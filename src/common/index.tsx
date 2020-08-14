export {default as Wrapper} from './WrapperHOC';
export {default as Component} from './Component';

export interface MapChildrenProps {
    /** *地图实例，来自父元素`<Map>`的继承，无需手动传入 */
    map: BMapGL.Map;
};