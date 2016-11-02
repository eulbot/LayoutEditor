/// <reference path="../typings/index.d.ts" />

module mapp.le {
    export class app {

        private Editor: KnockoutObservable<mapp.le.Editor>;
        
        constructor() {
            
            this.Editor = ko.observable(new mapp.le.Editor());
        }

        public static loadTemplates(): JQueryPromise<any> {
            
            var deferred = $.Deferred<any>();
            var append = (data: string) => {
                $('body').append(data);
            }

            $.when(
                $.get("app/templates/controls/input.html", function(data) { append(data); }),
                $.get("app/templates/controls/input_numeric.html", function(data) { append(data); }),
                $.get("app/templates/controls/radio.html", function(data) { append(data); }),
                $.get("app/templates/propertiesView.html", function(data) { append(data); }),
                $.get("app/templates/elementList.html", function(data) { append(data); }),
                $.get("app/templates/templateList.html", function(data) { append(data); }),
                $.get("app/templates/pageSetup.html", function(data) { append(data); }),
                $.get("app/templates/editor.html", function(data) { append(data); }),
                $.get("app/templates/canvas.html", function(data) { append(data); }),
                $.get("app/templates/menu.html", function(data) { append(data); })
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