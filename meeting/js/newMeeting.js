$(function () {
    initVue();
    var win_h = $(window).height(); //获取当前窗口的高度
    $('.main').css('height', (win_h - 82) + 'px');
    $(".login-out").click(function () {
        window.location.href = 'login.html'
    })

    app.getTree();
})

var app;
function initVue () {
    app = new Vue({
        el: '#app',
        data: {
            show: false,
            time: "",
            input_data: {
                meetingSubject: "", //会议主题
                meetingContent: "", //会议内容
                meetingType: "", //会议类型1 多人视频会议, 2 直播会议
                startTime: "", //开始时间
                endTime: "", //结束时间
                remindTime: "", //提醒时间
            },
            type: "",

            speechList: [],
            managerJwptList: [],
            participantsList: [],
            loadedPoliceList: [],

            options: [
                {
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
            showSuccessPopup: false,
            success_result: {},

            is_searching: false,
            search_list: null,
            search_keyword: '',
        },
        methods: {
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
                // app.show = true;
                app.showMask = true;
                $(".side").show().animate({"right":"0"},300);

                app.type = type;
                //判断tree数据是否存在
                if (app.tree.length == 0) {
                    app.getTree()
                }else {
                    var checkedList = [];
                    if (type == 1) {
                        checkedList = app.speechList.map(function (item) {
                            return item.jwptid
                        })
                    } else if (type == 2) {
                        checkedList = app.managerJwptList.map(function (item) {
                            return item.jwptid
                        })
                    } else if (type == 3) {
                        checkedList = app.participantsList.map(function (item) {
                            return item.jwptid
                        })
                    }
                    app.$refs.tree.setCheckedKeys(checkedList)
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

            //下一步按钮
            next() {
                createMeeting();
            },
            //成功创建会议室
            postData() {

            },
            //获取树结构数据
            getTree() {
                request({
                    url: host + getTreeAction,
                    data: {},
                    success: function (result) {
                        var result = result.result;
                        result.label = result.orgName;
                        app.tree = [result]
                    },
                    error: function (result) {}
                })

            },
            hideSide() {
                app.showMask = false;
                app.closetree();
                app.search_keyword = '';
                app.search_list = null;
            },

            successPopConfirm() {
                history.back(-1);
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
 * 创建房间
 * meetingSubject	是	string	主题
 * meetingType	是	string	会议类型: 1 多人视频会议, 2 直播会议
 meetingContent	是	string	会议内容
 startTime	是	date	开始时间（yyyy-MM-dd HH:mm:ss）
 endTime	是	date	结束时间 （yyyy-MM-dd HH:mm:ss）
 remindTime	是	date	提醒时间 （yyyy-MM-dd HH:mm:ss）
 managerJwptIds	否	String	管理人员的jwptid (,分割)
 speechJwptIds	否	String	演讲人员的jwptid (,分割)
 participantsJwptIds	否	String	参会人员的jwptid (,分割)

 */
function createMeeting () {
    //非空判断
    var meetingSubject = $.trim(app.input_data.meetingSubject);
    var meetingType = app.input_data.meetingType;
    var meetingContent = $.trim(app.input_data.meetingContent);
    var startTime = app.input_data.startTime;
    var endTime = app.input_data.endTime;
    var remindTime = app.input_data.remindTime;

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
        meetingSubject: meetingSubject,
        meetingType: meetingType,
        meetingContent: meetingContent,
        startTime: startTime,
        endTime: endTime,
        remindTime: remindTime,
        participantsJwptIds: participantsJwptIds.join(',')
    }
    if (meetingType == 2) {
        data.managerJwptIds = managerJwptIds.join(',');
        data.speechJwptIds = speechJwptIds.join(',');
    }
    load.loading.add('正在创建...')
    request({
        url: host + createMeetingAction,
        data: data,
        success: function (result) {
            showSuccessPop(result.result)
        },
        error: function (result) {
            load.loading.showError(result.msg)
        }
    })
}

function showSuccessPop (res) {
    load.loading.remove();
    app.success_result = res;
    app.showSuccessPopup = true
}