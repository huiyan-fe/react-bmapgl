const path = require('path')
const pkg = require('./package.json')

module.exports = {
  title: 'React-BMapGL文档',
  sections: [
    {
      name: '快速入门',
      content: 'README.md',
    },
    {
      name: '常见问题',
      content: 'FAQ.md',
    },
    {
      name: '反馈BUG',
      href: 'https://github.com/huiyan-fe/react-bmapgl/issues',
      external: true,
      shouldOpenInNewTab: true,
    },
    {
      name: '基础类',
      components: ['src/Map/index.tsx', 'src/Map/MapApiLoaderHOC.tsx'],
      sectionDepth: 1,
    },
    {
      name: '地图控件',
      components: 'src/Control/[A-Z]*.tsx',
      sectionDepth: 1,
    },
    {
      name: '覆盖物',
      components: 'src/Overlay/[A-Z]*.tsx',
      sectionDepth: 1,
    },
    {
      name: '地图图层',
      components: 'src/Layer/[A-Z]*.tsx',
      sectionDepth: 1,
    },
    {
      name: '开源工具库',
      components: 'src/Library/[A-Z]*.tsx',
      sectionDepth: 1,
    },
    {
      name: '地图服务',
      components: 'src/Services/[A-Z]*.tsx',
      sectionDepth: 1,
    },
    {
      name: '自定义组件',
      components: 'src/Custom/[A-Z]*.tsx',
      sectionDepth: 1,
    },
  ],
  pagePerSection: true,
  ribbon: {
    url: 'https://github.com/huiyan-fe/react-bmapgl',
    text: 'Star me on GitHub',
  },
  // 配置导出路径
  getComponentPathLine(cppath) {
    const name = path.basename(cppath, '.tsx')
    return `import {${name}} from '${pkg.name}'`
  },
  // 配置对应的example 文档
  getExampleFilename(cppath) {
    const baseDir = path.resolve('website')
    const srcDir = path.resolve('src')
    const relative = path.relative(srcDir, cppath)
    return path.join(baseDir, relative).replace(/\.tsx?$/, '.md')
  },
  template: {
    head: {
      links: [
        {
          rel: 'SHORTCUT ICON',
          href: './logo.ico'
        }
      ],
      scripts: [
        {
          type: 'text/javascript',
          src: '//api.map.baidu.com/api?type=webgl&v=1.0&ak=1XjLLEhZhQNUzd93EjU5nOGQ'
        }
      ]
    },
  },
  previewDelay: 1000,
  skipComponentsWithoutExample: true,
  theme: './rsg-config/theme.config.js',
  styles: './rsg-config/style.config.js',
  exampleMode: 'expand',
  usageMode: 'expand',
  styleguideComponents: {
    LogoRenderer: path.join(__dirname, 'rsg-config/Logo'),
    LinkRenderer: path.join(__dirname, 'rsg-config/Link'),
    RibbonRenderer: path.join(__dirname, 'rsg-config/Ribbon'),
  },
  // Typescript支持
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  propsParser: require('react-docgen-typescript').withCustomConfig('./tsconfig.json', {
    // If set to true, types that are optional will not display " | undefined" in the type.
    shouldRemoveUndefinedFromOptional: true
  }).parse,
  webpackConfig: {
    resolve: {
      extensions: ['.ts', '.tsx', '.js', 'jsx', 'json'],
      alias: {
        'react-bmapgl': path.resolve('src')
      }
    },
    module: {
      rules: [
        {
          test: /\.(js||jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp|ico)$/,
          loader: require.resolve('file-loader'),
          options: {
            name: '[name].[ext]'
          }
        },
      ],
    },
  },
  dangerouslyUpdateWebpackConfig(webpackConfig, env) {
    if (env === 'production') {
      // 修改图片等静态资源文件
      webpackConfig.output.publicPath = '//mapopen.cdn.bcebos.com/github/react-bmapgl/'
    }
    return webpackConfig
  }
}
