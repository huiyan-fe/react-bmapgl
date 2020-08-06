const path = require('path')
const pkg = require('./package.json')
const { theme, styles } = require('./styleguide.style')

module.exports = {
  title: 'React-BMapGL文档',
  sections: [
    {
      name: '快速开始',
      content: 'README.md',
    },
    {
      name: '基础',
      components: ['src/Map'],
      sectionDepth: 1,
    },
    {
      name: '控件',
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
      sectionDepth: 0,
    },
  ],
  // 每一节一页, 避免加载多个地图实例
  pagePerSection: true,
  ribbon: {
    url: 'https://github.com/huiyan-fe/react-bmapgl',
    text: 'Star me on GitHub',
  },
  // 配置导出路径
  getComponentPathLine(cppath) {
    const srcDir = path.resolve('src')
    const dirname = path
      .dirname(path.relative(srcDir, cppath))
      .split(path.sep)
      .join('/')
    const name = path.basename(cppath, '.tsx')

    return `import ${name} from '${path.posix.join(pkg.name, dirname, name)}'`
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
          rel: 'stylesheet',
          href: '//code.bdstatic.com/npm/semantic-ui@2.4.1/dist/semantic.min.css',
        },
      ],
      scripts: [
        {
          type: 'text/javascript',
          src: '//api.map.baidu.com/api?type=webgl&v=1.0&ak=1XjLLEhZhQNUzd93EjU5nOGQ'
        }
      ]
    },
  },
  theme: theme,
  styles: styles,
  exampleMode: 'expand',
  usageMode: 'expand',
  // styleguideComponents: {
  //   LogoRenderer: path.join(__dirname, 'rsg-components/Logo'),
  //   ReactComponentRenderer: path.join(__dirname, 'rsg-components/ReactComponent'),
  // },
  // require: [path.resolve(__dirname, 'docs/helpers/setup.tsx')],
  // Typescript支持
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  propsParser: require('react-docgen-typescript').withCustomConfig('./tsconfig.json', []).parse,
  webpackConfig: {
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js', 'jsx']
    },
    module: {
      rules: [
        {
          test: /\.(js||jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
      ],
    },
  },
}
