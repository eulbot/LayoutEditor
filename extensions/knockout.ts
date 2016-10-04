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
})(ko);