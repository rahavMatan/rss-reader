angular.module('rssReader')
.controller('itemCtrl',function($scope, $routeParams, FeedList, FeedLoad, HashString){
  var feed = FeedList.getById($routeParams.id)

  FeedLoad.getFeed({rss_url: feed.url, num: 50}, function (data) {
    console.log(data);
    $scope.feed = data.feed;
    $scope.id = $routeParams.id;
    var entries = data.items;

    for (var i = entries.length - 1; i >= 0; i--) {
        if (HashString.perform(entries[i].title) == $routeParams.hashKey) {
            $scope.item = entries[i];
        }
    }
  });
})
