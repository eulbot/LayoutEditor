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
            
            console.info('fetching templates..');

            $.when(
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
            console.info('done');
            ko.applyBindings(new app());
        });
    });
}