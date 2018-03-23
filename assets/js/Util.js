if(!Util) {    

    if(!Node.prototype.insertAfter) {
        Node.prototype.insertAfter  =   function(newKid, refChild) {
            this.insertBefore(newKid,refChild.getNextSibling())
        }
    }
    
    // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
    // http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
//     if(!Object.prototype.getClass) {
//         Object.prototype.getClass   =   function(object) {
//             return Object.prototype.toString.call(object)
//             .match(/^\[object\s(.*)\]$/)[1];
//         }
//     }

    //http://www.webdeveloper.com/forum/showthread.php?t=193474
    if(!Object.prototype.isEmpty) {
        Object.prototype.isEmpty = function() {
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) return false;
            }
            return true;
        }
    }

    ///////////////////////////////////////
    //http://www.guyfromchennai.com/?p=139
    (function(){
        var dash = /-(.)/g;

        function toHump(a, b){
            return b.toUpperCase();
        };

        if(!String.prototype.encamel) {
            String.prototype.encamel = function(){
                return this.replace(dash, toHump);
            };
        }
    })();

    var Util    =   function() {};

    // http://javascript.crockford.com/remedial.html
    // very nice
    Util.typeOf =   function(value) {
        var s = typeof value;
        if (s === 'object') {
            if (value) {
                if (typeof value.length === 'number' &&
                    !(value.propertyIsEnumerable('length')) &&
                    typeof value.splice === 'function') {
                        s = 'array';
                    }
            } else {
                s = 'null';
            }
        }
        return s;
    }
    
    Util.getStyle = function(el, styleprop){
        if(!el || !styleprop) {
            return false;
        }
        if(window.getComputedStyle){
            var defaultView =   document.defaultView;
//             var getComputedStyle    =   defaultView.getComputedStyle;
            var computedStyle   =   defaultView.getComputedStyle(el, null);
//             var getPropertyValue    =   computedStyle.getPropertyValue;
            var propertyValue   =   computedStyle.getPropertyValue(styleprop);
            return propertyValue;
//             return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleprop);
        }
        else if(el.currentStyle){
            return el.currentStyle[styleprop.encamel()];
        }
        return null;
    }
    ////http://www.guyfromchennai.com/?p=139
    ///////////////////////////////////////////

    Util.getSize  =   function(elem) {
        // TODO: better check for valid element / node
        if(!elem) {
            return false;
        }
        var width   =   parseInt(Util.getStyle(elem, 'width')) +
            parseInt(Util.getStyle(elem, 'padding-left')) + parseInt(Util.getStyle(elem, 'padding-right')) +
            parseInt(Util.getStyle(elem, 'margin-left')) + parseInt(Util.getStyle(elem, 'margin-right')) +
            parseInt(Util.getStyle(elem, 'border-left-width') + parseInt(Util.getStyle(elem, 'border-right-width')));
            
        var height  =   parseInt(Util.getStyle(elem, 'height')) +
            parseInt(Util.getStyle(elem, 'padding-top')) + parseInt(Util.getStyle(elem, 'padding-bottom')) +
            parseInt(Util.getStyle(elem, 'margin-top')) + parseInt(Util.getStyle(elem, 'margin-bottom')) +
            parseInt(Util.getStyle(elem, 'border-top-width') + parseInt(Util.getStyle(elem, 'border-bottom-width')));

//         return {"width" : width, "height" : height};
            return [width, height];
    }

    //http://www.quirksmode.org/js/findpos.html
    //  I think this methods is not exact.  Leaves off borders, margins, padding perhaps
    Util.getPos    =   function(obj) {
        var curleft = curtop = 0;

        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            // more convenient for output
            return [curleft,curtop];
//             return {"offsetLeft" : curleft, "offsetTop" : curtop};
        }
    }

    // http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    //Returns true if it is a DOM node
    Util.isNode  =   function(o){
        return (
        typeof Node === "object" ? o instanceof Node :
        typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
        );
    }

    //Returns true if it is a DOM element
    Util.isElement  =   function(o){
        return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
        );
    }

    // http://solutions.stephenwyattbush.com/2010/01/darken-a-color-with-javascript/
    // http://javascript.internet.com/miscellaneous/true-color-darkening-and-lightening.html
    /* This script and many more are available free online at
    The JavaScript Source!! http://javascript.internet.com
    Created by: Joseph Myers | http://www.codelib.net/ */
    
    Util.colorscale =   function(hexstr, scalefactor) {
        /* declared variables first, in order;
        afterwards, undeclared local variables */
        var r = scalefactor;
        var a, i;

        if (r < 0 || typeof(hexstr) != 'string') {
            return hexstr;
        }

        hexstr = hexstr.replace(/[^0-9a-f]+/ig, '');
        if (hexstr.length == 3) {
            a = hexstr.split('');
        } else if (hexstr.length == 6) {
            a = hexstr.match(/(\w{2})/g);
        } else {
            return hexstr;
        }

        for (i=0; i<a.length; i++) {
            if (a[i].length == 2) {
                a[i] = parseInt(a[i], 16);
            } else {
                a[i] = parseInt(a[i], 16);
                a[i] = a[i]*16 + a[i];
            }
        }

        var maxColor = parseInt('ff', 16);

        function relsize(a) {
            if (a == maxColor) {
                return Infinity;
            }
            return a/(maxColor-a);
        }

        function relsizeinv(y) {
            if (y == Infinity) {
                return maxColor;
            }
            return maxColor*y/(1+y);
        }

        for (i=0; i<a.length; i++) {
            a[i] = relsizeinv(relsize(a[i])*r);
            a[i] = Math.floor(a[i]).toString(16);
            if (a[i].length == 1) {
                a[i] = '0' + a[i];
            }
        }

        return a.join('');
    } // Util.colorScale()


    Util.getClass   =   function(object) {
        return Object.prototype.toString.call(object)
            .match(/^\[object\s(.*)\]$/)[1];
    } // Util.getClass

    Util.Callback = function(method, args) {
        var _this = this;

        this.execute = function() {
            if(Util.typeOf(method) == "function") {
                // not really necessary - is this the difference between passing null and passing undefined?
                //             if(_this.args) {
                    return method(_this.getArgs());
                    //             } else {
                        //                 return method();
                        //             }
            }
        } // this.execute()        

        this.setArgs = function(args) {
            _this.args = args;
        }

        this.getArgs = function() {
            return _this.args;
        }

        this.setArgs(args ? args : null);

        if(Util.typeOf(method) != "function") {
            return false;
        } else {
            return _this;
        }        
    } // Util.Callback

    // this method uses hardcoded styles including zIndex
    //  should change this to allow for customization
    Util.alert  =   function(title, message, lifetime, scope) {
        var _this   =   this;
        
        var newScope    =   scope   ?   scope   :document.body;
        var oldColor    =   Util.getStyle(scope, 'background-color');
        var newColor    =   (oldColor && !oldColor == "transparent" ? oldColor : "#AAAAAA");
        newColor    =   Util.colorscale(newColor, .5);        
        
        var alertDiv    =   document.createElement("div");
        alertDiv.style.visibility   =   "hidden";
        alertDiv.style.position =   "absolute";
        alertDiv.style.zIndex   =   "4";
        alertDiv.style.border   =   "1px solid black";
        alertDiv.style.backgroundColor  =   oldColor && !oldColor == "transparent" ? oldColor : "FFFFFF";
        newScope.appendChild(alertDiv);

        var alertDims   =   Util.getSize(alertDiv);
        var scopeDims    =   Util.getSize(newScope);

        alertDiv.style.top  =   scopeDims[1] / 2 - alertDims[1] / 2;
        alertDiv.style.left =   scopeDims[0] / 2 - alertDims[0] / 2;
        
        var alertFader  =   document.createElement("div");
        alertFader.style.visibility =   "hidden";
        alertFader.style.position   =   "absolute";
        alertFader.style.top    =   "0px";
        alertFader.style.left   =   "0px";
        alertFader.style.opacity    =   ".4";
        alertFader.style.zIndex =   "3";
        alertFader.style.width  =   "100%";
        alertFader.style.height =   "100%";
        alertFader.style.background =   newColor;
        newScope.appendChild(alertFader);

//         var cancel =   function() {
        this.cancel =   function() {
            if(cancelTimer) {
                clearTimeout(cancelTimer);
            }
            newScope.removeChild(alertDiv);
            newScope.removeChild(alertFader);
        };
        
        var alertTitlebarWrapper    =   document.createElement("div");
        alertTitlebarWrapper.style.borderBottom =   "1px solid black";
        alertDiv.appendChild(alertTitlebarWrapper);
        
        var alertTitlebar    =   document.createElement("div");
        alertTitlebar.style.textAlign   =   "center";
        alertTitlebar.appendChild(document.createTextNode(title));
        alertTitlebarWrapper.appendChild(alertTitlebar);
        
        var alertCloseButton    =   document.createElement("div");
        alertCloseButton.style.position =   "absolute";
        alertCloseButton.style.top  =   "0px";
        alertCloseButton.style.right    =   "0px";
        alertCloseButton.style.borderLeft   =   "1px solid black";
        alertCloseButton.onmouseover    =   alertCloseButton.style.cursor   =   "pointer";
//         The onclick causes the following errors in Opera 10.63 build 6450.  Untested in other browsers yet.
//         When this error occurs, the cancel function still works correctly
// 
//         JavaScript - http://fuzzlabs.org/sandbox/login.php?module=Forum&action=View
// 
//         Uncaught exception: ReferenceError: Undefined variable: pointer
//         Error thrown at unknown location in <anonymous function>(event):
//             /* no source available */

        alertCloseButton.onclick    =   this.cancel;
        alertTitlebarWrapper.appendChild(alertCloseButton);
        
        var alertCloseSpan  =   document.createElement("span");
        alertCloseSpan.style.backgroundColor    =   "black";
        alertCloseSpan.style.opacity    =   ".4";
        alertCloseButton.appendChild(alertCloseSpan);
        
        var alertCloseTextSpan  =   document.createElement("span");
        alertCloseTextSpan.style.color  =   "white";
        alertCloseTextSpan.style.opacity    =   "1";
        alertCloseTextSpan.appendChild(document.createTextNode("X"));
        alertCloseSpan.appendChild(alertCloseTextSpan);
        
        var alertMessages   =   document.createElement("span");
        alertMessages.appendChild(document.createTextNode(message));
        alertDiv.appendChild(alertMessages);
        
        var alertClearFloat =   document.createElement("div");
        alertDiv.appendChild(alertMessages);

        // show alert
        alertFader.style.visibility =   "";
        alertDiv.style.visibility   =   "";
        this.visible    =   true;

//         this.cancel =   function() {
//             newScope.removeChild(alertDiv);
//             newScope.removeChild(alertFader);
//         };

//         alert(Function.prototype.bind);
//         var cancelBind  =   cancel.bind(this);
        var cancelTimer =   null;
        if(lifetime) {
                cancelTimer =   setTimeout(this.cancel, 2000);
//             setTimeout(this.cancel.bind(_this), 2000);
        }
    } // Util.alert()

    // TODO: better way to track handlers assigned to a particular element (or elements a handler is a assigned to)
        //I'm going to stick with my way of doing this because addEventListener doesn't curry arguments
//     Util.addHandler =   function(elem, type, callback, args)     {
//         if(!elem || !type) {
//             return false;
//         }
// 
//         var ontype  =   "on" + type;
//         var oldHandler  =   elem[ontype];
//         var handler =   oldHandler ?
//             function(evt) {
//                 oldHandler(evt);
//                 callback(evt, args);
//             } :
//             function(evt) {
//                 callback(evt, args);
//             }
// 
//         elem[ontype]    =   handler;
//     }

//http://stackoverflow.com/questions/2695793/javascript-what-is-addeventlistener

    Util.addHandler =   function (node, type, callback, args) {
        var newCallback    =   function(evt, _args) {
            callback(evt, _args);
        }
        if (node.addEventListener) {
            node.addEventListener(type, newCallback, false);
        }
        else if (node.attachEvent) {
            node.attachEvent("on" + type, newCallback);
        }
        else {
            var ontype  =   "on" + type;
            var oldHandler  =   node[ontype];
            var handler =   oldHandler  ?
                function(evt) {
                    oldHandler(evt);
                    newCallback(evt, args);
                } :
                function(evt) {
                    newCallback(evt, args);
                };

            node[ontype]    =   handler;
        }
    } // Util.addHandler()
} // if(!Util)