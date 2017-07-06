var DC = function () {
  var $Toolkit = function () {
    var str2dom = function (_str) {
      var _ret = [],
          _cot = arguments.callee._temp = arguments.callee._temp || document.createElement("div");
      ;
      _cot.innerHTML = _str;
      while (_cot.firstChild) {
        _ret.push(_cot.removeChild(_cot.firstChild));
      }
      return _ret.length > 1 ? function () {
        var tmp = document.createDocumentFragment();
        for (var i = 0; i < _ret.length; i++) {
          tmp.appendChild(_ret[i]);
        }
        return tmp;
      }() : _ret[0];
    };
    var format = function (str, obj) {
      return str.replace(arguments.callee._reg, function (_i, _1) {
        return obj[_1] !== null ? obj[_1] : _1;
      });
    }
    format._reg = /\{(\w+)\}/g;
    return {
      str2dom: str2dom, format: format, extend: function (_Cld, _Prt) {
        var fn = EMPTY_FUN;
        fn.prototype = _Prt.prototype;
        _Cld.prototype = new fn();
        _Cld.constructor = _Cld;
        return _Cld;
      }
    }
  }();
  var $Object = function () {
    return {
      extend: function () {
        var args = arguments,
            len = arguments.length,
            deep = false,
            i = 1,
            target = args[0],
            opts, src, clone, copy;
        if (typeof target === "boolean") {
          deep = target;
          target = arguments[1] || {};
          i = 2;
        }
        if (typeof target !== "object" && typeof target !== "function") {
          target = {};
        }
        if (len === i) {
          target = {};
          --i;
        }
        for (; i < len; i++) {
          if ((opts = arguments[i]) != null) {
            for (var name in opts) {
              src = target[name];
              copy = opts[name];
              if (target === copy) {
                continue;
              }
              if (deep && copy && typeof copy === "object" && !copy.nodeType) {
                if (src) {
                  clone = src;
                } else if (copy instanceof Array) {
                  clone = [];
                } else if (typeof copy === 'object') {
                  clone = {};
                } else {
                  clone = copy;
                }
                target[name] = object.extend(deep, clone, copy);
              } else if (copy !== undefined) {
                target[name] = copy;
              }
            }
          }
        }
        return target;
      }
    }
  }();
  var $QueryString = function () {
    var re = /"/g;
    var tool = {
      genHttpParamString: function (o) {
        return this.commonDictionaryJoin(o, null, null, null, window.encodeURIComponent);
      },
      splitHttpParamString: function (s) {
        return this.commonDictionarySplit(s, null, null, null, window.decodeURIComponent);
      },
      commonDictionarySplit: function (s, esp, vq, eq, valueHandler) {
        var res = {},
            l, ks, vs, t, vv;
        if (!s || typeof(s) != "string") {
          return res;
        }
        if (typeof(esp) != 'string') {
          esp = "&";
        }
        if (typeof(vq) != 'string') {
          vq = "";
        }
        if (typeof(eq) != 'string') {
          eq = "=";
        }
        l = s.split(esp);
        if (l && l.length) {
          for (var i = 0, len = l.length; i < len; ++i) {
            ks = l[i].split(eq);
            if (ks.length > 1) {
              t = ks.slice(1).join(eq);
              vs = t.split(vq);
              vv = vs.slice(vq.length, vs.length - vq.length).join(vq);
              res[ks[0]] = (typeof valueHandler == 'function' ? valueHandler(vv) : vv);
            } else {
              ks[0] && (res[ks[0]] = true);
            }
          }
        }
        return res;
      },
      commonDictionaryJoin: function (o, esp, vq, eq, valueHandler) {
        var res = [],
            t, ok;
        if (!o || typeof(o) != "object") {
          return '';
        }
        if (typeof(o) == "string") {
          return o;
        }
        if (typeof(esp) != 'string') {
          esp = "&";
        }
        if (typeof(vq) != 'string') {
          vq = "";
        }
        if (typeof(eq) != 'string') {
          eq = "=";
        }
        for (var k in o) {
          ok = (o[k] + "").replace(re, "\\\"");
          res.push(k + eq + vq + (typeof valueHandler == 'function' ? valueHandler(ok) : ok) + vq);
        }
        return res.join(esp);
      }
    }
    return {
      stringify: function (obj) {
        return tool.genHttpParamString(obj);
      }, parse: function (str) {
        return tool.splitHttpParamString(str);
      }, getParameter: function (name) {
        var r = new RegExp("(\\?|#|&)" + name + "=([^&#]*)(&|#|$)"),
            m = location.href.match(r);
        return decodeURIComponent(!m ? "" : m[2]);
      }
    }
  }();
  var $Cookie = function () {
    var domainPrefix = document.domain || "";
    return {
      set: function (name, value, domain, path, hour) {
        if (hour) {
          var expire = new Date();
          expire.setTime(expire.getTime() + 3600000 * hour);
        }
        document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
        return true;
      },
      get: function (name) {
        var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)"),
            m = document.cookie.match(r);
        return (!m ? "" : m[1]);
      },
      del: function (name, domain, path) {
        document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
      }
    }
  }();
  return {
    Toolkit: $Toolkit,
    Object: $Object,
    QueryString:$QueryString,
    Cookie: $Cookie
  }
}();
(function (_dc) {
  var $ = function (_) {
    return typeof(_) == "string" ? document.getElementById(_) : _
  };
  /*var qc_script,
      scripts=document.getElementsByTagName('script');
  qc_script=scripts[1];
  var getDataPara = function (para) {
    return qc_script && (qc_script.dataset && qc_script.dataset[para] || qc_script.getAttribute("data-" + para));
  };*/
  var $Toolkit=_dc.Toolkit,
      $Object=_dc.Object,
      $QueryString=_dc.QueryString,
      $Cookie=_dc.Cookie;
  var __qc_wId;
  !(function () {
    __qc_wId=~~$QueryString.getParameter('__qc_wId') || ~~$Cookie.get('__qc_wId');
    if(!__qc_wId){
      var ret=+new Date() % 1000;
      document.cookie=['__qc_wId='+ret,' path=/'].join(';');
    }
  })();

  var Signin=function () {
    var BUTTON_STYLE = {
      A_XL: {styleId: 5, size: '230*48'},
      A_L: {styleId: 4, size: '170*32'},
      A_M: {styleId: 3, size: '120*24'},
      A_S: {styleId: 2, size: '105*16'},
      B_M: {styleId: 7, size: '63*24'},
      B_S: {styleId: 6, size: '50*16'},
      C_S: {styleId: 1, size: '16*16'}
    };

    function _insertButton(opts) {
      var btn=$(opts['btnId']),
          sizeObj=BUTTON_STYLE[opts['size']] || BUTTON_STYLE['B_M'],
          size=sizeObj['styleId'],
          fullWindow=opts['fullWindow'] || false,
          btnMode=opts['btnMode'] || 'standard';
      var url=arguments.callee._getPopupUrl(opts);
      console.log(url)
      // var url='http://www.baidu.com';
      var parasObj={size: size, fullWindow: fullWindow, url: url}
      if(opts && opts['btnId']){
        if(btn){
          btn.innerHTML=arguments.callee.getBtnHtml(parasObj, btnMode, opts);
          var onclick=btn.firstChild.onclick;
          (btn.firstChild.onclick=function (_a) {
            var crtPop,
                _close=function () {
                  crtPop && crtPop.close();
                };
            window.addEventListener ? window.addEventListener('unload',_close,false) : window.attachEvent('onunload',_close);
            return function () {
              if(crtPop){
                crtPop.close();
              }
              crtPop = _a();
              return false;
            }
          }(onclick))
        }else{
          throw new Error('未找到插入节点');
        }
      }
    }
    _insertButton.TEMPLATE=['<a href="javascript:void(0);" onclick="{onclick};"><img src="{src}" alt="{alt}" border="0"/></a>'].join('');
    _insertButton.getBtnHtml=function (parasOpts,btnMode,opts) {
      return arguments.callee.MODE[btnMode] && arguments.callee.MODE[btnMode](parasOpts,opts);
    };
    _insertButton.getBtnHtml.MODE={
      'standard':function (parasObj) {
        var windowId=~~$Cookie.get('__qc_wId')+10000;
        var baseStr=$Toolkit.format(_insertButton.TEMPLATE,{
          onclick:parasObj.fullWindow ? 'return window.open(\''+parasObj.url+'\',\'oauth2Login_'+windowId+'\')' : 'return window.open(\''+parasObj.url+'\',\'oauth2Login_'+windowId+'\',\'height=525,width=585, toolbar=no, menubar=no, scrollbars=no, status=no, location=no, directories=no,titlebar=0,left=0,top=0,resizable=no\')',
          src:'http://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_'+parasObj.size+'.png',
          alt:'帐号中心登录'
        });
        return baseStr;
      },
      'showUserAfterLogin':function (parasObj,opts) {

      }
    };
    _insertButton._getPopupUrl=function (opts) {
      var scope=opts['scope'] || 'all',
          display=opts['display'] || '',
          redirectURI=opts['redirectURI'] || '';
      redirectURI =redirectURI || ('http%3A%2F%2Fqzonestyle.gtimg.cn%2Fqzone%2Fopenapi%2Fredirect-1.0.1.html') || (location.protocol+'//'+location.host+((location.port && location.port!='80') ? ':'+location.port : '')+'qc_callback.html') || '';
      var paras = ['response_type=token'],
          // url = 'https://graph.qq.com/oauth2.0/authorize';
          url='';
      if(scope){
        paras.push('scope='+scope);
      }
      if(display=='mobile'){
        paras.push('display='+display);
      }
      if(redirectURI){
        if(redirectURI.indexOf('://')!=-1){
          redirectURI=encodeURIComponent(redirectURI);
          paras.push('redirectURI='+redirectURI);
        }
      }
      // url=url+'?'+paras.join('&');
      url='http://localhost:3001/src/html/login.html?redirect_uri=http%3A%2F%2Fbaidu.com';
      return url;
    };

    function retFun(opts) {
      _insertButton(opts);
    }
    $Object.extend(retFun,{
      insertButton:_insertButton
    });
    return retFun;
  };

  var Signup=function () {
    console.log('Signup');
  };

  _dc.Signin = Signin();
  _dc.Signup = Signup;
})(DC);
(function () {
  window.dc = DC;
  if (typeof Object.freeze == "function") {
    Object.freeze(DC);
  }
})();