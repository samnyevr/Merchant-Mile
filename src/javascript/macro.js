
///////////// Simple Inventory
/* twine-user-script #1: "simple-inventory.js" */
// Simple Inventory, for SugarCube 2, by Chapel
// v3.0.1, 2024-07-22, 8c9749dbafa5f12948d743a8dedd4e1c74bb9e26
;"use strict";function _typeof(t){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_typeof(t)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,_toPropertyKey(i.key),i)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function _toPropertyKey(t){var e=_toPrimitive(t,"string");return"symbol"==_typeof(e)?e:String(e)}function _toPrimitive(t,e){if("object"!=_typeof(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var i=n.call(t,e||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}!function(){var t={description:"",handler:null,displayName:"",consumable:!0,unique:!1,permanent:!1},e=new Map,n=function(){function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:clone(t),r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];if(_classCallCheck(this,n),!e||"string"!=typeof e)throw new Error("invalid item ID");if("object"!==_typeof(i))throw new Error("invalid item definition");Object.assign(this,Object.assign({},t,i)),this.id=e,this._tags=r instanceof Array?r:"string"==typeof r?[r]:[]}return _createClass(n,[{key:"tags",get:function(){return this._tags}},{key:"hasTag",value:function(t){return this._tags.includes(t)}},{key:"hasAllTags",value:function(){return this._tags.includesAll([].slice.call(arguments).flat(1/0))}},{key:"hasAnyTags",value:function(){return this._tags.includesAny([].slice.call(arguments).flat(1/0))}},{key:"name",get:function(){return this.displayName||this.id},set:function(t){this.displayName=t}},{key:"use",value:function(){return"string"==typeof this.handler?$.wiki(this.handler):"function"==typeof this.handler&&this.handler(this),this}},{key:"inspect",value:function(){return Dialog.setup(this.name,"simple-inventory item-description"),Dialog.wiki(this.description),Dialog.open(),this}}],[{key:"is",value:function(t){return t instanceof n}},{key:"add",value:function(t,i,r){var a=new n(t,i,r);return e.set(t,a),a}},{key:"get",value:function(t){return e.get(t)}},{key:"has",value:function(t){return e.has(t)}},{key:"list",get:function(){return e}}]),n}();setup.Item=n,window.Item=window.Item||n}(),function(){var t=setup.Item,e=!1,n="&hellip;",i={inspect:"Inspect",use:"Use",drop:"Drop",stack:"stack",take:"Take",give:"Give",stackPre:"&nbsp;&times;&nbsp;",stackPost:"&nbsp;"},r={};function a(e){return t.has(e)&&t.get(e).unique}var s=function(){function s(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];_classCallCheck(this,s),this.data=clone(t),this._tags=e instanceof Array?e:"string"==typeof e?[e]:[]}return _createClass(s,[{key:"emit",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return s.emit(t,this,e),this}},{key:"array",get:function(){var t=this,e=[];return Object.keys(this.data).forEach((function(n){if(e.push(n),t.data[n]>1)for(var i=1;i<t.data[n];i++)e.push(n)})),e}},{key:"list",get:function(){return Object.keys(this.data)}},{key:"length",get:function(){return this.array.length}},{key:"uniqueLength",get:function(){return this.list.length}},{key:"table",get:function(){return this.data}},{key:"tags",get:function(){return this._tags}},{key:"hasTag",value:function(t){return this._tags.includes(t)}},{key:"hasAllTags",value:function(){return this._tags.includesAll([].slice.call(arguments).flat(1/0))}},{key:"hasAnyTags",value:function(){return this._tags.includesAny([].slice.call(arguments).flat(1/0))}},{key:"count",value:function(t){return t?this.data[t]||0:this.length}},{key:"has",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return this.data[t]>=e}},{key:"hasAll",value:function(){var t=this;return[].slice.call(arguments).flat(1/0).every((function(e){return t.has(e)}))}},{key:"hasAny",value:function(){var t=this;return[].slice.call(arguments).flat(1/0).some((function(e){return t.has(e)}))}},{key:"compare",value:function(t){var e=this,n=s.itemset(t);return Object.keys(n).every((function(t){return e.has(t,n[t])}))}},{key:"merge",value:function(t){var e=this,n=s.itemset(t);return Object.keys(n).forEach((function(t){s.change(e,t,n[t])})),n}},{key:"unmerge",value:function(t){var e=this,n={},i=s.itemset(t);return Object.keys(i).forEach((function(t){e.has(t,i[t])?n[t]=i[t]:e.has(t)&&(n[t]=e.count(t)),s.change(e,t,i[t],!0)})),n}},{key:"pickup",value:function(){var t=this.merge(s.parseArgList.apply(null,arguments));return this.emit("update",{delta:t}),this}},{key:"drop",value:function(){var t=this.unmerge(s.parseArgList.apply(null,arguments));return this.emit("update",{delta:t}),this}},{key:"empty",value:function(){var t=clone(this.data);return this.data={},this.emit("update",{delta:t}),this}},{key:"transfer",value:function(t){var e=s.parseArgList.apply(null,[].slice.call(arguments).slice(1));if(!s.is(t))throw new TypeError("target inventory is not an inventory instance");var n=this.unmerge(e);return t.merge(n),this.emit("update",{target:t,delta:n}),this}},{key:"isEmpty",value:function(){return 0===this.length}},{key:"iterate",value:function(t){var e=this;return"function"!=typeof t||this.list.forEach((function(n){t(n,e.data[n])})),this}},{key:"use",value:function(e){if(t.has(e)){var n=t.get(e);if(n.use(),n.consumable){s.change(this,e,1,!0);var i={};i[e]=1,this.emit("update",{delta:i})}return this.emit("use",{item:n}),this}}},{key:"clone",value:function(){return new s(this.data||{},this._tags||[])}},{key:"toJSON",value:function(){return JSON.reviveWrapper("new setup.Inventory("+JSON.stringify(this.data)+", "+JSON.stringify(this._tags)+")")}}],[{key:"confirm",get:function(){return e},set:function(t){e="string"==typeof t&&"all"===t.trim().toLowerCase()?"all":"string"==typeof t&&"stack"===t.trim().toLowerCase()?"stack":!!t}},{key:"emptyMessage",get:function(){return n},set:function(t){"string"==typeof t&&(n=t)}},{key:"strings",get:function(){return Object.assign(clone(i),r)},set:function(t){"object"===_typeof(t)&&(r=Object.assign(r,clone(t)))}},{key:"change",value:function(e,n){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if(0!==i){if(e instanceof s&&(e=e.data),"object"!==_typeof(e)){if(e)throw new TypeError("cannot access inventory data");e={}}if(!(o=n)||"string"!=typeof o||!o.trim())throw new TypeError("invalid item name/id");var o;if("number"==typeof i&&!Number.isNaN(i)&&Number.isInteger(i)||(i=1),r&&(i*=-1),i>0){if(Object.keys(e).includes(n)&&a(n))return;i>1&&a(n)&&(i=1),Object.keys(e).includes(n)||(e[n]=0),e[n]+=i}else{if(function(e){return t.has(e)&&t.get(e).permanent}(n))return;Object.keys(e).includes(n)&&"number"==typeof e[n]&&(e[n]+=i),e[n]<=0&&delete e[n]}return e}}},{key:"itemset",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(s.is(t)&&(t=t.data),"object"!==_typeof(t))return{};var e={};return Object.keys(t).forEach((function(n){"number"==typeof t[n]&&Number.isInteger(t[n])&&0!==t[n]&&(e[n]=t[n])})),e}},{key:"parseArgList",value:function(){var t=[].slice.call(arguments).flat(1/0);if(t.length%2!=0)throw new Error("item sets should be pairs of item IDs and numbers");var e={};return t.forEach((function(n,i){i%2==0&&(e[n]=t[i+1])})),e}},{key:"is",value:function(t){return t instanceof s}},{key:"emit",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};$(document).trigger(Object.assign({type:":inventory-"+t+".simple-inventory",inventory:e,target:null,delta:{},item:null},n))}},{key:"create",value:function(t,e){return new s(t,e)}}]),s}();setup.Inventory=s,window.Inventory=window.Inventory||s}(),function(){var t=setup.Item,e=setup.Inventory;function n(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"Alert",a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"Are you sure?";if(!t||"function"!=typeof t)throw new Error("Invalid confirmation callback!");if(e.confirm)if("all"!==e.confirm||"all"===i)if("stack"!==e.confirm||i){var s={display:"inline-block",float:"right"},o=$(document.createElement("div")),u=$(document.createElement("p")).append(a),l=$(document.createElement("div")).addClass("confirmation-buttons"),c=$(document.createElement("button")).append("Okay").addClass("confirm-yes").css(Object.assign(s,{"margin-right":"0.5rem"})),d=$(document.createElement("button")).append("Cancel").addClass("confirm-no").css(s);t&&"function"==typeof t&&c.ariaClick(t),n&&"function"==typeof n&&d.ariaClick(n),l.append(d,c),o.append(u,l),Dialog.setup(r,"simple-inventory confirmation"),Dialog.append(o),Dialog.open()}else t();else t();else t()}function i(t){var e=$(document.createElement("span")).addClass("spacer");return t&&e.wiki(""+t),e}function r(t,i){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;return"give"===String(i).toLowerCase().trim()?i=e.strings.give:"take"===String(i).toLowerCase().trim()?i=e.strings.take:i&&"drop"!==String(i).toLowerCase().trim()||(i=e.strings.drop),$(document.createElement(r?"button":"a")).addClass("all-link drop-link").wiki(i+" all").ariaClick((function(){t.isEmpty()||n((function(){a&&e.is(a)?(a.merge(t),t.empty()):t.empty(),Dialog.close()}),(function(){Dialog.close()}),!0)}))}function a(a){var s,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{description:!0,use:!0,transfer:null,drop:!0,all:!0,stack:!0,dropActionText:"",classes:""},u=$(document.createElement("ul")).addClass("simple-inventory-list");if(a.length){if(s=a.list.map((function(r){var s=[],u=r;t.has(r)&&(u=t.get(r).name),o.description&&t.has(r)&&t.get(r).description?s.push(function(n,i,r){var a=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return r=r||e.strings.inspect,$(document.createElement(a?"button":"a")).addClass("inspect-link").wiki(""+r).ariaClick((function(){t.get(i).inspect()}))}(a,r,u)):s.push($(document.createElement("span")).append(t.has(r)?t.get(r).name:r).addClass("item-name")),s.push(function(t,n,i,r){var a=$(document.createElement("span")),s=t.count(n);return i=i||e.strings.stackPre,r=r||e.strings.stackPost,1==s?a.addClass("item-count single"):a.addClass("item-count multi"),a.append(""+i+(s||0)+r)}(a,r)),o.use&&t.has(r)&&t.get(r).handler?s.push(function(t,n,i){var r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return i=i||e.strings.use,$(document.createElement(r?"button":"a")).addClass("use-link").wiki(""+i).ariaClick((function(){t.use(n)}))}(a,r)):s.push(i()),(o.transfer&&e.is(o.transfer)||o.drop)&&!function(e){return t.has(e)&&t.get(e).permanent}(r)?(s.push(function(t,i,r){var a=arguments.length>3&&void 0!==arguments[3]&&arguments[3],s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null;return"give"===String(r).toLowerCase().trim()?r=e.strings.give:"take"===String(r).toLowerCase().trim()?r=e.strings.take:r&&"drop"!==String(r).toLowerCase().trim()||(r=e.strings.drop),$(document.createElement(a?"button":"a")).addClass("drop-link").wiki(""+r).ariaClick((function(){n((function(){s&&e.is(s)?t.transfer(s,i,1):t.drop(i,1),Dialog.close()}),(function(){Dialog.close()}))}))}(a,r,o.dropActionText,!1,o.transfer||null)),a.count(r)>1&&o.stack?s.push(function(t,i,r){var a=arguments.length>3&&void 0!==arguments[3]&&arguments[3],s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null;return"give"===String(r).toLowerCase().trim()?r=e.strings.give:"take"===String(r).toLowerCase().trim()?r=e.strings.take:r&&"drop"!==String(r).toLowerCase().trim()||(r=e.strings.drop),r=r+"&nbsp;"+e.strings.stack,$(document.createElement(a?"button":"a")).addClass("stack-link drop-link").wiki(""+r).ariaClick((function(){n((function(){s&&e.is(s)?t.transfer(s,i,t.count(i)):t.drop(i,t.count(i)),Dialog.close()}),(function(){Dialog.close()}))}))}(a,r,o.dropActionText,!1,o.transfer||null)):s.push(i())):s.push(i());var l=r.normalize().toLowerCase().replace(/\s+/g,"-");return $(document.createElement("li")).append(s).addClass("simple-inventory-listing").attr({"data-item-id":l,"data-keyword":u})})),o.all){var l=$(document.createElement("li")).addClass("all-listing simple-inventory-listing").append([i("&mdash;"),i(),i(),r(a,o.dropActionText,!1,o.transfer||null)]);s.push(l)}}else s=$(document.createElement("li")).addClass("simple-inventory-listing").append($(document.createElement("span")).wiki(e.emptyMessage));return u.append(s),u}e.prototype.interface=function(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i=this,r=$(document.createElement("div")).addClass("simple-inventory-wrapper");return e.filter&&r.append(function(){var t=$(document.createElement("div")).addClass("simple-inventory-filter"),e=$(document.createElement("input")).attr({type:"text",placeholder:"Filter..."}).on("input",(function(){var n=e.val().trim().toLowerCase(),i=t.parent().find("ul.simple-inventory-list li.simple-inventory-listing:not(.all-listing)");n?i.each((function(t,e){var i=$(e);i&&i.length&&(i.attr("data-keyword").substring(0,n.length).trim().toLowerCase()!==n?i.hide():i.show())})):i.show()}));return t.append(e),t}()),r.append(a(this,e)),$(document).on(":inventory-update.simple-inventory.gui-built-in",(function(){r.length?r.empty().append(a(i,e)):$(document).off(":inventory-update.simple-inventory.gui-built-in")})),n&&n instanceof $?t=n:n&&(t=$(n)),t&&r.appendTo(t),r}}(),function(){setup.Inventory,setup.Item;var t=".simple-inventory-userland",e=":inventory-update.simple-inventory"+t,n=":inventory-use.simple-inventory"+t;function i(t){return t&&"function"==typeof t}Object.assign(setup.Inventory,{events:{update:{on:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";i(t)&&$(document).on(e+n,t)},one:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";i(t)&&$(document).one(e+n,t)},off:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";$(document).off(e+t)}},use:{on:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";i(t)&&$(document).on(n+e,t)},one:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";i(t)&&$(document).one(n+e,t)},off:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";$(document).off(n+t)}}}})}(),function(){var t=":";function e(e){var n=function(t){return t.replace(/\r+/g,"\n").replace(/\n+/,"\n").replace(/ +/g," ").trim().split(/\n/g)}(e),i={};return n.forEach((function(e){if(e&&e.trim()&&e.includes(t)){var n=e.trim().split(t);i[n[0].trim()]=n[1].trim()}})),i}var n=function(t){try{return Story.has(t)?e(Story.get(t).text):{}}catch(t){return console.error(t.message,t),{}}}("inventory.strings");n.empty&&"string"==typeof n.empty&&n.empty.trim()&&(setup.Inventory.emptyMessage=n.empty,delete n.empty),setup.Inventory.strings=n||{}}(),function(){var t=setup.Item,e=setup.Inventory;function n(t){return t&&"string"==typeof t&&t.length>=2&&("$"===t[0]||"_"===t[0])}function i(t){if(n(t)&&(t=State.getVar(t)),e.is(t))return t}Macro.add(["item","consumable"],{tags:["description","tags","unique","permanent"],handler:function(){var e,n,i,r,a=null,s=!1,o=!1,u=!1;if(State.length>0)return this.error("items must be defined in `StoryInit` or story JavaScript!");if(!this.args[0]||"string"!=typeof this.args[0]||!this.args[0].trim())return this.error("invalid item ID");if(e=this.args[0].trim(),"consumable"===this.name&&(a=this.payload[0].contents||null,s=!0),this.args[1]&&(n=this.args[1]),this.payload.length>1){var l=this.payload.find((function(t){return"description"===t.name})),c=this.payload.find((function(t){return"tags"===t.name})),d=this.payload.find((function(t){return"unique"===t.name})),f=this.payload.find((function(t){return"permanent"===t.name}));l&&(i=l.contents.trim()),c&&(r=c.args.flat(1/0)),d&&(o=!0),f&&(u=!0)}t.add(e,{displayName:n||"",description:i||"",handler:a,consumable:s,unique:o,permanent:u},r)}}),Macro.add("newinv",{handler:function(){var t=this.args.raw.trim().split(" ").first().replace(/["']/g,"").trim();if(!n(t))return this.error("argument must be a story or temporary variable!");State.setVar(t,new e({},this.args.flat(1/0).slice(1)))}}),Macro.add(["pickup","drop"],{handler:function(){var t=i(this.args[0]);return t?this.args.length<3?this.error("no items to pick up were provided"):void t[this.name](this.args.slice(1)):this.error("first argument must be a valid inventory!")}}),Macro.add("dropall",{handler:function(){var t=i(this.args[0]);if(!t)return this.error("first argument must be a valid inventory!");t.empty()}}),Macro.add(["transfer","merge","unmerge"],{handler:function(){var t=i(this.args[0]);if(!t)return this.error("first argument must be a valid inventory!");var e=i(this.args[1]);if(!e)return this.error("second argument must be a valid inventory!");if("transfer"===this.name){if(this.args.length<4)return this.error("no items to transfer were provided");t.transfer(e,this.args.slice(2))}else t[this.name](e)}}),Macro.add(["inv","take","give"],{handler:function(){var t=null,n=i(this.args[0]);if(!n)return this.error("first argument must be a valid inventory!");this.args[1]&&i(this.args[1])&&(t=i(this.args[1]));var r={description:this.args.includesAny("inspect","description"),use:this.args.includes("use"),transfer:t,drop:this.args.includes("drop"),all:this.args.includes("all"),stack:this.args.includes("stack"),filter:this.args.includes("filter"),dropActionText:"inv"===this.name?"Drop":e.strings[this.name.trim().toLowerCase()],classes:"macro-".concat(this.name)};n.interface(r,$(this.output))}})}(),function(){var t=setup.Item,e=setup.Inventory;function n(t,e,n){if("object"!==_typeof(e))throw new TypeError("the extension should be a plain generic object holding the properties and methods you want to add");Object.keys(e).forEach((function(i){if(t[i]&&!n)throw new Error('Cannot override existing property "'+i+'"!');t[i]=e[i]}))}Object.assign(e,{extend:function(t){n(e,t,arguments.length>1&&void 0!==arguments[1]&&arguments[1])},extendPrototype:function(t){var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];n(e.prototype,t,i)}}),Object.assign(t,{extend:function(e){n(t,e,arguments.length>1&&void 0!==arguments[1]&&arguments[1])},extendPrototype:function(e){var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];n(t.prototype,e,i)}})}();
// End Simple Inventory
/* twine-user-script #2: "Story JavaScript" */
Config.ui.stowBarInitially = false;


//
// popover.min.js, for SugarCube 2, by Chapel
// v1.0.1, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;!function(){"use strict";function o(o,i){i=function(){return[].slice.call(arguments).flat(1/0).filter((function(o){return o&&"string"==typeof o&&o.trim()}))||[]}(i),$("#ui-overlay, #ui-dialog").addClass("popover"),$("#ui-overlay, #ui-dialog, #ui-dialog-body").addClass(i),i.includesAny("noclick","no-click")&&$("#ui-overlay").removeClass("ui-close"),Dialog.setup("","popover"),Dialog.wiki(o),Dialog.open(),$(document).one(":dialogclosed",(function(){$("#ui-overlay").addClass("ui-close"),$("#ui-overlay, #ui-dialog").removeClass("popover"),$("#ui-overlay, #ui-dialog, #ui-dialog-body").removeClass(i)}))}Macro.add("popover",{tags:null,handler:function(){o(this.payload[0].contents,this.args)}}),Macro.add("dismisspopover",{skipArgs:!0,handler:function(){$("ui-overlay").hasClass("popover")&&Dialog.close()}}),setup.popover=o}();
// end popover.min.js//

// mouseover.min.js, for SugarCube 2, by Chapel
// v1.0.1, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;Macro.add("mouseover",{tags:["onhover","onmouseover","onmousein","onmouseenter","onmouseout"],skipArgs:!0,handler:function(){if(this.payload.length<2)return this.error("No event tag used.");var e={mouseover:[],mousein:[],mouseout:[]},o=$(document.createElement("span")).addClass("macro-"+this.name).wiki(this.payload[0].contents).appendTo(this.output);this.payload.forEach((function(o){switch(o.name){case"onhover":case"onmouseover":e.mouseover.push(o.contents);break;case"onmousein":case"onmouseenter":e.mousein.push(o.contents);break;case"onmouseout":e.mouseout.push(o.contents);break;default:return}})),e.mouseover.length&&o.on("mouseover",this.createShadowWrapper((function(o){$.wiki(e.mouseover.join(" "))}))),e.mousein.length&&o.on("mouseenter",this.createShadowWrapper((function(o){$.wiki(e.mousein.join(" "))}))),e.mouseout.length&&o.on("mouseout",this.createShadowWrapper((function(o){$.wiki(e.mouseout.join(" "))})))}});
// end mouseover.min.js

// continue.min.js, for SugarCube 2, by Chapel
// v1.0.1, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;!function(){"use strict";var n=["a",":button",'*[role="button"]',".continue-macro-ignore","#ui-bar","#ui-dialog"],t=0;function o(){$(document).on("click.continue-macro keyup.continue-macro",n.join(", "),(function(n){n.stopPropagation()}))}function e(){if(State.length>0)return!1;var t=[].slice.call(arguments).flat(1/0);return n=n.concat(t),!0}function c(n,o){var e=function(){var n="."+Date.now().toString(36)+"-"+t;return t++,n}();if(o&&"function"==typeof o){var c="click.continue-macro"+e;n&&(c=c+" keyup.continue-macro"+e),$(document).one(c,(function(){o.call(),$(document).off(e)}))}}prehistory["%%continue-expiration"]=function(){t=0},$(document).one(":passagerender",(function(){o()})),Macro.add("ignore",{handler:function(){if(!e(this.args))return this.error("the <<ignore>> macro should only be run from StoryInit or equivalent.")}}),Macro.add("cont",{tags:null,handler:function(){var n,t=this.args.includes("append"),o=this.args.includesAny("key","keypress","press","button"),e=this.payload[0].contents;t&&(n=$(document.createElement("span")).addClass("macro-"+this.name).appendTo(this.output)),c(o,this.createShadowWrapper((function(){t&&n&&n instanceof $?n.wiki(e):$.wiki(e)})))}}),setup.cont=c,setup.cont.ignore=e,setup.cont.reset=function(){var t=[].slice.call(arguments).flat(1/0);n=n.concat(t),$(document).off(".continue-macro"),o()},window.cont=window.cont||setup.cont}();
// end continue.min.js

// fading-macro-set.min.js, for SugarCube 2, by Chapel
// v1.1.0, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;Macro.add("fadein",{tags:null,handler:function(){var t,a,s=$(document.createElement("span")),e=this.payload[0].contents;if(0===this.args.length)return this.error("no arguments given");t=Util.fromCssTime(this.args[0]),a=this.args.length>1?Util.fromCssTime(this.args[1]):0,s.wiki(e).addClass("macro-"+this.name).appendTo(this.output).hide().delay(a).fadeIn(t)}}),Macro.add("fadeout",{tags:null,handler:function(){var t,a,s=$(document.createElement("span")),e=this.payload[0].contents;if(0===this.args.length)return this.error("no arguments given");t=Util.fromCssTime(this.args[0]),a=this.args.length>1?Util.fromCssTime(this.args[1]):0,s.wiki(e).addClass("macro-"+this.name).appendTo(this.output).delay(a).fadeOut(t)}});
// end fading-macro-set.min.js

// disable.min.js, for SugarCube 2, by Chapel
// v1.0.0, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;!function(){"use strict";var a=["button","fieldset","input","menuitem","optgroup","option","select","textarea"];Macro.add("disable",{tags:null,handler:function(){var t,i,e,s=$(document.createElement("span")).addClass("macro-"+this.name).wiki(this.payload[0].contents);try{t=this.args.raw.trim()?!!Scripting.evalJavaScript(this.args.full):void 0}catch(a){return this.error("bad evaluation: "+a.message)}!function(a,t){a instanceof $||(a=$(a)),a.ariaDisabled(void 0===t||!!t),function(a){a.ariaIsDisabled()?a.addClass("disabled"):a.removeClass("disabled")}(a)}((i=s,e=$(i).find(a.join(",")).first(),e[0]||(e=$(i).children().eq(0))[0]?e:$(i)),t),$(this.output).append(s)}})}();
// end disable.min.js

// swap-macro-set.min.js, for SugarCube 2, by Chapel
// v1.1.0, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;!function(){"use strict";var t=!0,a=!0,e="violet",s="red",r="swappable";setup.swap=setup.swap||{};var n=null;function i(a){var e=function(){return a};setup.swap.current=e,t&&(window.swapCurrent=e)}function o(a,o){var p=$(document.createElement("span"));return $(document.createElement("a")).wiki(a).css("color",e).attr({"data-swap-flag":"false","data-orig-content":a,"data-wiki-code":o||""}).addClass(r).appendTo(p).ariaClick((function(a){a.preventDefault();var r=$(this);if("true"===r.attr("data-swap-flag"))r.attr("data-swap-flag","false").css("color",e),n=null;else if(n){var o=n.text(),p=r.text(),l=n.attr("data-wiki-code"),c=r.attr("data-wiki-code");n.attr("data-swap-flag","false").css("color",e).empty().wiki(p),r.attr("data-swap-flag","false").css("color",e).empty().wiki(o),l&&"string"==typeof l&&l.trim()&&(i(p),$.wiki(l)),c&&"string"==typeof c&&c.trim()&&(i(o),$.wiki(c)),setup.swap.current&&"function"==typeof setup.swap.current&&delete setup.swap.current,t&&window.swapCurrent&&"function"==typeof window.swapCurrent&&delete window.swapCurrent,n=null}else n=r,r.attr("data-swap-flag","true").css("color",s)})),p}function p(){n=null,$("a."+r).each((function(){var t=$(this);t.empty().wiki(t.attr("data-orig-content")).attr("data-swap-flag","false").css("color",e)}))}Macro.add("swap",{tags:["onswap"],skipArgs:!0,handler:function(){var t=this.payload[0].contents,a=this.payload[1]?this.payload[1].contents:"",e=this.output,s=this.name;o(t,a).addClass("macro-"+s).appendTo(e)}}),Macro.add("resetswap",{handler:function(){var t=this.args&&this.args[0]&&"string"==typeof this.args[0]?this.args[0]:"Reset";$(document.createElement(a?"button":"a")).wiki(t).ariaClick({label:"Reset all swappable elements."},(function(t){t.preventDefault(),p()})).appendTo(this.output)}}),setup.swap.create=o,setup.swap.reset=p}();
// end swap-macro-set.min.js

// first-macro.min.js, for SugarCube 2, by Chapel
// v1.1.1, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;Macro.add("first",{skipArgs:!0,tags:["then","finally"],handler:function(){var a,t=$(document.createElement("span")),n=this.payload[this.payload.length-1],s=visited()-1;a=s<this.payload.length?this.payload[s].contents:"finally"===n.name?n.contents:"",t.wiki(a).addClass("macro-"+this.name).appendTo(this.output)}});
// end first-macro.min.js


// message-macro.min.js, for SugarCube 2, by Chapel
// v1.0.1, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;setup.messageMacro={},setup.messageMacro.default="Help",Macro.add("message",{tags:null,handler:function(){var e=this.payload[0].contents,a=$(document.createElement("span")),s=$(document.createElement(this.args.includes("btn")?"button":"a")),t=$(document.createElement("span"));s.wiki(this.args.length>0&&"btn"!==this.args[0]?this.args[0]:setup.messageMacro.default).ariaClick(this.createShadowWrapper((function(){a.hasClass("open")?t.css("display","none").empty():t.css("display","block").wiki(e),a.toggleClass("open")}))),a.attr("id","macro-"+this.name+"-"+this.args.join("").replace(/[^A-Za-z0-9]/g,"")).addClass("message-text").append(s).append(t).appendTo(this.output)}});
// end message-macro.min.js

// notify.min.js, for SugarCube 2, by Chapel
// v1.1.1, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;!function(){var s=/\d+m?s$/;function a(s,a,e){"string"==typeof s&&("number"!=typeof a&&(a=!1),$(document).trigger({type:":notify",message:s,delay:a,class:e||""}))}$(document.body).append("<div id='notify'></div>"),$(document).on(":notify",(function(s){s.message&&"string"==typeof s.message&&(s.message.trim(),s.class?"string"==typeof s.class?s.class="open macro-notify "+s.class:Array.isArray(s.class)?s.class="open macro-notify "+s.class.join(" "):s.class="open macro-notify":s.class="open macro-notify",s.delay?("number"!=typeof s.delay&&(s.delay=Number(s.delay)),Number.isNaN(s.delay)&&(s.delay=2e3)):s.delay=2e3,$("#notify").empty().wiki(s.message).addClass(s.class),setTimeout((function(){$("#notify").removeClass()}),s.delay))})),Macro.add("notify",{tags:null,handler:function(){var e=this.payload[0].contents,t=!1,i=!1;if(this.args.length>0){var n=s.test(this.args[0]);"number"==typeof this.args[0]||n?(t=n?Util.fromCssTime(this.args[0]):this.args[0],i=this.args.length>1&&this.args.slice(1).flat(1/0)):i=this.args.flat(1/0).join(" ")}a(e,t,i)}}),setup.notify=a}();
// end notify.min.js

// operations.min.js, for SugarCube 2, by Chapel
// v1.1.0, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;!function(){"use strict";var e=e||{},r=!0,t=!0,n=[0,100];function o(e,r){var t,n=[],o=0,i=1;if("string"==typeof e)n=e.split("d");else if("number"==typeof e&&r)n=[e,r];else{if(!(Array.isArray(e)&&e.length>=2))throw new TypeError("dice(): could not process arguments...");e.length=2,n=e}if(n[0]=Number(n[0]),"string"==typeof n[1]&&"F"===n[1].trim().toUpperCase()?(n[1]=3,i=-1):n[1]=Number(n[1]),n.some((function(e){return Number.isNaN(e)})))throw new TypeError("dice(): could not process arguments...");for(t=0;t<n[0];t++){o+=Math.floor(State.random()*n[1])+i}return o}function i(e,r){if("string"==typeof e){var t=[(n=e.trim().replace(/\s/g,"").match(/(\d+[d][\df]\d*)(.*)/i))[1],Number(n[2])];return o(t[0])+t[1]}return o(e,r);var n}e.dice={roll:i},r&&(window.dice=window.dice||i),Number.prototype.dice||Object.defineProperty(Number.prototype,"dice",{configurable:!0,writable:!0,value:function(e){if(0===this)return 0;if(this<0)throw new TypeError("Number.prototype.dice: cannot roll a negative number of dice!");if(("string"!=typeof e||"F"!==e.trim().toUpperCase())&&(null==e||"number"!=typeof e||e<=0||!Number.isInteger(e)))throw new TypeError("Number.prototype.dice: error in argument");if(!Number.isInteger(this))throw new TypeError("Number.prototype.dice: cannot roll partial dice!");return i(this,e)}}),Number.prototype.fairmath||Object.defineProperty(Number.prototype,"fairmath",{configurable:!0,writable:!0,value:function(e){var r=n;if(this<r[0]||this>r[1])throw new TypeError("Number.prototype.fairmath called on a number that is out of the defined range (the number was "+this+").");if(null==e||"number"!=typeof e||e>100||e<-100||arguments.length<1)throw new TypeError("Number.prototype.fairmath given incorrect argument or an argument that is out of the valid 0-100 range.");if(0===e)return Math.clamp(Math.trunc(this),r[0],r[1]);if(e<0)return e*=-1,Math.clamp(Math.trunc(this-(this-r[0])*(e/r[1])),r[0],r[1]);if(e>0)return Math.clamp(Math.trunc(this+(r[1]-this)*(e/r[1])),r[0],r[1]);throw new Error("Number.prototype.fairmath encountered an unspecified error.")}}),Number.prototype.between||Object.defineProperty(Number.prototype,"between",{configurable:!0,writable:!0,value:function(e,r){if("number"!=typeof e||"number"!=typeof r)throw new TypeError("Number.between() -> both values must be numbers");var t=Number(this);if(e===r)return t===e;if(r<e){var n=r;r=e,e=n}return t>=e&&t<=r}}),Math.fairmath||Object.defineProperty(Math,"fairmath",{configurable:!0,writable:!0,value:function(e,r){return e.fairmath(r)}}),Math.between||Object.defineProperty(Math,"between",{configurable:!0,writable:!0,value:function(e,r,t){return e.between(r,t)}}),t&&(Math.fm||Object.defineProperty(Math,"fm",{configurable:!0,writable:!0,value:function(e,r){return e.fairmath(r)}}),Number.prototype.fm||Object.defineProperty(Number.prototype,"fm",{configurable:!0,writable:!0,value:function(e){return this.fairmath(e)}}),Number.prototype.d||Object.defineProperty(Number.prototype,"d",{configurable:!0,writable:!0,value:function(e){return this.dice(e)}}))}();
// end operations.min.js

// playtime.min.js, for SugarCube 2, by Chapel
// v2.1.0, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;!function(){"use strict";var e=!0,t="playtime",a="pausetimer";function n(){return Date.now()-State.variables[t]}function r(e){if(e&&!(e<0)&&"number"==typeof e){var t=[];return t.push(Math.floor(e/1e3)%60),t.push(Math.floor(e/6e4)%60),t.push(Math.floor(e/36e5)),t}}State.variables[t]=Date.now(),predisplay["start-playtime"]=function(e){delete predisplay[e],State.variables[t]||(State.variables[t]=Date.now())},prehistory["pause-playtime"]=function(e){tags().includes(a)&&(State.variables[t]+=time())};var i=["h","hr","hrs","hour","hours"],s=["m","min","mins","minute","minutes"],u=["s","sec","secs","second","seconds"];function o(e){return function(e,t){if(e&&Array.isArray(e)&&!(e.length<3)){var a=e[2]<10?"0"+e[2]:""+e[2],n=e[1]<10?"0"+e[1]:""+e[1],r=e[0]<10?"0"+e[0]:""+e[0];return t?"<b>"+a+":"+n+"</b>:"+r:a+":"+n+":"+r}}(r(n()),e)}setup.playTime=function(e){return"string"==typeof e?function(e){var t=n(),a=r(t);return i.includes(e)?a[2]:s.includes(e)?a[1]:u.includes(e)?a[0]:t}(e):o(e)},e&&(window.playTime=window.playTime||setup.playTime),Macro.add("playtime",{handler:function(){var e=this.args.map((function(e){return String(e).trim().toLowerCase()})),t=$(document.createElement("span")),a=o(e.includesAny(["format","f","fmt","b","bold","true"]));t.wiki(a).addClass("macro-"+this.name).appendTo(this.output)}})}();
// end playtime.min.js

// cycles.min.js, for SugarCube 2, by Chapel
// v2.1.1, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;!function(){"use strict";var e="%%cycles",t=!0,r="cycles.pause",i="cycles.pause.menu",s="cycles.postdisplay";function n(){return State.variables[e]}function a(e,t){if(!(this instanceof a))return new a(e,t);if(!e||"object"!=typeof e)throw new Error("Cycle() -> invalid definition object");if(!e.name||"string"!=typeof e.name||!e.name.trim())throw new Error("Cycle() -> invalid name");if(this.name=e.name,!e.phases||!Array.isArray(e.phases)||e.phases.length<2)throw new Error("Cycle() -> phases should be an array of at least two strings");if(!e.phases.every((function(e){return e&&"string"==typeof e&&e.trim()})))throw new Error("Cycle() -> each phase should be a valid, non-empty string");this.phases=clone(e.phases),e.period=Number(e.period),(Number.isNaN(e.period)||e.period<1)&&(e.period=1),Number.isInteger(e.period)||(e.period=Math.trunc(e.period)),this.period=e.period,e.increment=Number(e.increment),(Number.isNaN(e.increment)||e.increment<1)&&(e.increment=1),Number.isInteger(e.increment)||(e.increment=Math.trunc(e.increment)),this.increment=e.increment,this.active=void 0===e.active||!!e.active,t=Number(t),(Number.isNaN(t)||t<0)&&(t=0),Number.isInteger(t)||(t=Math.trunc(t)),this.stack=t}State.variables[e]={},Object.assign(a,{is:function(e){return e instanceof a},add:function(e,t){if(!t||"object"!=typeof t)throw new Error("Cycle.add() -> invalid definition object");if(e&&"string"==typeof e&&e.trim())t.name=e;else if(!t.name||"string"!=typeof t.name||!t.name.trim())throw new Error("Cycle.add() -> invalid name");var r=new a(t,0);return n()[t.name]=r,r},has:function(e){var t=n();return t.hasOwnProperty(e)&&a.is(t[e])},get:function(e){return a.has(e)?n()[e]:null},del:function(e){return!!a.has(e)&&(delete n()[e],!0)},check:function(e){if(a.has(e)){var t=[].slice.call(arguments).flat(1/0).slice(1);return a.get(e).check(t)}},clear:function(e){n()},_emit:function(e,t){$(document).trigger({type:":cycle-"+t,cycle:e})},_retrieveCycles:n}),Object.assign(a.prototype,{constructor:a,revive:function(){var e={};return Object.keys(this).forEach((function(t){e[t]=clone(this[t])}),this),e},clone:function(){return new a(this.revive(),this.stack)},toJSON:function(){return JSON.reviveWrapper("new setup.Cycle("+JSON.stringify(this.revive())+", "+this.stack+")")},current:function(){return this.phases[Math.trunc(this.stack/this.period)%this.phases.length]},length:function(){return this.period*this.phases.length},turns:function(){return this.period/this.increment},turnsTotal:function(){return this.length()/this.increment},update:function(e){e=Number(e),Number.isNaN(e)&&(e=this.increment);var t=this.current();return this.stack+=e,this.stack<0&&(this.stack=0),Number.isInteger(this.stack)||(this.stack=Math.trunc(this.stack)),t!==this.current()&&a._emit(this,"change"),this},reset:function(){return this.stack=0,a._emit(this,"reset"),this.update(0)},suspend:function(){var e=this.active;return this.active=!1,e!==this.active&&a._emit(this,"suspend"),this},resume:function(){var e=this.active;return this.active=!0,e!==this.active&&a._emit(this,"resume"),this},toggle:function(){return this.active?this.suspend():this.resume(),this},isSuspended:function(){return!this.active},editIncrement:function(e){return e=Number(e),(!Number.isNaN(e)||e>0)&&(Number.isInteger(e)||(e=Math.trunc(e)),this.increment=e),this.increment},check:function(){var e=[].slice.call(arguments).flat(1/0);return e.includes(this.current())}}),postdisplay[s]=function(){var e;tags().includes(r)||e?e=!1:tags().includes(i)?e=!0:Object.keys(n()).forEach((function(e){var t=a.get(e);t.active&&t.update()}))},setup.Cycle=a,t&&(window.Cycle=window.Cycle||a),Macro.add("newcycle",{tags:["phase"],handler:function(){if(this.args.length<1)return this.error("A cycle must at least be given a name.");if(this.payload.length<2)return this.error("A cycle must be given at least two phases.");var e=this.payload.slice(1).map((function(e){return function(e){if(e.args.length<1)return null;var t=e.args.flat(1/0);return t.every((function(e){return"string"==typeof e}))?t:null}(e)})).flat(1/0);if(e.includes(null))return this.error("Each `<<phase>>` tag must be given a valid name.");try{a.add(this.args[0],{phases:e,period:this.args[1],increment:this.args[2],active:this.args[3]&&"string"==typeof this.args[3]&&"suspend"!==this.args[3].trim()})}catch(e){var t=e.message&&e.message.split("->")[1];return t=!!t&&t.trim(),this.error(t||e.message)}}}),Macro.add("editcycle",{handler:function(){if(this.args.length<1||"string"!=typeof this.args[0]||!this.args[0].trim())return this.error("You must name the cycle you wish to act on.");if(this.args.length<2)return this.error("You must provide an action to perform.");var e=a.get(this.args[0]);if(null===e)return this.error('Cannot find a cycle named "'+this.args[0]+'".');if(this.args.includes("suspend")?e.suspend():this.args.includes("toggle")?e.toggle():this.args.includes("resume")&&e.resume(),this.args.includes("increment")){var t=this.args[this.args.indexOf("increment")+1];"number"==typeof t&&e.editIncrement(t)}if(this.args.includesAny("reset","clear")&&e.reset(),this.args.includes("change")){var r=this.args[this.args.indexOf("change")+1];r=Number(r),!Number.isNaN(r)&&Number.isInteger(r)&&e.update(r)}}}),Macro.add("showcycle",{handler:function(){if(this.args.length<1||"string"!=typeof this.args[0]||!this.args[0].trim())return this.error("You must name the cycle you wish to act on.");var e=a.get(this.args[0]);if(null===e)return this.error('Cannot find a cycle named "'+this.args[0]+'".');var t=e.current();this.args.includes("uppercase")?t=t.toUpperCase():this.args.includes("lowercase")?t=t.toLowerCase():this.args.includes("upperfirst")&&(t=t.toUpperFirst()),$(document.createElement("span")).addClass("macro-"+this.name).append(t).appendTo(this.output)}})}();
// end cycles.min.js

// type-sim.min.js, for SugarCube 2, by Chapel
// v2.0.0, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;!function(){"use strict";Macro.add("typesim",{tags:null,handler:function(){if(!this.args.length||!this.args[0]||"string"!=typeof this.args[0])return this.error("no text to type out was provided");var t,e=$(document.createElement("span")).addClass("macro"+this.name),n=$(document.createElement("div"));this.payload[0].contents&&this.payload[0].contents.trim()&&(t=this.payload[0].contents),function(t,e,n){if(t&&"string"==typeof t){!e||e instanceof $||(e=$(e));var i=0,s=t.split(""),a=[],o=$(document.createElement("textarea")).addClass("type-sim").on("input.type-sim",(function(){var e=$(this);i=a.push(s[i]),e.val(a.join("")),t.length===a.length&&(e.off("input.type-sim").ariaDisabled(!0),n&&"function"==typeof n&&n(a.join("")),$(document).trigger({type:":type-sim-end",message:a.join("")}))}));e&&e[0]&&e.append(o)}}(this.args[0],e,(function(){n.wiki(t)})),e.append(n).appendTo($(this.output))}})}();
// end type-sim.min.js

// pronouns.min.js, for SugarCube 2, by Chapel
// v1.1.0, 2024-07-22, 336675ff2cabe5f729a5f30d86aa409cc8432726
;!function(){"use strict";if(Template&&Template.add&&"function"==typeof Template.add){var e={name:"gender",showSetting:!0,label:"Gender",desc:"",storyVar:"%%gender",default:"female"},t="#setting-control-"+e.name,r={subjective:["she","he","they"],objective:["her","him","them"],possessive:["hers","his","theirs"],determiner:["her","his","their"],reflexive:["herself","himself","themself"],noun:["woman","man","person"]};e.showSetting&&(Setting.addToggle(e.name,{label:e.label,desc:e.desc&&"string"==typeof e.desc&&e.desc.trim()?e.desc.trim():void 0}),$(document).on(":dialogopen :dialogopened",(function(){$("#ui-dialog-body").hasClass("settings")&&$(t).parent("div").empty().append($(document.createElement("button")).append("Configure...").ariaClick((function(){h()})))})));var a=/^is$/i,n=/^was$/i,s=/^has$/i,i=/oes$/i,o=/^[dl]ies$/i,l=/ies$/i,u=/sses$/i,c=/hes$/i,d=/s$/i,p=/they/i;Template.add(["he","she","they","He","She","They"],(function(){return S(this.name,g().subjective)})),Template.add(["him","her","them","Him","Her","Them"],(function(){return S(this.name,g().objective)})),Template.add(["his","hers","theirs","His","Hers","Theirs"],(function(){return S(this.name,g().possessive)})),Template.add(["his_","her_","their","His_","Her_","Their"],(function(){return S(this.name,g().determiner)})),Template.add(["himself","herself","themself","Himself","Herself","Themself"],(function(){return S(this.name,g().reflexive)})),Template.add(["man","woman","person","Man","Woman","Person"],(function(){return S(this.name,g().noun)})),Template.add(["he-s","she-s","they-re","He-s","She-s","They-re"],(function(){return S(this.name,g().subjective+T("&apos;s","&apos;re",y()))})),Macro.add("pronouns",{skipArgs:!0,handler:function(){h()}}),Macro.add("verb",{handler:function(){var e=y();if(this.args.length<1)return this.error("Please pass at least a singular third person pronoun to this macro.");this.args.includes("plural")&&(e=!0),this.output.append(T(String(this.args[0]),this.args[1]?String(this.args[1]):null,!!e))}}),setup.gender={pronouns:g,setPronouns:function(t){return"string"==typeof t?v(t):"object"==typeof t?function(t){if("object"==typeof t)return State.variables[e.storyVar]=v("male"===e.default?1:0),Object.assign(State.variables[e.storyVar],t)}(t):void 0},dialog:h,pluralize:b},window.gender=window.gender||setup.gender}else alert("Warning, this version of SugarCube does not include the Template API. Please upgrade to v2.29.0 or higher.");function m(){var t=$(document.createElement("div"));var a=Object.keys(r).map((function(t){var a=2;"male"===e.default?a=1:"female"===e.default&&(a=0);var n=State.variables,s=r[t][a];return n[e.storyVar]&&n[e.storyVar][t]&&(s=n[e.storyVar][t]),function(e,t,r){return $(document.createElement("label")).append(e).css("display","block").append($(document.createElement("input")).attr({type:"text",name:t}).css({float:"right","margin-left":"0.2em"}).val(r))}(t.toUpperFirst()+": ","gender-"+t,s)})),n=function(e,t,r){var a=$(document.createElement("select")).attr("name",t).css("float","right");return r.forEach((function(e,t){console.log(t),$(document.createElement("option")).attr("value",String(t)).append(e).appendTo(a)})),$(document.createElement("label")).css("display","block").append(e,a)}("Presets: ","gender-preset",["She/Her","He/Him","They/Them"]).on("change",(function(){var e=Number($(this).find("select").val());Number.isNaN(e)||a.forEach((function(t){var a=t.find("input"),n=a.attr("name").split("-")[1];a.val(r[n][e])}))})),s=n.find("select");State.variables[e.storyVar]?s.val(""):"male"===e.default?s.val("1"):"female"===e.default?s.val("0"):s.val("2");var i,o=$(document.createElement("button")).wiki("Confirm").addClass("gender-confirm").ariaClick({label:"Confirm pronoun selection."},(function(){var t=State.variables;t[e.storyVar]={},a.forEach((function(r){var a=r.find("input"),n=a.attr("name").split("-")[1];t[e.storyVar][n]=a.val().trim().toLowerCase()})),$("#ui-dialog-body").hasClass("reopen")&&UI.settings(),Dialog.close()})),l=(i=[n,"<br>"],a.forEach((function(e){i.push(e),i.push("<br>")})),i.push(o),i);return t.append(l)}function h(){var e,t,r,a;e="Customize Gender",t=m(),r="custom-gender",a=!1,Dialog.isOpen()&&$("#ui-dialog-body").hasClass("settings")&&(a=!0),Dialog.close(),Dialog.setup(e,a?r+" reopen":r),Dialog.append(t),Dialog.open()}function f(e){("number"!=typeof e||Number.isNaN(e)||e>2||e<0)&&(e=0);var t={};return Object.keys(r).forEach((function(a){t[a]=r[a][e]})),t}function g(){return State.variables[e.storyVar]&&State.variables[e.storyVar].subjective?State.variables[e.storyVar]:f("male"===e.default?1:0)}function v(t){var r;switch(t){case"female":r=f(0);break;case"male":r=f(1);break;default:r=f(2)}return State.variables[e.storyVar]=clone(r),r}function b(e){return e&&"string"==typeof e?(e=e.trim(),a.test(e)?e.replace(a,"are"):n.test(e)?e.replace(n,"were"):s.test(e)?e.replace(s,"have"):i.test(e)?e.replace(i,"o"):o.test(e)?e.replace(l,"ie"):l.test(e)?e.replace(l,"y"):u.test(e)?e.replace(u,"ss"):c.test(e)?e.replace(c,"h"):d.test(e)?e.replace(d,""):e):e}function y(){return p.test(g().subjective.trim())}function T(e,t,r){return r?t&&"string"==typeof t?t:b(e):e}function S(e,t){return e.first()===e.first().toUpperCase()?t.toUpperFirst():t}}();
// end pronouns.min.js


/// Journal Sys
(function journalMacros() {
    /**
     <<journaladd "Santa Claus" "characters">>Lives on North Pole (this is journal entry content)<</journaladd>>
     <<journaladd "Santa Claus" "characters">>Has 4 reindeers<</journaladd>>
     <<journaldisplay "Santa Claus" "characters">>Gift giver (this serves as optional title)<</journaldisplay>>
     // renders all entries in order they were entered

     <<journalreplace "Santa Claus" "characters">>Doesn't exist!!!<</journalreplace>>
     <<journaldisplay "Santa Claus" "characters">><</journaldisplay>>
     // Will show only one entry

     <<journalreplace "Santa Claus" "characters" true>>(Nothing will be shown when journaldisplay called)<</journalreplace>>
     Note that you need to have exactly 3 arguments for this to work

     All arguments are optional and defaults to empty strings
     <<journaladd "Santa Claus">>Have all journal entries in one place<</journaladd>>
     <<journalreplace "Santa Claus" "">><</journalreplace>>

     Entries content gets rendered when <<journaldisplay>> is used, not when they are added:
     <<set $melike = "pies">>
     <<journaladd>>I like $melike!<</journaladd>>
     <<set $melike = "ice cream">>
     <<journaldisplay>>Me<</journaldisplay>>

     Internally, all entries are stored in `State.variables.journal`.
     */
    'use strict';

    /* globals version, State, Macro */

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error('<<journal*>> macros family requires SugarCube 2.0 or greater, aborting load');
    }

    if (!State.variables.journal) {
        State.variables.journal = {};
    }

    function ensureNameType(args) {
        let name = args[0] || '';
        let type = args[1] || '';

        if (name.startsWith('$')) {
            name = State.variables.journal[name.slice(1)];
        }

        if (type.startsWith('$')) {
            type = State.variables.journal[type.slice(1)];
        }

        if (!State.variables.journal[type]) {
            State.variables.journal[type] = {};
        }

        return {name, type};
    }

    Macro.add('journaladd', {
        tags: null,
        handler () {
            const {name, type} = ensureNameType(this.args);
            const entry = this.payload[0].contents.trim();

            if (!State.variables.journal[type][name]) {
                State.variables.journal[type][name] = [];
            }

            State.variables.journal[type][name].push(entry);
        },
    });

    Macro.add('journalreplace', {
        tags: null,
        handler () {
            const {name, type} = ensureNameType(this.args);

            if (this.args.length === 3 && this.args[2] === true) {
                State.variables.journal[type][name] = [];
            } else {
                State.variables.journal[type][name] = [this.payload[0].contents];
            }
        },
    });

    function getTitle(payload) {
        return payload[0].contents || '';
    }

    function renderJournalSection(title, entries) {
        const ul = jQuery('<ul class="journalEntries"></ul>');
        entries.forEach((entry) => jQuery('<li></li>').wiki(entry).appendTo(ul));
        jQuery(`<header class="journalHeader">${title}</header>`).insertBefore(ul);
        return ul;
    }

    Macro.add('journaldisplay', {
        tags: null,
        handler () {
            const {name, type} = ensureNameType(this.args);

            const title = getTitle(this.payload);
            const entries = State.variables.journal[type][name];

            if (entries && entries.length) {
                const out = renderJournalSection(title, entries);
                out.appendTo(this.output);
            }
        },
    });
}());
//// Journal Sys End



/// TEXT WHEEL
// Made by SjoerdHekking with too much help from Gwen
// SETUP
setup.circle = {
    msg: "Error".split(""),
    size: 14,
    circleY: 1,
    circleX: 1,
    letter_spacing: 5,
    diameter: 22,
    rotation: 0.2,
    speed: 0.5,
    currStep: 20,
    y: [],
    x: [],
    Y: [],
    X: [],
    circleInitnopy: false,
    circleFirstDiv: document.createElement("div"),
    circleSecondDiv: document.createElement("div"),
    circleMouse: function (e) {
      e = e || window.event;
      setup.circle.ymouse = !isNaN(e.pageY) ? e.pageY : e.clientY; // setup.circle.y-position
      setup.circle.xmouse = !isNaN(e.pageX) ? e.pageX : e.clientX; // setup.circle.x-position
    },
    makeCircle: function () { // rotation/positioning
      if (setup.circle.circleInitnopy) {
        setup.circle.circleFirstDiv.style.top = document.body.scrollTop + "px";
        setup.circle.circleFirstDiv.style.left = document.body.scrollLeft + "px";
      }
      setup.circle.currStep -= setup.circle.rotation;
      for (let i = setup.circle.n; i > -1; --i) { // makes the circle
        let d = document.getElementById("iemsg" + i).style;
        d.top = Math.round(setup.circle.y[i] + setup.circle.a * Math.sin((setup.circle.currStep + i) / setup.circle.letter_spacing) * setup.circle.circleY - 15) + "px";
        d.left = Math.round(setup.circle.x[i] + setup.circle.a * Math.cos((setup.circle.currStep + i) / setup.circle.letter_spacing) * setup.circle.circleX) + "px";
      }
    },
    circleDrag: function () { // makes the resistance
      setup.circle.y[0] = setup.circle.Y[0] += (setup.circle.ymouse - setup.circle.Y[0]) * setup.circle.speed;
      setup.circle.x[0] = setup.circle.X[0] += (setup.circle.xmouse - 20 - setup.circle.X[0]) * setup.circle.speed;
      for (let i = setup.circle.n; i > 0; --i) {
        setup.circle.y[i] = setup.circle.Y[i] += (setup.circle.y[i - 1] - setup.circle.Y[i]) * setup.circle.speed;
        setup.circle.x[i] = setup.circle.X[i] += (setup.circle.x[i - 1] - setup.circle.X[i]) * setup.circle.speed;
      }
      setup.circle.makeCircle();
    },
    circleInit: function () { // appends message divs, & sets initial values for positioning arrays
      setup.circle.n = setup.circle.msg.length - 1;
      setup.circle.a = Math.round(setup.circle.size * setup.circle.diameter * 0.20);
      setup.circle.ymouse = setup.circle.a * setup.circle.circleY + 20;
      setup.circle.xmouse = setup.circle.a * setup.circle.circleX + 20;
      setup.circle.circleFirstDiv.id = "outerCircleText";
      setup.circle.circleFirstDiv.style.fontSize = setup.circle.size + "px";
      if (!isNaN(window.pageYOffset)) {
        setup.circle.ymouse += window.pageYOffset;
        setup.circle.xmouse += window.pageXOffset;
      }
      else
        setup.circle.circleInitnopy = true;
      for (let i = setup.circle.n; i > -1; --i) {
        let d = document.createElement("div");
        d.id = "iemsg" + i;
        d.style.height = setup.circle.a + "px";
        d.style.width = setup.circle.a + "px";
        d.appendChild(document.createTextNode(setup.circle.msg[i]));
        setup.circle.circleSecondDiv.appendChild(d); setup.circle.y[i] = setup.circle.x[i] = setup.circle.Y[i] = setup.circle.X[i] = 0;
      }
      setup.circle.circleFirstDiv.appendChild(setup.circle.circleSecondDiv);
      document.body.appendChild(setup.circle.circleFirstDiv);
      setInterval(setup.circle.circleDrag, 25);
    },
    circleAscroll: function () {
      setup.circle.ymouse += window.pageYOffset;
      setup.circle.xmouse += window.pageXOffset;
      window.removeEventListener("scroll", setup.circle.circleAscroll, false);
    }
};
  
// MACRO

Macro.add("wordwheel", {
	tags: ["fontSize", "fontsize", "circleSize", "circlesize"],
	handler: function () {
		let errorArray = [];
		if (!window.addEventListener && !window.attachEvent && !document.createElement) {errorArray.push("Unable to either add EvenListener, AttachEvent or createElement")}; 
		if(this.args.length <= 0)
			return this.error("First argument cannot be skipped, please insert a string via <<wordwheel \"Text here.\">>.");
		if(this.args[0] === "")
			return this.error("First argument cannot be an empty string.");
		if(this.args[0].length > 31)
			return this.error("Word wheel doesn't accept more than 50 characters.");
		
		setup.circle.msg = this.args[0].split("");


		for (const pay of this.payload) {
			switch (pay.name.toLowerCase()) {
			case "fontsize":
				if (pay.args[0] > 30)
					errorArray.push("Font size cannot be bigger than 30.");
				if (pay.args[0] < 4)
					errorArray.push("Font size cannot be negative nor below 4.");
			
				setup.circle.size = pay.args[0];
			break;
			case "circlesize":
				if (pay.args[0] > 70)
					errorArray.push("Circle size cannot be above 70.");
				if (pay.args[0] < 20)
					errorArray.push("Circle size cannot be below 20");

				setup.circle.diameter = pay.args[0];
			break;
			}
		}

		if (errorArray.length > 0)
			return this.error(errorArray.join("\n"));

		else if (window.addEventListener) {
			setup.circle.circleInit();
			document.addEventListener("mouseover", setup.circle.circleMouse, false);
			document.addEventListener("mousemove", setup.circle.circleMouse, false);
			if (/Apple/.test(navigator.vendor))
			window.addEventListener("scroll", setup.circle.circleAscroll, false);
		}
		else if (window.attachEvent) {
			// window.attachEvent("onload", setup.circle.circleInit);
			document.attachEvent("onmousemove", setup.circle.circleMouse);
		}
	}
});
//
