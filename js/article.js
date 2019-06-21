var url,ftp,ftptext;
function address(){
    var host = window.location.host;
    if(host === "www.91jtg.com"){
        ftp ='http://auth.winshe.cn:8022/upload/images/';//大v图像
        ftptext = 'http://attach.91diyancha.com/';  //文章图片获取地址
        url = 'http://quiz.91diyancha.com';//接口地址
    }else{
        ftp ='http://api.91jtg.com:8020/upload/images/';//图像获取地址
        ftptext = 'http://47.97.45.6:8006'  //文章图片获取地址
        url = 'http://47.97.45.6:8092';
    }
}

var articleId,savantId; //文章id
//获取URL参数
function getQueryString(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}
$(function(){
    articleId = getQueryString("articleId");
    savantId = getQueryString("savantId");
    article();
    load();
})

function load(){
    address();
    $.ajax({
        type:"post",
        url:url +"/api/savant/detail/info",
        dataType:"json",
        data:{
            savantId:savantId
        },
        success:function(result){
            console.log(result)
            if(result.state== "1"){
                $("#nickName").text(result.data.nickName);
                if(result.data.headImgPath ==''|| result.data.headImgPath == null){
                    $("#headImgPath").attr('src', 'img/renwu.png');
                }else{
                    $("#headImgPath").attr('src', ftp + result.data.headImgPath);
                }
            }
        },
    });
}
function article(){
    address();
    $.ajax({
        type:"post",
        url:url+"/api/article/detail/push",
        dataType:"json",
        data:{
            articleId:articleId,
            htmlFormat:true
        },
        success:function(result){
            console.log(result)
            if(result.state== "1"){
                var data = result.data;
                var textHtml = data.content;
                textHtml = textHtml.replace(/<br\/>/g,"<br/>");
                $("#content").append(textHtml);
                $("#title").text(data.title);
                $(".title").text(data.title);
                $("#createTime").text(data.createTime);
                // extraType=true代表管理后台发布的文章
                if(data.extraType == false){
                    for(var i=0;i<data.imgList.length;i++){
                        var html = '<span><img src='+ ftptext +'/'+ data.imgList[i].imgPath +' /></span>';
                        $(".img").append(html);
                    }
                }
            }
        },
    });
}

//获取是否微信内置浏览器
function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
//下载
function downloadApp(isForse) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS == true) {
        location.href = "https://itunes.apple.com/cn/app/%E5%A4%AA%E5%85%AC%E9%97%AE%E7%AD%94/id1270031233?mt=8";
    }
    else if (isAndroid || isForse) {
        // 判断是否是微信浏览器
        var isWeixin = is_weixin();
        if (isWeixin) {
            $('#mcover').show();
            return;
        }
        location.href = "http://www.91jtg.com/appjtg.apk";
        // location.href = "https://sj.qq.com/myapp/detail.htm?apkName=com.winshe.jtg.tgzj"; //跳到应用宝下载
    }
    return false;
}
