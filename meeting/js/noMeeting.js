$(function(){
    $(".tab-tit-ul li").click(function(){
        var index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $(".tab-content .tab-specific-content").eq(index).show().siblings('.tab-specific-content').hide();
    });
});