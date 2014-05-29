var isIE6 = !!window.ActiveXObject && !window.XMLHttpRequest;
Eva.use("slide", "plug-carousel", "plug-switchable-effect", "datalazyloader", "slide", 
function(q) {
    var f = "autoplay",
    k = "img-src",
    b = "fade",
    c = "scrollX",
    u = "scrollY",
    j = "mouseenter",
    i = "mouseover",
    d = "mouseout",
    G = "switch",
    p = "mouseleave",
    E = "display",
    r = "none",
    a = "block",
    t = true,
    J = false;
    if (q.one(".ifengframe-header")) {
        return
    }
    var v = q.one("#Y_ItemTab"),
    n = q.one("#Y_bigshow"),
    o = q.one("#Y_brand_win"),
    s = q.one("#Y_CorpWrap"),
    C = null,
    H = '<div class="cop-tab-bg"></div>',
    I = '<div class="mask-layer"></div>';
    var D = null;
    if (D == null) {
        D = new q.DataLazyLoader(null, {
            callbacks: {
                els: [s],
                fns: [y]
            }
        })
    }
    if (n) {
        var g = n.one(".tab-panel"),
        B = g.all("img");
        B.each(function(K) {});
        n.all(".tab-panel li a").append(I);
        var A = n.all(".mask-layer");
        if (isIE6) {
            PNG_IE6()
        }
        A.on(i, 
        function(K) {
            new q.Anim({
                node: K.currentTarget,
                to: {
                    opacity: 0.5
                },
                duration: 0.2
            }).run()
        });
        A.on(d, 
        function(K) {
            new q.Anim({
                node: K.currentTarget,
                to: {
                    opacity: 0
                },
                duration: 0.2
            }).run()
        });
        var l = new q.Anim({
            node: q.one("#Y_bigshow .tab-nav"),
            to: {
                bottom: 0
            },
            duration: 1
        });
        var x = new q.Slide(n, {
            effect: u,
            panelsCls: "tab-content",
            triggersCls: "tab-nav-list",
            activeTriggerCls: "tab-nav-active",
            interval: 8,
            duration: 1,
            autoplay: J,
            pauseOnHover: t
        });
        var w = x.switchable;
        w.on(G, 
        function(L) {
            var M = w.get("activeIndex"),
            K = n.all(".cur-arrow");
            K.setStyle(E, r);
            K.item(M).setStyle(E, a);
            var N = n.all(".tab-panel").item(L.index);
            if (N != null) {
                D.loadCustomLazyData(N, k)
            }
        });
        l.run()
    }
    if (v) {
        new q.Slide(v, {
            triggersCls: "tab-nav",
            panelsCls: "tab-content",
            activeTriggerCls: "on",
            effect: b,
            autoplay: J,
            interval: 4
        }).switchable.on("switch", 
        function(K) {
            var L = v.all(".tab-pannel").item(K.index);
            if (L != null) {
                D.loadCustomLazyData(L, k)
            }
        })
    }
    if (o) {
        var h = o.one("#scroller-prev"),
        e = o.one("#scroller-next");
        o.plug([{
            fn: q.Plugin.Carousel,
            cfg: {
                circular: t,
                steps: 3,
                autoplay: J,
                interval: 5
            }
        },
        {
            fn: q.Plugin.SwitchableEffect,
            cfg: {
                effect: c,
                relateType: "carousel",
                easing: "easeOutStrong",
                duration: 2
            }
        }]).carousel.on(G, 
        function(K) {
            var L = o.all(".scroller li");
            if (L != null) {
                L.each(function(M) {
                    D.loadCustomLazyData(M, k)
                })
            }
        });
        o.on(j, 
        function(K) {
            new q.Anim({
                node: h,
                to: {
                    left: 0
                },
                duration: 0.3
            }).run();
            new q.Anim({
                node: e,
                to: {
                    right: 0
                },
                duration: 0.3
            }).run()
        });
        o.on(p, 
        function(K) {
            new q.Anim({
                node: h,
                to: {
                    left: -92
                },
                duration: 0.3
            }).run();
            new q.Anim({
                node: e,
                to: {
                    right: -92
                },
                duration: 0.3
            }).run()
        })
    }
    var z = q.one("#cop-tab-hot");
    if (z) {
        var F = {
            interval: 3,
            autoplay: t,
            pauseOnHover: t,
            effect: u
        };
        var m = new q.Slide(z, F)
    }
    if (isIE6 && !n) {
        PNG_IE6()
    }
    q.on("domready", 
    function() {
        w.set(f, t);
        w._startAutoPlay();
        v.switchable.set(f, t);
        v.switchable._startAutoPlay();
        o.carousel.set(f, t);
        o.carousel._startAutoPlay()
    });
    function y() {
        C = q.one("#Y_cop");
        if (C) {
            C.all(".cop-tab li a").append(H);
            var L = new q.Slide(C, {
                panelsCls: "cop-content",
                triggersCls: "cop-tab",
                activeTriggerCls: "cop-tab-active",
                interval: 4,
                autoplay: J,
                effect: b
            }),
            K = L.switchable;
            K.on(G, 
            function(M) {
                var N = C.all(".cop-panel").item(M.index);
                if (N != null) {
                    D.loadCustomLazyData(N, k)
                }
            });
            C.on(p, 
            function(M) {
                if (K.get("activeIndex") != 0) {
                    K.switchTo(0)
                }
            })
        }
    }
});
function PNG_IE6() {
    GtPNG.fix("#Y_bigshow div,#Y_bigshow ul,#Y_bigshow span,#Y_bigshow li,#Y_bigshow a,#Y_bigshow em,#Y_bigshow b,#Y_brand_win span,#hd,#ft")
}
if (isIE6) {
    eval(function(f, h, g, i, d, b) {
        d = function(a) {
            return (a < h ? "": d(parseInt(a / h))) + ((a = a % h) > 35 ? String.fromCharCode(a + 29) : a.toString(36))
        };
        if (!"".replace(/^/, String)) {
            while (g--) {
                b[d(g)] = i[g] || d(g)
            }
            i = [function(a) {
                return b[a]
            }];
            d = function() {
                return "\\w+"
            };
            g = 1
        }
        while (g--) {
            if (i[g]) {
                f = f.replace(new RegExp("\\b" + d(g) + "\\b", "g"), i[g])
            }
        }
        return f
    } ("2 E={J:'E',Z:{},1E:7(){4(x.1l&&!x.1l[6.J]){x.1l.23(6.J,'24:25-26-27:3')}4(1F.11){1F.11('28',7(){E=29})}},1G:7(){2 a=x.1m('8');x.1H.1b.1n(a,x.1H.1b.1b);2 b=a.1o;b.1c(6.J+'\\\\:*','{12:2a(#1I#2b)}');b.1c(6.J+'\\\\:9','Q:1p;');b.1c('1J.'+6.J+'1K','12:y; 1q:y; Q:1p; z-2c:-1; 1d:-1r; 1L:1M;');6.1o=b},1N:7(){2 a=13.2d;4(13.1e.K('2e')!=-1||13.1e.K('1q')!=-1){E.1f(a)}4(13.1e=='8.1s'){2 b=(a.F.1s=='y')?'y':'2f';G(2 v M a.3){a.3[v].9.8.1s=b}}4(13.1e.K('14')!=-1){E.1t(a)}},1t:7(a){4(a.F.14.K('2g')!=-1){2 b=a.F.14;b=1u(b.2h(b.1v('=')+1,b.1v(')')),10)/2i;a.3.N.9.8.14=a.F.14;a.3.C.I.2j=b}},15:7(a){2k(7(){E.1f(a)},1)},2l:7(a){2 b=a.1O(',');G(2 i=0;i<b.2m;i++){6.1o.1c(b[i],'12:2n(E.1P(6))')}},1f:7(a){a.S.1Q='';6.1R(a);6.16(a);6.1t(a);4(a.O){6.1S(a)}},1T:7(b){2 c=6;2 d={2o:'16',2p:'16'};4(b.17=='A'){2 e={2q:'15',2r:'15',2s:'15',2t:'15'};G(2 a M e){d[a]=e[a]}}G(2 h M d){b.11('1w'+h,7(){c[d[h]](b)})}b.11('2u',6.1N)},1x:7(a){a.8.2v=1;4(a.F.Q=='2w'){a.8.Q='2x'}},1S:7(a){2 b={'2y':P,'2z':P,'2A':P};G(2 s M b){a.3.N.9.8[s]=a.F[s]}},1R:7(a){4(!a.F){1g}U{2 b=a.F}G(2 v M a.3){a.3[v].9.8.1U=b.1U}a.S.18='';a.S.19='';2 c=(b.18=='1V');2 d=P;4(b.19!='y'||a.O){4(!a.O){a.D=b.19;a.D=a.D.2B(5,a.D.1v('\")')-5)}U{a.D=a.1h}2 e=6;4(!e.Z[a.D]){2 f=x.1m('1J');e.Z[a.D]=f;f.2C=e.J+'1K';f.S.1Q='12:y; Q:1p; 1y:-1r; 1d:-1r; 1q:y;';f.11('2D',7(){6.1i=6.2E;6.1j=6.2F;e.16(a)});f.1h=a.D;f.1W('1i');f.1W('1j');x.1X.1n(f,x.1X.1b)}a.3.C.I.1h=a.D;d=V}a.3.C.I.1w=!d;a.3.C.I.N='y';a.3.N.9.8.18=b.18;a.S.19='y';a.S.18='1V'},16:7(e){2 f=e.F;2 g={'W':e.2G+1,'H':e.2H+1,'w':6.Z[e.D].1i,'h':6.Z[e.D].1j,'L':e.2I,'T':e.2J,'1k':e.2K,'1z':e.2L};2 i=(g.L+g.1k==1)?1:0;2 j=7(a,l,t,w,h,o){a.2M=w+','+h;a.2N=o+','+o;a.2O='2P,1Y'+w+',1Y'+w+','+h+'2Q,'+h+' 2R';a.8.1i=w+'u';a.8.1j=h+'u';a.8.1y=l+'u';a.8.1d=t+'u'};j(e.3.N.9,(g.L+(e.O?0:g.1k)),(g.T+(e.O?0:g.1z)),(g.W-1),(g.H-1),0);j(e.3.C.9,(g.L+g.1k),(g.T+g.1z),(g.W),(g.H),1);2 k={'X':0,'Y':0};2 m=7(a,b){2 c=P;2S(b){1a'1y':1a'1d':k[a]=0;1A;1a'2T':k[a]=.5;1A;1a'2U':1a'2V':k[a]=1;1A;1I:4(b.K('%')!=-1){k[a]=1u(b)*.2W}U{c=V}}2 d=(a=='X');k[a]=2X.2Y(c?((g[d?'W':'H']*k[a])-(g[d?'w':'h']*k[a])):1u(b));4(k[a]==0){k[a]++}};G(2 b M k){m(b,f['2Z'+b])}e.3.C.I.Q=(k.X/g.W)+','+(k.Y/g.H);2 n=f.30;2 p={'T':1,'R':g.W+i,'B':g.H,'L':1+i};2 q={'X':{'1B':'L','1C':'R','d':'W'},'Y':{'1B':'T','1C':'B','d':'H'}};4(n!='1D'){2 c={'T':(k.Y),'R':(k.X+g.w),'B':(k.Y+g.h),'L':(k.X)};4(n.K('1D-')!=-1){2 v=n.1O('1D-')[1].31();c[q[v].1B]=1;c[q[v].1C]=g[q[v].d]}4(c.B>g.H){c.B=g.H}e.3.C.9.8.1Z='20('+c.T+'u '+(c.R+i)+'u '+c.B+'u '+(c.L+i)+'u)'}U{e.3.C.9.8.1Z='20('+p.T+'u '+p.R+'u '+p.B+'u '+p.L+'u)'}},1P:7(a){a.8.12='y';4(a.17=='32'||a.17=='33'||a.17=='34'){1g}a.O=V;4(a.17=='35'){4(a.1h.21().K(/\\.22$/)!=-1){a.O=P;a.8.1L='1M'}U{1g}}U 4(a.F.19.21().K('.22')==-1){1g}2 b=E;a.3={N:{},C:{}};2 c={9:{},I:{}};G(2 r M a.3){G(2 e M c){2 d=b.J+':'+e;a.3[r][e]=x.1m(d)}a.3[r].9.36=V;a.3[r].9.37(a.3[r].I);a.38.1n(a.3[r].9,a)}a.3.C.9.39='y';a.3.C.I.3a='3b';a.3.N.I.1w=V;b.1T(a);b.1x(a);b.1x(a.3c);b.1f(a)}};3d{x.3e(\"3f\",V,P)}3g(r){}E.1E();E.1G();", 62, 203, "||var|vml|if||this|function|style|shape|||||||||||||||||||||px|||document|none||||image|vmlBg|GtPNG|currentStyle|for||fill|ns|search||in|color|isImg|true|position||runtimeStyle||else|false||||imgSize||attachEvent|behavior|event|filter|handlePseudoHover|vmlOffsets|nodeName|backgroundColor|backgroundImage|case|firstChild|addRule|top|propertyName|applyVML|return|src|width|height|bLW|namespaces|createElement|insertBefore|styleSheet|absolute|border|10000px|display|vmlOpacity|parseInt|lastIndexOf|on|giveLayout|left|bTW|break|b1|b2|repeat|createVmlNameSpace|window|createVmlStyleSheet|documentElement|default|img|_sizeFinder|visibility|hidden|readPropertyChange|split|fixPng|cssText|vmlFill|copyImageBorders|attachHandlers|zIndex|transparent|removeAttribute|body|0l|clip|rect|toLowerCase|png|add|urn|schemas|microsoft|com|onbeforeunload|null|url|VML|index|srcElement|background|block|lpha|substring|100|opacity|setTimeout|fix|length|expression|resize|move|mouseleave|mouseenter|focus|blur|onpropertychange|zoom|static|relative|borderStyle|borderWidth|borderColor|substr|className|onload|offsetWidth|offsetHeight|clientWidth|clientHeight|offsetLeft|offsetTop|clientLeft|clientTop|coordsize|coordorigin|path|m0|l0|xe|switch|center|right|bottom|01|Math|ceil|backgroundPosition|backgroundRepeat|toUpperCase|BODY|TD|TR|IMG|stroked|appendChild|parentNode|fillcolor|type|tile|offsetParent|try|execCommand|BackgroundImageCache|catch".split("|"), 0, {}))
};