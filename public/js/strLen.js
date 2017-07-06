var strLen=function(){var r=function(r){return(r||"").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,"")};return function(n,t){n=r(n),t=t||"Ch";var u=n.length;if(0==u)return 0;var e=n.match(/[\u4e00-\u9fa5]/g);return u+(e&&"Ch"==t?e.length:0)}}();
//# sourceMappingURL=maps/strLen.js.map
