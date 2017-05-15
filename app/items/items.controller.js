angular.module('rssReader')
    .controller('itemsCtrl', function ($scope, $routeParams, FeedList, FeedLoad) {
        var feed = FeedList.getById($routeParams.id || FeedList.getMinId())

        FeedLoad.getFeed({rss_url: feed.url, num: 50}, function (data) {
          console.log(data);
            $scope.feed = data.items;
            $scope.feed.id = feed.id;
        });
    });
