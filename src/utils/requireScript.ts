/**
 * @file 异步加载css和script
 * @author hedongran
 * @email hdr01@126.com
 */

const headElement = document.head || document.getElementsByTagName('head')[0];
const _importedScript: { [src: string]: true } = {};

interface CompatibleIEScript extends HTMLScriptElement {
    readyState?: string;
    onreadystatechange?: Function | null;
}

/**
 * load dependency by css tag
 */
export function requireCss(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (src in _importedScript) {
            resolve();
            return;
        }
        const script = document.createElement('link');
        script.type = 'text/css';
        script.rel = 'stylesheet';
        script.href = src;

        // 加载失败
        script.onerror = err => {
            headElement.removeChild(script);
            reject(new URIError(`The css ${src} is no accessible.`));
        };

        // 加载成功
        script.onload = () => {
            _importedScript[src] = true;
            resolve();
        };
        headElement.appendChild(script);
    });
}

/**
 * load dependency by script tag
 */
export function requireScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (src in _importedScript) {
            resolve();
            return;
        }
        const script: CompatibleIEScript = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;

        // 加载失败
        script.onerror = err => {
            headElement.removeChild(script);
            reject(new URIError(`The Script ${src} is no accessible.`));
        };

        // 加载成功
        if (isImplementedOnload(script)) {
            // Firefox, Safari, Chrome, and Opera
            script.onload = () => {
                _importedScript[src] = true;
                resolve();
            };
        }
        else {
            // IE
            script.onreadystatechange = () => {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    _importedScript[src] = true;
                    resolve();
                }
            };
        }
        headElement.appendChild(script);
    });
}

function isImplementedOnload(script: CompatibleIEScript) {
    script = script || document.createElement('script');
    if ('onload' in script) {
        return true;
    }
    // @ts-ignore
    script.setAttribute('onload', '');
    return typeof script['onload'] === 'function'; // ff true ie false .
}
