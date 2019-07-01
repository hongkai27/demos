$(function () {
    var win_h = $(window).height(); //获取当前窗口的高度
    $('.main').css('height', (win_h - 82) + 'px');
    getDetail();

    initVue();
})

var roomNo = sessionStorage.getItem("roomId");
var app;
function initVue () {
    app = new Vue({
        el: '#app',
        data: {
            speechList: [],
            managerJwptList: [],
            participantsList: [],

            loadedPoliceList: [],

            show: false,
            xiugai: false,
            dialogVisible: false,
            room_pwd: "",

            detailInfo: {},
            options: [{
                value: 1,
                label: '多人视频会议'
            },
                {
                    value: 2,
                    label: '直播会议'
                }
            ],
            tree: [],
            props: {
                isLeaf: 'isLeaf'
            },
            showMask: false,

            search_list: null,
            search_keyword: '',
            is_searching: false,

            isManager: false,
            isCreater: false,
        },
        methods: {
            //进入会议
            intoMeeting() {
                app.dialogVisible = true;
            },
            cancle() {
                app.dialogVisible = false;
                app.passWorld = ''
            },
            confirm() {
                app.dialogVisible = false;
                joinMeeting()
            },
            ///////////////////////////////////
            //勾选树数据
            handleCheckChange(tree, value, indeterminate) {
                var checkedNodes = value.checkedNodes.filter(function(item){
                    return item.jwptid;
                })

                if (app.type == 1) {
                    //如果当前的人不在组织架构里，则需要加进来
                    for (var i in app.speechList) {
                        var police = app.speechList[i];
                        var isInStructure = isPeopleInStructure(police,app.loadedPoliceList);
                        if (!isInStructure) {
                            checkedNodes.push(police);
                        }
                    }

                    app.speechList = checkedNodes

                } else if (app.type == 2) {
                    //管理员只能有一个
                    if (checkedNodes.length > 0) {
                        if (app.managerJwptList.length > 0) {
                            app.managerJwptList = checkedNodes.filter(function(item){
                                return item.jwptid != app.managerJwptList[0].jwptid
                            });
                        }else {
                            app.managerJwptList = checkedNodes;
                        }

                    }else {
                        app.managerJwptList = []
                    }
                    var checkedList = app.managerJwptList.map(function (item) {
                        return item.jwptid
                    })
                    app.$refs.tree.setCheckedKeys(checkedList)

                } else if (app.type == 3) {
                    //如果当前的人不在组织架构里，则需要加进来
                    for (var i in app.participantsList) {
                        var police = app.participantsList[i];
                        var isInStructure = isPeopleInStructure(police,app.loadedPoliceList);
                        if (!isInStructure) {
                            checkedNodes.push(police);
                        }
                    }
                    app.participantsList = checkedNodes;
                }
            },
            //节点被点击时回调的函数
            loadNode(node, resolve) {
                var children = node.data.children;
                if (children && children.length>0) {
                    return resolve(children);
                }else {
                    var orgCode = node.data.orgCode
                    //如果子节点为空，则调接口查询底层参数
                    request({
                        url: host + getUserAction,
                        data: {
                            'orgCode': orgCode,
                        },
                        success: function (result) {
                            var convertResult = result.result.map(function(item){
                                item.isLeaf = true;
                                return item;
                            })
                            resolve(convertResult);


                            var list = app.loadedPoliceList;
                            app.loadedPoliceList = list.concat(convertResult);

                            setTimeout(function(){
                                setCheckedList()
                            },300)
                        },
                        error: function (result) {
                            console.log('error', result.msg)
                            resolve([]);
                        }
                    })
                }
            },

            canShow(type) {
                app.showMask = true;
                $(".side").show().animate({"right":"0"},300);

                app.type = type;
                //判断tree数据是否存在
                if (app.tree.length === 0) {
                    app.getTree()
                }else {
                    setCheckedList();
                }
            },
            deletePeopleAction(type,index) {
                switch (type) {
                    case 1: {
                        var list = app.speechList;
                        list.splice(index,1);
                        app.speechList = list;
                        break;
                    }
                    case 2: {
                        var list = app.managerJwptList;
                        list.splice(index,1);
                        app.managerJwptList = list;
                        break;
                    }
                    case 3: {
                        var list = app.participantsList;
                        list.splice(index,1);
                        app.participantsList = list;
                        break;
                    }
                }
            },
            closetree() {
                $(".side").animate({"right":"-300px"}, function(){
                    $(".side").hide();
                });
            },
            //获取树结构数据
            getTree() {
                request({
                    url: host + getTreeAction,
                    data: {},
                    success: function (res) {
                        var result = res.result;
                        result.label = result.orgName;
                        app.tree = [result]
                    },
                    error: function (res) {
                        load.loading.showError(res.msg)
                    }
                })

            },
            //修改按钮
            edit() {
                app.xiugai = true
            },
            editCancel() {
                app.xiugai = false
            },
            //修改结束确认按钮
            editOver() {
                //警号放入一个数组
                editMeeting()
            },

            backToPre() {
                history.back(-1);
            },

            hideSide() {
                app.showMask = false;
                app.closetree();
                app.search_keyword = '';
                app.search_list = null;
            },

            /**
             * 搜索输入改变
             */
            searchValueChange () {
                var key = $.trim(app.search_keyword);
                if (key.length == 0) {
                    app.search_list = null
                }
            },
            /**
             * 开始搜索
             */
            startSearch() {
                var keyword = $.trim(app.search_keyword);
                if (keyword.length == 0) {
                    //load.loading.showError('请输入关键字');
                    return;
                }
                app.is_searching = true;
                request({
                    url: host+getUserAction,
                    data: {
                        keyWord: keyword
                    },
                    success: function (res) {
                        app.is_searching = false;
                        app.search_list = res.result;
                    },
                    error: function (res) {
                        app.is_searching = false;
                        app.search_list = []
                    }
                })
            },
            /**
             * 选中某个搜索结果
             */
            selectSearchItemAction(item) {
                switch (app.type) {
                    case 1: {
                        var list = app.speechList;
                        var isIn = isPeopleInStructure(item,list);
                        if (isIn) {
                            load.loading.showError('请勿重复添加');
                            return;
                        }
                        list.push(item);
                        app.speechList = list;
                        break;
                    }
                    case 2: {
                        app.managerJwptList = [item];
                        break;
                    }
                    case 3: {
                        var list = app.participantsList;
                        var isIn = isPeopleInStructure(item,list);
                        if (isIn) {
                            load.loading.showError('请勿重复添加');
                            return;
                        }
                        list.push(item);
                        app.participantsList = list;
                        break;
                    }
                }
            }
        }
    })
}

function isPeopleInStructure (police, list) {
    for (var z in list) {
        var p = list[z];
        if (p.jwptid == police.jwptid) {
            return true;
        }
    }
    return false;
}

/**
 *  设置选中的结点
 */
function setCheckedList () {
    var checkedList;
    if (app.type == 1) {
        checkedList = app.speechList.map(function (item) {
            return item.jwptid
        });
    } else if (app.type == 2) {
        checkedList = app.managerJwptList.map(function (item) {
            return item.jwptid
        });
    } else if (app.type == 3) {
        checkedList = app.participantsList.map(function (item) {
            return item.jwptid
        });
    }
    app.$refs.tree.setCheckedKeys(checkedList)
}

/**
 * 获取会议详情
 */
function getDetail() {
    load.loading.add('加载中...');
    request({
        url: host + getDetailAction,
        data: {
            roomNo: roomNo
        },
        success: function (val) {
            load.loading.remove();

            var result = val.result;
            if (result.meetingType === 1) {
                result.meetingTypeContent = '多人视频会议'
            } else {
                result.meetingTypeContent = '直播会议'
            }
            app.detailInfo = result;

            app.managerJwptList = result.managers
            app.speechList = result.speeches
            app.participantsList = result.participants

            checkUserAuthor(result);
        },
        error: function (val) {
            load.loading.showError(val.msg);
        }
    })
}

function checkUserAuthor (result) {
    //判断当前用户是否为管理员
    var userInfo = getUserInfo();
    var res = result.managers.filter(function(item){
        return item.jwptid == userInfo.jwptid
    })
    app.isManager = (res && res.length>0);
    app.isCreater = (result.createJwptid == userInfo.jwptid);
}

/**
 * 进入会议室
 */
function joinMeeting() {
    var roomPassword = $.trim(app.room_pwd);
    if (roomPassword.length == 0) {
        load.loading.showError('密码不能为空');
        return;
    }

    load.loading.add('正在进入...');
    var userInfo = getUserInfo();
    request({
        url: host + joinMeetingAction,
        data: {
            roomNo: roomNo,
            jwptid: userInfo.jwptid,
            roomPassword: roomPassword
        },
        success: function (val) {
            load.loading.remove();

            sessionStorage.setItem('meetingType', app.detailInfo.meetingType);
            sessionStorage.setItem('isManager', app.isManager?'1':'0');
            location.href = '../video.html';
        },
        error: function (val) {
            load.loading.showError(val.msg);
        }
    })
}

/**
 * 编辑会议信息
 */
function editMeeting(){
    var meetingSubject = $.trim(app.detailInfo.meetingSubject);
    var meetingType = app.detailInfo.meetingType;
    var meetingContent = $.trim(app.detailInfo.meetingContent);
    var startTime = app.detailInfo.startTime;
    var endTime = app.detailInfo.endTime;
    var remindTime = app.detailInfo.remindTime;

    var managerJwptIds = app.managerJwptList.map(function(item){
        return item.jwptid
    });
    var speechJwptIds = app.speechList.map(function(item){
        return item.jwptid
    });
    var participantsJwptIds = app.participantsList.map(function(item){
        return item.jwptid
    });
    if (!meetingSubject || meetingSubject.length==0) {
        load.loading.showError('请输入会议主题');
        return;
    }
    if (!meetingType || meetingType.length==0) {
        load.loading.showError('请选择会议类型');
        return;
    }
    if (meetingType == 2) {
        if (speechJwptIds.length==0) {
            load.loading.showError('请选择演讲人');
            return;
        }
        if (managerJwptIds.length==0) {
            load.loading.showError('请选择管理人');
            return;
        }
    }
    if (!startTime || startTime.length==0) {
        load.loading.showError('请选择开始时间');
        return;
    }
    if (!endTime || endTime.length==0) {
        load.loading.showError('请选择结束时间');
        return;
    }
    if (participantsJwptIds.length == 0) {
        load.loading.showError('请选择主要参会人员');
        return;
    }
    if (meetingType == 1 && participantsJwptIds.length > 7) {
        load.loading.showError('参会人员不能超过7人');
        return;
    }

    if (!remindTime || remindTime.length==0) {
        load.loading.showError('请输入会议主题');
        return;
    }
    if (!meetingContent || meetingContent.length==0) {
        load.loading.showError('请输入会议内容');
        return;
    }

    var data = {
        roomId: app.detailInfo.roomId,
        meetingSubject: meetingSubject,
        meetingType: meetingType,
        meetingContent: meetingContent,
        startTime: startTime,
        endTime: endTime,
        remindTime: remindTime,
        participantsJwptIds: participantsJwptIds.join(',')
    }
    if (meetingType==2) {
        data.managerJwptIds = managerJwptIds.join(',');
        data.speechJwptIds = speechJwptIds.join(',');
    }

    load.loading.add('正在修改...');
    console.log("data:"+JSON.stringify(data));
    request({
        url: host + editOverAction,
        data: data,
        success: function (val) {
            load.loading.showSuccess('修改成功')
            app.xiugai = false;

            checkUserAuthor(val.result);
        },
        error: function (val) {
            load.loading.showError(val.msg)
        },
    })
}
