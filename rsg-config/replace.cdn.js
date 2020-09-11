var fs = require('fs');
var path = require('path');

// readdir方法读取文件名
// readFile方法读取文件内容
// writeFile改写文件内容
var filePath = path.resolve(__dirname, '../styleguide/index.html');

// 把.js文件替换成线上cdn域名前缀，正则的(?<!\/)表示后面那串的前面没有`/`，避免二次替换造成bug
fs.readFile(filePath, 'utf8', function (err, result) {
    var reg = /(?<!\/)(build\/bundle\.\S{8}\.js)/;
    var matchString = result.match(reg);
    if (matchString) {
        console.log(`replacing CDN: "${matchString[0]}"  ==>  "//mapopen.cdn.bcebos.com/github/react-bmapgl/${matchString[0]}"\n`);
        result = result.replace(reg, '//mapopen.cdn.bcebos.com/github/react-bmapgl/$1');
    } else {
        console.log(`no CDN to replace\n`);
    }
    fs.writeFile(filePath, result, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    });
});
