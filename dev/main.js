global_data_cache = {};
global_absolute_path = '';
global_forbid_editor_change_event = false
editor=null;
$(function(){
  if(ie_error()){
        $('#editor').hide();
    }else{
        $('#editorBox').hide();
        var langTools = ace.require("ace/ext/language_tools");
		langTools.addCompleter({
		    getCompletions: function(editor, session, pos, prefix, callback) {
		        var str = editor.getValue();
		        if(!str) return;
		        var lines = str.split("\n");
		        str = lines[pos['row']];
		        str = str.replace("\r",'');
		        var match;
		        var reg = new RegExp(/^\s*?class\s+?[a-z0-9_]+?\s+?extends\s+?([a-z0-9_]*?)$/i);
		        match = reg.exec(str);
		        if(match!=null)
		        {
		        	//extends
		        	if(global_absolute_path.indexOf('/controller/')>0)
		        	{
		        		//控制器
		        		var _list = [];
	        			_list.push({
	        				name : 'Controller',
	        				value : 'Controller',
	        				score : 999999999,
	        				meta : 'PHPX Controller Base',
	        			});
	        			_list.push({
	        				name : 'PHPX',
	        				value : 'PHPX',
	        				score : 999999999,
	        				meta : 'PHPX Root',
	        			});
	        			callback(null,_list);
		        	}else if(global_absolute_path.indexOf('.model.php')>0)
		        	{
		        		//控制器
		        		var _list = [];
	        			_list.push({
	        				name : 'Model',
	        				value : 'Model',
	        				score : 999999999,
	        				meta : 'PHPX Model Base',
	        			});
	        			_list.push({
	        				name : 'PHPX',
	        				value : 'PHPX',
	        				score : 999999999,
	        				meta : 'PHPX Root',
	        			});
	        			callback(null,_list);
		        	}

		        	return;
		        }
		        reg = new RegExp(/\$this(\->([a-z0-9_]+?)){0,}\s*?\->([a-z0-9_]*?)(\s|$)/i);
		        var match = reg.exec(str);
		        if(match!=null)
		        {
		        	var caller = typeof match[2]=='undefined'?'this':match[2];
		        	var prop_prefix = match[3];
		        	var url = '?class=dict&method=search_property&path='+global_absolute_path+'&caller='+caller;

		        	var _list = [];
		        	if(caller=='this')
		        	{
		        		var reg1=new RegExp(/function\s+?([a-z0-9_]+?)\s*?\(/ig);
		        		var funcs;
		        		while((funcs = reg1.exec(str))!=null)
		        		{
		        			_list.push({
		        				name : 'this.'+funcs[1],
		        				value : funcs[1],
		        				score : 99999998,
		        				meta : 'method',
		        			});
		        		}
		        		var reg1=new RegExp(/(public|private|protected)\s+?\$([a-z0-9_]+?)(\s|=|;)/ig);
		        		var props;
		        		while((props = reg1.exec(str))!=null)
		        		{
		        			_list.push({
		        				name : 'this.'+props[2],
		        				value : props[2],
		        				score : 999999999,
		        				meta : 'property',
		        			});
		        		}
		        	}
		        	$.ajax({
		        		url : url,
		        		cache : false,
		        		success : function(res)
		        		{
		        			var json = eval('('+res+')');
		        			for(var i in json)
		        			{
		        				_list.push(json[i]);
		        			}
		        			callback(null,_list);
		        		}
		        	});
		        }
		        
		        reg = new RegExp(/^\s*?<([a-z0-9_]*?)$/i);
		        var match = reg.exec(str);
		        if(match!=null)
		        {
		        	var _list = [];
		        	var url = '?class=dict&method=search_taglib&path='+global_absolute_path;
		        	$.ajax({
		        		url : url,
		        		cache : false,
		        		success : function(res)
		        		{
		        			var json = eval('('+res+')');
		        			for(var i in json)
		        			{
		        				_list.push(json[i]);
		        			}
		        			callback(null,_list);
		        		}
		        	});
		        	return;
		        }

		        
		        reg = new RegExp(/^\s*?<([a-z0-9_]+?:[a-z0-9_]+?)\s+?[^>]*?\s*?([a-z0-9_]*?)$/i);
		        var match = reg.exec(str);
		        if(match!=null && match[1].indexOf(':')>0)
		        {
		        	var _list = [];
		        	var url = '?class=dict&method=search_taglib_property&path='+global_absolute_path+'&tag='+match[1];
		        	$.ajax({
		        		url : url,
		        		cache : false,
		        		success : function(res)
		        		{
		        			var json = eval('('+res+')');
		        			for(var i in json)
		        			{
		        				_list.push(json[i]);
		        			}
		        			callback(null,_list);
		        		}
		        	});
		        	return;
		        }
		        /*if (prefix.length === 0) { callback(null, []); return }
		        callback(null, [{
		            name: 'aaaa', //显示的名称，‘奖金’
		            value: 'zzzz', //插入的值，‘100’
		            score: 100000000, //分数，越大的排在越上面
		            meta: 'type' //描述，‘我的常量’
		        }]);*/
		    }
		}); 
        editor = ace.edit("editor");
        editor.setOptions({
            enableBasicAutocompletion: false,
            enableSnippets: false,
            enableLiveAutocompletion: true
        });
		editor.on("change", function(e){
			if(!global_forbid_editor_change_event)
				$('li[path=\''+global_absolute_path+'\']').addClass('changed');
		　　editor.execCommand("startAutocomplete");
		}) 
    	//editor.setTheme("ace/theme/cobalt");
        editor.setTheme("ace/theme/dracula");
        editor.getSession().setMode("ace/mode/php");

    }
isCtrlDown=false;
isSDown=false;
function keydown(e){ 
    var a=window.event.keyCode;
    if(a==17)
    {
      isCtrlDown=true;
    }
    if(a==83)
    {
      isSDown=true;
    }
    if(isCtrlDown && isSDown)
    {
      e.preventDefault();
      //保存
      var text = editor.getValue();
      $.ajax({
      	url : '?class=edit&method=save&file='+global_absolute_path,
      	method : 'POST',
      	data : {data:text},
      });
      $("li[path='"+global_absolute_path+"']").removeClass('changed');
      return
    }
}// end hotkey  
function keyup()
{
    var a=window.event.keyCode;
    if(a==17)
    {
      isCtrlDown=false;
    }
    if(a==83)
    {
      isSDown=false;
    }
}
document.onkeydown = keydown;
document.onkeyup = keyup;

	var firstnav = $("#firstnav .nav-addtabs");
	$(window).resize(function () {
	    var siblingsWidth = 0;
	    firstnav.siblings().each(function () {
	        siblingsWidth += $(this).outerWidth();
	    });
	    firstnav.width(firstnav.parent().width() - siblingsWidth);
	    firstnav.refreshAddtabs();
	});
	$(window).resize();

	function init_fs_item(fs_item){
		fs_item.click(function()
		{
			var item = $(this);
			var item_wrap = item.parent();
			var type = item_wrap.attr('type');
			if(type=='folder')
			{
				$('.now-file').hide()
				if(item_wrap.hasClass('open'))
				{
					item_wrap.removeClass('open');
					item_wrap.find('>.fs-item-wrap').hide();
				}else{
					if(item_wrap.find('.fs-item-wrap').size()>0)
					{
						item_wrap.find('>.fs-item-wrap').show();
					}else{
						$.ajax({
							url : '?class=filesystem&method=get_files&path='+item_wrap.attr('path'),
							method : 'GET',
							cache : false,
							success : function(res)
							{
								var files = eval('('+res+')');
								for(var i in files)
								{
									var f = files[i];
									var add_wrap = '<div class="fs-item-wrap '+f['icon']+'" type="'+f['type']+'" path="'+f['path']+'">';
									add_wrap    += '<div class="fs-item '+f['icon']+'">'+f['name']+'</div>';
									add_wrap    += '</div>';

									add_wrap = $(add_wrap);
									add_wrap.appendTo(item_wrap);
									init_fs_item(add_wrap.find('.fs-item'));
								}
							}
						});
					}
					item_wrap.addClass('open');
				}
			}else{
				var path = item_wrap.attr('path');

				addtab(path);

				$('.now-file').css('top',$(this)[0].offsetTop).show()
			}
		});

		fs_item.contextmenu(function(e) {
			$('.now-file').css('top',$(this)[0].offsetTop).show()

			$('.contextmenu').attr('path',fs_item.parent().attr('path'))

			if(fs_item.parent().attr('type')=='folder')
			{
				$('li[job=new_file]').show();
				$('li[job=new_folder]').show();
				$('li[job=find]').show();
			}else{
				$('li[job=new_file]').hide();
				$('li[job=new_folder]').hide();
				$('li[job=find]').hide();
			}
			// 获取窗口尺寸
			var winWidth = $(document).width();
			var winHeight = $(document).height();
			// 鼠标点击位置坐标
			var mouseX = e.pageX;
			var mouseY = e.pageY;
			// ul标签的宽高
			var menuWidth = $(".contextmenu").width();
			var menuHeight = $(".contextmenu").height();
			// 最小边缘margin(具体窗口边缘最小的距离)
			var minEdgeMargin = 0;
			// 以下判断用于检测ul标签出现的地方是否超出窗口范围
			// 第一种情况：右下角超出窗口
			if(mouseX + menuWidth + minEdgeMargin >= winWidth &&
				mouseY + menuHeight + minEdgeMargin >= winHeight) {
				menuLeft = mouseX - menuWidth - minEdgeMargin + "px";
				menuTop = mouseY - menuHeight - minEdgeMargin + "px";
			}
			// 第二种情况：右边超出窗口
			else if(mouseX + menuWidth + minEdgeMargin >= winWidth) {
				menuLeft = mouseX - menuWidth - minEdgeMargin + "px";
				menuTop = mouseY + minEdgeMargin + "px";
			}
			// 第三种情况：下边超出窗口
			else if(mouseY + menuHeight + minEdgeMargin >= winHeight) {
				menuLeft = mouseX + minEdgeMargin + "px";
				menuTop = mouseY - menuHeight - minEdgeMargin + "px";
			}
			// 其他情况：未超出窗口
			else {
				menuLeft = mouseX + minEdgeMargin + "px";
				menuTop = mouseY + minEdgeMargin + "px";
			};
			// ul菜单出现
			$(".contextmenu").css({
				"left": menuLeft,
				"top": menuTop
			}).show();
			// 阻止浏览器默认的右键菜单事件
			return false;
		});

	}

	init_fs_item($('.fs-item'));
	$('.fs-item').click();

	
	$(document).click(function(){
		$('.contextmenu').hide()
	})

	$('.contextmenu li[job=new_file]').click(function(){
		let path = $(this).parent().attr('path')
		console.log(path)
		let name = prompt('Input new file name')

		if(!name)
		{
			return;
		}

		$.ajax({
			url : '?class=filesystem&method=new_file&path='+path+'&name='+name,
			success : function(res)
			{
				var f=eval('('+res+')');
				var new_path = path+'/'+name;
				let fs_item_wrap = $('.fs-item-wrap[path=\''+path+'\']')
				if(fs_item_wrap.find('.fs-item-wrap').size()==0 && !fs_item_wrap.hasClass('open'))
				{
					return;
				}
				var add_wrap = '<div class="fs-item-wrap '+f['icon']+'" type="'+f['type']+'" path="'+f['path']+'">';
				add_wrap    += '<div class="fs-item '+f['icon']+'">'+f['name']+'</div>';
				add_wrap    += '</div>';

				add_wrap = $(add_wrap);
				init_fs_item(add_wrap.find('.fs-item'));

				var inserted = false
				fs_item_wrap.find('.fs-item-wrap').each(function(i)
				{
					var sub_item_wrap = $(this);
					console.log(sub_item_wrap.attr('path'));
					if(sub_item_wrap.attr('type')=='file' && new_path<sub_item_wrap.attr('path'))
					{
						add_wrap.insertBefore(sub_item_wrap);
						inserted=true;
						return false;
					}
				})
				if(!inserted)
				{
					fs_item_wrap.append(add_wrap);
				}

			}
		})
	})

	$('.contextmenu li[job=new_folder]').click(function(){
		let path = $(this).parent().attr('path')
		console.log(path)
		let name = prompt('Input new folder name')

		if(!name)
		{
			return;
		}

		$.ajax({
			url : '?class=filesystem&method=new_folder&path='+path+'&name='+name,
			success : function(res)
			{
				var f=eval('('+res+')');
				var new_path = path+'/'+name;
				let fs_item_wrap = $('.fs-item-wrap[path=\''+path+'\']')
				if(fs_item_wrap.find('.fs-item-wrap').size()==0 && !fs_item_wrap.hasClass('open'))
				{
					return;
				}
				var add_wrap = '<div class="fs-item-wrap '+f['icon']+'" type="'+f['type']+'" path="'+f['path']+'">';
				add_wrap    += '<div class="fs-item '+f['icon']+'">'+f['name']+'</div>';
				add_wrap    += '</div>';

				add_wrap = $(add_wrap);
				init_fs_item(add_wrap.find('.fs-item'));

				var inserted = false
				fs_item_wrap.find('.fs-item-wrap').each(function(i)
				{
					var sub_item_wrap = $(this);
					if(sub_item_wrap.attr('type')=='file')
					{
						add_wrap.insertBefore(sub_item_wrap);
						inserted=true;
						return false;
					}
					if(sub_item_wrap.attr('type')=='folder' && new_path<sub_item_wrap.attr('path'))
					{
						add_wrap.insertBefore(sub_item_wrap);
						inserted=true;
						return false;
					}
				})
				if(!inserted)
				{
					fs_item_wrap.append(add_wrap);
				}
			}
		})
	})

	$('.contextmenu li[job=rename]').click(function(){
		let path = $(this).parent().attr('path')
		console.log(path)
		let name = prompt('Input new file name')

		if(!name)
		{
			return;
		}

		$.ajax({
			url : '?class=filesystem&method=rename&path='+path+'&name='+name,
			success : function(res)
			{
				let fs_item_wrap = $('.fs-item-wrap[path=\''+path+'\']')
				let new_path = path.replace(/\/[^\/]+?$/i,'/'+name)

				fs_item_wrap.attr('path',new_path)
				fs_item_wrap.find('.fs-item').html(name)

				if(fs_item_wrap.attr('type')=='folder')
				{
					fs_item_wrap.find('.fs-item-wrap').remove();
					fs_item_wrap.removeClass('open')
					fs_item_wrap.find('.fs-item').click()
				}

			}
		})
	})


	$('.contextmenu li[job=find]').click(function(){
		let path = $(this).parent().attr('path')
		let name = prompt('Input new file name')

		if(!name)
		{
			return;
		}

		$.ajax({
			url : '?class=filesystem&method=find&path='+path+'&key='+name,
			success : function(res)
			{
				global_data_cache['Results']=res;
				addtab('Results')
				editor.setValue(res)
				editor.selection.clearSelection()
			}
		})
	})


	$('.contextmenu li[job=delete]').click(function(){
		let path = $(this).parent().attr('path')
		
		if(!confirm('Are you sure to delete this?'))
		{
			return;
		}
		$.ajax({
			url : '?class=filesystem&method=delete&path='+path,
			success : function(res)
			{
				if(res=='success')
				{
					let fs_item_wrap = $('.fs-item-wrap[path=\''+path+'\']')
					fs_item_wrap.remove()
				}
			}
		});
	})

	function addtab(path)
	{
		var tab;
		if($('#firstnav >ul >li[path=\''+path+'\']').size()>0)
		{
			tab = $('#firstnav >ul >li[path=\''+path+'\']');
		}else{
	        var html = '<li role="presentation" id="tab_6" class="" path="'+path+'" alt="'+path+'" title="'+path+'">';
	              html+='<a href="#con_6" node-id="6" aria-controls="6" role="tab" data-toggle="tab">';
	             html+=   '<span>'+(path.length>16?('..'+path.substring(path.length-14)):path)+'</span>';
	            html+=  '</a>';
	              html+='<i class="close-tab fa fa-remove"></i>';
	           html+= '</li>';
	        tab = $(html);
	        tab.appendTo($('#firstnav >ul'));
	        tab.find('a').click(function()
	        {
	        	if(global_absolute_path)
	        	{
	        		global_data_cache[global_absolute_path]=editor.getValue()
	        	}
    			$('#firstnav >ul li').removeClass('current');
    			$(this).parent().addClass('current');
    			
	        	var path = tab.attr('path');
	        	load_file(path);
	        	$("#firstnav .nav-addtabs").refreshAddtabs();
	        });
	        tab.find('i.close-tab').click(function()
	        {
	        	//关闭菜单和对应文档
	        	//找到属于前面一个
	        	if(!tab.hasClass('current')){
	        		let path = tab.attr('path')
	        		if(tab.hasClass('changed'))
	        		{
	        			if(window.confirm('The file data has been changed,do you want to save?'))
	        			{
					      let text = global_data_cache[path];
					      $.ajax({
					      	url : '?class=edit&method=save&file='+path,
					      	method : 'POST',
					      	data : {data:text},
					      });
	        			}
	        		}
	        		tab.remove()
	        		delete global_data_cache[path]
	        		$("#firstnav .nav-addtabs").refreshAddtabs()
	        		return
	        	}
        		let prev = null
	        	if(tab.parent().hasClass('dropdown-menu'))
	        	{
	        		let idx = tab.parent().find('li').index(tab)
	        		if(idx>0)
	        		{
	        			prev = tab.parent().find('li:eq('+(idx-1)+')')
	        		}else if($('#firstnav >ul >li').size()>1){
	        			prev = $('#firstnav >ul >li:last')
	        		}else if(tab.parent().find('li').size()>1)
	        		{
	        			prev = tab.next()
	        		}
	        	}else{
	        		let idx = tab.parent().find('>li').index(tab)
	        		if(idx>1)
	        		{
	        			prev = tab.parent().find('>li:eq('+(idx-1)+')')
	        		}else if(tab.parent().find('>li').size()>2)
	        		{
	        			prev = tab.next()
	        		}
	        	}

			    let path = tab.attr('path')
        		if(tab.hasClass('changed'))
        		{
        			if(window.confirm('The file data has been changed,do you want to save?'))
        			{
				      let text = editor.getValue()
				      $.ajax({
				      	url : '?class=edit&method=save&file='+path,
				      	method : 'POST',
				      	data : {data:text},
				      });
        			}
        		}
	        	tab.remove()
	        	delete global_data_cache[path]
	        	$("#firstnav .nav-addtabs").refreshAddtabs()
	        	if(prev)
	        	{
	        		prev.find('a').click()
	        	}else{
		        	global_absolute_path = ''
		        	editor.setValue('')
		        	$('#editor').hide()
	        	}
	        });
		}
		tab.find('a').click();
	}
	function load_data(path,callback)
	{
		if(typeof global_data_cache[path]!='undefined')
		{
			global_absolute_path = path;
			callback(global_data_cache[path]);
			return;
		}
		$.ajax({
			url : '?class=filesystem&method=data&path='+path,
			success : function(res)
			{
				global_absolute_path = path;
				global_data_cache[path]=res;
				callback(res);
			}
		});
	}

	function load_file(path)
	{
		load_data(path,function(data){
			global_forbid_editor_change_event = true
			editor.setValue(data);
			editor.selection.clearSelection()
			editor.focus()
			global_forbid_editor_change_event = false
			$('#editor').show()
		});
	}
});