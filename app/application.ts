/// <reference path="../typings/index.d.ts" />

module mapp {
    export class app {

        private elements: KnockoutObservableArray<IEditorObject>;
        
        constructor() {
            
            this.elements = ko.observableArray<IEditorObject>();

            let f1 = new Frame();
            let f2 = new Frame();
            this.elements.push(f1);
            this.elements.push(f2);
        }

        public static loadTemplates(): JQueryPromise<any> {
            
            var deferred = $.Deferred<any>();
            var append = (data) => {
                $('body').append(data);
            }
            
            $.when(
                $.get("app/templates/editor.html", function(data) { append(data); }),
                $.get("app/templates/toolbar.html", function(data) { append(data); }),
                $.get("app/templates/frame.html", function(data) { append(data); })
            ).then(
               () => deferred.resolve()
            );

            return deferred.promise();
        }
    }

    $(() => {
        app.loadTemplates().then(() => {
            ko.applyBindings(new app());
        });
    });
}