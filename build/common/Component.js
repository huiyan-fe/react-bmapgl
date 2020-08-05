import { __extends } from "tslib";
import { PureComponent } from 'react';
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 给某个对象绑定对应需要的事件
     * @param 需要绑定事件的对象
     * @param 事件名数组
     * @return null;
     */
    Component.prototype.bindEvent = function (obj, events) {
        var self = this;
        if (events) {
            events.forEach(function (event) {
                obj.addEventListener(event, function () {
                    self.props.events && self.props.events[event] && self.props.events[event].apply(self, arguments);
                });
            });
        }
    };
    /**
     * 给某个对象绑定需要切换的属性对应的方法
     * @param 需要绑定属性的对象
     * @param 属性和对应的2个切换方法
     * @return null;
     */
    Component.prototype.bindToggleMeghods = function (obj, toggleMethods) {
        for (var key in toggleMethods) {
            if (this.props[key] !== undefined) {
                if (this.props[key]) {
                    obj[toggleMethods[key][0]]();
                }
                else {
                    obj[toggleMethods[key][1]]();
                }
            }
        }
    };
    Component.prototype.getOptions = function (options) {
        var _this = this;
        var result = {};
        options.map(function (key) {
            if (_this.props[key] !== undefined) {
                result[key] = _this.props[key];
            }
        });
        return result;
    };
    return Component;
}(PureComponent));
export default Component;
