/// <reference path="../typings/index.d.ts" />

module mapp.ple {
    export class app {

        private Editor: KnockoutObservable<mapp.ple.Editor>;
        
        constructor() {
            
            this.Editor = ko.observable(new mapp.ple.Editor());
        }

        public static loadTemplates(): JQueryPromise<any> {
            
            var deferred = $.Deferred<any>();
            var append = (data) => {
                $('body').append(data);
            }
            
            console.info('fetching templates');

            $.when(
                $.get("app/templates/editor.html", function(data) { append(data); }),
                $.get("app/templates/canvas.html", function(data) { append(data); }),
                $.get("app/templates/menu.html", function(data) { append(data); }),
                $.get("app/templates/element.html", function(data) { append(data); }),
                $.get("app/templates/frame.html", function(data) { append(data); })
            ).then(
               () => deferred.resolve()
            );

            return deferred.promise();
        }
    }

    $(() => {
        app.loadTemplates().then(() => {
            console.info('done');
            ko.applyBindings(new app());
        });
    });
}