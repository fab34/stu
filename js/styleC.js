$(document).ready(function(){
    //$("#thumbnail>li").addClass('active');
    $(".carLeftNav>li").mouseover(function(){
        $(".carLeftNav>li").removeClass('active');
        this.addClass('active');
    });
    $(".carLeft").mouseout(function(){
        $(".carLeftNav>li.deful").addClass('active');
    });

    $(".carRightNav>li").mouseover(function(){
        $(".carRightNav>li").removeClass('active');
        this.addClass('active');
    });
    $(".carRight").mouseout(function(){
        $(".carRightNav>li.deful").addClass('active');
    });

    //顯示所在大圖
    $(".carCon li").each(function(index, element){
        $(element).attr("class", 'hide');
    });
    $("#large_imagesL li").each(function(index, element){
        $(element).attr("id", 'imgL'+index);
    });
    $("#large_imagesR li").each(function(index, element){
        $(element).attr("id", 'imgR'+index);
    });
    $("#thumb_holderL li a").each(function(index, element){
        $(element).attr("rel", 'imgL'+index);
    });
    $("#thumb_holderR li a").each(function(index, element){
        $(element).attr("rel", 'imgR'+index);
    });
    
    var mainImgL ='imgL';
    var currentL = 'imgL';
    var mainImgR ='imgR';
    var currentR = 'imgR';
    
    $('#imgL0').css('display', 'block');
    $('#imgR0').css('display', 'block');
    
    $('#thumb_holderL li a').click (function(){                                 
        mainImgL = $(this).attr('rel');
        if(mainImgL != currentL){
        $('.currentL').fadeOut('fast');
        $('#'+mainImgL).fadeIn('fast', function(){
            $(this).addClass('currentL');
            currentL = mainImgL;
            });
        }
    });

    $('#thumb_holderR li a').click (function(){                                 
        mainImgR = $(this).attr('rel');
        if(mainImgR != currentR){
        $('.currentR').fadeOut('fast');
        $('#'+mainImgR).fadeIn('fast', function(){
            $(this).addClass('currentR');
            currentR = mainImgR;
            });
        }
    });


    $(".slnav li").mouseover(function(){
        $(".slnav li").removeClass('slactive');
        $(this).addClass('slactive');
    });
    $(".slnav li").mouseout(function(){
        $(".slnav li").removeClass('slactive');
        $(".slnav #sli-1").addClass('slactive');
    });
});