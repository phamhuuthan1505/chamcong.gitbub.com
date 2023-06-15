var i18n;
var myTitle = 'Wise Eye ITS V3.0';
var myUserLogin = 'admin';
function getRootUrl() {
	var defaultPorts = { "http:": 80, "https:": 443 };
	return window.location.protocol + "//" + window.location.hostname
		+ (((window.location.port)
			&& (window.location.port != defaultPorts[window.location.protocol]))
			? (":" + window.location.port) : "");
}
//function getRootUrl(url) {
//	return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/, "$1");
//}
var bfs = function (tree, key, collection) {
	if (!tree[key] || tree[key].length === 0) return;
	for (var i = 0; i < tree[key].length; i++) {
		var child = tree[key][i]
		collection[child.id] = child;
		bfs(child, key, collection);
	}
	return;
}
function showmessage(data, status) {
	if (status == "success") {
		$.messager.show({
			title: $.i18n('mytitle'),
			msg: data.message,
			showType: 'show',
			style: {
				left: 0,
				right: '',
				top: '',
				bottom: -document.body.scrollTop - document.documentElement.scrollTop
			}
		});
	} else
	{
		$.messager.show({
			title: $.i18n('mytitle'),
			msg: 'Erorr',
			showType: 'show',
			style: {
				left: 0,
				right: '',
				top: '',
				bottom: -document.body.scrollTop - document.documentElement.scrollTop
			}
		});

	}
}
function message(str) {
	$.messager.show({
		title: $.i18n('mytitle'),
		msg: str,
		showType: 'show',
		style: {
			left: 0,
			right: '',
			top: '',
			bottom: -document.body.scrollTop - document.documentElement.scrollTop
		}
	});
}
function showProgress() {
	$.messager.progress({
		msg: $.i18n('processing'),
		border: 'thin',
		style: {
			right: '',
			bottom: ''
		}
	});
}
function closeProgress() {
	$.messager.progress('close');
}
function loaderWSE(opts, param, success, error) {
	if (!opts.url) return false;
	$.ajax({
		type: opts.method,
		url: opts.url,
		data: JSON.stringify(param),
		dataType: 'json',
		success: function (data) {
				if (data.state == "error") {
					console.log(data);
					message(data.message)
					error(data);
				} else {
					success(data);
				}
		},
		error: function (request, status, error) {
			if (request.status == 200) {
				var tmp = $('<head></head>').html(request.responseText);
				var content = tmp.find('meta[http-equiv="refresh"]').attr('content');
				if (content != undefined) {
					var url = content.split('=')[1]
					window.location.href = url;
				} else {
					window.location.href = getRootUrl();
				}
			} else {
				console.log(request.responseText);
				console.log(error);
            }
			
		}
	});
}
function mydateformatter(date) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	return (d < 10 ? ('0' + d) : d) + '/' + (m < 10 ? ('0' + m) : m) + '/' + y;
}
function mydateparser(s) {
	if (!s) return new Date();
	var ss = (s.split('/'));
	var d = parseInt(ss[0], 10);
	var m = parseInt(ss[1], 10);
	var y = parseInt(ss[2], 10);
	if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
		return new Date(y, m - 1, d);
	} else {
		return new Date();
	}
}
function mydatetimeformatter(date) {
	var y = date.getFullYear(); var h = date.getHours();
	var m = date.getMonth() + 1; var M = date.getMinutes()
	var d = date.getDate(); var s = date.getSeconds();
	return (d < 10 ? ('0' + d) : d) + '/' + (m < 10 ? ('0' + m) : m) + '/' + y + ' ' + (h < 10 ? ('0' + h) : h) + ':' + (M < 10 ? ('0' + M) : M) + ':' + (s < 10 ? ('0' + s) : s);
}
function mydatetimeparser(s) {
	if (!s) return new Date();
	var s1 = s.split(' ');
	var ss = (s1[0].split('/'));
	var d = parseInt(ss[0], 10);
	var m = parseInt(ss[1], 10);
	var y = parseInt(ss[2], 10);
	var ss1 = (s1[1].split(':'));
	var h = parseInt(ss1[0], 10);
	var M = parseInt(ss1[1], 10);
	var s = parseInt(ss1[2], 10);
	if (!isNaN(y) && !isNaN(m) && !isNaN(d) && !isNaN(h) && !isNaN(M) && !isNaN(s)) {
		return new Date(y, m - 1, d, h, M, s, 0);
	} else {
		return new Date();
	}
}
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function createMenu(items,handler) {
	var m = $('<div></div>').appendTo('body').menu({ onClick: handler });
	_create(items);
	return m;

	function _create(items, p) {
		$.map(items, function (item) {
			m.menu('appendItem', $.extend({}, item, {
				parent: (p ? p.target : null)
			}));
			if (item.items) {
				var p1 = m.menu('findItem', item.text);
				_create(item.items, p1);
			}
		});
	}
}
function createTopMenu(items, handler) {
	var m = $('<div class="top-menu"></div>').appendTo('body').menu({ onClick: handler });
	_create(items);
	return m;

	function _create(items, p) {
		$.map(items, function (item) {
			m.menu('appendItem', $.extend({}, item, {
				parent: (p ? p.target : null)
			}));
			if (item.items) {
				var p1 = m.menu('findItem', item.text);
				_create(item.items, p1);
			}
		});
	}
}
function isyescount(value, row, index) {
	if (value == "on") {
		return '<img src="connected.png" style="width:30px;height:30px"/>';
	} else {
		return '<img src="disconnected.png" style="width:30px;height:30px"/>';
	}
	//return '<img src="large_device.png"/>'
}
function isyesswitch(value, row, index) {
	if (value == "on") {
		return $.i18n('yes');
	} else {
		return $.i18n('no');
	}
}
function getValidDate(s, e) {
	if (s == "" || e == "") return false;
	var ss = (s.split('/'));
	var d = parseInt(ss[0], 10);
	var m = parseInt(ss[1], 10);
	var y = parseInt(ss[2], 10);
	var sd = new Date(y, m - 1, d);
	ss = (e.split('/'));
	d = parseInt(ss[0], 10);
	m = parseInt(ss[1], 10);
	y = parseInt(ss[2], 10);
	var ed = new Date(y, m - 1, d);
	if (sd <= ed) {
		return true
	} else {
		return false
	}
}
function dateDiff(startDate, endDate) {
	var date1 = new Date(mydateparser(startDate));
	var date2 = new Date(mydateparser(endDate));
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	return diffDays + 1;
}
function subtractDayFromDate(objDate, intDays) {
	var numberOfMlSeconds = objDate.getTime();
	var addMlSeconds = (intDays * 1440) * 60 * 1000;
	var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
	return newDateObj;
}
var SelObj = {
	Dept: null,
	Area: null,
	Title: null,
	Privilege: null,
	Gender: null,
	init: function (_areaid = 0) {
		SelObj.Dept = new Map();
		SelObj.doneDept = false;
		SelObj.Area = new Map();
		SelObj.doneArea = false;
		SelObj.Title = new Map();
		SelObj.doneTitle = false;
		$.post('departmentnew?getmapdepartmentbyarea&locale=' + i18n.locale,
			JSON.stringify({ areaid: _areaid }))
			.done(function (data) {	
				var data = eval('(' + data + ')');			
				SelObj.Dept = new Map(Object.entries(data))
			});
		$.get('areas?getmaparea&locale=' + i18n.locale)
			.done(function (data) {
				var data = eval('(' + data + ')');
				SelObj.Area = new Map(Object.entries(data))
			});
		$.get('title?getmaptitle&locale=' + i18n.locale)
			.done(function (data) {
				var data = eval('(' + data + ')');
				SelObj.Title = new Map(Object.entries(data))
			});
		SelObj.Gender = new Map();
		SelObj.Gender.set(0, $.i18n("male"));
		SelObj.Gender.set(1, $.i18n("female"));
		SelObj.Privilege = new Map();
		SelObj.Privilege.set(0, $.i18n("normaluser"));
		SelObj.Privilege.set(14, $.i18n("supervisor"));
		SelObj.Privilege.set(2, $.i18n("definedrole1"));
		SelObj.Privilege.set(6, $.i18n("definedrole2"));
		SelObj.Privilege.set(10, $.i18n("definedrole3"));
		SelObj.Privilege.set(2, $.i18n("enroller"));
	},
	DeptName: function (value, row, index) {
		return SelObj.Dept.get(value.toString());
	},
	AreaName: function (value, row, index) {
		return SelObj.Area.get(value.toString());
	},
	TitleName: function (value, row, index) {
		return SelObj.Title.get(value.toString());
	},
	PrivilegeName: function (value, row, index) {
		return SelObj.Privilege.get(value);
	},
	GenderName: function (value, row, index) {
		return SelObj.Gender.get(value);
	},
	DeptData: function () {
		var array = Array.from(SelObj.Dept, ([id, text]) => ({ id, text }));
		return array
	},
	AreaData: function () {
		var array = Array.from(SelObj.Area, ([id, text]) => ({ id, text }));
		return array
	},
	TitleData: function () {
		var array = Array.from(SelObj.Title, ([id, text]) => ({ id, text }));
		return array
	},
	PrivilegeData: function () {
		var array = Array.from(SelObj.Privilege, ([id, text]) => ({ id, text }));
		return array
	},
	GenderData: function () {
		var array = Array.from(SelObj.Gender, ([id, text]) => ({ id, text }));
		return array
	}
}
var SelAreaObj = {
	Area: null,
	init: function () {
		SelAreaObj.Area = new Map();
		$.get('areas?getmaparea&locale=' + i18n.locale)
			.done(function (data) {
				var data = eval('(' + data + ')');
				SelAreaObj.Area = new Map(Object.entries(data))
			});
	},
	AreaName: function (value, row, index) {
		return SelAreaObj.Area.get(value.toString());
	},
	AreaData: function () {
		var array = Array.from(SelAreaObj.Area, ([id, text]) => ({ id, text }));
		return array
	}
}
var SelPriObj = {
	Privilege: null,
	init: function () {
		SelPriObj.Privilege = new Map();
		SelPriObj.Privilege.set(0, $.i18n("normaluser"));
		SelPriObj.Privilege.set(14, $.i18n("supervisor"));
		SelPriObj.Privilege.set(2, $.i18n("definedrole1"));
		SelPriObj.Privilege.set(6, $.i18n("definedrole2"));
		SelPriObj.Privilege.set(10, $.i18n("definedrole3"));
		SelPriObj.Privilege.set(2, $.i18n("enroller"));
	},
	PrivilegeData: function () {
		var array = Array.from(SelPriObj.Privilege, ([id, text]) => ({ id, text }));
		return array
	},
	PrivilegeName: function (value) {
		return SelPriObj.Privilege.get(value);
	}
}
var SelInOutMode = {
	InOutMode: null,
	init: function () {
		SelInOutMode.InOutMode = new Map();
		SelInOutMode.InOutMode.set(0, $.i18n("inoutmode01"));
		SelInOutMode.InOutMode.set(1, $.i18n("inoutmode02"));
		SelInOutMode.InOutMode.set(2, $.i18n("inoutmode03"));
		SelInOutMode.InOutMode.set(3, $.i18n("inoutmode04"));
		SelInOutMode.InOutMode.set(4, $.i18n("inoutmode05"));
	},
	InOutModeData: function () {
		var array = Array.from(SelInOutMode.InOutMode, ([id, text]) => ({ id, text }));
		return array
	},
	InOutModeName: function (value, row, index) {
		return SelInOutMode.InOutMode.get(parseInt(value));
	}
}
var SelInOutArrObj = {
	InOutArr: null,
	init: function () {
		SelInOutArrObj.InOutArr = new Map();
		$.get('inoutarr?getmapinoutarr&locale=' + i18n.locale)
			.done(function (data) {
				var data = eval('(' + data + ')');
				SelInOutArrObj.InOutArr = new Map(Object.entries(data))
			});
	},
	InOutArrName: function (value, row, index) {
		return SelInOutArrObj.InOutArr.get(value.toString());
	},
	InOutArrData: function () {
		var array = Array.from(SelInOutArrObj.InOutArr, ([id, text]) => ({ id, text }));
		return array
	}
}
var SelSchObj = {
	Sch: null,
	init: function () {
		SelSchObj.Sch = new Map();
		$.get('schedule?getmapschedule&locale=' + i18n.locale)
			.done(function (data) {
				var data = eval('(' + data + ')');
				SelSchObj.Sch = new Map(Object.entries(data))
			});
	},
	SchName: function (value, row, index) {
		return SelSchObj.Sch.get(value.toString());
	},
	SchData: function () {
		var array = Array.from(SelSchObj.Sch, ([id, text]) => ({ id, text }));
		return array
	}
}
var SelDevObj = {
	Dev: null,
	init: function () {
		SelDevObj.Dev = new Map();
		$.get('machines?getmapmachine&locale=' + i18n.locale)
			.done(function (data) {
				var data = eval('(' + data + ')');
				SelDevObj.Dev = new Map(Object.entries(data))
			});
	},
	DevName: function (value, row, index) {
		if (!value) return '';
		return SelDevObj.Dev.get(value.toString());
	},
	DevData: function () {
		var array = Array.from(SelDevObj.Dev, ([id, text]) => ({ id, text }));
		return array
	}
}
var SelDeptObj = {
	Dept: null,
	init: function (_areaid = 0) {
		SelDeptObj.Dept = new Map();
		$.post('departmentnew?getmapdepartmentbyarea&locale=' + i18n.locale,
			JSON.stringify({ areaid: _areaid }))
			.done(function (data) {
				var data = eval('(' + data + ')');
				SelDeptObj.Dept = new Map(Object.entries(data))
			});
	},
	DeptName: function (value, row, index) {
		return SelDeptObj.Dept.get(value.toString());
	},
	DeptData: function () {
		var array = Array.from(SelDeptObj.Dept, ([id, text]) => ({ id, text }));
		return array
	}
}






