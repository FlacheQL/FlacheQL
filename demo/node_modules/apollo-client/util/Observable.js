var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// This simplified polyfill attempts to follow the ECMAScript Observable proposal.
// See https://github.com/zenparsing/es-observable
import { Observable as LinkObservable } from 'apollo-link';
import $$observable from 'symbol-observable';
// rxjs interopt
var Observable = /** @class */ (function (_super) {
    __extends(Observable, _super);
    function Observable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Observable.prototype[$$observable] = function () {
        return this;
    };
    Observable.prototype['@@observable'] = function () {
        return this;
    };
    return Observable;
}(LinkObservable));
export { Observable };
//# sourceMappingURL=Observable.js.map