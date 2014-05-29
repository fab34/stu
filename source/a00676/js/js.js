(function() {
D.query("#J_pane_tab .pane-title li").forEach(function(el,n){
E.on(el,"mouseover",function(){
    if(typeof Tracker != 'undefined'){
  Tracker.click('tab'+(n>0?'wow':'life'));  
      }
});
});

AP.widget.eSlide=function(m){var g={duration:1000,pause:1000,num:1,dir:[-1,0],auto:false,floatFix:true};var p={scroll_to:[]},q={scroll_to:[]},d=m.nodeName?m:D.get(m),e=f(d),r=arguments[1]||g,t=l("dir")[0]==0?"top":"left";function k(){var u={position:"relative"};D.setStyles(d.parentNode,u);var w=0;for(var v=0;v<e.length;v++){e[v].startPos=w;w+=e[v][l("dir")[0]==0?"clientHeight":"clientWidth"]}if(l("floatFix")){u.width=w+"px"}u[t]=0;D.setStyles(d,u)}k();var j,i=0;function h(y){var v=o("scroll_to",{from:i,to:y,total:e.length});y=v.to;_f=v.from;if(!e[y]||y==_f){return}var u=-e[y].startPos;var w=e[_f]?-e[_f].startPos:parseInt(d.style[t]);i=y;j&&j.stop();var x={};x[t]={from:w,to:u};j=new U.Anim(d,x,l("duration")/1000,YAHOO.util.Easing.easeOut);j.onComplete.subscribe(function(){c("scroll_to",{cur:i})});j.animate()}function a(){var v;do{var u=l("dir");v=i+(u[0]+u[1])*l("num")*(arguments[0]?arguments[0]:-1);if(arguments[0]){break}}while(!n(v));h(v)}function n(u){var v=true;if(u<0||u>=e.length){r.dir=[l("dir")[0]*-1,l("dir")[1]*-1];v=false}return v}var s=0;function b(){s=window.setInterval(function(){if(l("auto")){a()}else{window.clearInterval(s)}},l("duration")+l("pause"))}if(l("auto")){b()}function l(u){return r[u]===undefined?g[u]:r[u]}function f(x){var w=[];var y=x.childNodes;for(var v=0,u=y.length;v<u;v++){if(y[v].tagName!=undefined&&y[v].nodeName!="#comment"){w.push(y[v])}}return w}function o(x,w){if(p[x].length>0){for(var v=0,u=p[x].length;v<u;v++){w=p[x][v].call(w)||w}}return w}function c(x,w){if(q[x].length>0){for(var v=0,u=q[x].length;v<u;v++){w=q[x][v].call(w)||w}}return w}return{next:function(){window.clearInterval(s);h(i+l("num"));if(l("auto")){b()}return{current:i,first:i==0,end:i==(e.length-1)}},prev:function(){window.clearInterval(s);h(i-l("num"));if(l("auto")){b()}return{current:i,first:i==0,end:i==(e.length-1)}},go:function(u){h(u)},play:function(){window.clearInterval(s);if(l("auto")){b()}},stop:function(){window.clearInterval(s)},addFilter:function(v,u){p[v].push(u)},addAction:function(v,u){q[v].push(u)}}};


E.onDOMReady(function() {
//Init for Banner
var banner_panel_html = '', banner_panel_tpl = unescape(D.query('#J_banner_action_panel ul')[0].innerHTML);
D.query('.banner-explain').forEach(function(e, i){
	var panel_detail = { title: e.getAttribute('data-title'), url: e.getAttribute('data-url'), img: e.getAttribute('data-img'), index: i };
	var _detail = banner_panel_tpl.replace(/\{([a-zA-Z0-9]*?)\}/g, "'+panel_detail.$1+'").replace(/[\n\r]/g, '');
	eval("_detail='"+_detail+"'");
	banner_panel_html += _detail;
});
D.get('J_banner_action_panel').innerHTML = '<ul>'+banner_panel_html+'</ul>';
D.addClass(D.query('#J_banner_action_panel ul li')[0], 'current');
lasyLoad(0);
D.removeClass(D.query('#J_banner_action_panel'), 'fn-hide');


var _banner = new AP.widget.eSlide(D.get('J-banner-container'), { auto: true, duration: 400, pause: 10000 });
var _delay = 0;
E.on(D.query('#J_banner_action_panel ul li'), 'mouseover', function(e){
	_banner.stop();
	var _to = parseInt(this.getAttribute('data-index'));
	window.clearInterval(_delay);
	_delay = window.setInterval(function(){ _banner.go(_to); }, 400);
});

E.on(D.query('#J_banner_action_panel ul li'), 'mouseout', function(e){
	window.clearInterval(_delay);	
	_banner.play();
});

var otherli = document.createElement('li');
otherli.className = 'other';
D.query('#J_banner_action_panel ul')[0].appendChild(otherli);

_banner.addFilter('scroll_to', function(){
	D.query('#J_banner_action_panel ul li').forEach(function(e, i){
		D.removeClass(e, 'current');
	});
	D.addClass(D.query('#J_banner_action_panel ul li')[this.to], 'current');
	//当滑动间隔不为1时
	if(Math.abs(this.from-this.to)>1){
		this.from = this.to + (this.from<this.to?-1:1);
	}

	lasyLoad(this.from);
	lasyLoad(this.to);

	//Clear Delay Scroll
	window.clearInterval(_delay);
	
	return this;
});

function lasyLoad(i){
	//For Lasy Load
	var dataimg = D.query('.banner-explain')[i].getAttribute('data-img');
	if(dataimg){
		D.setStyles(D.query('.banner-explain')[i], { background: 'url('+dataimg+')' });
		D.query('.banner-explain')[i].removeAttribute('data-img');
	}	
}

var links = D.query('a',D.get('J_banner_action_panel'));
if(links.length>0){
    links.forEach(function(i){
        i.target = '_blank';

    });
}
});

})();