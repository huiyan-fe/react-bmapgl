/**
 * @file 一些简单的基础函数
 * @author hedongran
 * @email hdr01@126.com
 */

export default function isString (str: any) {
    return Object.prototype.toString.call(str) === '[object String]';
};