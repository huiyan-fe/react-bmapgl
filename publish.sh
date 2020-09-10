mkdir temp
cp -r package.json README.md LICENSE temp/
npm run build
cp -r dist/* temp/
cd temp && npm publish
cd .. && rm -rf temp
