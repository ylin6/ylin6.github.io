$(function(){ 
    var width = window.innerWidth/2;
    var height = window.innerHeight/2;
    $("body").mousemove(function(e){
        var vx = (event.pageX - width)/(width*8)*-100;
        var vx2 = vx*0.25;
        $("#cloud1").css({
            'transform':'translateX('+vx+'%)',
            '-webkit-transform':'translateX('+vx+'%)',
            '-moz-transform':'translateX('+vx+'%)'
        });
        
        $("#cloud2").css({
            'transform':'translateX('+vx2+'%)',
            '-webkit-transform':'translateX('+vx2+'%)',
            '-moz-transform':'translateX('+vx2+'%)'
        });
    });
    
    $(window).on('scroll', function(){
        $('#avi').addClass("expanded");
        console.log("Scrolling");
        console.log(window.pageYOffset);
        if(window.pageYOffset > 450){
            $(".toolbar").show();
        }
        
        else{
            $(".toolbar").hide();
        }
        
        if(window.pageYOffset > 510){
            $('.toolbar-header').show();
        }
        
        else{
            $('.toolbar-header').hide();
        }
    });
    
    $('.col-md-6').mouseenter(function(){
        $(this).find('.hover').show();
        console.log($(this).find('img').height());
        $(this).find('.hover').height($(this).find('.img-r').height());
    });
    
    $('.col-md-6').mouseleave(function(){
        $(this).find('.hover').hide();
    });
    
    $('#menu').click(function(){
        $(".menu").show();
    });
    
    $('#close').click(function(){
        $(".menu").hide();
    });
        
});
    