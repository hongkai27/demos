
//api服务地址
var host = "https://sphy.ihooyah.com/sphy_rtc_api/";
//websocket服务地址
var ws_host = "wss://sphy.ihooyah.com/sphy_rtc_chat/ws/";

//获取会议列表
var getRoomListAction = 'room/list';
//获取树结构数据
var getTreeAction = 'common/getOrganizeStructure';
//创建房间成功提交信息
var createMeetingAction = 'room/add';
//首页进入房间获取信息
var getDetailAction = 'room/detail';
//加入会议
var joinMeetingAction = 'room/joinRoom';
//树结构底层用户数据
var getUserAction = 'user/list';
//会议详情修改编辑
var editOverAction = 'room/edit';
//获取房间参会人员
var getHomeUserListAction = 'room/participantsList';
//禁言
var forbiddenWordsAction = 'room/forbiddenWords';
//踢出房间
var kickOutRoomAction = 'room/kickOutRoom';
//变更主播
var changeAnchorAction = 'room/anchor';

/**
 * 登录
 * @param obj
 */
//登录操作
var loginAction = 'user/login';


function request (obj) {
    var params = obj.data;
    var userInfo = getUserInfo();
    $.ajax({
        type: "POST",
        url: obj.url,
        dataType: "json",
        data: params,
        timeout: 10000, // 超时时间 10 秒
        headers : {
            'Content-Type':'application/x-www-form-urlencoded;charset=utf8',
            "app-version": '1.0.0',
            "device-uuid": "111",
            "device-name": "222",
            "device-model": "aa",
            "device-os-name": "333",
            "device-os-version": "sddf",
            "jwptid": userInfo.jwptid
        },
        // headers:{'Content-Type':'application/x-www-form-urlencoded;charset=utf8'},
        // beforeSend: function(request) {
        //     request.setRequestHeader("app-version", '1.0.0');
        //     request.setRequestHeader("device-uuid", '1');
        //     request.setRequestHeader("device-name", navigator.appName);
        //     request.setRequestHeader("device-model", '111');
        //     request.setRequestHeader("device-os-name", navigator.platform);
        //     request.setRequestHeader("device-os-version", navigator.appVersion);
        //     request.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded;charset=utf8');
        // },
        success: function (object) {
            //console.log("请求成功："+JSON.stringify(object))
            if (object && object.code==200) {
                obj.success(object);
            }else {
                obj.error(object);
            }

        },
        error:function (object) {
            //console.log("请求失败："+JSON.stringify(object))
            obj.error(object);
        }
    });
}

function getUserInfo () {
    var userInfoStr = sessionStorage.getItem('userInfo');
    if (userInfoStr && userInfoStr.length > 0) {
        var userInfo = JSON.parse(userInfoStr);
        return userInfo;
    }

    return {};
}

function getRoomNo() {
    return sessionStorage.getItem("roomId");
}

/**
 * 获取链接参数 公用方法
 */
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null){
            var a=r[2].replace(/<.*>/, "");
            var b=a.replace(/<|>|\'|\"/g, "");
            return unescape(b);
        }else{
            return null;
        }

    }
})(jQuery);