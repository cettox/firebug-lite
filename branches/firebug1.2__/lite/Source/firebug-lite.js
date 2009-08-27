/**
 * firebug lite <http://www.getfirebug.com/lite.html>
 * Developer: Azer Koçulu <http://azer.kodfabrik.com>
 */
var firebug = {
	version:[1.21,200808],
	el:{}, env:{ "cache":{}, "ctmp":[], "dIndex":"console", "height":295, "init":false, "minimized":false, "ml":false, "objCn":[] },
	init:function(_css){
		with(firebug){
			
			if(env.init)
				return;
			
			document.getElementsByTagName("head")[0].appendChild(
				new pi.element("link").attribute.set("rel","stylesheet").attribute.set("href",firebug.env.css||"http://getfirebug.com/releases/lite/1.2/firebug-lite.css").element
			);

			/* 
			 * main interface
			 */
			el.content = {};
			el.main = new pi.element("DIV").attribute.set("id","Firebug").environment.addStyle({ "display":"none", "width":pi.util.GetViewport().width+"px" }).insert(document.body);
			
			el.resizer = new pi.element("DIV").attribute.addClass("Resizer").event.addListener("mousedown",win.resizer.start).insert(el.main);
			
			el.header = new pi.element("DIV").attribute.addClass("Header").insert(el.main);
			el.left = {};
			el.left.container = new pi.element("DIV").attribute.addClass("Left").insert(el.main);
			el.right = {};
			el.right.container = new pi.element("DIV").attribute.addClass("Right").insert(el.main);
			el.main.child.add(new pi.element("DIV").environment.addStyle({ "clear":"both" }));
			
			/*
			 * buttons
			 */
			el.button = {};
			el.button.container = new pi.element("DIV").attribute.addClass("ButtonContainer").insert(el.header);
			el.button.logo = new pi.element("A").attribute.set("title","Firebug Lite").attribute.set("target","_blank").attribute.set("href","http://getfirebug.com/lite.html").update("&nbsp;").attribute.addClass("Button Logo").insert(el.button.container);
			el.button.inspect = new pi.element("A").attribute.addClass("Button").event.addListener("click",d.inspector.toggle).update("Inspect").insert(el.button.container);
			el.button.maximize = new pi.element("A").attribute.addClass("Button Maximize").event.addListener("click",win.maximize).insert(el.button.container);
			el.button.minimize = new pi.element("A").attribute.addClass("Button Minimize").event.addListener("click",win.minimize).insert(el.button.container);
			el.button.close = new pi.element("A").attribute.addClass("Button Close").event.addListener("click",win.close).insert(el.button.container);;
			
			if(pi.env.ie||pi.env.webkit){
				el.button.container.environment.addStyle({ "paddingTop":"12px" });
			}
			
			/*
			 * navigation
			 */
			el.nav = {};
			el.nav.container = new pi.element("DIV").attribute.addClass("Nav").insert(el.left.container);
			el.nav.console = new pi.element("A").attribute.addClass("Tab Selected").event.addListener("click",pi.util.Curry(d.navigate,window,"console")).update("Console").insert(el.nav.container);
			el.nav.html = new pi.element("A").attribute.addClass("Tab").update("HTML").event.addListener("click",pi.util.Curry(d.navigate,window,"html")).insert(el.nav.container);
			el.nav.css = new pi.element("A").attribute.addClass("Tab").update("CSS").event.addListener("click",pi.util.Curry(d.navigate,window,"css")).insert(el.nav.container);
			el.nav.scripts = new pi.element("A").attribute.addClass("Tab").update("Script").event.addListener("click",pi.util.Curry(d.navigate,window,"scripts")).insert(el.nav.container);
			el.nav.dom = new pi.element("A").attribute.addClass("Tab").update("DOM").event.addListener("click",pi.util.Curry(d.navigate,window,"dom")).insert(el.nav.container);
			el.nav.xhr = new pi.element("A").attribute.addClass("Tab").update("XHR").event.addListener("click",pi.util.Curry(d.navigate,window,"xhr")).insert(el.nav.container);
			
			/*
			 * inspector
			 */
			
			el.borderInspector = new pi.element("DIV").attribute.set("id","FirebugBorderInspector").event.addListener("click",listen.inspector).insert(document.body);
			el.bgInspector = new pi.element("DIV").attribute.set("id","FirebugBGInspector").insert(document.body);
			
			/*
			 * console
			 */
			el.left.console = {};
			el.left.console.container = new pi.element("DIV").attribute.addClass("Console").insert(el.left.container);
			el.left.console.mlButton = new pi.element("A").attribute.addClass("MLButton").event.addListener("click",d.console.toggleML).insert(el.left.console.container);
			el.left.console.monitor = new pi.element("DIV").insert(
				new pi.element("DIV").attribute.addClass("Monitor").insert(el.left.console.container)
			);
			el.left.console.container.child.add(
				new pi.element("DIV").attribute.addClass("InputArrow").update(">>>")
			);
			el.left.console.input = new pi.element("INPUT").attribute.set("type","text").attribute.addClass("Input").event.addListener("keydown",listen.consoleTextbox).insert(
				new pi.element("DIV").attribute.addClass("InputContainer").insert(el.left.console.container)
			);
			
			el.right.console = {};
			el.right.console.container = new pi.element("DIV").attribute.addClass("Console Container").insert(el.right.container);
			el.right.console.mlButton = new pi.element("A").attribute.addClass("MLButton CloseML").event.addListener("click",d.console.toggleML).insert(el.right.console.container);
			el.right.console.input = new pi.element("TEXTAREA").attribute.addClass("Input").insert(el.right.console.container);
			el.right.console.input.event.addListener("keydown",pi.util.Curry(tab,window,el.right.console.input.element));
			el.right.console.run = new pi.element("A").attribute.addClass("Button").event.addListener("click",listen.runMultiline).update("Run").insert(el.right.console.container);
			
			el.right.console.clear = new pi.element("A").attribute.addClass("Button").event.addListener("click",pi.util.Curry(d.clean,window,el.right.console.input)).update("Clear").insert(el.right.console.container);
			
			el.button.console = {};
			el.button.console.container = new pi.element("DIV").attribute.addClass("ButtonSet").insert(el.button.container);
			el.button.console.clear = new pi.element("A").attribute.addClass("Button").event.addListener("click",d.console.clear).update("Clear").insert(el.button.console.container);
			
			/*
			 * html
			 */
			
			el.left.html = {};
			el.left.html.container = new pi.element("DIV").attribute.addClass("HTML").insert(el.left.container);
			
			el.right.html = {};
			el.right.html.container = new pi.element("DIV").attribute.addClass("HTML Container").insert(el.right.container);
			
			el.right.html.nav = {};
			el.right.html.nav.container = new pi.element("DIV").attribute.addClass("Nav").insert(el.right.html.container);
			el.right.html.nav.computedStyle = new pi.element("A").attribute.addClass("Tab Selected").event.addListener("click",pi.util.Curry(d.html.navigate,firebug,"computedStyle")).update("Computed Style").insert(el.right.html.nav.container);
			el.right.html.nav.dom = new pi.element("A").attribute.addClass("Tab").event.addListener("click",pi.util.Curry(d.html.navigate,firebug,"dom")).update("DOM").insert(el.right.html.nav.container);
			
			el.right.html.content = new pi.element("DIV").attribute.addClass("Content").insert(el.right.html.container);
			
			el.button.html = {};
			el.button.html.container = new pi.element("DIV").attribute.addClass("ButtonSet HTML").insert(el.button.container);
			
			/*
			 * css
			 */
			
			el.left.css = {};
			el.left.css.container = new pi.element("DIV").attribute.addClass("CSS").insert(el.left.container);
			
			el.right.css = {};
			el.right.css.container = new pi.element("DIV").attribute.addClass("CSS Container").insert(el.right.container);
			
			el.right.css.nav = {};
			el.right.css.nav.container = new pi.element("DIV").attribute.addClass("Nav").insert(el.right.css.container);
			el.right.css.nav.runCSS = new pi.element("A").attribute.addClass("Tab Selected").update("Run CSS").insert(el.right.css.nav.container);
	
			el.right.css.mlButton = new pi.element("A").attribute.addClass("MLButton CloseML").event.addListener("click",d.console.toggleML).insert(el.right.css.container);
			el.right.css.input = new pi.element("TEXTAREA").attribute.addClass("Input").insert(el.right.css.container);
			el.right.css.input.event.addListener("keydown",pi.util.Curry(firebug.tab,window,el.right.css.input.element));
			el.right.css.run = new pi.element("A").attribute.addClass("Button").event.addListener("click",listen.runCSS).update("Run").insert(el.right.css.container);
			el.right.css.clear = new pi.element("A").attribute.addClass("Button").event.addListener("click",pi.util.Curry(d.clean,window,el.right.css.input)).update("Clear").insert(el.right.css.container);
			
			el.button.css = {};
			el.button.css.container = new pi.element("DIV").attribute.addClass("ButtonSet CSS").insert(el.button.container);
			el.button.css.selectbox = new pi.element("SELECT").event.addListener("change",listen.cssSelectbox).insert(el.button.css.container);
		
			/*
			 * scripts
			 */
			
			el.left.scripts = {};
			el.left.scripts.container = new pi.element("DIV").attribute.addClass("Scripts").insert(el.left.container);
			
			el.right.scripts = {};
			el.right.scripts.container = new pi.element("DIV").attribute.addClass("Scripts Container").insert(el.right.container);
			
			el.button.scripts = {};
			el.button.scripts.container = new pi.element("DIV").attribute.addClass("ButtonSet Scripts").insert(el.button.container);
			el.button.scripts.selectbox = new pi.element("SELECT").event.addListener("change",listen.scriptsSelectbox).insert(el.button.scripts.container);
			el.button.scripts.lineNumbers = new pi.element("A").attribute.addClass("Button").event.addListener("click",d.scripts.toggleLineNumbers).update("Show Line Numbers").insert(el.button.scripts.container);
			
			/*
			 * dom
			 */
			
			el.left.dom = {};
			el.left.dom.container = new pi.element("DIV").attribute.addClass("DOM").insert(el.left.container);
			
			el.right.dom = {};
			el.right.dom.container = new pi.element("DIV").attribute.addClass("DOM Container").insert(el.right.container);
			
			el.button.dom = {};
			el.button.dom.container = new pi.element("DIV").attribute.addClass("ButtonSet DOM").insert(el.button.container);
			el.button.dom.label = new pi.element("LABEL").update("Object Path:").insert(el.button.dom.container);
			el.button.dom.textbox = new pi.element("INPUT").event.addListener("keydown",listen.domTextbox).update("window").insert(el.button.dom.container);
			
			/*
			 * str
			 */
			el.left.str = {};
			el.left.str.container = new pi.element("DIV").attribute.addClass("STR").insert(el.left.container);
			
			el.right.str = {};
			el.right.str.container = new pi.element("DIV").attribute.addClass("STR").insert(el.left.container);
			
			el.button.str = {};
			el.button.str.container = new pi.element("DIV").attribute.addClass("ButtonSet XHR").insert(el.button.container);
			el.button.str.watch = new pi.element("A").attribute.addClass("Button").event.addListener("click",pi.util.Curry(d.navigate,window,"xhr")).update("Back").insert(el.button.str.container);

			/*
			 * xhr
			 */
			el.left.xhr = {};
			el.left.xhr.container = new pi.element("DIV").attribute.addClass("XHR").insert(el.left.container);
			
			el.right.xhr = {};
			el.right.xhr.container = new pi.element("DIV").attribute.addClass("XHR").insert(el.left.container);
			
			
			el.button.xhr = {};
			el.button.xhr.container = new pi.element("DIV").attribute.addClass("ButtonSet XHR").insert(el.button.container);
			el.button.xhr.label = new pi.element("LABEL").update("XHR Path:").insert(el.button.xhr.container);
			el.button.xhr.textbox = new pi.element("INPUT").event.addListener("keydown",listen.xhrTextbox).insert(el.button.xhr.container);
			el.button.xhr.watch = new pi.element("A").attribute.addClass("Button").event.addListener("click",listen.addXhrObject).update("Watch").insert(el.button.xhr.container);
			
			pi.util.AddEvent(window,"resize",win.refreshSize);
			pi.util.AddEvent(document,"mousemove",listen.mouse)("mousemove",win.resizer.resize)("mouseup",win.resizer.stop)("keydown",listen.keyboard);
			
			env.init = true;
			
			for(var i=0, len=env.ctmp.length; i<len; i++){
				d.console.log.apply(window,env.ctmp[i]);
			};
			
			if(env.height)
				win.setHeight(env.height);
			el.main.environment.addStyle({ "display":"block" });
			
			
			// fix ie6 a:hover bug
			if(pi.env.ie6)
			{
				window.onscroll = pi.util.Curry(win.setVerticalPosition,window,null);
				var buttons = [
					el.button.inspect,
					el.button.close,
					el.button.inspect,
					el.button.console.clear,
					el.right.console.run,
					el.right.console.clear,
					el.right.css.run,
					el.right.css.clear
				];
				for(var i=0, len=buttons.length; i<len; i++)
					buttons[i].attribute.set("href","#");
				win.refreshSize();
				
			}
			//
		}	
	},
	inspect:function(){
		return firebug.d.html.inspect.apply(window,arguments);
	},
	watchXHR:function(){
		with(firebug){
			d.xhr.addObject.apply(window,arguments);
			if(env.dIndex!="xhr"){
				d.navigate("xhr");
			}
		}
	},
	win:{
		close:function(){
			with(firebug){
				el.main.update("");
				el.main.remove();
				pi.util.RemoveEvent(window,"resize",win.refreshSize);
				pi.util.RemoveEvent(document,"mousemove",listen.mouse)("keydown",firebug.listen.keyboard);
				env.init = false;
			}
		},
		minimize:function(){
			with(firebug){
				env.minimized=true;
				el.main.environment.addStyle({ "height":"35px" });
				el.button.maximize.environment.addStyle({ "display":"block" });
				el.button.minimize.environment.addStyle({ "display":"none" });
				win.refreshSize();
			}
		},
		maximize:function(){
			with(firebug){
				env.minimized=false;
				el.button.minimize.environment.addStyle({ "display":"block" });
				el.button.maximize.environment.addStyle({ "display":"none" });
				win.setHeight(env.height);
			}
		},
		resizer:{
			y:[], enabled:false,
			start:function(_event){
				with(firebug){
					if(env.minimized)return;
					win.resizer.y=[el.main.element.offsetHeight,_event.clientY];
					if(pi.env.ie6){
						win.resizer.y[3]=parseInt(el.main.environment.getPosition().top);
					}
					win.resizer.enabled=true;
				}
			},
			resize:function(_event){
				with(firebug){
					if(!win.resizer.enabled)return;
					win.resizer.y[2]=(win.resizer.y[0]+(win.resizer.y[1]-_event.clientY));
					el.main.environment.addStyle({ "height":win.resizer.y[2]+"px" });
					if(pi.env.ie6){
						el.main.environment.addStyle({ "top":win.resizer.y[3]-(win.resizer.y[1]-_event.clientY)+"px" });
					}
				}
			},
			stop:function(_event){
				with(firebug){
					if(win.resizer.enabled){
						win.resizer.enabled=false;
						win.setHeight(win.resizer.y[2]-35);
					}
				}
			}
		},
		setHeight:function(_height){
			with(firebug){
				env.height=_height;
				
				el.left.container.environment.addStyle({ "height":_height+"px" });
				el.right.container.environment.addStyle({ "height":_height+"px" });
				el.main.environment.addStyle({ "height":_height+38+"px" });
				
				win.refreshSize();
				
				// console
				el.left.console.monitor.element.parentNode.style.height=_height-47+"px";
				el.left.console.mlButton.environment.addStyle({ "top":_height+19+"px" });
				el.right.console.mlButton.environment.addStyle({ "top":_height+19+"px" });
				el.right.console.input.environment.addStyle({ "height":_height-29+"px" });
				
				// html
				el.left.html.container.environment.addStyle({"height":_height-23+"px"});
				el.right.html.content.environment.addStyle({"height":_height-23+"px"});
				
				// css
				el.left.css.container.environment.addStyle({"height":_height-33+"px"});
				el.right.css.input.environment.addStyle({ "height":_height-55+"px" });
				
				// script
				el.left.scripts.container.environment.addStyle({"height":_height-23+"px"});
				
				// dom
				el.left.dom.container.environment.addStyle({"height":_height-31+"px"});
				
				// xhr
				el.left.xhr.container.environment.addStyle({"height":_height-32+"px"});
				
				// string
				el.left.str.container.environment.addStyle({"height":_height-32+"px"});
			}
		},
		refreshSize:function(){
			with(firebug){
				if(!env.init)
					return;
					
				var dim = pi.util.GetViewport();
				el.main.environment.addStyle({ "width":dim.width+"px"});
				if(pi.env.ie6)
					win.setVerticalPosition(dim);
			}
		},
		setVerticalPosition:function(_dim,_event){
			with(firebug){
				var dim = _dim||pi.util.GetViewport();
				el.main.environment.addStyle({ "top":dim.height-el.main.environment.getSize().offsetHeight+Math.max(document.documentElement.scrollTop,document.body.scrollTop)+"px" });
			}
		}
	},
	d: {
		clean:function(_element){
			with(firebug){
				_element.update("");
			}
		},
		console:{
			cache:[],
			clear:function(){
				with(firebug){
					d.clean(el.left.console.monitor);
					d.console.cache = [];
				}
			},
			dir:function(_value){
				with(firebug){
					d.console.addLine().attribute.addClass("Arrow").update(">>> console.dir("+_value+")");
					d.dom.open(_value,d.console.addLine());
				}
			},
			addLine:function(){
				with (firebug) {
					return new pi.element("DIV").attribute.addClass("Row").insert(el.left.console.monitor);
				}
			},
			historyIndex:0,
			history:[],
			log:function(_values){
				with (firebug) {
					if(env.init==false){
						env.ctmp.push(arguments);
						return;
					}
					
					var value = "";
					for(var i=0, len=arguments.length; i<len; i++){
						value += (i>0?" ":"")+d.highlight(arguments[i],false,false,true);
					}
					
					d.console.addLine().update(value);
					d.console.scroll();
					
				}
			},
			print: function(_cmd,_text){
				with (firebug){
					d.console.addLine().attribute.addClass("Arrow").update(">>> "+_cmd);
					d.console.addLine().update(d.highlight(_text,false,false,true));
					d.console.scroll();
					d.console.historyIndex = d.console.history.push(_cmd);
				}
			},
			run:function(cmd){
				with(firebug){
					if(cmd.length==0)return;
					el.left.console.input.environment.getElement().value = "";
					try { 
						var result = eval.call(window,cmd);
						d.console.print(cmd,result);
					} catch(e){
						d.console.addLine().attribute.addClass("Arrow").update(">>> "+cmd);
						if(!pi.env.ff){
							d.console.scroll();
							return d.console.addLine().attribute.addClass("Error").update("<strong>Error: </strong>"+(e.description||e),true);
						}
						if(e.fileName==null){
							d.console.addLine().attribute.addClass("Error").update("<strong>Error: </strong>"+e.message,true);
						}
						var fileName = pi.util.Array.getLatest(e.fileName.split("\/"));
						d.console.addLine().attribute.addClass("Error").update("<strong>Error: </strong>"+e.message+" (<em>"+fileName+"</em>,"+e.lineNumber+")",true);
						d.console.scroll();
					}
					d.console.scroll();
				}
			},
			openObject:function(_index){
				with (firebug) {
					d.dom.open(env.objCn[_index], el.left.dom.container, pi.env.ie);
					d.navigate("dom");
				}
			},
			scroll:function(){
				with(firebug){
					el.left.console.monitor.environment.getElement().parentNode.scrollTop = Math.abs(el.left.console.monitor.environment.getSize().offsetHeight-(el.left.console.monitor.element.parentNode.offsetHeight-11));
				}
			},
			toggleML:function(){
				with(firebug){
					var open = !env.ml;
					env.ml = !env.ml;
					d.navigateRightColumn("console",open);
					el[open?"left":"right"].console.mlButton.environment.addStyle({ display:"none" });
					el[!open?"left":"right"].console.mlButton.environment.addStyle({ display:"block" });
					//el.left.console.monitor.environment.addStyle({ "height":(open?233:210)+"px" });
					el.left.console.mlButton.attribute[(open?"add":"remove")+"Class"]("CloseML");
				}
			}
		},
		css:{
			index:-1,
			open:function(_index){
				with (firebug) {
					var item = document.styleSheets[_index];
					var uri = item.href;
					if(uri.indexOf("http:\/\/")>-1&&getDomain(uri)!=document.domain){
						el.left.css.container.update("<em>Access to restricted URI denied</em>");
						return;
					}
					var rules = item[pi.env.ie ? "rules" : "cssRules"], str = "";
					for (var i=0; i<rules.length; i++) {
						var item = rules[i];
						var selector = item.selectorText;
						var cssText = pi.env.ie?item.style.cssText:item.cssText.match(/\{(.*)\}/)[1];
						str+=d.css.printRule(selector, cssText.split(";"), el.left.css.container);
					}
					el.left.css.container.update(str);
				}
			},
			printRule:function(_selector,_css,_layer){
				with(firebug){
					var str = "<div class='Selector'>"+_selector+" {</div>";
					for(var i=0,len=_css.length; i<len; i++){
						var item = _css[i];
						str += "<div class='CSSText'>"+item.replace(/(.+\:)(.+)/,"<span class='CSSProperty'>$1</span><span class='CSSValue'>$2;</span>")+"</div>";
					}
					str+="<div class='Selector'>}</div>";
					return str;
				}
			},
			refresh:function(){
				with(firebug){
					el.button.css.selectbox.update("");
					var collection = document.styleSheets;
					for(var i=0,len=collection.length; i<len; i++){
						var uri = collection[i].href;
						d.css.index=d.css.index<0?i:d.css.index;
						el.button.css.selectbox.child.add(
							new pi.element("OPTION").attribute.set("value",i).update(uri)
						)
					};
					d.css.open(d.css.index);
				}
			}
		},
		dom: {
			open: function(_object,_layer){
				with (firebug) {
					_layer.clean();
					var container = new pi.element("DIV").attribute.addClass("DOMContent").insert(_layer);
					d.dom.print(_object, container);
				}
			},
			print:function(_object,_parent, _inTree){
				with (firebug) {
					var obj = _object || window, parentElement = _parent;
					parentElement.update("");
					
					if(parentElement.opened&&parentElement!=el.left.dom.container){
						parentElement.environment.getParent().pi.child.get()[0].pi.child.get()[0].pi.attribute.removeClass("Opened");
						parentElement.opened = false;
						parentElement.environment.addStyle({ "display":"none" });
						return;
					}
					if(_inTree)
						parentElement.environment.getParent().pi.child.get()[0].pi.child.get()[0].pi.attribute.addClass("Opened");
					parentElement.opened = true;
					
					for (var key in obj) {
						try { 
							var value = obj[key], property = key, container = new pi.element("DIV").attribute.addClass("DOMRow").insert(parentElement),
							left = new pi.element("DIV").attribute.addClass("DOMRowLeft").insert(container), right = new pi.element("DIV").attribute.addClass("DOMRowRight").insert(container);
							
							container.child.add(
								new pi.element("DIV").environment.addStyle({ "clear":"both" })
							);
							
							var link = new pi.element("A").attribute.addClass(
								typeof value=="object"&&Boolean(value)?"Property Object":"Property"
							).update(property).insert(left);
							
							right.update(d.highlight(value,false,true));
							
							var subContainer = new pi.element("DIV").attribute.addClass("DOMRowSubContainer").insert(container);
							
							if(typeof value!="object"||Boolean(value)==false)
								continue;
							
							link.event.addListener("click",pi.util.Curry(d.dom.print,window,value, subContainer, true));
						}catch(e){
						}
					}
					parentElement.environment.addStyle({ "display":"block" });
				}
			}
		},
		highlight:function(_value,_inObject,_inArray,_link){
			with(firebug){
				var isArray = false, isElement = false, vtype=typeof _value, result=[];
				try {
					isArray = pi.util.IsArray(_value);
					isElement = _value!=undefined&&Boolean(_value.nodeName)&&Boolean(_value.nodeType);
				}catch(e){};
				
				// number, string, boolean, null, function pi.util.Array.indexOf(["boolean","function","number","string"],typeof _value)
				if(_value==null||vtype=="number"||vtype=="string"||vtype=="boolean"||vtype=="function"){
					if(_value==null){
						result.push("<span class='Null'>null</span>");
					}else if (vtype=="boolean"||vtype=="number") {
						result.push("<span class='DarkBlue'>" + _value + "</span>");
					} else if(vtype=="function"){
						result.push("<span class='"+(_inObject?"Italic Gray":"Green")+"'>function()</span>");
					} else {
						result.push("<span class='Red'>\""+( !_inObject&&!_inArray?_value : _value.substring(0,35)+(_value.length>35?" ...":"") ).replace(/\n/g,"\\n").replace(/\s/g,"&nbsp;").replace(/>/g,"&#62;").replace(/</g,"&#60;")+"\"</span>");
					}
				}
				else if(isElement){
					if(_value.nodeType==3)
						result.push(d.highlight(_value.nodeValue));
					else if(_inObject){
						result.push("<span class='Gray Italic'>"+_value.nodeName.toLowerCase()+"</span>");
					} else {
						result.push("<span class='Blue"+ ( !_link?"'":" ObjectLink' onmouseover='this.className=this.className.replace(\"ObjectLink\",\"ObjectLinkHover\")' onmouseout='this.className=this.className.replace(\"ObjectLinkHover\",\"ObjectLink\")' onclick='firebug.d.html.inspect(firebug.d.console.cache[" +( d.console.cache.push( _value ) -1 )+"])'" ) + "'>");
						if(_inArray){
							result.push(_value.nodeName.toLowerCase());
							if(_value.getAttribute){
								if(_value.getAttribute&&_value.getAttribute("id"))
									result.push("<span class='DarkBlue'>#"+_value.getAttribute("id")+"</span>");
								var elClass = _value.getAttribute(pi.env.ie?"className":"class")||"";
								result.push(!elClass?"":"<span class='Red'>."+elClass.split(" ")[0]+"</span>");
							}
							result.push("</span>");
						} else {
							result.push("<span class='DarkBlue'>&#60;<span class='Blue TagName'>"+ _value.nodeName.toLowerCase());
							if(_value.attributes){
								for(var i=0,len=_value.attributes.length; i<len; i++){
									var item = _value.attributes[i];
									if(!pi.env.ie||item.nodeValue)
										result.push(" <span class='DarkBlue'>"+item.nodeName+"=\"<span class='Red'>"+item.nodeValue+"</span>\"</span>");
								}
							}
							result.push("</span>&#62;</span>");
						}
					}
				}
				// array & object
				else if(isArray||pi.util.Array.indexOf(["object","array"],typeof _value)>-1){
					if(isArray||_value instanceof Array){
						if(_inObject){
							result.push("<span class='Gray Italic'>["+_value.length+"]</span>");
						} else {
							result.push("<span class='Strong'>[ ");
			
							for(var i=0,len=_value.length; i<len; i++){
								if((_inObject||_inArray)&&i>3){
									result.push(", <span class='Strong Gray'>"+(len-4)+" More...</span>");
									break;
								}
								result.push( (i > 0 ? ", " : "") + d.highlight(_value[i], false, true, true) );
							}
							result.push(" ]</span>");
						}
					} else if(_inObject)
						result.push("<span class='Gray Italic'>Object</span>");
					else {
						result.push("<span class='Strong Green"+ ( !_link?"'":" ObjectLink' onmouseover='this.className=this.className.replace(\"ObjectLink\",\"ObjectLinkHover\")' onmouseout='this.className=this.className.replace(\"ObjectLinkHover\",\"ObjectLink\")' onclick='firebug.d.console.openObject(" +( d.console.cache.push( _value ) -1 )+")'" ) + ">Object");
						var i=0;
						for(var key in _value){
							var value = _value[key];
							if((_inObject||_inArray)&&i>3){
								result.push(" <span class='Strong Gray'>More...</span>");
								break;
							}
							result.push(" "+key+"="+d.highlight(value,true));
							i++;
						};
						result.push("</span>");
					}
				} else if(_inObject)
						result.push("<span class='Gray Italic'>"+_value+"</span>");
				return result.join("");
			}
		},
		html:{
			nIndex:"computedStyle",
			current:null,
			highlight:function(_element,_clear,_event){
				with(firebug){
					if(_clear){
						el.bgInspector.environment.addStyle({ "display":"none" });
						return;
					}
					d.inspector.inspect(_element,true);
				}
			},
			inspect:function(_element){
				var map = [], parent = _element;
				while(parent){
					map.push(parent);
					if(parent==document.body)
						break;
					parent = parent.parentNode;
				}
				map = map.reverse();
				with(firebug){
					if(env.dIndex!="html"){
						firebug.d.navigate("html");
					}
					d.inspector.toggle(false);
					var parentLayer = el.left.html.container.child.get()[2].childNodes[1].pi;

					for(var t=0, len=map.length; map[t]; t++){
						if(t==len-1){
							var link = parentLayer.environment.getElement().previousSibling.pi;
							link.attribute.addClass("Selected");
							
							if(d.html.current){
								d.html.current[1].attribute.removeClass("Selected");
							}
							
							d.html.current = [_element,link];
							
							return;
						}
						parentLayer = d.html.openHtmlTree(map[t],parentLayer,map[t+1]);
					}
				}
			},
			navigate:function(_index,_element){
				with(firebug){
					el.right.html.nav[d.html.nIndex].attribute.removeClass("Selected");
					el.right.html.nav[_index].attribute.addClass("Selected");
					d.html.nIndex = _index;
					d.html.openProperties();
				}
			},
			openHtmlTree:function(_element,_parent,_returnParentElementByElement,_event){
				with(firebug){
					var t=Number(new Date),
					element = _element || document.documentElement, 
					parent = _parent || el.left.html.container, 
					returnParentEl = _returnParentElementByElement || null, 
					returnParentVal = null,
					len = element.childNodes.length;

					if(parent!=el.left.html.container){
						var nodeLink = parent.environment.getParent().pi.child.get()[0].pi;
						if (d.html.current) {
							d.html.current[1].attribute.removeClass("Selected");
						}
						nodeLink.attribute.addClass("Selected");
						
						d.html.current = [_element,nodeLink];
						d.html.openProperties();
					};
					
					if(element.childNodes&&(len==0||(len==1&&element.childNodes[0].nodeType==3)))return;
					parent.clean();

					if(parent.opened&&Boolean(_returnParentElementByElement)==false){
						parent.opened = false;
						parent.element.previousSibling.pi.attribute.removeClass("Open");
						return;
					};
					
					if (parent != el.left.html.container) {
						parent.element.previousSibling.pi.attribute.addClass("Open");
						parent.opened = true;
					};
					
					if(element==document.documentElement){
						new pi.element("A").attribute.addClass("Block").update("<span class='DarkBlue'>&#60;<span class='Blue'>html</span>&#62;").insert(parent);
					};
					
					for(var i=0; i<=len; i++){
						if(i==len){
							new pi.element("A").attribute.addClass("Block").update("<span class='DarkBlue'>&#60;/<span class='Blue'>"+element.nodeName.toLowerCase()+"</span>&#62;").insert(container);
							break;
						} 
						var item = element.childNodes[i];
						
						if (item.nodeType != 3){
							var container = new pi.element().attribute.addClass("Block").insert(parent), 
							link = new pi.element("A").attribute.addClass("Link").insert(container), 
							spacer = new pi.element("SPAN").attribute.addClass("Spacer").update("&nbsp;").insert(link),
							html = new pi.element("SPAN").attribute.addClass("Content").update(d.highlight(item)).insert(link),
							subContainer = new pi.element("DIV").attribute.addClass("SubContainer").insert(container),
							view = pi.util.Element.getView(item);
							
							link.event.addListener("click", pi.util.Curry(d.html.openHtmlTree, window, item, subContainer, false));
							link.event.addListener("mouseover", pi.util.Curry(d.html.highlight, window, item, false));
							link.event.addListener("mouseout", pi.util.Curry(d.html.highlight, window, item, true));
							
							returnParentVal = returnParentEl == item ? subContainer : returnParentVal;
							
							if(d.html.current==null&&item==document.body){
								link.attribute.addClass("Selected");
								d.html.current = [item,link];
								d.html.openHtmlTree(item,subContainer);
							 }
							
							if(element.nodeName!="HEAD"&&element!=document.documentElement&&(view.visibility=="hidden"||view.display=="none")){
								container.attribute.addClass("Unvisible");
							};
							
							if (item.childNodes){
								var childLen = item.childNodes.length;
								if (childLen == 1 && item.childNodes[0].nodeType == 3) {
									html.child.add(document.createTextNode(item.childNodes[0].nodeValue.substring(0, 50)));
									html.child.add(document.createTextNode("</"));
									html.child.add(new pi.element("span").attribute.addClass("Blue").update(item.nodeName.toLowerCase()).environment.getElement());
									html.child.add(document.createTextNode(">"));
									continue;
								}
								else 
									if (childLen > 0) {
										link.attribute.addClass("Parent");
									}
							}
						}
					};
					return returnParentVal;
				}
			},
			openProperties:function(){
				with(firebug){
					var index = d.html.nIndex;
					var node = d.html.current[0];
					d.clean(el.right.html.content);
					var str = "";
					switch(index){
						case "computedStyle":
							var property = ["opacity","filter","azimuth","background","backgroundAttachment","backgroundColor","backgroundImage","backgroundPosition","backgroundRepeat","border","borderCollapse","borderColor","borderSpacing","borderStyle","borderTop","borderRight","borderBottom","borderLeft","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","borderTopStyle","borderRightStyle","borderBottomStyle","borderLeftStyle","borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth","borderWidth","bottom","captionSide","clear","clip","color","content","counterIncrement","counterReset","cue","cueAfter","cueBefore","cursor","direction","display","elevation","emptyCells","cssFloat","font","fontFamily","fontSize","fontSizeAdjust","fontStretch","fontStyle","fontVariant","fontWeight","height","left","letterSpacing","lineHeight","listStyle","listStyleImage","listStylePosition","listStyleType","margin","marginTop","marginRight","marginBottom","marginLeft","markerOffset","marks","maxHeight","maxWidth","minHeight","minWidth","orphans","outline","outlineColor","outlineStyle","outlineWidth","overflow","padding","paddingTop","paddingRight","paddingBottom","paddingLeft","page","pageBreakAfter","pageBreakBefore","pageBreakInside","pause","pauseAfter","pauseBefore","pitch","pitchRange","playDuring","position","quotes","richness","right","size","speak","speakHeader","speakNumeral","speakPunctuation","speechRate","stress","tableLayout","textAlign","textDecoration","textIndent","textShadow","textTransform","top","unicodeBidi","verticalAlign","visibility","voiceFamily","volume","whiteSpace","widows","width","wordSpacing","zIndex"].sort();
							var view = document.defaultView?document.defaultView.getComputedStyle(node,null):node.currentStyle;
							for(var i=0,len=property.length; i<len; i++){
								var item = property[i];
								if(!view[item])continue;
								str+="<div class='CSSItem'><div class='CSSProperty'>"+item+"</div><div class='CSSValue'>"+d.highlight(view[item])+"</div></div>";
							}
							el.right.html.content.update(str);
							break;
						case "dom":
							d.dom.open(node,el.right.html.content,pi.env.ie);
							break;
					}
				}
			}
		},
		inspector:{
			enabled:false,
			el:null,
			inspect:function(_element,_bgInspector){
				var pos = pi.util.Element.getPosition(_element);
				with(firebug){
					el[_bgInspector?"bgInspector":"borderInspector"].environment.addStyle({ 
						"width":_element.offsetWidth+"px", "height":_element.offsetHeight+"px",
						"top":pos.offsetTop-(_bgInspector?0:2)+"px", "left":pos.offsetLeft-(_bgInspector?0:2)+"px",
						"display":"block"
					});

					if(!_bgInspector){
						d.inspector.el = _element;
					}
				};
			},
			toggle:function(_absoluteValue){
				with (firebug) {
					if(_absoluteValue==d.inspector.enabled)
						return;
					d.inspector.enabled = _absoluteValue!=undefined?_absoluteValue:d.inspector.enabled;
					el.button.inspect.attribute[(d.inspector.enabled ? "add" : "remove") + "Class"]("Enabled");
					if(d.inspector.enabled==false){
						el.borderInspector.environment.addStyle({ "display":"none" });
						d.inspector.el = null;
					} else if(pi.env.dIndex!="html") {
						d.navigate("html");
					}
				}
			}
		},
		scripts:{
			index:-1,
			lineNumbers:false,
			open:function(_index){
				with(firebug){
					d.scripts.index = _index;
					el.left.scripts.container.update("");
					var script = document.getElementsByTagName("script")[_index],uri = script.src||document.location.href,source;
					
					if(uri.indexOf("http:\/\/")>-1&&getDomain(uri)!=document.domain){
						el.left.scripts.container.update("<em>Access to restricted URI denied</em>");
						return;
					}
					
					if(uri!=document.location.href){
						source = env.cache[uri]||pi.xhr.get(uri).responseText;
						env.cache[uri] = source;
					} else
						source = script.innerHTML;
					source = source.replace(/\n|\t|<|>/g,function(_ch){
						return ({"<":"&#60;",">":"&#62;","\t":"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;","\n":"<br />"})[_ch];
					});
				
					if (!d.scripts.lineNumbers) 
						el.left.scripts.container.child.add(
							new pi.element("DIV").attribute.addClass("CodeContainer").update(source)
						);
					else {
						source = source.split("<br />");
						for (var i = 0; i < source.length; i++) {
							el.left.scripts.container.child.add(new pi.element("DIV").child.add(new pi.element("DIV").attribute.addClass("LineNumber").update(i + 1), new pi.element("DIV").attribute.addClass("Code").update("&nbsp;" + source[i]), new pi.element("DIV").environment.addStyle({
								"clear": "both"
							})));
						};
					};
				}
			},
			toggleLineNumbers:function(){
				with(firebug){
					d.scripts.lineNumbers = !d.scripts.lineNumbers;
					el.button.scripts.lineNumbers.attribute[(d.scripts.lineNumbers ? "add" : "remove") + "Class"]("Enabled");
					d.scripts.open( d.scripts.index );
					
				}	
			},
			refresh:function(){
				with(firebug){
					el.button.scripts.selectbox.clean();
					var collection = document.getElementsByTagName("script");
					for(var i=0,len=collection.length; i<len; i++){
						var item = collection[i];
						d.scripts.index=d.scripts.index<0?i:d.scripts.index;
						el.button.scripts.selectbox.child.add(
							new pi.element("OPTION").attribute.set("value",i).update(item.src||item.baseURI||"..")
						);
					}
					d.scripts.open( d.scripts.index );
				}
			}
		},
		str: {
			open:function(_str){
				with(firebug){
					d.navigate("str");
					el.left.str.container.update(_str.replace(/\n/g,"<br />"))
				}
			}
		},
		xhr:{
			objects:[],
			addObject:function(){
				with(firebug){
					for(var i=0,len=arguments.length; i<len; i++){
						try {
							var item = arguments[i];
							var val = eval(item);
							d.xhr.objects.push([
								item, val
							]);
						} catch(e){
							continue;
						}
					}
				}
			},
			open:function(){
				with(firebug){
					el.left.xhr.container.update("");
					el.left.xhr.name = new pi.element("DIV").attribute.addClass("BlockContent").insert(new pi.element("DIV").attribute.addClass("Block").environment.addStyle({ "width":"20%" }).insert(el.left.xhr.container));
					el.left.xhr.nameTitle = new pi.element("STRONG").update("Object Name:").insert(el.left.xhr.name);
					el.left.xhr.nameContent = new pi.element("DIV").insert(el.left.xhr.name);
					el.left.xhr.status = new pi.element("DIV").attribute.addClass("BlockContent").insert(new pi.element("DIV").attribute.addClass("Block").environment.addStyle({ "width":"10%" }).insert(el.left.xhr.container));
					el.left.xhr.statusTitle = new pi.element("STRONG").update("Status:").insert(el.left.xhr.status);
					el.left.xhr.statusContent = new pi.element("DIV").insert(el.left.xhr.status);
					el.left.xhr.readystate = new pi.element("DIV").attribute.addClass("BlockContent").insert(new pi.element("DIV").environment.addStyle({ "width":"15%" }).attribute.addClass("Block").insert(el.left.xhr.container));
					el.left.xhr.readystateTitle =el.left.xhr.nameTitle = new pi.element("STRONG").update("Ready State:").insert(el.left.xhr.readystate);
					el.left.xhr.readystateContent = new pi.element("DIV").insert(el.left.xhr.readystate);
					el.left.xhr.response = new pi.element("DIV").attribute.addClass("BlockContent").insert(new pi.element("DIV").environment.addStyle({ "width":(pi.env.ie?"50":"55")+"%" }).attribute.addClass("Block").insert(el.left.xhr.container));
					el.left.xhr.responseTitle = new pi.element("STRONG").update("Response:").insert(el.left.xhr.response);
					el.left.xhr.responseContent = new pi.element("DIV").insert(el.left.xhr.response);
					setTimeout(d.xhr.refresh,500);
				}
			},
			refresh:function(){
				with(firebug){
					el.left.xhr.nameContent.update("");
					el.left.xhr.statusContent.update("");
					el.left.xhr.readystateContent.update("");
					el.left.xhr.responseContent.update("");
					for(var i=0,len=d.xhr.objects.length; i<len; i++){
						var item = d.xhr.objects[i];
						var response = item[1].responseText;
						if(Boolean(item[1])==false)continue;
						el.left.xhr.nameContent.child.add(new pi.element("span").update(item[0]));
						try {
							el.left.xhr.statusContent.child.add(new pi.element("span").update(item[1].status));
						} catch(e){ el.left.xhr.statusContent.child.add(new pi.element("span").update("&nbsp;")); }
						el.left.xhr.readystateContent.child.add(new pi.element("span").update(item[1].readyState));
						
						el.left.xhr.responseContent.child.add(new pi.element("span").child.add(
							new pi.element("A").event.addListener("click",pi.util.Curry(d.str.open,window,response)).update("&nbsp;"+response.substring(0,50))
						));
					};
					if(env.dIndex=="xhr")
						setTimeout(d.xhr.refresh,500);
				}
			}
		},
		navigateRightColumn:function(_index,_open){
			with(firebug){
				el.left.container.environment.addStyle({ "width":_open?"70%":"100%" });
				el.right.container.environment.addStyle({ "display":_open?"block":"none" });
			}
		},
		navigate:function(_index){
			with(firebug){
				
				var open = _index, close = env.dIndex;
				env.dIndex = open;
				
				el.button[close].container.environment.addStyle({ "display":"none" });
				el.left[close].container.environment.addStyle({ "display":"none" });
				el.right[close].container.environment.addStyle({ "display":"none" });
				
				el.button[open].container.environment.addStyle({ "display":"inline" });
				el.left[open].container.environment.addStyle({ "display":"block" });
				el.right[open].container.environment.addStyle({ "display":"block" });
				
				if(el.nav[close])
					el.nav[close].attribute.removeClass("Selected");
				if(el.nav[open])
					el.nav[open].attribute.addClass("Selected");
				
				switch(open){
					case "console":
						d.navigateRightColumn(_index);
						break;
					case "html":
						
						d.navigateRightColumn(_index,true);
						if(!d.html.current){
							var t=Number(new Date);
							d.html.openHtmlTree();
						}
						break;
					case "css":
						d.navigateRightColumn(_index,true);
						d.css.refresh();
						break;
					case "scripts":
						d.navigateRightColumn(_index);
						d.scripts.refresh();
						break;
					case "dom":
						d.navigateRightColumn(_index);
						if(el.left.dom.container.environment.getElement().innerHTML==""){
							var t=Number(new Date);
							d.dom.open(eval(el.button.dom.textbox.environment.getElement().value),el.left.dom.container);
							console.log("@@@",Number(new Date)-t);
						}
						break;
					case "xhr":
						d.navigateRightColumn(_index);
						d.xhr.open();
						break;
				}
				
			}
		}
	},
	getDomain:function(_url){
		return _url.match(/http:\/\/(www.)?([\.\w]+)/)[2];
	},
	cancelEvent:function(_event){
		if(_event.stopPropagation)
			_event.stopPropagation();
		if(_event.preventDefault)
			_event.preventDefault();
	},
	getSelection:function(_el){
		if(pi.env.ie){
			var range = document.selection.createRange(),stored = range.duplicate();
			stored.moveToElementText(_el);
			stored.setEndPoint('EndToEnd', range);
			_el.selectionStart = stored.text.length - range.text.length;
			_el.selectionEnd = _el.selectionStart + range.text.length;
		}
		return {
			start:_el.selectionStart,
			length:_el.selectionEnd-_el.selectionStart
		}
	},
	tab:function(el,_event){
		if(_event.keyCode==9){
			if(el.setSelectionRange){
				var position = firebug.getSelection(el);
				el.value = el.value.substring(0,position.start) + String.fromCharCode(9) + el.value.substring(position.start+position.length,el.value.length);
				el.setSelectionRange(position.start+1,position.start+1);
			} else if(document.selection) {	
				var range = document.selection.createRange(), isCollapsed = range.text == '';
				range.text = String.fromCharCode(9);
				range.moveStart('character', -1);
			}
			firebug.cancelEvent(_event);
			if(pi.env.ie)
				setTimeout(el.focus,100);
		};
	},
	listen: {
		addXhrObject:function(){
			with(firebug){
				d.xhr.addObject.apply(window, el.button.xhr.textbox.environment.getElement().value.split(","));
			}
		},
		consoleTextbox:function(_event){
			with(firebug){
				if(_event.keyCode==13&&(env.multilinemode==false||_event.shiftKey==false)){
					d.console.historyIndex = d.console.history.length;
					d.console.run(el.left.console.input.environment.getElement().value);
					return false;
				}
				if(pi.util.Array.indexOf([13,38,40],_event.keyCode)==-1)
					return;
					
				d.console.historyIndex+=_event.keyCode!=40?0:d.console.historyIndex==d.console.history.length?0:1;
				d.console.historyIndex-=_event.keyCode!=38?0:d.console.historyIndex==0?0:1;
				el.left.console.input.update(
					d.console.history.length > d.console.historyIndex ?
					d.console.history[d.console.historyIndex] :
					""
				);
			}
		},
		cssSelectbox:function(){
			with(firebug){
				d.css.open(el.button.css.selectbox.environment.getElement().selectedIndex);
			}
		},
		domTextbox:function(_event){
			with(firebug){
				if(_event.keyCode==13){
					d.dom.open(eval(el.button.dom.textbox.environment.getElement().value),el.left.dom.container);
				}
			}
		},
		inspector:function(){
			with(firebug){
				d.html.inspect(d.inspector.el);
			}
		},
		keyboard:function(_event){
			with(firebug){
				if(_event.keyCode==27&&d.inspector.enabled)
					d.inspector.toggle();
			}
		},
		mouse:function(_event){
			with(firebug){
				var target = _event[pi.env.ie?"srcElement":"target"];
				if(
					d.inspector.enabled&&
					target!=document.body&&
					target!=document.firstChild&&
					target!=document.childNodes[1]&&
					target!=el.borderInspector.environment.getElement()&&
					target!=el.main.environment.getElement()&&
					target.offsetParent!=el.main.environment.getElement()
				){
					d.inspector.inspect(target);
				}
			}
		},
		runMultiline:function(){
			with(firebug){
				d.console.run.call(window,el.right.console.input.environment.getElement().value);
			}
		},
		runCSS:function(){
			with(firebug){
				var source = el.right.css.input.environment.getElement().value.replace(/\n|\t/g,"").split("}");
				for(var i=0, len=source.length; i<len; i++){
					var item = source[i]+"}", rule = !pi.env.ie?item:item.split(/{|}/), collection = document.getElementsByTagName("style"),
					style = collection.length>0?collection[0]:document.body.appendChild( document.createElement("style") );
					if(item.match(/.+\{.+\}/)){
						if(pi.env.ie)
							style.styleSheet.addRule(rule[0],rule[1]);
						else
							style.sheet.insertRule( rule, style.sheet.cssRules.length );
					}
				}
			}
		},
		scriptsSelectbox:function(){
			with(firebug){
				d.scripts.open(parseInt(el.button.scripts.selectbox.environment.getElement().value));
			}
		},
		xhrTextbox:function(_event){
			with(firebug){
				if(_event.keyCode==13){
					d.xhr.addObject.apply(window, el.button.xhr.textbox.environment.getElement().value.split(","));
				}
			}
		}
	}
};

window.console = firebug.d.console;
pi.util.Init.push(firebug.init);