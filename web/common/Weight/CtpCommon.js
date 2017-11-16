/**
 扩展一个test模块
 **/

layui.define('layer',function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var $ = layui.jquery;
    var layer = layui.layer; //独立版的layer无需执行这一句

    var CtpCommon = {};

    /**
     * 调用服务公共方法
     * @param url String 服务地址，必填。
     * @param param Object 带给服务器的数据，可选。 不传，默认不带数据。
     * @param type String 请求方式，可选。 不传，默认GET请求方式。比如： GET 、 POST 、 PUT 、 DELETE。
     * @param isAsync boolean 是否异步，可选。 不传，默认是异步的。 true(异步) / false(同步)。
     * @param isRedirectErrorPage 后台服务报错，是否重定向错误页面，可选。 不传，默认YES(重定向错误页面)。 YES(重定向错误页面) / NO(不重定向错误页面)。
     * 示例：
     *     callServices('/tcApply/v1/applys/list').done(function (data) {
     *          // 成功回调
     *     }).fail(function (err) {
     *          // 失败回调
     *     });
     */
    CtpCommon.CallService = function(url, param, type, isAsync, isRedirectErrorPage){
        var argsLen = arguments.length;

        if (argsLen < 2) {
            param = "";
        }

        type = type || "GET";

        if (argsLen < 4) {
            isAsync = true;
        }

        isRedirectErrorPage = isRedirectErrorPage || "YES";

        //判断参数的类型
        var paramType = typeof param;
        //带个服务器的参数
        var data = "";
        if (paramType === "string") {
            data = param;
        } else if (paramType === "object") {
            data = JSON.stringify(param);
        } else if (paramType === "number") {
            data = JSON.stringify(param);
        } else {
            return "(Param Error) param = " + param;
        }

        var ajaxConfig = {
            url: this.getWebRoot() + url,
            type: String(type).toUpperCase(),
            contentType: 'application/json;charset=utf-8',   //发送给服务器的数据格式，json
            data: data,   //带给服务器的数据
            // timeout: 15000, //超时时间
            dataType: 'json',  //返回数据的格式
            async: isAsync,
            cache: false,
            error: function (err) {
                if(err.status != "0") { // 0 表示取消请求。让浏览器不再监听这个请求的响应。
                    //打印日志信息
                    console.error("rest url = " + url);
                    /*if(utils.device().ie === '9' || utils.device().ie === '10' || utils.device().ie === '11'){
                        console.error("err = " + JSON.stringify(err));
                    }else{
                        console.error(err);
                    }*/
                }

                //前台给出提示
                var message = "";
                if (err.status == "404") {
                    message = "请求地址不存在！";
                } else if (err.status == "500") {
                    message = "未知错误！";
                } else if (err.status == "401") {
                    //相当于退出登录。设置登录标识为false，用于关闭页面使用
                    //未登录或者登录超时跳转到登录页面
                    window.location.href = '/modules/purchase/common/login/Login.html';
                }else{
                    return;
                }
                layer.msg(message,{
                    time: 3000 // 3s后关闭
                });

                // 重定向错误页面
                if (isRedirectErrorPage != "NO") {
                    // CtpCommon.setDataToSession('common.error.message', err);
                    // window.location.href = '/modules/purchase/common/error/Error.html';
                }
            }
        };
        return $.ajax(ajaxConfig);
    };

    /**
     * 获取web应用根目录
     * @returns {string}
     */
    CtpCommon.getWebRoot = function () {
        return "/gateway";
    }

    //输出test接口
    exports('CtpCommon', CtpCommon);
});