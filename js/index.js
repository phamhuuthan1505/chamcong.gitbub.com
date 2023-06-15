
$(function () {
	
	i18n = $.i18n();
	locale = i18n.locale;
	if (locale == 'vi') {
		i18n.load({ 'vi': 'index?getlanguage&locale=' + locale }).done(function () { i18nDone(); });
	} else {
		i18n.load({ 'en': 'index?getlanguage&locale=' + locale }).done(function () { i18nDone(); });
    }
	function i18nDone() {
		//console.log(i18n);
		SelPriObj.init();
		$('#menubar').css('width', i18n.locale == 'vi' ? "600px" : "800px");
		$.get('index?getbarmenu&locale=' + i18n.locale, function (data) {
			createMenuBar(data, '#menubar');
		},'json');
			
			$.get('index?getuser',
				function (data) {
					var data = eval('(' + data + ')');
					if (data.state == "error") {
						myUserLogin = 'error';
					} else {
						myUserLogin = data.message;
						$('#mnuserlogin').menubutton({
							iconCls: 'icon-useraccount',
							menuAlign: 'right',
							menu: '#mm10',
							text: $.i18n('loginname') + ': ' + myUserLogin
						});
						var item = $('#mm10').menu('findItem', { name: 'changepass' })
						$('#mm10').menu('setText', {
							target: item.target,
							text: $.i18n('changepass')
						});
						var item = $('#mm10').menu('findItem', { name: 'changelang' })
						$('#mm10').menu('setText', {
							target: item.target,
							text: $.i18n('changelang')
						});
						var item = $('#mm10').menu('findItem', { name: 'changetheme' })
						$('#mm10').menu('setText', {
							target: item.target,
							text: $.i18n('changetheme')
						});
						var item = $('#mm10').menu('findItem', { name: 'logout' })
						$('#mm10').menu('setText', {
							target: item.target,
							text: $.i18n('logout')
						});
					}
				});

		EasyuiExt();
		GetAllLeftMenu()
		//$.post('index?gettopmenu&locale=' + i18n.locale,
		//	JSON.stringify({ name: 'data' }),
		//	function (data) {
		//		var data = eval('(' + data + ')');
		//		$('#mndata').menubutton(
		//			$.extend({}, this, {
		//				text: $.i18n('personel'),
		//				iconCls: 'icon-data',
		//				menu: createMenu(data, MainMenuHandler)
		//			})
		//);
		//	});
		


		$("body").show();
		$('body').layout({ fit: true });
		//$('body').layout('close', 'center');
		//$('body').layout('close', 'west');
		$("#mainmenu").click(function () {
			toggle();
		});
		
	}
	
	
	
	
	
	
	$("#tab").tabs({
		fit: true,
		border: true,
		onAdd: function (title, index) {
			if (index == 0) {
				$(this).show();
				$(this).tabs('resize');
			}
		},
		onBeforeClose: function (title, index) {
			var tab = $(this).tabs('getTab', index);
			
			if (tab[0].id == "tabPanelDevStatus") {
				StatusOfDevices.socketexit = 1;
				EventsOfDevices.socketexit = 1;
				if (EventsOfDevices.socket) {
					if (EventsOfDevices.socket.readyState == WebSocket.OPEN) {
						EventsOfDevices.socket.close();
					}
				}
				if (StatusOfDevices.socket) {
					if (StatusOfDevices.socket.readyState == WebSocket.OPEN) {
						StatusOfDevices.socket.close();
					}
				}
			} else if (tab[0].id == "tabPanelBasicCommand") {
				StatusOfBasicCmdDevices.socketexit = 1;
				if (StatusOfBasicCmdDevices.socket) {
					if (StatusOfBasicCmdDevices.socket.readyState == WebSocket.OPEN) {
						StatusOfBasicCmdDevices.socket.close();
					}
				}
				EventsOfCommands.socketexit = 1;
				if (EventsOfCommands.socket) {
					if (EventsOfCommands.socket.readyState == WebSocket.OPEN) {
						EventsOfCommands.socket.close();
					}
				}
			} else if (tab[0].id == "tabPanelUserCommand") {
				StatusOfUserCmdDevices.socketexit = 1;
				if (StatusOfUserCmdDevices.socket) {
					if (StatusOfUserCmdDevices.socket.readyState == WebSocket.OPEN) {
						StatusOfUserCmdDevices.socket.close();
					}
				}
				EventsOfUserCommands.socketexit = 1;
				if (EventsOfUserCommands.socket) {
					if (EventsOfUserCommands.socket.readyState == WebSocket.OPEN) {
						EventsOfUserCommands.socket.close();
					}
				}
			} else if (tab[0].id == "tabPanelUserByDevice") {
				StatusOfUserDevDevices.socketexit = 1;
				if (StatusOfUserDevDevices.socket) {
					if (StatusOfUserDevDevices.socket.readyState == WebSocket.OPEN) {
						StatusOfUserDevDevices.socket.close();
					}
				}
				EventsOfUserDevCommands.socketexit = 1;
				if (EventsOfUserDevCommands.socket) {
					if (EventsOfUserDevCommands.socket.readyState == WebSocket.OPEN) {
						EventsOfUserDevCommands.socket.close();
					}
				}
			} else if (tab[0].id == "tabPanelEnrollRemotely") {
				StatusOfEnrollCmdDevices.socketexit = 1;
				if (StatusOfEnrollCmdDevices.socket) {
					if (StatusOfEnrollCmdDevices.socket.readyState == WebSocket.OPEN) {
						StatusOfEnrollCmdDevices.socket.close();
					}
				}
				EventsOfEnrollCommands.socketexit = 1;
				if (EventsOfEnrollCommands.socket) {
					if (EventsOfEnrollCommands.socket.readyState == WebSocket.OPEN) {
						EventsOfEnrollCommands.socket.close();
					}
				}
			}
		},

		onLoad: function (panel) {
			var opts = panel.panel('options');
			switch (opts.id) {
				case 'tabPanelDevStatus':
					clearInterval(StatusOfDevices.ReopenSocket);
					StatusOfDevices.init(0);
					clearInterval(EventsOfDevices.ReopenSocket);
					EventsOfDevices.init(0);
				case 'tabPanelBasicCommand':

				default:
					break;
			}
			
		},
		onSelect: function (title, index) {
			var tab = $(this).tabs('getTab', index);
			MenuItem.init(tab);
		},
		onClose: function (title, index) {
			var len = $("#tab").tabs('tabs').length;
			if (len == 0) {
				$("#tab").hide();
			}

		},

	});
	


	
	
});

function createMenuBar(data, container) {
	$.map(data, function (btn) {
		var b = $('<a style="width:20%;height:50px"></a>').appendTo(container);
		$.post('index?gettopmenu&locale=' + i18n.locale,
			JSON.stringify({ name: btn.name }),
			function (data) {
				var data = eval('(' + data + ')');
				b.menubutton(
					$.extend({}, btn, {
						plain: true,
						toggle: true,
						hasDownArrow: true,
						group: 'gk1',
						width: i18n.locale == 'vi' ? 130 : 160,
						menu: createTopMenu(data, MainMenuHandler)
					}));
			});
		
	});
}
function MainMenuHandler(item) {
	if (!item.enabled) {
		$.messager.alert($.i18n('mytitle'), $.i18n('userlimit'), 'info')
		return;
	}
	ShowPlugin(item);
}
function GetLeftMenu(target) {
	var opts = $(target).linkbutton('options');
	if (opts.name == 'acc') {
		$.messager.alert($.i18n('mytitle'), $.i18n('underdevelopment'), 'info')
		return;
    }
	$.post('index?getmenu&locale=' + i18n.locale,
		JSON.stringify({ name: opts.name }),
		function (data, status) {
			$('#sm').sidemenu({
				multiple: true,
				border: false,
				data: data,
				onSelect: function (item) {
					//console.log(item);
					if (!item.enabled) {
						$.messager.alert($.i18n('mytitle'), $.i18n('userlimit'), 'info')
						return;
					}
					ShowPlugin(item);
				}
				
			});
			
	}, 'json')
	$('body').layout('open', 'center');
	$('body').layout('open', 'west');
}
function GetAllLeftMenu() {
	$.post('index?getmenu&locale=' + i18n.locale,
		JSON.stringify({ name: 'all' }),
		function (data, status) {
			$('#sm').sidemenu({
				multiple: false,
				border: false,
				data: data,
				width:55,
				onSelect: function (item) {
					//console.log(item);
					if (!item.enabled) {
						$.messager.alert($.i18n('mytitle'), $.i18n('userlimit'), 'info')
						return;
					}
					ShowPlugin(item);
				}

			}).sidemenu('collapse');
			var p = $('body').layout('panel', 'west');  // get the west panel
			p.panel('resize', { width: 55 });  // change the width of west panel
			$('body').layout('resize');
		}, 'json')
}
function toggle() {
	var opts = $('#sm').sidemenu('options');
	$('#sm').sidemenu(opts.collapsed ? 'expand' : 'collapse');
	opts = $('#sm').sidemenu('options');
	$('#sm').sidemenu('resize', {
		width: opts.collapsed ? 55 : 200
	});
	var p = $('body').layout('panel', 'west');  // get the west panel
	p.panel('resize', { width: opts.collapsed ? 55 : 200 });  // change the width of west panel
	$('body').layout('resize');
	
}
function ShowPlugin(item) {
	switch (item.plugin) {
		case 'companyinfo':
			openDialogWindow(item);
			break;
		default:
			addTab(item);
			break;
	}
}
function addTab(item) {
	
	if ($('#tab').tabs('exists', item.text)) {
		$('#tab').tabs('select', item.text);
	} else {
		$('#tab').tabs('add', {
			menuitem:item,
			title: item.text,
			id: 'tabPanel' + item.plugin,
			cache: true,
			href: item.plugin + '.html',
			closable: true,
			iconCls: item.iconCls,
			//loadingMessage: 'Đang tải ...',
			extractor: function (data) {
				return CheckSessionTimeOut(data);
			}
			

		});
		
	}
	
}
function openDialogWindow(item) {
	$('body').append('<div id="indexWindow" style="display:none;overflow:hidden"></div>');
	$('#indexWindow').window({
		width: item.widthW,
		height: item.heightW,
		modal: true,
		closed: true,
		iconCls: item.iconCls,
		title: item.text,
		collapsible: false,
		minimizable: false,
		maximizable: false,
		constrain: true,
		extractor: function (data) {
			return CheckSessionTimeOut(data);
		},
		onClose: function () {
			$('#indexWindow').remove();
		}
	}).window('open').window('refresh', item.plugin + '.html').window('center');
}
function CheckSessionTimeOut(data) {
	var tmp = $('<head></head>').html(data);
	var content = tmp.find('meta[http-equiv="refresh"]').attr('content');
	if (content == undefined) {
		data = $.fn.panel.defaults.extractor(data);
		return data;
	} else {
		var url = content.split('=')[1]
		window.location.href = url;
		return;
	}
}
function Reload() {
	setCookie("SessionToken", "", 1)
	window.location.href = getRootUrl();
}


function openChangePass() {
	$('body').append('<div id="indexWindowP" style="display:none;overflow:hidden"></div>');
	$('#indexWindowP').window({
		width: 320,
		height: 220,
		modal: true,
		closed: true,
		iconCls: 'icon-changepass',
		title: 'Thay dổi mật khẩu',
		collapsible: false,
		minimizable: false,
		maximizable: false,
		bodyCls: 'dv-table',
		extractor: function (data) {
			return CheckSessionTimeOut(data);
		},
		onClose: function () {
			$('#indexWindowP').remove();
		}

	}).window('open').window('refresh', 'changepass.html').window('center');
}

var MenuItem = {
	opts: null,
	init: function (tab) {
		//var tab = $('#tab').tabs('getSelected');
		MenuItem.opts = tab.panel('options');
	},
	IsAdd: function () {
		return MenuItem.opts.menuitem.isadd;
	},
	IsEdit: function () {
		return MenuItem.opts.menuitem.isedit;
	},
	IsDelete: function () {
		return MenuItem.opts.menuitem.isdelete;
	}
}
function GetExport(url) {
	try {
		showProgress();
		$.get(url, function (res) {
			res = eval('(' + res + ')');
			closeProgress();
			if (res.state == 'success') {
				document.getElementById('exp_iframe').src = res.message;
			} else {
				$.messager.alert($.i18n('mytitle'), res.message, 'info');
			}
		});
	} catch (err) { closeProgress(); message(err) }
}


function openChangeLang() {
	try {
		//$('#ChangeLangW').window({
		//	height: 160,
		//	width: 320,
		//}).window('open').window('center');
		$('#ChangeLangW').dialog({
			title: $.i18n('changelang'),
			modal: true,
			closed: true,
			iconCls: 'icon-lang',
			collapsible: false,
			minimizable: false,
			maximizable: false,
			resizable: true,
			height: 160,
			width: 320,
			buttons: [{
				text: $.i18n('ok'),
				iconCls: 'icon-ok',
				handler: function () {
					let locale = $('#cbLang').combobox('getValue');
					setCookie("CurrentLocale", locale, 365)
					window.location.href = getRootUrl();
				}
			}, {
				text: $.i18n('cancel'),
				iconCls: 'icon-cancel',
				handler: function () {
					$('#ChangeLangW').dialog('close');
				}
			}],
			onBeforeOpen: function () {
				$('#cbLang').combobox({
					showItemIcon: true,
					iconWidth: 38,
					//iconCls: 'icon-lang',
					data: [
						{ value: 'vi', text: 'Việt Nam', iconCls: 'icon-vi' },
						{ value: 'en', text: 'English', iconCls: 'icon-en' }
					],
					editable: false,
					panelHeight: 'auto',
					onSelect: function (record) {

					}
				}).combobox('setValue', i18n.locale);
            }

		}).window('open').window('center');

	} catch (err) { message(err) }
}

function openChangeTheme() {
	try {
		
		$('#ChangeTheme').dialog({
			title: $.i18n('changetheme'),
			modal: true,
			closed: true,
			iconCls: 'icon-theme',
			collapsible: false,
			minimizable: false,
			maximizable: false,
			resizable: true,
			height: 160,
			width: 320,
			buttons: [{
				text: $.i18n('ok'),
				iconCls: 'icon-ok',
				handler: function () {
					let theme = $('#cbThemes').combobox('getValue');
					setCookie("CurrentTheme", theme, 365)
					window.location.href = getRootUrl();
				}
			}, {
				text: $.i18n('cancel'),
				iconCls: 'icon-cancel',
				handler: function () {
					$('#ChangeTheme').dialog('close');
				}
			}],
			onBeforeOpen: function () {
				let theme = getCookie("CurrentTheme");
				console.log(theme);
				if (theme) $('#cbThemes').combobox('setValue', theme);
				
			}

		}).window('open').window('center');

	} catch (err) { message(err) }
}

