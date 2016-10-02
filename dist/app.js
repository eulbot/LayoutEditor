var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/index.d.ts" />
var mapp;
(function (mapp) {
    var ple;
    (function (ple) {
        var app = (function () {
            function app() {
                this.Editor = ko.observable(new mapp.ple.Editor());
            }
            app.loadTemplates = function () {
                var deferred = $.Deferred();
                var append = function (data) {
                    $('body').append(data);
                };
                console.info('fetching templates');
                $.when($.get("app/templates/editor.html", function (data) { append(data); }), $.get("app/templates/canvas.html", function (data) { append(data); }), $.get("app/templates/menu.html", function (data) { append(data); }), $.get("app/templates/element.html", function (data) { append(data); }), $.get("app/templates/frame.html", function (data) { append(data); })).then(function () { return deferred.resolve(); });
                return deferred.promise();
            };
            return app;
        }());
        ple.app = app;
        $(function () {
            app.loadTemplates().then(function () {
                console.info('done');
                ko.applyBindings(new app());
            });
        });
    })(ple = mapp.ple || (mapp.ple = {}));
})(mapp || (mapp = {}));
var mapp;
(function (mapp) {
    var ple;
    (function (ple) {
        var Canvas = (function () {
            function Canvas(menu) {
                var _this = this;
                this.menu = menu;
                this.elements = ko.observableArray([]);
                this.addElement = function (event) {
                    var target = event.relatedTarget;
                    var menuItem = _this.menu.GetMenuElement(target.getAttribute('id'));
                    if (menuItem) {
                        var newElement = menuItem.createInstance();
                        newElement.copyPosition(menuItem);
                        _this.elements.push(newElement);
                        setTimeout(function () {
                            interact('#'.concat(newElement.Id)).draggable({ onmove: ple.Util.moveObject });
                        }, 0);
                    }
                };
                this.init = function () {
                    interact('.page').dropzone({
                        ondropactivate: function (event) {
                            event.target.classList.add('drop-active');
                        },
                        ondragenter: function (event) {
                            event.target.classList.add('drop-active');
                        },
                        ondragleave: function (event) {
                            event.target.classList.remove('drop-active');
                        },
                        ondrop: _this.addElement,
                        ondropdeactivate: function (event) {
                            event.target.classList.remove('drop-active');
                        }
                    });
                };
                this.init();
            }
            return Canvas;
        }());
        ple.Canvas = Canvas;
    })(ple = mapp.ple || (mapp.ple = {}));
})(mapp || (mapp = {}));
var mapp;
(function (mapp) {
    var ple;
    (function (ple) {
        var Editor = (function () {
            function Editor() {
                this.menu = ko.observable(new ple.Menu());
                this.canvas = ko.observable(new ple.Canvas(this.menu()));
            }
            return Editor;
        }());
        ple.Editor = Editor;
    })(ple = mapp.ple || (mapp.ple = {}));
})(mapp || (mapp = {}));
var mapp;
(function (mapp) {
    var ple;
    (function (ple) {
        var Element = (function () {
            function Element(isMenuItem) {
                var _this = this;
                Element.counter++;
                this._id = ko.observable('mapp-ple-element-'.concat(Element.counter.toString()));
                this.wrapper = 'element-template';
                this.x = ko.observable(0);
                this.y = ko.observable(1);
                this.x.subscribe(function () {
                    console.log('x changed');
                });
                this.position = function () { return ko.computed(function () {
                    var pos;
                    if (_this.x() && _this.y())
                        pos = _this.x().toString().concat('px, ', _this.y().toString(), 'px');
                    else
                        pos = '0, 0';
                    console.info('pos for +' + _this.Id + ': ' + 'translate(' + pos + ')');
                    return 'translate(' + pos + ')';
                }); };
                this.setPosition = function (x, y) {
                    _this.x(x);
                    _this.y(y);
                };
                this.copyPosition = function (target) {
                    _this.setPosition(target.x(), target.y());
                };
            }
            Object.defineProperty(Element.prototype, "Id", {
                get: function () {
                    return this._id();
                },
                enumerable: true,
                configurable: true
            });
            Element.counter = 0;
            return Element;
        }());
        ple.Element = Element;
    })(ple = mapp.ple || (mapp.ple = {}));
})(mapp || (mapp = {}));
var mapp;
(function (mapp) {
    var ple;
    (function (ple) {
        var Frame = (function (_super) {
            __extends(Frame, _super);
            function Frame() {
                _super.call(this);
                this.template = 'frame-template';
            }
            Frame.prototype.createInstance = function () {
                return new Frame();
            };
            ;
            return Frame;
        }(ple.Element));
        ple.Frame = Frame;
    })(ple = mapp.ple || (mapp.ple = {}));
})(mapp || (mapp = {}));
var mapp;
(function (mapp) {
    var ple;
    (function (ple) {
        var Menu = (function () {
            function Menu() {
                var _this = this;
                this.menuElements = ko.observableArray();
                this.menuElements.push(new ple.Frame());
                this.menuElements.push(new ple.Frame());
                this.GetMenuElement = function (id) {
                    var result = null;
                    $.each(_this.menuElements(), function (i, v) {
                        if (v.Id == id)
                            result = v;
                    });
                    return result;
                };
                this.Init = function () {
                    interact('.menu-element > *:last-child').draggable({
                        inertia: false,
                        onmove: ple.Util.moveObject,
                        onend: ple.Util.resetObject
                    });
                };
                setTimeout(this.Init, 0);
            }
            return Menu;
        }());
        ple.Menu = Menu;
    })(ple = mapp.ple || (mapp.ple = {}));
})(mapp || (mapp = {}));
var mapp;
(function (mapp) {
    var ple;
    (function (ple) {
        var Util = (function () {
            function Util() {
            }
            Util.move = function (target, x, y) {
                target.style.webkitTransform =
                    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
                target.setAttribute('data-x', x.toString());
                target.setAttribute('data-y', y.toString());
            };
            Util.moveObject = function (event) {
                var target = event.target, x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx, y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                Util.move(target, x, y);
            };
            Util.resetObject = function (event) {
                var target = event.target, x = 0, y = 0;
                Util.move(target, x, y);
            };
            return Util;
        }());
        ple.Util = Util;
    })(ple = mapp.ple || (mapp.ple = {}));
})(mapp || (mapp = {}));
//# sourceMappingURL=app.js.map