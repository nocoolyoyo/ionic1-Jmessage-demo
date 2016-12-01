angular.module('starter.controllers', [])
    .controller('LoginCtrl', function($scope,$state,MyInfo) {
        $scope.input={'account':''};
        $scope.input={'password':''};
        $scope.login = function() {
           // $state.go("tab.chats",{},{reload:true});
             window.JMessage.login($scope.input.account, $scope.input.password,
                 function (response) {
                     window.JMessage.getMyInfo(
                         function(response) {
                             var myInfo = JSON.parse(response);
                             MyInfo.init(myInfo);
                             $scope.myInfo = MyInfo.all();
                             //alert($scope.myInfo);
                         }, function(errorStr) {
                             console.log(errorStr);  // 输出错误信息。
                         });
                    //alert(response);
                     $state.go("tab.chats",{},{reload:true});
                 }, function(errorStr){
                     alert(errorStr);
                 });
        };
    })
    .controller('ChatsCtrl', function($scope, Chats) {
        //alert(Chats.all());
        $scope.$on('$ionicView.enter', function(e) {
            Chats.getAll(
            ).then(function(data) {
                $scope.chats = data;
            });
        });
        // document.addEventListener('jmessage.onReceiveMessage', function(msg) {
        //     Chats.getAll(
        //     ).then(function(data) {
        //         $scope.chats = data;
        //     });
        // }, false);
        // //离开当前会话移除监听和会话
        // $scope.$on('$ionicView.beforeLeave', function(e) {
        //     document.removeEventListener('jmessage.onReceiveMessage', function(){
        //     },false);
        // });


        //$scope.chats = Chats.all();
        $scope.remove = function(chat) {
            //alert(chat.targetId);
            window.JMessage.deleteSingleConversation(chat.targetId, null,
                function(response){
                    //(response);
                    Chats.remove(chat);// 删除成功
                }, function(errorMsg) {
                    console.log(errorMsg);
                });

        };
    })
    .controller('ChatsAddCtrl', function($scope) {
        $scope.input={'userid':''};
        $scope.addChat = function () {
           // alert($scope.input.userid);
            $state.go("tab.chat-detail",{chatId:$scope.input.userid},{reload:true});
        }
    })
    .controller('ChatDetailCtrl', function($scope, $rootScope, $stateParams, Chats, MyInfo, Messages) {
       // alert($stateParams.chatId);
       $scope.chat = Chats.get($stateParams.chatId);
       $scope.user = MyInfo.all().userName;
       $scope.toUser = $stateParams.chatId;
        var conrentMessage = {
            content:{
                text: ''
            },
            contentType: 'text',
            fromID:''
        };
        $scope.sending = false;
        // var dialog = document.getElementById('dialog');
        $scope.input={'message':''};
        $scope.$on('$ionicView.enter', function(e) {
            window.JMessage.enterSingleConversation($scope.toUser, null,
                function(response) {
                    Messages.getAll('single',$scope.toUser,0,10).then(function(data) {
                        $scope.messages= data;
                    });
                    $scope.sendMessage = function (){
                        conrentMessage.content.text = $scope.input.message;
                        conrentMessage.fromID = $scope.user;
                        $scope.sending = true;
                        window.JMessage.sendSingleTextMessage($scope.toUser, $scope.input.message, null,
                            function(response) {
                                $scope.$apply(function () {
                                    $scope.messages.push(conrentMessage);
                                });
                                keepKeyboardOpen();
                                viewScroll.scrollBottom(true);
                                // $scope.messages.push(conrentMessage);
                                // $scope.$apply($scope.messages);
                                $scope.input.message.val('');
                                $scope.sending = false;
                                //appendSendMsg(MyInfo.all().nickname, $scope.input.message)
                            }, function(errorMsg) {
                                alert(errorMsg);   // 输出错误信息。
                            });
                    };
                    //当前会话框事件监听
                    document.addEventListener('jmessage.onReceiveMessage', function(msg) {
                        // alert(msg.fromUser);
                        conrentMessage.content.text = msg.content.text;
                        conrentMessage.fromID = msg.fromUser.username;
                        // $scope.$apply($scope.messages.push(conrentMessage));
                        // conrentMessage.content.text = msg.content.text;
                        // conrentMessage.fromID = msg.fromUser.username;
                        // Messages.message.push(conrentMessage);
                        // alert(Messages.message);
                        // $scope.messages = Messages.getLocalMessage();
                        $scope.$apply(function () {
                            $scope.messages.push(conrentMessage);
                        });
                        // viewScroll.scrollBottom(true);
                        //appendReceMsg(msg.fromUser.nickname,msg.content.text);
                    }, false);

                    //离开当前会话移除监听和会话
                    $scope.$on('$ionicView.beforeLeave', function(e) {
                        document.removeEventListener('jmessage.onReceiveMessage', function(){
                        },false);
                        window.JMessage.exitConversation(
                            function(response){
                            }, function(errorMsg) {
                                alert(errorMsg);
                            }
                        );
                    });
                    function keepKeyboardOpen() {
                        console.log('keepKeyboardOpen');
                        txtInput.one('blur', function() {
                            console.log('textarea blur, focus back on it');
                            txtInput[0].focus();
                        });
                    }
                }, function(errorMsg) {
                   alert(errorMsg);  // 输出错误信息。
                 });
        });
    })
    .controller('FriendsCtrl', function($scope,Friends) {
        $scope.$on('$ionicView.enter', function(e) {
            //获取当前用户所有会话框列表
            Friends.getAll(
            ).then(function(data) {
                $scope.friends = data;
            });
        });
    })
    .controller('FriendsAddCtrl', function($scope) {
        $scope.input={'friendName':''};
        $scope.sendAddFriendRequest = function() {
            //$state.go("tab.friends",{},{reload:true});
            window.JMessage.sendInvitationRequest($scope.input.friendName, "","",
                function(response){
                    alert('请求发送成功');
                    //$state.go("chats",{},{reload:true});
                    //window.JMessage.username = username;
                }, function(errorStr){
                    alert(errorStr);
                });
        };
    })
    .controller('FriendsDetailCtrl', function($scope, $stateParams, Friends) {
        alert($stateParams.friendId);

        $scope.friend = Friends.get($stateParams.friendId);
        $scope.enterSingleChats = function() {
            usernameForConversation = username;
            $state.go("chat-detail",{},{reload:true});
        };
        $scope.sendSingleMessage = function() {
            function sendMessage() {
                var messageContentString = $("#messageContent").val();
                window.JMessage.sendSingleTextMessage(
                    usernameForConversation, messageContentString, null,
                    function (response) {
                        var msg = JSON.parse(response);
                        messageArray.unshift(msg);
                        refreshConversation();
                    }, function (response) {
                        console.log("send message fail" + response);
                        alert("send message fail" + response);
                    });
            }
        };
    })
    .controller('GroupsCtrl', function($scope,Groups) {
        $scope.$on('$ionicView.enter', function(e) {
            //获取当前用户组列表
            Groups.getAll(
            ).then(function(data) {
                $scope.groups = data;
            });
        });
    })
    .controller('GroupDetailCtrl', function($scope, $stateParams, Groups) {
        $scope.$on('$ionicView.enter', function(e) {
            //获取当前用户组列表
            alert(groupId);
            Groups.getDetail(stateParams.groupId).then(function(data) {
                $scope.group = data;
            });
        });
    })
    .controller('GroupAddCtrl', function($scope) {
        $scope.sendAddGroupRequest = function (){

        }
    })
    .controller('AccountCtrl', function($scope,MyInfo) {
        $scope.myInfo = MyInfo.all();
        // window.JMessage.getMyInfo(
        //     function(response) {
        //         var myInfo = JSON.parse(response);
        //         MyInfo.init(myInfo);
        //         $scope.myInfo = MyInfo.all();
        //     }, function(errorStr) {
        //         console.log(errorStr);  // 输出错误信息。
        // });
      // $scope.settings = {
      //   enableFriends: true
      // };
    });
