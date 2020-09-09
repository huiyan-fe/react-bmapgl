/**
 * @file 入口文件
 * @author hedongran
 * @email hdr01@126.com
 */

// Map 地图核心
export {default as Map} from './Map';

// Control 地图控件
export {default as MapTypeControl} from './Control/MapTypeControl';
export {default as ScaleControl} from './Control/ScaleControl';
export {default as ZoomControl} from './Control/ZoomControl';
export {default as NavigationControl} from './Control/NavigationControl';

// Overlay 覆盖物组件
export {default as Marker} from './Overlay/Marker';
export {default as Polyline} from './Overlay/Polyline';
export {default as Polygon} from './Overlay/Polygon';
export {default as Circle} from './Overlay/Circle';
export {default as InfoWindow} from './Overlay/InfoWindow';
export {default as Label} from './Overlay/Label';
export {default as CustomOverlay} from './Overlay/CustomOverlay';

// Layer 图层组件
export {default as MapvglView} from './Layer/MapvglView';
export {default as MapvglLayer} from './Layer/MapvglLayer';
export {default as TrafficLayer} from './Layer/TrafficLayer';
export {default as PanoramaLayer} from './Layer/PanoramaLayer';

// Library 开源工具库
export {default as DrawingManager} from './Library/DrawingManager';
export {default as DistanceTool} from './Library/DistanceTool';

// Service 地图服务
export {default as AutoComplete} from './Services/AutoComplete';


// Custom 自定义复杂组件


// 其他
export * from './utils';
