angular.module('moraApp')
  .controller('ForumDetailCtrl', function($scope, Thread, $http, $, _, $modal) {

    /*
     appVersion: "1.14dev"
     attachedImg: "http://llss.qiniudn.com/forum/image/NzI4MWQwMDAwMDAwMDVjYQ==_1417579401.jpg"
     body: "其实没有内容"
     bodyLength: 6
     createdAt: 1417579302
     followsCount: 0
     id: "NzI4MDgwMDAwMDAwMDQwOQ=="
     isFollowed: false
     isLiked: falselikes
     Count: 1
     os: "iOS 8.0.2"
     platform: 1
     read: true
     repliedAt: 1418872064
     repliesCount: 25
     title: "有内容，有图片"
     type: 0
     userAnswerBadgeLevel: 0
     userAvatar: "http://llss.qiniudn.com/user_images/58DE9EAC-7AA2-4D3E-8A58-4815145EA940_1381557857.jpg"
     userId: "NzI4MWQwMDAwMDAwMDVjYQ=="userName: "c"
     */

    function filterReplies(reply) {
      $scope.Reply.replies = _.filter($scope.Reply.replies, function(r) {
        return r.id !== reply.id;
      });
    }

    $scope.restore = function(reply) {
      $http.put('api/reply/' + reply.id + '/restore').success(function() {
        filterReplies(reply);
      });
    };
    $scope.remove = function(reply) {
      $http.delete('api/reply/' + reply.id).success(function() {
        filterReplies(reply);
      });
    };


    $scope.thread = Thread;
    $scope.Reply = {type: 'default'};

    $scope.$watch('Reply.type', getReplyList);
    $scope.$watch('pager.page', _.ignoreFirstCall(getReplyList));

    function getReplyList() {
      var query = $.param(_.assign({type: $scope.Reply.type, 'topic_id': Thread.id}, $scope.pager));
      $http.get('api/reply/?' + query).success(function(data) {
        $scope.Reply.replies = data.replies;
        $scope.pager.total = data.total;
      });
    }



  });