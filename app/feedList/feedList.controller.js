angular.module('rssReader')
.controller('FeedListCtrl',function($scope, $routeParams, FeedList, FeedLoad){
  $scope.feeds = FeedList.get();

  $scope.$on('FeedList', function (event, data) {
      $scope.feeds = data;
  });
})
