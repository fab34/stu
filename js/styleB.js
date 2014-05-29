$(document).ready(function(){
    $(".carLeftNav>li").mouseover(function(){
        $(".carLeftNav>li").removeClass('active');
        this.addClass('active');
        });
    $("#thumbnail").mouseout(function(){
        $(".carLeftNav>li.deful").addClass('active');
    });

    $(".carRightNav>li").mouseover(function(){
        $(".carRightNav>li").removeClass('active');
        this.addClass('active');
        });
    $("#thumbnail").mouseout(function(){
        $(".carRightNav>li.deful").addClass('active');
    });
});