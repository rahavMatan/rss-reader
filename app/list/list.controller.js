angular.module('rssReader')
.controller('listCtrl',function($scope, $routeParams, FeedList, FeedLoad){
  console.log('list ctrl');
  $scope.feeds = FeedList.get();

  var feed = FeedList.getById($routeParams.id || FeedList.getMinId());

  FeedLoad.getFeed({rss_url: feed.url, num: 10 },function(data){
    console.log(data);
    $scope.feed = data.feed;
    $scope.feed.id = feed.id;
  });
})
