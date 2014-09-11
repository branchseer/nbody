(function () {
  angular.module('nbody', []).controller('nbodyController',['$scope', '$interval',
  function($scope, $interval) {
    $scope.bodies = renderer.bodies;
    $scope.started = false;
    $scope.precision = 10;

    $scope.togglePlay = function () {
      if ($scope.started) {
        renderer.pauseAnimation();
        $scope.started = false;
      }
      else {
        renderer.startAnimation();
        $scope.started = true;
      }
    }

    $interval(function () { }, 400);
  }]);
})();
