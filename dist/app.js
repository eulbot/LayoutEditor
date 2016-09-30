var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/index.d.ts" />
var mapp;
(function (mapp) {
    var app = (function () {
        function app() {
            this.elements = ko.observableArray();
            var f1 = new mapp.Frame();
            var f2 = new mapp.Frame();
            this.elements.push(f1);
            this.elements.push(f2);
        }
        app.loadTemplates = function () {
            var deferred = $.Deferred();
            var append = function (data) {
                $('body').append(data);
            };
            $.when($.get("app/templates/editor.html", function (data) { append(data); }), $.get("app/templates/toolbar.html", function (data) { append(data); }), $.get("app/templates/frame.html", function (data) { append(data); })).then(function () { return deferred.resolve(); });
            return deferred.promise();
        };
        return app;
    }());
    mapp.app = app;
    $(function () {
        app.loadTemplates().then(function () {
            ko.applyBindings(new app());
        });
    });
})(mapp || (mapp = {}));
var mapp;
(function (mapp) {
    var EditorObject = (function () {
        function EditorObject() {
            EditorObject.counter++;
            this.id = ko.observable(EditorObject.counter);
        }
        EditorObject.counter = 0;
        return EditorObject;
    }());
    mapp.EditorObject = EditorObject;
})(mapp || (mapp = {}));
var mapp;
(function (mapp) {
    var Frame = (function (_super) {
        __extends(Frame, _super);
        function Frame() {
            _super.call(this);
            this.template = 'frame-template';
        }
        return Frame;
    }(mapp.EditorObject));
    mapp.Frame = Frame;
})(mapp || (mapp = {}));
//# sourceMappingURL=app.js.map