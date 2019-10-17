var api_domain = 'http://161.117.192.11:8080';
// var api_domain = 'http://cw.wanzhantong.cn/api/v1/';
var token = '';

/**获取url中字段的值
 * name : 字段名
 * */
function get_param(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
 
function layer_msg(msg) {
    layer.msg(msg);
}
function loadding(){
    var index = layer.load(1, {
  shade: [0.6,'#000'] //0.1透明度的白色背景
});
}

function postFun(url, data, callbake) {
    var paramData = {
    "data": data,
    "global": {
        "loc": "english",
        "os": "3",
        "sign": "CBDE447D82EBC44207FAC122DA430122",
        "device": "20824660614580524044",
        // "token": localStorage.getItem("token") || '8oBI0g==',
        "identity": localStorage.getItem("identity") || ''
    }
};

var datalist = {
    "loc": localStorage.getItem("language") || "chinese",
    "text": JSON.stringify(paramData),
    "os": "3"
};
console.log(paramData.global.identity,'ajax');
    $.ajax({
        url: api_domain + url,
        dataType: "json",
        contentType: 'application/json',
        async: true,
        data: JSON.stringify(datalist),
        type: "POST",
        success: function(req) {

                callbake(req);

        },
        error: function(req) {
            //请求出错处理
            layer_msg('请重试');
        }
    });
}