dbug = {
    logged: [],
    timers: {},
    firebug: false,
    debug: false,
    log: function () {
        dbug.logged.push(arguments)
    },
    nolog: function (msg) {
        dbug.logged.push(arguments)
    },
    time: function (name) {
        dbug.timers[name] = new Date().getTime()
    },
    timeEnd: function (name) {
        if (dbug.timers[name]) {
            var end = new Date().getTime() - dbug.timers[name];
            dbug.timers[name] = false;
            dbug.log('%s: %s', name, end)
        } else dbug.log('no such timer: %s', name)
    },
    enable: function () {
        if (dbug.firebug) {
            try {
                dbug.debug = true;
                dbug.log = console.debug || console.log;
                dbug.time = console.time;
                dbug.timeEnd = console.timeEnd;
                dbug.log('enabling dbug');
                for (i = 0; i < dbug.logged.length; i++) {
                    dbug.log.apply(console, dbug.logged[i])
                }
                dbug.logged = []
            } catch (e) {
                dbug.enable.delay(400)
            }
        }
    },
    disable: function () {
        if (dbug.firebug) dbug.debug = false;
        dbug.log = dbug.nolog;
        dbug.time = function () {};
        dbug.timeEnd = function () {}
    },
    cookie: function () {
        dbug.log('setting debugging cookie');
        var date = new Date();
        date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
        document.cookie = 'jsdebug=true;expires=' + date.toGMTString()
    },
    disableCookie: function () {
        dbug.log('disabling debugging cookie');
        document.cookie = 'jsdebug=false'
    },
    loadtime: function () {},
    loadtimeEnd: function () {}
};
if (typeof console != "undefined" && console.warn) {
    dbug.firebug = true;
    var value = document.cookie.match('(?:^|;)\\s*jsdebug=([^;]*)');
    var debugCookie = value ? unescape(value[1]) : false;
    if (window.location.href.indexOf("jsdebug=true") > 0 || debugCookie == 'true') dbug.enable();
    if (debugCookie == 'true') dbug.log('debugging cookie enabled');
    if (window.location.href.indexOf("jsdebugCookie=true") > 0) {
        dbug.cookie();
        if (!dbug.debug) dbug.enable()
    }
    if (window.location.href.indexOf("jsdebugCookie=false") > 0) dbug.disableCookie()
}
var Class = function (properties) {
    var klass = function () {
        if (this.initialize && $type(this.initialize) == 'function') return this.initialize.apply(this, arguments);
        else return this
    };
    $extend(klass, this);
    klass.prototype = properties;
    return klass
};
Class.empty = function () {};
Class.prototype = {
    extend: function (properties) {
        var proto = $merge(this.prototype);
        for (var property in properties) {
            var pp = proto[property];
            proto[property] = $mergeClass(pp, properties[property])
        }
        return new Class(proto)
    },
    implement: function (properties) {
        $extend(this.prototype, properties)
    }
};

function $type(obj) {
    if (obj === null || obj === undefined) return false;
    var type = typeof obj;
    if (type == 'object') {
        if (obj.htmlElement) return 'element';
        if (obj.push) return 'array';
        if (obj.nodeName) {
            switch (obj.nodeType) {
            case 1:
                return 'element';
            case 3:
                return obj.nodeValue.test(/\S/) ? 'textnode' : 'whitespace'
            }
        }
    }
    return type
};

function $merge() {
    var mix = {};
    for (var i = 0; i < arguments.length; i++) {
        for (var property in arguments[i]) {
            var ap = arguments[i][property];
            var mp = mix[property];
            if (mp && $type(ap) == 'object' && $type(mp) == 'object') mix[property] = $merge(mp, ap);
            else mix[property] = ap
        }
    }
    return mix
};

function $mergeClass(previous, current) {
    if (previous && previous != current) {
        var ptype = $type(previous);
        var ctype = $type(current);
        if (ptype == 'function' && ctype == 'function') {
            return function () {
                this.parent = previous;
                return current.apply(this, arguments)
            }
        }
        if (ptype == 'object' && ctype == 'object') return $merge(previous, current)
    }
    return current
};
var $extend = Object.extend = function () {
    var args = arguments;
    if (!args[1]) args = [this, args[0]];
    for (var property in args[1]) args[0][property] = args[1][property];
    return args[0]
};
var $native = Object.Native = function () {
    for (var i = 0; i < arguments.length; i++) arguments[i].extend = $native.extend
};
$native.extend = function (props) {
    for (var prop in props) {
        if (!this.prototype[prop]) this.prototype[prop] = props[prop]
    }
};
$native(Function, Array, String, Number, Class);
window.extend = document.extend = $extend;
var Window = window;

function $chk(obj) {
    return !!(obj || obj === 0)
};

function $pick(obj, picked) {
    return ($type(obj)) ? obj : picked
};

function $random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
};

function $time() {
    return new Date().getTime()
};

function $clear(timer) {
    clearTimeout(timer);
    clearInterval(timer);
    return null
};
if (window.ActiveXObject) window.ie = window[window.XMLHttpRequest ? 'ie7' : 'ie6'] = true;
else if (document.childNodes && !document.all && !navigator.taintEnabled) window.khtml = true;
else if (document.getBoxObjectFor != null) window.gecko = true;
if (typeof HTMLElement == 'undefined') {
    var HTMLElement = Class.empty;
    if (window.khtml) document.createElement("iframe");
    HTMLElement.prototype = (window.khtml) ? window["[[DOMElement.prototype]]"] : {}
}
HTMLElement.prototype.htmlElement = true;
if (window.ie6) try {
    document.execCommand("BackgroundImageCache", false, true)
} catch (e) {};
Array.extend({
    forEach: function (fn, bind) {
        for (var i = 0, j = this.length; i < j; i++) fn.call(bind, this[i], i, this)
    },
    filter: function (fn, bind) {
        var results = [];
        for (var i = 0, j = this.length; i < j; i++) {
            if (fn.call(bind, this[i], i, this)) results.push(this[i])
        }
        return results
    },
    map: function (fn, bind) {
        var results = [];
        for (var i = 0, j = this.length; i < j; i++) results[i] = fn.call(bind, this[i], i, this);
        return results
    },
    every: function (fn, bind) {
        for (var i = 0, j = this.length; i < j; i++) {
            if (!fn.call(bind, this[i], i, this)) return false
        }
        return true
    },
    some: function (fn, bind) {
        for (var i = 0, j = this.length; i < j; i++) {
            if (fn.call(bind, this[i], i, this)) return true
        }
        return false
    },
    indexOf: function (item, from) {
        from = from || 0;
        var len = this.length;
        if (from < 0) from = Math.max(0, len + from);
        while (from < len) {
            if (this[from] === item) return from;
            from++
        }
        return -1
    },
    copy: function (start, length) {
        start = start || 0;
        if (start < 0) start = this.length + start;
        length = length || (this.length - start);
        var newArray = [];
        for (var i = 0; i < length; i++) newArray[i] = this[start++];
        return newArray
    },
    remove: function (item) {
        var i = 0;
        var len = this.length;
        while (i < len) {
            if (this[i] === item) this.splice(i, 1);
            else i++
        }
        return this
    },
    test: function (item, from) {
        return this.indexOf(item, from) != -1
    },
    extend: function (newArray) {
        var pos = this.length;
        for (var i = 0, j = newArray.length; i < j; i++) this[pos++] = newArray[i];
        return this
    },
    associate: function (keys) {
        var obj = {},
            length = Math.min(this.length, keys.length);
        for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
        return obj
    }
});
Array.prototype.each = Array.prototype.forEach;

function $A(array, start, length) {
    return Array.prototype.copy.call(array, start, length)
};

function $each(iterable, fn, bind) {
    if (iterable.length) Array.prototype.forEach.call(iterable, fn, bind);
    else
        for (var name in iterable) fn.call(bind, iterable[name], name)
};
String.extend({
    test: function (regex, params) {
        return ((typeof regex == 'string') ? new RegExp(regex, params) : regex).test(this)
    },
    toInt: function () {
        return parseInt(this)
    },
    toFloat: function () {
        return parseFloat(this)
    },
    camelCase: function () {
        return this.replace(/-\D/g, function (match) {
            return match.charAt(1).toUpperCase()
        })
    },
    hyphenate: function () {
        return this.replace(/\w[A-Z]/g, function (match) {
            return (match.charAt(0) + '-' + match.charAt(1).toLowerCase())
        })
    },
    capitalize: function () {
        return this.toLowerCase().replace(/\b[a-z]/g, function (match) {
            return match.toUpperCase()
        })
    },
    trim: function () {
        return this.replace(/^\s+|\s+$/g, '')
    },
    clean: function () {
        return this.replace(/\s{2,}/g, ' ').trim()
    },
    rgbToHex: function (array) {
        var rgb = this.match(/\d{1,3}/g);
        return (rgb) ? rgb.rgbToHex(array) : false
    },
    hexToRgb: function (array) {
        var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
        return (hex) ? hex.slice(1).hexToRgb(array) : false
    }
});
Array.extend({
    rgbToHex: function (array) {
        if (this.length < 3) return false;
        if (this[3] && (this[3] == 0) && !array) return 'transparent';
        var hex = [];
        for (var i = 0; i < 3; i++) {
            var bit = (this[i] - 0).toString(16);
            hex.push((bit.length == 1) ? '0' + bit : bit)
        }
        return array ? hex : '#' + hex.join('')
    },
    hexToRgb: function (array) {
        if (this.length != 3) return false;
        var rgb = [];
        for (var i = 0; i < 3; i++) {
            rgb.push(parseInt((this[i].length == 1) ? this[i] + this[i] : this[i], 16))
        }
        return array ? rgb : 'rgb(' + rgb.join(',') + ')'
    }
});
Number.extend({
    toInt: function () {
        return parseInt(this)
    },
    toFloat: function () {
        return parseFloat(this)
    }
});
Function.extend({
    create: function (options) {
        var fn = this;
        options = $merge({
            'bind': fn,
            'event': false,
            'arguments': null,
            'delay': false,
            'periodical': false,
            'attempt': false
        }, options);
        if ($chk(options.arguments) && $type(options.arguments) != 'array') options.arguments = [options.arguments];
        return function (event) {
            var args;
            if (options.event) {
                event = event || window.event;
                args = [(options.event === true) ? event : new options.event(event)];
                if (options.arguments) args = args.concat(options.arguments)
            } else args = options.arguments || arguments;
            var returns = function () {
                return fn.apply(options.bind, args)
            };
            if (options.delay) return setTimeout(returns, options.delay);
            if (options.periodical) return setInterval(returns, options.periodical);
            if (options.attempt) {
                try {
                    return returns()
                } catch (err) {
                    return err
                }
            }
            return returns()
        }
    },
    pass: function (args, bind) {
        return this.create({
            'arguments': args,
            'bind': bind
        })
    },
    attempt: function (args, bind) {
        return this.create({
            'arguments': args,
            'bind': bind,
            'attempt': true
        })()
    },
    bind: function (bind, args) {
        return this.create({
            'bind': bind,
            'arguments': args
        })
    },
    bindAsEventListener: function (bind, args) {
        return this.create({
            'bind': bind,
            'event': true,
            'arguments': args
        })
    },
    delay: function (ms, bind, args) {
        return this.create({
            'delay': ms,
            'bind': bind,
            'arguments': args
        })()
    },
    periodical: function (ms, bind, args) {
        return this.create({
            'periodical': ms,
            'bind': bind,
            'arguments': args
        })()
    }
});
var Element = new Class({
    initialize: function (el, props) {
        if ($type(el) == 'string') el = document.createElement(el);
        el = $(el);
        if (!props || !el) return el;
        for (var prop in props) {
            switch (prop) {
            case 'styles':
                el.setStyles(props[prop]);
                break;
            case 'events':
                el.addEvents(props[prop]);
                break;
            case 'attributes':
                el.setProperties(props[prop]);
                break;
            default:
                el.setProperty(prop, props[prop])
            }
        }
        return el
    }
});

function $(el) {
    if (!el) return false;
    if (el.htmlElement || [window, document].test(el)) return el;
    if ($type(el) == 'string') el = document.getElementById(el);
    if ($type(el) != 'element') return false;
    if (['object', 'embed'].test(el.tagName.toLowerCase())) return el;
    Garbage.collect(el);
    $extend(el, Element.prototype);
    el.htmlElement = true;
    return el
};
var Elements = new Class({});
$native(Elements);
document.getElementsBySelector = document.getElementsByTagName;

function $$() {
    if (!arguments) return false;
    var elements = [];
    for (var i = 0, j = arguments.length; i < j; i++) {
        var selector = arguments[i];
        switch ($type(selector)) {
        case 'element':
            elements.push($(selector));
            break;
        case 'string':
            selector = document.getElementsBySelector(selector, true);
        default:
            if (selector.length) {
                for (var k = 0, l = selector.length; k < l; k++) {
                    var el = $(selector[k]);
                    if (el) elements.push(el)
                }
            }
        }
    }
    return $extend(elements, new Elements)
};
Elements.Multi = function (property) {
    return function () {
        var args = arguments;
        var items = [];
        var elements = true;
        $each(this, function (el) {
            var returns = el[property].apply(el, args);
            if ($type(returns) != 'element') elements = false;
            items.push(returns)
        });
        if (elements) items = $$(items);
        return items
    }
};
Element.extend = function (properties) {
    for (var property in properties) {
        HTMLElement.prototype[property] = properties[property];
        Element.prototype[property] = properties[property];
        Elements.prototype[property] = Elements.Multi(property)
    }
};
Element.extend({
    inject: function (el, where) {
        $(el);
        switch (where) {
        case "before":
            $(el.parentNode).insertBefore(this, el);
            break;
        case "after":
            if (!el.getNext()) $(el.parentNode).appendChild(this);
            else $(el.parentNode).insertBefore(this, el.getNext());
            break;
        case "inside":
            el.appendChild(this)
        }
        return this
    },
    injectBefore: function (el) {
        return this.inject(el, 'before')
    },
    injectAfter: function (el) {
        return this.inject(el, 'after')
    },
    injectInside: function (el) {
        return this.inject(el, 'inside')
    },
    adopt: function () {
        $$(arguments).each(function (el) {
            this.appendChild(el)
        }, this);
        return this
    },
    remove: function () {
        this.parentNode.removeChild(this);
        return this
    },
    clone: function (contents) {
        var el = this.cloneNode(contents !== false);
        return $(el)
    },
    replaceWith: function (el) {
        $(el);
        this.parentNode.replaceChild(el, this);
        return el
    },
    appendText: function (text) {
        if (window.ie) {
            switch (this.getTag()) {
            case 'style':
                this.styleSheet.cssText = text;
                return this;
            case 'script':
                this.setProperty('text', text);
                return this
            }
        }
        this.appendChild(document.createTextNode(text));
        return this
    },
    hasClass: function (className) {
        return this.className.test('(?:^|\\s)' + className + '(?:\\s|$)')
    },
    addClass: function (className) {
        if (!this.hasClass(className)) this.className = (this.className + ' ' + className).clean();
        return this
    },
    removeClass: function (className) {
        this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1').clean();
        return this
    },
    toggleClass: function (className) {
        return this.hasClass(className) ? this.removeClass(className) : this.addClass(className)
    },
    setStyle: function (property, value) {
        switch (property) {
        case 'opacity':
            return this.setOpacity(parseFloat(value));
        case 'float':
            property = (window.ie) ? 'styleFloat' : 'cssFloat'
        }
        this.style[property.camelCase()] = (value.push) ? 'rgb(' + value.join(',') + ')' : value;
        return this
    },
    setStyles: function (source) {
        switch ($type(source)) {
        case 'object':
            for (var property in source) this.setStyle(property, source[property]);
            break;
        case 'string':
            this.style.cssText = source
        }
        return this
    },
    setOpacity: function (opacity) {
        if (opacity == 0) {
            if (this.style.visibility != "hidden") this.style.visibility = "hidden"
        } else {
            if (this.style.visibility != "visible") this.style.visibility = "visible"
        } if (!this.currentStyle || !this.currentStyle.hasLayout) this.style.zoom = 1;
        if (window.ie) this.style.filter = "alpha(opacity=" + opacity * 100 + ")";
        this.style.opacity = this.opacity = opacity;
        return this
    },
    getStyle: function (property) {
        property = property.camelCase();
        var style = this.style[property];
        if (!$chk(style)) {
            if (property == 'opacity') return $chk(this.opacity) ? this.opacity : 1;
            if (['margin', 'padding'].test(property)) {
                var result = [];
                ['top', 'right', 'bottom', 'left'].each(function (prop) {
                    result.push(this.getStyle(property + '-' + prop) || '0')
                }, this);
                var every = result.every(function (val) {
                    return val == result[0]
                });
                return (every) ? result[0] : result
            }
            if (document.defaultView) style = document.defaultView.getComputedStyle(this, null).getPropertyValue(property.hyphenate());
            else if (this.currentStyle) style = this.currentStyle[property]
        }
        if (style == 'auto' && ['height', 'width'].test(property)) return this['offset' + property.capitalize()] + 'px';
        return (style && property.test(/color/i) && style.test(/rgb/)) ? style.rgbToHex() : style
    },
    getStyles: function () {
        var result = {};
        $each(arguments, function (argument) {
            result[argument] = this.getStyle(argument)
        }, this);
        return result
    },
    addEvent: function (type, fn) {
        this.events = this.events || {};
        this.events[type] = this.events[type] || {
            'keys': [],
            'values': []
        };
        if (!this.events[type].keys.test(fn)) {
            this.events[type].keys.push(fn);
            if (this.addEventListener) {
                this.addEventListener((type == 'mousewheel' && window.gecko) ? 'DOMMouseScroll' : type, fn, false)
            } else {
                fn = fn.bind(this);
                this.attachEvent('on' + type, fn);
                this.events[type].values.push(fn)
            }
        }
        return this
    },
    addEvents: function (source) {
        if (source) {
            for (var type in source) this.addEvent(type, source[type])
        }
        return this
    },
    removeEvent: function (type, fn) {
        if (this.events && this.events[type]) {
            var pos = this.events[type].keys.indexOf(fn);
            if (pos == -1) return this;
            var key = this.events[type].keys.splice(pos, 1)[0];
            if (this.removeEventListener) {
                this.removeEventListener((type == 'mousewheel' && window.gecko) ? 'DOMMouseScroll' : type, key, false)
            } else {
                this.detachEvent('on' + type, this.events[type].values.splice(pos, 1)[0])
            }
        }
        return this
    },
    removeEvents: function (type) {
        if (this.events) {
            if (type) {
                if (this.events[type]) {
                    this.events[type].keys.each(function (fn) {
                        this.removeEvent(type, fn)
                    }, this);
                    this.events[type] = null
                }
            } else {
                for (var evType in this.events) this.removeEvents(evType);
                this.events = null
            }
        }
        return this
    },
    fireEvent: function (type, args) {
        if (this.events && this.events[type]) {
            this.events[type].keys.each(function (fn) {
                fn.bind(this, args)()
            }, this)
        }
    },
    getBrother: function (what) {
        var el = this[what + 'Sibling'];
        while ($type(el) == 'whitespace') el = el[what + 'Sibling'];
        return $(el)
    },
    getPrevious: function () {
        return this.getBrother('previous')
    },
    getNext: function () {
        return this.getBrother('next')
    },
    getFirst: function () {
        var el = this.firstChild;
        while ($type(el) == 'whitespace') el = el.nextSibling;
        return $(el)
    },
    getLast: function () {
        var el = this.lastChild;
        while ($type(el) == 'whitespace') el = el.previousSibling;
        return $(el)
    },
    getParent: function () {
        return $(this.parentNode)
    },
    getChildren: function () {
        return $$(this.childNodes)
    },
    setProperty: function (property, value) {
        switch (property) {
        case 'class':
            this.className = value;
            break;
        case 'style':
            this.setStyles(value);
            break;
        case 'name':
            if (window.ie6) {
                var el = $(document.createElement('<' + this.getTag() + ' name="' + value + '" />'));
                $each(this.attributes, function (attribute) {
                    if (attribute.name != 'name') el.setProperty(attribute.name, attribute.value)
                });
                if (this.parentNode) this.replaceWith(el);
                return el
            }
        default:
            this.setAttribute(property, value)
        }
        return this
    },
    setProperties: function (source) {
        for (var property in source) this.setProperty(property, source[property]);
        return this
    },
    setHTML: function () {
        this.innerHTML = $A(arguments).join('');
        return this
    },
    getProperty: function (property) {
        return (property == 'class') ? this.className : this.getAttribute(property)
    },
    getTag: function () {
        return this.tagName.toLowerCase()
    },
    scrollTo: function (x, y) {
        this.scrollLeft = x;
        this.scrollTop = y
    },
    getValue: function () {
        switch (this.getTag()) {
        case 'select':
            var values = [];
            $each(this.options, function (opt) {
                if (opt.selected) values.push((opt.value !== null) ? opt.value : opt.text)
            });
            return (this.multiple) ? values : values[0];
        case 'input':
            if (!(this.checked && ['checkbox', 'radio'].test(this.type)) && !['hidden', 'text', 'password'].test(this.type)) break;
        case 'textarea':
            return this.value
        }
        return false
    },
    getSize: function () {
        return {
            'scroll': {
                'x': this.scrollLeft,
                'y': this.scrollTop
            },
            'size': {
                'x': this.offsetWidth,
                'y': this.offsetHeight
            },
            'scrollSize': {
                'x': this.scrollWidth,
                'y': this.scrollHeight
            }
        }
    },
    getPosition: function (overflown) {
        overflown = overflown || [];
        var el = this,
            left = 0,
            top = 0;
        do {
            left += el.offsetLeft || 0;
            top += el.offsetTop || 0;
            el = el.offsetParent
        } while (el);
        overflown.each(function (element) {
            left -= element.scrollLeft || 0;
            top -= element.scrollTop || 0
        });
        return {
            'x': left,
            'y': top
        }
    },
    getTop: function () {
        return this.getPosition().y
    },
    getLeft: function () {
        return this.getPosition().x
    },
    getCoordinates: function (overflown) {
        var position = this.getPosition(overflown);
        var obj = {
            'width': this.offsetWidth,
            'height': this.offsetHeight,
            'left': position.x,
            'top': position.y
        };
        obj.right = obj.left + obj.width;
        obj.bottom = obj.top + obj.height;
        return obj
    }
});
window.addEvent = document.addEvent = Element.prototype.addEvent;
window.removeEvent = document.removeEvent = Element.prototype.removeEvent;
window.removeEvents = document.removeEvents = Element.prototype.removeEvents;
var Garbage = {
    elements: [],
    collect: function (element) {
        Garbage.elements.push(element)
    },
    trash: function () {
        Garbage.collect(window);
        Garbage.collect(document);
        Garbage.elements.each(function (el) {
            try {
                el.removeEvents();
                for (var p in Element.prototype) el[p] = null;
                el.extend = null
            } catch (e) {}
        })
    }
};
window.addEvent('unload', Garbage.trash);
var Event = new Class({
    initialize: function (event) {
        this.event = event || window.event;
        this.type = this.event.type;
        this.target = this.event.target || this.event.srcElement;
        if (this.target.nodeType == 3) this.target = this.target.parentNode;
        this.shift = this.event.shiftKey;
        this.control = this.event.ctrlKey;
        this.alt = this.event.altKey;
        this.meta = this.event.metaKey;
        if (['DOMMouseScroll', 'mousewheel'].test(this.type)) {
            this.wheel = this.event.wheelDelta ? (this.event.wheelDelta / (window.opera ? -120 : 120)) : -(this.event.detail || 0) / 3
        } else if (this.type.test(/key/)) {
            this.code = this.event.which || this.event.keyCode;
            for (var name in Event.keys) {
                if (Event.keys[name] == this.code) {
                    this.key = name;
                    break
                }
            }
            var fKey = this.code - 111;
            if (fKey > 0 && fKey < 13) this.key = 'f' + fKey;
            this.key = this.key || String.fromCharCode(this.code).toLowerCase()
        } else if (this.type.test(/mouse/) || (this.type == 'click')) {
            this.page = {
                'x': this.event.pageX || this.event.clientX + document.documentElement.scrollLeft,
                'y': this.event.pageY || this.event.clientY + document.documentElement.scrollTop
            };
            this.client = {
                'x': this.event.pageX ? this.event.pageX - window.pageXOffset : this.event.clientX,
                'y': this.event.pageY ? this.event.pageY - window.pageYOffset : this.event.clientY
            };
            this.rightClick = (this.event.which == 3) || (this.event.button == 2);
            switch (this.type) {
            case 'mouseover':
                this.relatedTarget = this.event.relatedTarget || this.event.fromElement;
                break;
            case 'mouseout':
                this.relatedTarget = this.event.relatedTarget || this.event.toElement
            }
        }
    },
    stop: function () {
        this.stopPropagation();
        this.preventDefault();
        return this
    },
    stopPropagation: function () {
        if (this.event.stopPropagation) this.event.stopPropagation();
        else this.event.cancelBubble = true;
        return this
    },
    preventDefault: function () {
        if (this.event.preventDefault) this.event.preventDefault();
        else this.event.returnValue = false;
        return this
    }
});
Event.keys = {
    'enter': 13,
    'up': 38,
    'down': 40,
    'left': 37,
    'right': 39,
    'esc': 27,
    'space': 32,
    'backspace': 8,
    'delete': 46
};
Function.extend({
    bindWithEvent: function (bind, args) {
        return this.create({
            'bind': bind,
            'arguments': args,
            'event': Event
        })
    }
});
var Chain = new Class({
    chain: function (fn) {
        this.chains = this.chains || [];
        this.chains.push(fn);
        return this
    },
    callChain: function () {
        if (this.chains && this.chains.length) this.chains.shift().delay(10, this)
    },
    clearChain: function () {
        this.chains = []
    }
});
var Events = new Class({
    addEvent: function (type, fn) {
        if (fn != Class.empty) {
            this.events = this.events || {};
            this.events[type] = this.events[type] || [];
            if (!this.events[type].test(fn)) this.events[type].push(fn)
        }
        return this
    },
    fireEvent: function (type, args, delay) {
        if (this.events && this.events[type]) {
            this.events[type].each(function (fn) {
                fn.create({
                    'bind': this,
                    'delay': delay,
                    'arguments': args
                })()
            }, this)
        }
        return this
    },
    removeEvent: function (type, fn) {
        if (this.events && this.events[type]) this.events[type].remove(fn);
        return this
    }
});
var Options = new Class({
    setOptions: function () {
        var args = (arguments.length == 1) ? [this.options, arguments[0]] : arguments;
        this.options = $merge.apply(this, args);
        if (this.addEvent) {
            for (var option in this.options) {
                if (($type(this.options[option]) == 'function') && option.test(/^on[A-Z]/)) this.addEvent(option, this.options[option])
            }
        }
        return this
    }
});
var Group = new Class({
    initialize: function () {
        this.instances = $A(arguments);
        this.events = {};
        this.checker = {}
    },
    addEvent: function (type, fn) {
        this.checker[type] = this.checker[type] || {};
        this.events[type] = this.events[type] || [];
        if (this.events[type].test(fn)) return false;
        else this.events[type].push(fn);
        this.instances.each(function (instance, i) {
            instance.addEvent(type, this.check.bind(this, [type, instance, i]))
        }, this);
        return this
    },
    check: function (type, instance, i) {
        this.checker[type][i] = true;
        var every = this.instances.every(function (current, j) {
            return this.checker[type][j] || false
        }, this);
        if (!every) return;
        this.instances.each(function (current, j) {
            this.checker[type][j] = false
        }, this);
        this.events[type].each(function (event) {
            event.call(this, this.instances, instance)
        }, this)
    }
});

function $E(selector, filter) {
    return ($(filter) || document).getElement(selector)
};

function $ES(selector, filter) {
    return ($(filter) || document).getElementsBySelector(selector)
};
Element.extend({
    getElements: function (selector, nocash) {
        var items = [];
        var xpath = (document.evaluate) ? true : false;
        selector = selector.clean().split(' ');
        for (var i = 0, j = selector.length; i < j; i++) {
            var sel = selector[i];
            var param = sel.match(/^(\w*|\*)(?:#([\w-]+)|\.([\w-]+))?(?:\[(\w+)(?:([!*^$]?=)["']?([^"'\]]*)["']?)?])?$/);
            if (!param) break;
            param[1] = (param[1]) ? param[1].toLowerCase() : '*';
            if (xpath) {
                var temp = [param[1]];
                if (param[2]) temp.push('[@id="', param[2], '"]');
                if (param[3]) temp.push('[contains(concat(" ", @class, " "), " ', param[3], ' ")]');
                if (param[4]) {
                    if (param[5] && param[6]) {
                        switch (param[5]) {
                        case '*=':
                            temp.push('[contains(@', param[4], ', "', param[6], '")]');
                            break;
                        case '^=':
                            temp.push('[starts-with(@', param[4], ', "', param[6], '")]');
                            break;
                        case '$=':
                            temp.push('[substring(@', param[4], ', string-length(@', param[4], ') - ', param[6].length, ' + 1) = "', param[6], '"]');
                            break;
                        case '=':
                            temp.push('[@', param[4], '="', param[6], '"]');
                            break;
                        case '!=':
                            temp.push('[@', param[4], '!="', param[6], '"]')
                        }
                    } else temp.push('[@', param[4], ']')
                }
                items.push(temp.join(''));
                continue
            }
            Filters.selector = param;
            if (i == 0) {
                if (param[2]) {
                    var el = this.getElementById(param[2]);
                    if (!el || ((param[1] != '*') && (Element.prototype.getTag.call(el) != param[1]))) break;
                    items = [el]
                } else {
                    items = $A(this.getElementsByTagName(param[1]))
                }
            } else {
                items = Elements.prototype.getElementsByTagName.call(items, param[1], true);
                if (param[2]) items = items.filter(Filters.id)
            } if (param[3]) items = items.filter(Filters.className);
            if (param[4]) items = items.filter(Filters.attribute)
        }
        if (xpath) items = this.getElementsByXpath(items.join('//'));
        return (nocash) ? items : $$(items)
    },
    getElementsByXpath: function (xp) {
        var result = [];
        var xpath = document.evaluate('.//' + xp, this, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0, j = xpath.snapshotLength; i < j; i++) result.push(xpath.snapshotItem(i));

        return result
    },
    getElementById: function (id) {
        var el = document.getElementById(id);
        if (!el) return false;
        for (var parent = el.parentNode; parent != this; parent = parent.parentNode) {
            if (!parent) return false
        }
        return el
    },
    getElement: function (selector) {
        return this.getElementsBySelector(selector)[0]
    },
    getElementsBySelector: function (selector, nocash) {
        var els = [];
        var sel = selector.split(',');
        for (var i = 0, j = sel.length; i < j; i++) {
            els.extend(this.getElements(sel[i], true))
        }
        return (nocash) ? els : $$(els)
    }
});
document.extend({
    getElementsByClassName: function (className) {
        return document.getElements('.' + className)
    },
    getElement: Element.prototype.getElement,
    getElements: Element.prototype.getElements,
    getElementsBySelector: Element.prototype.getElementsBySelector,
    getElementsByXpath: Element.prototype.getElementsByXpath
});
var Filters = {
    selector: [],
    id: function (el) {
        return (el.id == Filters.selector[2])
    },
    className: function (el) {
        return (Element.prototype.hasClass.call(el, Filters.selector[3]))
    },
    attribute: function (el) {
        var current = el.getAttribute(Filters.selector[4]);
        if (!current) return false;
        var operator = Filters.selector[5];
        if (!operator) return true;
        var value = Filters.selector[6];
        switch (operator) {
        case '=':
            return (current == value);
        case '*=':
            return (current.test(value));
        case '^=':
            return (current.test('^' + value));
        case '$=':
            return (current.test(value + '$'));
        case '!=':
            return (current != value)
        }
        return false
    }
};
Elements.extend({
    getElementsByTagName: function (tagName) {
        var found = [];
        for (var i = 0, j = this.length; i < j; i++) found.extend(this[i].getElementsByTagName(tagName));
        return found
    }
});
var Hash = new Class({
    length: 0,
    initialize: function (obj) {
        this.obj = {};
        this.extend(obj)
    },
    get: function (key) {
        return this.obj[key]
    },
    hasKey: function (key) {
        return this.obj[key] !== undefined
    },
    set: function (key, value) {
        if (value === undefined) return false;
        if (this.obj[key] === undefined) this.length++;
        this.obj[key] = value;
        return this
    },
    remove: function (key) {
        if (this.obj[key] === undefined) return this;
        var obj = {};
        this.length--;
        for (var property in this.obj) {
            if (property != key) obj[property] = this.obj[property]
        }
        this.obj = obj;
        return this
    },
    each: function (fn, bind) {
        for (var property in this.obj) fn.call(bind || this, property, this.obj[property])
    },
    extend: function (obj) {
        for (var property in obj) {
            if (this.obj[property] === undefined) this.length++;
            this.obj[property] = obj[property]
        }
        return this
    },
    empty: function () {
        return (this.length == 0)
    },
    keys: function () {
        var keys = [];
        for (var property in this.obj) keys.push(property);
        return keys
    },
    values: function () {
        var values = [];
        for (var property in this.obj) values.push(this.obj[property]);
        return values
    }
});

function $H(obj) {
    return new Hash(obj)
};
var Color = new Class({
    initialize: function (color, type) {
        if (color.isColor) return color;
        color.isColor = true;
        type = type || (color.push ? 'rgb' : 'hex');
        var rgb, hsb;
        switch (type) {
        case 'rgb':
            rgb = color;
            hsb = rgb.rgbToHsb();
            break;
        case 'hsb':
            rgb = color.hsbToRgb();
            hsb = color;
            break;
        default:
            rgb = color.hexToRgb(true);
            hsb = rgb.rgbToHsb()
        }
        rgb.hsb = hsb;
        return $extend(rgb, Color.prototype)
    },
    mix: function () {
        var colors = $A(arguments);
        var alpha = ($type(colors[colors.length - 1]) == 'number') ? colors.pop() : 50;
        var rgb = this.copy();
        colors.each(function (color) {
            color = new Color(color);
            for (var i = 0; i < 3; i++) rgb[i] = Math.round((rgb[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha))
        });
        return new Color(rgb, 'rgb')
    },
    invert: function () {
        return new Color(this.map(function (value) {
            return 255 - value
        }))
    },
    setHue: function (value) {
        return new Color([value, this.hsb[1], this.hsb[2]], 'hsb')
    },
    setSaturation: function (percent) {
        return new Color([this.hsb[0], percent, this.hsb[2]], 'hsb')
    },
    setBrightness: function (percent) {
        return new Color([this.hsb[0], this.hsb[1], percent], 'hsb')
    }
});

function $RGB(r, g, b) {
    return new Color([r, g, b], 'rgb')
};

function $HSB(h, s, b) {
    return new Color([h, s, b], 'hsb')
};
Array.extend({
    rgbToHsb: function () {
        var red = this[0],
            green = this[1],
            blue = this[2];
        var hue, saturation, brightness;
        var max = Math.max(red, green, blue),
            min = Math.min(red, green, blue);
        var delta = max - min;
        brightness = max / 255;
        saturation = (max != 0) ? delta / max : 0;
        if (saturation == 0) {
            hue = 0
        } else {
            var rr = (max - red) / delta;
            var gr = (max - green) / delta;
            var br = (max - blue) / delta;
            if (red == max) hue = br - gr;
            else if (green == max) hue = 2 + rr - br;
            else hue = 4 + gr - rr;
            hue /= 6;
            if (hue < 0) hue++
        }
        return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)]
    },
    hsbToRgb: function () {
        var br = Math.round(this[2] / 100 * 255);
        if (this[1] == 0) {
            return [br, br, br]
        } else {
            var hue = this[0] % 360;
            var f = hue % 60;
            var p = Math.round((this[2] * (100 - this[1])) / 10000 * 255);
            var q = Math.round((this[2] * (6000 - this[1] * f)) / 600000 * 255);
            var t = Math.round((this[2] * (6000 - this[1] * (60 - f))) / 600000 * 255);
            switch (Math.floor(hue / 60)) {
            case 0:
                return [br, t, p];
            case 1:
                return [q, br, p];
            case 2:
                return [p, br, t];
            case 3:
                return [p, q, br];
            case 4:
                return [t, p, br];
            case 5:
                return [br, p, q]
            }
        }
        return false
    }
});
window.extend({
    addEvent: function (type, fn) {
        if (type == 'domready') {
            if (this.loaded) fn();
            else if (!this.events || !this.events.domready) {
                var domReady = function () {
                    if (this.loaded) return;
                    this.loaded = true;
                    if (this.timer) this.timer = $clear(this.timer);
                    Element.prototype.fireEvent.call(this, 'domready');
                    this.events.domready = null
                }.bind(this);
                if (document.readyState && this.khtml) {
                    this.timer = function () {
                        if (['loaded', 'complete'].test(document.readyState)) domReady()
                    }.periodical(50)
                } else if (document.readyState && this.ie) {
                    document.write("<script id=ie_ready defer src=javascript:void(0)><\/script>");
                    $('ie_ready').onreadystatechange = function () {
                        if (this.readyState == 'complete') domReady()
                    }
                } else {
                    this.addEvent("load", domReady);
                    document.addEvent("DOMContentLoaded", domReady)
                }
            }
        }
        Element.prototype.addEvent.call(this, type, fn);
        return this
    },
    onDomReady: function (init) {
        return this.addEvent('domready', init)
    }
});
window.extend({
    getWidth: function () {
        if (this.khtml) return this.innerWidth;
        if (this.opera) return document.body.clientWidth;
        return document.documentElement.clientWidth
    },
    getHeight: function () {
        if (this.khtml) return this.innerHeight;
        if (this.opera) return document.body.clientHeight;
        return document.documentElement.clientHeight
    },
    getScrollWidth: function () {
        if (this.ie) return Math.max(document.documentElement.offsetWidth, document.documentElement.scrollWidth);
        if (this.khtml) return document.body.scrollWidth;
        return document.documentElement.scrollWidth
    },
    getScrollHeight: function () {
        if (this.ie) return Math.max(document.documentElement.offsetHeight, document.documentElement.scrollHeight);
        if (this.khtml) return document.body.scrollHeight;
        return document.documentElement.scrollHeight
    },
    getScrollLeft: function () {
        return this.pageXOffset || document.documentElement.scrollLeft
    },
    getScrollTop: function () {
        return this.pageYOffset || document.documentElement.scrollTop
    },
    getSize: function () {
        return {
            'size': {
                'x': this.getWidth(),
                'y': this.getHeight()
            },
            'scrollSize': {
                'x': this.getScrollWidth(),
                'y': this.getScrollHeight()
            },
            'scroll': {
                'x': this.getScrollLeft(),
                'y': this.getScrollTop()
            }
        }
    },
    getPosition: function () {
        return {
            'x': 0,
            'y': 0
        }
    }
});
var Fx = {};
Fx.Transitions = {
    linear: function (t, b, c, d) {
        return c * t / d + b
    },
    sineInOut: function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
    }
};
Fx.Base = new Class({
    options: {
        onStart: Class.empty,
        onComplete: Class.empty,
        onCancel: Class.empty,
        transition: Fx.Transitions.sineInOut,
        duration: 500,
        unit: 'px',
        wait: true,
        fps: 50
    },
    initialize: function (options) {
        this.element = this.element || null;
        this.setOptions(options);
        if (this.options.initialize) this.options.initialize.call(this)
    },
    step: function () {
        var time = $time();
        if (time < this.time + this.options.duration) {
            this.cTime = time - this.time;
            this.setNow();
            this.increase()
        } else {
            this.stop(true);
            this.now = this.to;
            this.increase();
            this.fireEvent('onComplete', this.element, 10);
            this.callChain()
        }
    },
    set: function (to) {
        this.now = to;
        this.increase();
        return this
    },
    setNow: function () {
        this.now = this.compute(this.from, this.to)
    },
    compute: function (from, to) {
        return this.options.transition(this.cTime, from, (to - from), this.options.duration)
    },
    start: function (from, to) {
        if (!this.options.wait) this.stop();
        else if (this.timer) return this;
        this.from = from;
        this.to = to;
        this.time = $time();
        this.timer = this.step.periodical(Math.round(1000 / this.options.fps), this);
        this.fireEvent('onStart', this.element);
        return this
    },
    stop: function (end) {
        if (!this.timer) return this;
        this.timer = $clear(this.timer);
        if (!end) this.fireEvent('onCancel', this.element);
        return this
    },
    custom: function (from, to) {
        return this.start(from, to)
    },
    clearTimer: function (end) {
        return this.stop(end)
    }
});
Fx.Base.implement(new Chain);
Fx.Base.implement(new Events);
Fx.Base.implement(new Options);
Fx.CSS = {
    select: function (property, to) {
        if (property.test(/color/i)) return this.Color;
        if (to.test && to.test(' ')) return this.Multi;
        return this.Single
    },
    parse: function (el, property, fromTo) {
        if (!fromTo.push) fromTo = [fromTo];
        var from = fromTo[0],
            to = fromTo[1];
        if (!to && to != 0) {
            to = from;
            from = el.getStyle(property)
        }
        var css = this.select(property, to);
        return {
            from: css.parse(from),
            to: css.parse(to),
            css: css
        }
    }
};
Fx.CSS.Single = {
    parse: function (value) {
        return parseFloat(value)
    },
    getNow: function (from, to, fx) {
        return fx.compute(from, to)
    },
    getValue: function (value, unit) {
        return value + unit
    }
};
Fx.CSS.Multi = {
    parse: function (value) {
        return value.push ? value : value.split(' ').map(function (v) {
            return parseFloat(v)
        })
    },
    getNow: function (from, to, fx) {
        var now = [];
        for (var i = 0; i < from.length; i++) now[i] = fx.compute(from[i], to[i]);
        return now
    },
    getValue: function (value, unit) {
        return value.join(unit + ' ') + unit
    }
};
Fx.CSS.Color = {
    parse: function (value) {
        return value.push ? value : value.hexToRgb(true)
    },
    getNow: function (from, to, fx) {
        var now = [];
        for (var i = 0; i < from.length; i++) now[i] = Math.round(fx.compute(from[i], to[i]));
        return now
    },
    getValue: function (value) {
        return 'rgb(' + value.join(',') + ')'
    }
};
Fx.Style = Fx.Base.extend({
    initialize: function (el, property, options) {
        this.element = $(el);
        this.property = property;
        this.parent(options)
    },
    hide: function () {
        return this.set(0)
    },
    setNow: function () {
        this.now = this.css.getNow(this.from, this.to, this)
    },
    set: function (to) {
        this.css = Fx.CSS.select(this.property, to);
        return this.parent(this.css.parse(to))
    },
    start: function (from, to) {
        if (this.timer && this.options.wait) return this;
        var parsed = Fx.CSS.parse(this.element, this.property, [from, to]);
        this.css = parsed.css;
        return this.parent(parsed.from, parsed.to)
    },
    increase: function () {
        this.element.setStyle(this.property, this.css.getValue(this.now, this.options.unit))
    }
});
Element.extend({
    effect: function (property, options) {
        return new Fx.Style(this, property, options)
    }
});
Fx.Styles = Fx.Base.extend({
    initialize: function (el, options) {
        this.element = $(el);
        this.parent(options)
    },
    setNow: function () {
        for (var p in this.from) this.now[p] = this.css[p].getNow(this.from[p], this.to[p], this)
    },
    set: function (to) {
        var parsed = {};
        this.css = {};
        for (var p in to) {
            this.css[p] = Fx.CSS.select(p, to[p]);
            parsed[p] = this.css[p].parse(to[p])
        }
        return this.parent(parsed)
    },
    start: function (obj) {
        if (this.timer && this.options.wait) return this;
        this.now = {};
        this.css = {};
        var from = {},
            to = {};
        for (var p in obj) {
            var parsed = Fx.CSS.parse(this.element, p, obj[p]);
            from[p] = parsed.from;
            to[p] = parsed.to;
            this.css[p] = parsed.css
        }
        return this.parent(from, to)
    },
    increase: function () {
        for (var p in this.now) this.element.setStyle(p, this.css[p].getValue(this.now[p], this.options.unit))
    }
});
Element.extend({
    effects: function (options) {
        return new Fx.Styles(this, options)
    }
});
Fx.Elements = Fx.Base.extend({
    initialize: function (elements, options) {
        this.elements = $$(elements);
        this.parent(options)
    },
    setNow: function () {
        for (var i in this.from) {
            var iFrom = this.from[i],
                iTo = this.to[i],
                iCss = this.css[i],
                iNow = this.now[i] = {};
            for (var p in iFrom) iNow[p] = iCss[p].getNow(iFrom[p], iTo[p], this)
        }
    },
    set: function (to) {
        var parsed = {};
        this.css = {};
        for (var i in to) {
            var iTo = to[i],
                iCss = this.css[i] = {},
                iParsed = parsed[i] = {};
            for (var p in iTo) {
                iCss[p] = Fx.CSS.select(p, iTo[p]);
                iParsed[p] = iCss[p].parse(iTo[p])
            }
        }
        return this.parent(parsed)
    },
    start: function (obj) {
        if (this.timer && this.options.wait) return this;
        this.now = {};
        this.css = {};
        var from = {},
            to = {};
        for (var i in obj) {
            var iProps = obj[i],
                iFrom = from[i] = {},
                iTo = to[i] = {},
                iCss = this.css[i] = {};
            for (var p in iProps) {
                var parsed = Fx.CSS.parse(this.elements[i], p, iProps[p]);
                iFrom[p] = parsed.from;
                iTo[p] = parsed.to;
                iCss[p] = parsed.css
            }
        }
        return this.parent(from, to)
    },
    increase: function () {
        for (var i in this.now) {
            var iNow = this.now[i],
                iCss = this.css[i];
            for (var p in iNow) this.elements[i].setStyle(p, iCss[p].getValue(iNow[p], this.options.unit))
        }
    }
});



MultipleOpenAccordion = Fx.Elements.extend({
    initialize: function (togglers, elements, options) {
        this.parent(elements, options);
        this.setOptions(this.options, $merge({
            openAll: true,
            allowMultipleOpen: true,
            firstElementsOpen: [0],
            start: 'open-first',
            fixedHeight: false,
            fixedWidth: false,
            alwaysHide: true,
            wait: false,
            onActive: Class.empty,
            onBackground: Class.empty,
            height: true,
            opacity: true,
            width: false
        }, options || {

        }));
        this.previousClick = 'nan';
        this.elementsVisible = [];
        togglers.each(function (tog, i) {
            $(tog).addEvent('click', function () {
                this.toggleSection(i)
            }.bind(this))
        }, this);
        this.togglers = togglers;
        this.h = {

        };
        this.w = {

        };
        this.o = {

        };
        this.now = [];
        this.elements.each(function (el, i) {
            this.now[i] = {

            };
            if (this.options.openAll && this.options.allowMultipleOpen) $(el).setStyles({
                'overflow': 'hidden'
            });
            else $(el).setStyles({
                'height': 0,
                'overflow': 'hidden'
            })
        }, this);
        if (!this.options.openAll || !this.options.allowMultipleOpen) {
            switch (this.options.start) {
            case 'first-open':
                this.showSection(this.options.firstElementsOpen[0]);
                break;
            case 'open-first':
                this.toggleSection(this.options.firstElementsOpen[0]);
                break
            }
        }
        if (this.options.openAll && this.options.allowMultipleOpen) {
            this.showAll()
        } else if (this.options.allowMultipleOpen) {
            this.openSections(this.options.firstElementsOpen)
        }
    },
    hideThis: function (i) {
        this.elementsVisible[i] = false;
        if (this.options.height) this.h = {
            'height': [this.elements[i].offsetHeight, 0]
        };
        if (this.options.width) this.w = {
            'width': [this.elements[i].offsetWidth, 0]
        };
        if (this.options.opacity) this.o = {
            'opacity': [this.now[i]['opacity'] || 1, 0]
        }
    },
    showThis: function (i) {
        this.elementsVisible[i] = true;
        if (this.options.height) this.h = {
            'height': [this.elements[i].offsetHeight, this.options.fixedHeight || this.elements[i].scrollHeight]
        };
        if (this.options.width) this.w = {
            'width': [this.elements[i].offsetWidth, this.options.fixedWidth || this.elements[i].scrollWidth]
        };
        if (this.options.opacity) this.o = {
            'opacity': [this.now[i]['opacity'] || 0, 1]
        }
    },
    toggleSection: function (iToToggle) {
        if (iToToggle != this.previousClick || this.options.alwaysHide || this.options.allowMultipleOpen) {
            this.previousClick = iToToggle;
            var objObjs = {

            };
            var err = false;
            var madeInactive = false;
            this.elements.each(function (el, i) {
                var update = false;
                this.now[i] = this.now[i] || {

                };
                if (i == iToToggle) {
                    if (this.elementsVisible[i] && (this.options.allowMultipleOpen || this.options.alwaysHide)) {
                        if (!(this.options.wait && this.timer)) {
                            update = true;
                            this.hideThis(i)
                        } else {
                            this.previousClick = 'nan';
                            err = true
                        }
                    } else if (!this.elementsVisible[i]) {
                        if (!(this.options.wait && this.timer)) {
                            update = true;
                            this.showThis(i)
                        } else {
                            this.previousClick = 'nan';
                            err = true
                        }
                    }
                } else if (this.elementsVisible[i] && !this.options.allowMultipleOpen) {
                    if (!(this.options.wait && this.timer)) {
                        update = true;
                        this.hideThis(i)
                    } else {
                        this.previousClick = 'nan';
                        err = true
                    }
                }
                if (update) objObjs[i] = Object.extend(this.h, Object.extend(this.o, this.w))
            }, this);
            if (err) return;
            if (!madeInactive) this.options.onActive.call(this, this.togglers[iToToggle], iToToggle);
            this.togglers.each(function (tog, i) {
                if (!this.elementsVisible[i]) this.options.onBackground.call(this, tog, i)
            }, this);
            return this.custom(objObjs)
        }
    },
    showSection: function (i, useFx) {
        if ($pick(useFx, false)) {
            if (!this.elementsVisible[i]) this.toggleSection(i)
        } else {
            this.setSectionStyle(i, $(this.elements[i]).scrollWidth, $(this.elements[i]).scrollHeight, 1);
            this.elementsVisible[i] = true;
            return true
        }
    },
    hideSection: function (i, useFx) {
        if ($pick(useFx, false)) {
            if (this.elementsVisible[i]) this.toggleSection(i)
        } else {
            this.setSectionStyle(i, 0, 0, 0);
            this.elementsVisible[i] = false;
            return true
        }
    },
    setSectionStyle: function (i, w, h, o) {
        if (this.options.opacity) $(this.elements[i]).setOpacity(o);
        if (this.options.height) $(this.elements[i]).setStyle('height', h + 'px');
        if (this.options.width) $(this.elements[i]).setStyle('width', w + 'px')
    },
    showAll: function () {
        if (this.options.allowMultipleOpen) {
            this.elements.each(function (el, idx) {
                this.showSection(idx, false)
            }, this)
        }
    },
    hideAll: function (useFx) {
        if (this.options.allowMultipleOpen) {
            this.elements.each(function (el, idx) {
                this.hideSection(idx, false)
            }, this)
        }
    },
    openSections: function (sections) {
        if (this.options.allowMultipleOpen) {
            this.elements.each(function (el, idx) {
                if (sections.test(idx)) this.showSection(idx, false);
                else this.hideSection(idx, false)
            }, this)
        }
    }
});
MultipleOpenAccordion.implement(new Options);
var YNavAccordion = new Class({
    initialize: function (options) {
        try {
            this.setOptions({
                openAll: false,
                allowMultipleOpen: true,
                defaultOpenIndexes: [0],
                defaultOpenClassName: 'forceOpen',
                allowCookie: false,
                cookieName: false,
                cookieDuration: 999,
                stretchToggleSelector: 'div.xNavGrp div.btn',
                stretcherSelector: 'div.xNavGrp ul'
            }, options);
            var start = (this.options.openAll) ? 'first-open' : 'open-first';
            if (this.options.allowCookie && this.options.cookieName && this.getPref()) this.options.defaultOpenIndexes = this.getPref();
            var toggles = $$(this.options.stretchToggleSelector);
            var stretchers = $$(this.options.stretcherSelector);
            if (toggles && stretchers) {
                var forceOpen = toggles.filter(function (t, i) {
                    return t.hasClass(this.options.defaultOpenClassName)
                }, this);
                forceOpen.extend(this.options.defaultOpenIndexes);
                this.Accordion = new MultipleOpenAccordion(toggles, stretchers, {
                    openAll: this.options.openAll,
                    allowMultipleOpen: this.options.allowMultipleOpen,
                    firstElementsOpen: forceOpen,
                    start: start
                })
            }
        } catch (e) {
            dbug.log('nav accordion error: %s', e)
        }
    },
    savePref: function (iToShow) {
        Cookie.set(Json.toString(this.options.cookieName), iToShow, {
            duration: cookieDuration
        })
    },
    getPref: function () {
        return Json.evaluate(Cookie.get(this.options.cookieName))
    }
});
YNavAccordion.implement(new Options);
YNavAccordion.implement(new Events);
var Ycarousel = new Class({
    initialize: function (container, options) {
        this.container = $(container);
        if (!this.container.hasClass('hasCarousel')) {
            this.container.addClass('hasCarousel');
            this.slides = [];
            this.buttons = [];
            this.setOptions({
                onRotate: Class.empty,
                onStop: Class.empty,
                onAutoPlay: Class.empty,
                onShowSlide: Class.empty,
                slidesSelector: ".slide",
                buttonsSelector: ".button",
                slideInterval: 4000,
                transitionDuration: 700,
                startIndex: 0,
                buttonOnClass: "selected",
                buttonOffClass: "off",
                rotateAction: "none",
                rotateActionDuration: 100,
                autoplay: true
            }, options);
            this.slides = $(container).getElements(this.options.slidesSelector);
            this.buttons = $(container).getElements(this.options.buttonsSelector);
            this.createFx();
            this.showSlide(this.options.startIndex);
            if (this.options.autoplay) this.autoplay();
            if (this.options.rotateAction != 'none') this.setupAction(this.options.rotateAction);
            return this
        } else return false
    },
    setupAction: function (action) {
        this.buttons.each(function (el, idx) {
            $(el).addEvent(action, function () {
                this.slideFx.setOptions(this.slideFx.options, {
                    duration: this.options.rotateActionDuration
                });
                if (this.currentSlide != idx) this.showSlide(idx);
                this.stop()
            }.bind(this))
        }, this)
    },
    createFx: function () {
        this.slideFx = new Fx.Elements(this.slides, {
            duration: this.options.transitionDuration
        });
        this.slides.each(function (slide) {
            slide.setStyle('opacity', 0)
        })
    },
    showSlide: function (slideIndex) {
        var action = {

        };
        this.slides.each(function (slide, index) {
            if (index == slideIndex && index != this.currentSlide) {
                $(this.buttons[index]).removeClass(this.options.buttonOffClass).addClass(this.options.buttonOnClass);
                action[index.toString()] = {
                    'opacity': [1]
                }
            } else {
                $(this.buttons[index]).removeClass(this.options.buttonOnClass).addClass(this.options.buttonOffClass);
                action[index.toString()] = {
                    'opacity': [0]
                }
            }
        }, this);
        this.fireEvent('onShowSlide', slideIndex);
        this.currentSlide = slideIndex;
        this.slideFx.start(action)
    },
    autoplay: function () {
        this.createFx();
        this.slideshowInt = this.rotate.periodical(this.options.slideInterval, this);
        this.fireEvent('onAutoPlay')
    },
    stop: function () {
        clearInterval(this.slideshowInt);
        this.fireEvent('onStop')
    },
    rotate: function () {
        current = this.currentSlide;
        next = (current + 1 >= this.slides.length) ? 0 : current + 1;
        this.showSlide(next);
        this.fireEvent('onRotate')
    },
    show: function () {
        $(this.options.carouselContainer).setStyle('visibility', 'visible');
        if (!$(this.options.carouselContainer).visible()) $(this.options.carouselContainer).show()
    },
    hide: function () {
        $(this.options.carouselContainer).setStyle('visibility', 'hidden')
    }
});
Ycarousel.implement(new Options);
Ycarousel.implement(new Events);
var YcarouselWithButtons = Ycarousel.extend({
    initialize: function (el, options) {
        this.parent(el, $merge({
            bubbleButtonBGImgSelector: '.bbg',
            buttonOnGifSrc: 'images/green_button.gif',
            buttonOffGifSrc: 'images/gray_button.gif'
        }, options))
    },
    showSlide: function (slideIndex) {
        this.buttons.each(function (button, index) {
            $(button).getElement(this.options.bubbleButtonBGImgSelector).src = (index == slideIndex) ? this.options.buttonOnGifSrc : this.options.buttonOffGifSrc
        }, this);
        this.parent(slideIndex)
    }
});
var carousel = null;
window.onDomReady(function () {
    if ($('Carousel')) {
        carousel = new YcarouselWithButtons($('Carousel'), {
            buttonsSelector: '.bubble',
            rotateAction: 'mouseover'
        })
    }
});