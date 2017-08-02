var dct = angular.module('directives', []);

dct.directive('enter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.enter);
        });
        event.preventDefault();
      }
    });
  };
});

dct.directive('ctrlc', function () {
  return function (scope, element, attrs) {
    var map = { 17: false, 67: false }
    element.bind("keydown", function (event) {
      map[event.which] = true;
      if (map[17] && map[67]) {
        scope.$apply(function () {
          scope.$eval(attrs.ctrlc);
        });
        event.preventDefault();
      }
    });
  };
});
