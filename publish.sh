# 发布的包一级目录就是组件目录，从而支持这种导入模式 import Map from 'react-bmapgl/Map'
mkdir temp
cp -r package.json README.md LICENSE temp/
npm run build
cp -r dist/* temp/
cd temp && npm publish
cd .. && rm -rf temp
