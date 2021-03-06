const path = require('path')
const gulp = require('gulp')
const Tools = require('..')

const loadContext = require('../lib/libs/loadData').loadContext

const config = {
  project: {
    path: {
      app: {
        public: [
          '{{ _.app_root }}/public/',
          {
            root: 'fonts/weather-icons/', files: [
            path.resolve('node_modules/weather-icons/font/')
          ]
          },
          {
            root: 'css/', files: [
            path.resolve('node_modules/weather-icons/css/weather-icons.css')
          ]
          }
        ]
      }
    }
  },
  webpack: {
    hot: true,
    extract_css: false,
    bundle_analyzer: false,
    providePlugin: {
      $: 'cash-dom'
    },
    config: {
      resolve: {
        modules: [
          '{{ project.path.app.js }}',
          '{{ envs.root }}/../common/js/',
          '{{ envs.root }}/../common/js/libs',
          '{{ project.app_root }}',
          '{{ project.project_root }}/../',
          '{{ envs.root }}'
        ]
      }
    }
  },
  postcss: {
    autoprefixer: true
  },
  sass: {
    includePaths: [
      'test'
    ]
  },
  template: {
    globals: {
      get_example: () => loadContext('example')
    }
  },
  sprite: {
    example_sprite: {
      root: '{{ project.path.app.images }}/sprites/',
      imgRoot: '{{ project.static_root }}/img/',
      imgPath: '{{ project.path.app.public[0] }}/images/_example_sprite.png',
      stylePath: '{{ project.path.app.scss }}/mixins/_example_sprite.scss',
      suffix: 'icons-'
    }
  },
  'sass-image': {
    example_images: {
      root: '{{ project.path.app.public[0] }}/images/',
      http_images_path: '{{ project.static_root }}/images/',
      includeBase64: false,
      suffix: 'img-'
    }
  }

}

Tools(gulp, config)
  .task('example', (gulp, config) => {
    gulp.task('example', () => {
      console.log(config.example)
    })
  })
  .configHook((config) => {
    config.example = 'EXAMPLE nya!'
    return config
  })
  .run()
