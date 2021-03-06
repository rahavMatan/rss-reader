angular.module('rssReader')
.controller('manageCtrl',function($scope, $location, FeedLoad, FeedList){
  $scope.feeds = FeedList.get();

  $scope.add = function () {
    FeedList.add($scope.feed.url, $scope.feed.title);
    $location.path('/manage');
  };

  $scope.delete = function (id) {
      FeedList.delete(id);
  };
  $scope.$on('FeedList', function (event, data) {
    console.log('feed event');
    $scope.feeds = data;
  });

})
