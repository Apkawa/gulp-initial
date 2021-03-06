import _ from 'lodash'
import url from 'url'
import proxy from 'proxy-middleware'
import stripAnsi from 'strip-ansi'
import { create } from 'browser-sync'
/* Webpack */
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const browserSync = create()

function buildProxyList (proxyObject) {
  return _.map(proxyObject, function (v, k) {
    let proxyOptions = url.parse(v)
    proxyOptions.route = k
    return proxy(proxyOptions)
  })

}

function getWebpackMiddlewares (webpackConfig) {
  const publicPath = webpackConfig.output.publicPath
  const bundler = webpack(webpackConfig)
  bundler.plugin('done', function (stats) {
    if (stats.hasErrors() || stats.hasWarnings()) {
      return browserSync.sockets.emit('fullscreen:message', {
        title: 'Webpack Error:',
        body: stripAnsi(stats.toString()),
        timeout: 100000,
      })
    }
    // browserSync.reload('**/*.js')
    // browserSync.reload('**/*.css')
  })

  return [
    webpackDevMiddleware(bundler, {
      publicPath,
      stats: {colors: true},
    }),
    webpackHotMiddleware(bundler),
  ]
}

function getBSConfig (config) {
  // options.webpack.extract_css = false;
  const webpack_options = config.webpack.getConfig(config)
  const {server, routes={}, middleware=[], proxy: proxyOptions} = config.browserSync

  const bsOptions = _.omit(config.browserSync,
    ['browserSync', 'getBSConfig', 'proxy', 'routes', 'middleware', 'server'])
  const project = config.project

  const compiledBsOptions = {
    open: true,
    startPath: '',
    browser: 'google-chrome',
    server: {
      baseDir: project.dist_root,
      routes: {
        ...routes,
      },
      middleware: [
        ...buildProxyList(proxyOptions),
        ...getWebpackMiddlewares(webpack_options),
        ...middleware,
      ],
      ...server,
    },
    plugins: [],
    ...bsOptions
  }
  compiledBsOptions.server.routes[project.static_root] = project.dist_root
  return compiledBsOptions
}

module.exports = {
  getBSConfig,
  browserSync: browserSync,
  proxy: {
    '/example/': 'http://example.com/',
  },

}

