/* http://jamesvec.com
   simple thumbs v1
   Written by james vecchio (jamesvec[at]gmail.com) June 2010.
   Feel free to use this on any project. 
   I would love to see what people do with it, so drop me a line
   if you use it.
   */
$(document).ready (function(){		
	$("#large_images li").each(function(index, element){$(element).attr("class", 'hide');});
    $("#large_images li").each(function(index, element){$(element).attr("id", 'img'+index);});
    $("#thumb_holder li a").each(function(index, element){$(element).attr("rel", 'img'+index);});
	
	var mainImg ='img0';
	var current = 'img0';
	
	$('#img0').css('display', 'inline');
	$('#img0').addClass('current');
	
	$('#thumb_holder li a').click (function(){								   
		mainImg = $(this).attr('rel');
		if(mainImg != current){
		$('.current').fadeOut('slow');
		$('#'+mainImg).fadeIn('slow', function(){
		$(this).addClass('current');
		current = mainImg;
		
		});
		}
	});
});