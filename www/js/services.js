angular.module('starter.services', [])
    .factory('Chats', ['$q',function($q) {
    var chats = [{
      id: 0,
      targetId: 'nocoolyoyo2',
      lastText: '最近怎样',
      type: "single",
      unReadMsgCnt: 0,
      lastMsgDate: 1468983461848,
      face: 'img/ben.png'
    },{
      id: 1,
      targetId: '某wqe某人',
      lastText: '最近怎wqew样',
      type: "single",
      unReadMsgCnt: 0,
      lastMsgDate: 1468983461848,
      face: 'img/ben.png'
    }];

    return {
      getAll: function() {
        var deferred = $q.defer();
        window.JMessage.getConversationList(
            function (response) {
              if(JSON.parse(response).length != 0) {
                chats = JSON.parse(response);
              }
              deferred.resolve(chats);
            }, function (errorStr) {
              alert(errorStr);
            });
        return deferred.promise;
      },
      remove: function(chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function(chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      },
      init: function(data) {
        chats = data;
      }
    };
  }])
    .factory('Messages', ['$q',function($q) {
        var messages = [{
            id: 0,
            targetId: 'nocoolyoyo2',
            lastText: '最近怎样',
            type: "single",
            unReadMsgCnt: 0,
            lastMsgDate: 1468983461848,
            face: 'img/ben.png'
        }];
        return {
            getAll: function(conversationType, value, from, limit) {
                var deferred = $q.defer();
                window.JMessage.getHistoryMessages(conversationType, value, '',from, limit,
                    function(response) {
                        messages = JSON.parse(response).reverse();
                       // messages = messages.reverse();
                        deferred.resolve(messages);
                    }, function(errorMsg) {
                        console.log(errorMsg);  // 输出错误信息。
                    });
                return deferred.promise;
            },
            getLocalMessage: function(){
                return messages;
            },
            remove: function(chat) {
                chats.splice(messages.indexOf(chat), 1);
            },
            get: function(chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            },
        };
    }])
    .factory('MyInfo', function() {
      var myInfo = {
        address: "",
        appkey: "",
        birthday: "",
        gender: "",
        nickname: "nocool",
        noteText: "",
        notename: "",
        region: "",
        signature: "",
        userName: "nocool",
        userID: 123,
        blacklist:0,
        isFriend:0,
        noDisturb:0,
        star:0,
        avatarPath:""
      };

      return {
        all: function() {
          return myInfo;
        },
        edit: function(attr) {
          chats.splice(chats.indexOf(chat), 1);
        },
        init: function(data) {
          myInfo = data;
        }
      };
    })
    .factory('Friends', ['$q',function($q) {
          var friends = [];

          return {
            getAll: function() {
              var deferred = $q.defer();
              window.JMessage.getFriendList(
                  function (response) {
                    friends = JSON.parse(response);
                    deferred.resolve(friends);
                  }, function (errorStr) {
                    alert(errorStr);
                  });
              return deferred.promise;
            },
            get: function(userId){
              for (var i = 0; i < friends.length; i++) {
                if (friends[i].userID === parseInt(userId)) {
                  return friends[i];
                }
              }
              return null;
            }
          };
        }])
    .factory('Groups', ['$q',function($q) {
            var groups = [];
            return {
                getAll: function() {
                    var deferred = $q.defer();
                    window.JMessage.getGroupIDList(
                       function (response) {
                           groups = JSON.parse(response);
                           deferred.resolve(groups);
                        }, function (errorMsg) {
                                alert(errorMsg);
                    });
                    return deferred.promise;
                },
                getDetail: function(groupId){
                    var deferred = $q.defer();
                    alert(groupId);
                    window.JMessage.getGroupInfo(groupId,
                        function(response){
                            deferred.resolve(JSON.parse(response));
                        },function(error){
                            alert(error);
                        });
                    return deferred.promise;
                }
            };
        }]);