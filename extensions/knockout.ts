/// <reference path="../typings/index.d.ts" />

interface KnockoutBindingHandlers {
    element: KnockoutBindingHandler;
}

((ko: KnockoutStatic) => {
    ko.bindingHandlers.element = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                value(element);
            }
        }
    };

    ko.observable.fn['withPausing'] = function() {
        this.notifySubscribers = function() {
            if (!this.pauseNotifications) {
                ko.subscribable.fn.notifySubscribers.apply(this, arguments);
            }
        };

        this.sneakyUpdate = function(newValue) {
            this.pauseNotifications = true;
            this(newValue);
            this.pauseNotifications = false;
        };

        return this;
    };
})(ko);


