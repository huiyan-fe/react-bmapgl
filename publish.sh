# 发布的包一级目录就是组件目录，从而支持这种导入模式 import Map from 'react-bmapgl/Map'
npm run build
cp -r package.json README.md LICENSE dist/
cd dist && npm publish
cd ..
