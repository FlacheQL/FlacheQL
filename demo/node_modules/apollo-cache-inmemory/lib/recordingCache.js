var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var RecordingCache = /** @class */ (function () {
    function RecordingCache(data) {
        if (data === void 0) { data = {}; }
        this.data = data;
        this.recordedData = {};
    }
    RecordingCache.prototype.record = function (transaction) {
        transaction(this);
        var recordedData = this.recordedData;
        this.recordedData = {};
        return recordedData;
    };
    RecordingCache.prototype.toObject = function () {
        return __assign({}, this.data, this.recordedData);
    };
    RecordingCache.prototype.get = function (dataId) {
        if (this.recordedData.hasOwnProperty(dataId)) {
            // recording always takes precedence:
            return this.recordedData[dataId];
        }
        return this.data[dataId];
    };
    RecordingCache.prototype.set = function (dataId, value) {
        if (this.get(dataId) !== value) {
            this.recordedData[dataId] = value;
        }
    };
    RecordingCache.prototype.delete = function (dataId) {
        this.recordedData[dataId] = undefined;
    };
    RecordingCache.prototype.clear = function () {
        var _this = this;
        Object.keys(this.data).forEach(function (dataId) { return _this.delete(dataId); });
        this.recordedData = {};
    };
    RecordingCache.prototype.replace = function (newData) {
        this.clear();
        this.recordedData = __assign({}, newData);
    };
    return RecordingCache;
}());
export { RecordingCache };
export function record(startingState, transaction) {
    var recordingCache = new RecordingCache(startingState);
    return recordingCache.record(transaction);
}
//# sourceMappingURL=recordingCache.js.map