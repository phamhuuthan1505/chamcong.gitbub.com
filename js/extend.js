function EasyuiExt() {
	if ($.messager) {
		$.messager.defaults.ok = $.i18n('ok');
		$.messager.defaults.cancel = $.i18n('exit');
	}
	if ($.fn.pagination) {
		$.fn.pagination.defaults.beforePageText = $.i18n('pagination_page');
		$.fn.pagination.defaults.afterPageText = $.i18n('pagination_of_page');
		$.fn.pagination.defaults.displayMsg = $.i18n('pagination_display');
	}
	if ($.fn.datagrid) {
		$.fn.datagrid.defaults.loadMsg = $.i18n('processing');
	}
	if ($.fn.treegrid && $.fn.datagrid) {
		$.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg;
	}
	if ($.fn.calendar) {
		$.fn.calendar.defaults.weeks = [$.i18n('sun'), $.i18n('mon'), $.i18n('tue'), $.i18n('wed'), $.i18n('thu'), $.i18n('fri'), $.i18n('sat')];
		$.fn.calendar.defaults.months = [$.i18n('jan'), $.i18n('feb'), $.i18n('mar'), $.i18n('apr'),
		$.i18n('may'), $.i18n('jun'), $.i18n('jul'), $.i18n('aug'), $.i18n('sep'), $.i18n('oct'), $.i18n('nov'), $.i18n('dec')];
	}
	if ($.fn.datebox) {
		$.fn.datebox.defaults.currentText = $.i18n('today');
		$.fn.datebox.defaults.closeText = $.i18n('close');
		$.fn.datebox.defaults.okText = $.i18n('ok');
	}
	if ($.fn.datetimebox && $.fn.datebox) {
		$.extend($.fn.datetimebox.defaults, {
			currentText: $.fn.datebox.defaults.currentText,
			closeText: $.fn.datebox.defaults.closeText,
			okText: $.fn.datebox.defaults.okText
		});
	}
	if ($.fn.switchbutton) {
		$.fn.switchbutton.defaults.onText = $.i18n('yes');
		$.fn.switchbutton.defaults.offText = $.i18n('no');
	}
	if ($.fn.panel) {
		$.fn.panel.defaults.loadingMessage = $.i18n('loading');
	}
	if ($.fn.propertygrid) {
		$.fn.propertygrid.defaultsloadMsg = $.i18n('loading');
		$.fn.propertygrid.defaults.columns = [];
	}
	$.map(['validatebox', 'textbox', 'passwordbox', 'filebox', 'searchbox',
		'combo', 'combobox', 'combogrid', 'combotree',
		'datebox', 'datetimebox', 'numberbox',
		'spinner', 'numberspinner', 'timespinner', 'datetimespinner'], function (plugin) {
			if ($.fn[plugin]) {
				$.fn[plugin].defaults.missingMessage = $.i18n('field_required');
			}
		});
	$.extend($.fn.validatebox.defaults.rules, {
		checkIP: {
			validator: function (value) {
				return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value);
			},
			message: $.i18n('checkip')
		},
		specialInput: {
			validator: function (value) {
				var format = /[!@#$%^&*()+\=\[\]{};':"\\|<>\/?]/;
				return !format.test(value);
			},
			message: $.i18n('specialinput')
		},
		confirmPass: {
			validator: function (value, param) {
				var pass = $(param[0]).passwordbox('getValue');
				return value == pass;
			},
			message: $.i18n('confirmpass')
		}
	});

}

(function ($) {
$.extend($.fn.datagrid.defaults.editors, {
	switchbutton: {
		init: function (container, options) {
			var input = $('<input>').appendTo(container);
			input.switchbutton(options);
			return input;
		},
		getValue: function (target) {
			return $(target).switchbutton('options').checked;
		},
		setValue: function (target, value) {
			$(target).switchbutton(value ? 'check' : 'uncheck');
		},
		resize: function (target, width) {
			$(target).switchbutton('resize', { width: width, height: 22 });
		}
	}
});
//$.extend($.fn.validatebox.defaults.rules, {
//	checkIP: {
//		validator: function (value) {
//			return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value);
//		},
//		message: "Nhập địa chỉ IP4 hợp lệ."
//	},
//	specialInput: {
//		validator: function (value) {
//			var format = /[!@#$%^&*()+\=\[\]{};':"\\|<>\/?]/;
//			return !format.test(value);
//		},
//		message: 'Không nhập các ký tự đặc biệt!'
//	},
//	confirmPass: {
//		validator: function (value, param) {
//			var pass = $(param[0]).passwordbox('getValue');
//			return value == pass;
//		},
//		message: 'Mật khẩu chưa trùng khớp!'
//	},
//	confirmCapcha: {
//		validator: function (value, param) {
//			var pass = $(param[0]).textbox('getValue');
//			return value == pass;
//		},
//		message: 'Chưa trùng khớp!'
//	}
//});
$.extend($.fn.textbox.methods, {
	setBorder: function (jq, border) {
		var style = $('#easyui-textbox-border');
		if (!style.length) {
			$('head').append(
				'<style id="easyui-textbox-border">' +
				'.textbox-noborder{border-color:transparent;border-radius:0}' +
				'</style>'
			);
		}
		return jq.each(function () {
			var span = $(this).next();
			if (border) {
				span.removeClass('textbox-noborder');
			} else {
				span.addClass('textbox-noborder');
			}
		});
	}
})
var origTreegrid_autoSizeColumn = $.fn.datagrid.methods['autoSizeColumn'];
$.extend($.fn.treegrid.methods, {
	autoSizeColumn: function (jq, field) {
		$.each(jq, function () {
			var opts = $(this).treegrid('options');
			if (!opts.skipAutoSizeColumns) {
				var tg_jq = $(this);
				if (field) origTreegrid_autoSizeColumn(tg_jq, field);
				else origTreegrid_autoSizeColumn(tg_jq);
			}
		});
	}
});
$.extend($.fn.textbox.methods, {
	addClearBtn: function (jq, iconCls) {
		return jq.each(function () {
			var t = $(this);
			var opts = t.textbox('options');
			opts.icons = opts.icons || [];
			opts.icons.unshift({
				iconCls: iconCls,
				handler: function (e) {
					$(e.data.target).textbox('clear').textbox('textbox').focus();
					$(this).css('visibility', 'hidden');
				}
			});
			t.textbox();
			if (!t.textbox('getText')) {
				t.textbox('getIcon', 0).css('visibility', 'hidden');
			}
			t.textbox('textbox').bind('keyup', function () {
				var icon = t.textbox('getIcon', 0);
				if ($(this).val()) {
					icon.css('visibility', 'visible');
				} else {
					icon.css('visibility', 'hidden');
				}
			});
		});
	}
});


	//function forNodes(data, callback) {
	//	var nodes = [];
	//	for (var i = 0; i < data.length; i++) {
	//		nodes.push(data[i]);
	//	}
	//	while (nodes.length) {
	//		var node = nodes.shift();
	//		if (callback(node) == false) { return; }
	//		if (node.children) {
	//			for (var i = node.children.length - 1; i >= 0; i--) {
	//				nodes.unshift(node.children[i]);
	//			}
	//		}
	//	}
	//}

	//$.extend($.fn.tree.methods, {
	//	doFilter: function (jq, text) {
	//		return jq.each(function () {
	//			var target = this;
	//			var data = $.data(target, 'tree').data;
	//			var ids = {};
	//			forNodes(data, function (node) {
	//				if (node.text.toLowerCase().indexOf(text.toLowerCase()) == -1) {
	//					$('#' + node.domId).hide();
	//				} else {
	//					$('#' + node.domId).show();
	//					ids[node.domId] = 1;
	//				}
	//			});
	//			for (var id in ids) {
	//				showParents(id);
	//			}

	//			function showParents(domId) {
	//				var p = $(target).tree('getParent', $('#' + domId)[0]);
	//				while (p) {
	//					$(p.target).show();
	//					p = $(target).tree('getParent', p.target);
	//				}
	//			}
	//		});
	//	}
	//});




if ($.fn.validatebox) {
	$.fn.validatebox.defaults.rules.email.message = 'Nhập email hợp lệ.';
	$.fn.validatebox.defaults.rules.url.message = 'Nhập ỦL hợp lệ.';
	$.fn.validatebox.defaults.rules.length.message = 'Nhập giá trị giữa {0} và {1}.';
	$.fn.validatebox.defaults.rules.remote.message = 'Vui lòng sửa trường này.';
}
$.extend($.fn.layout.methods, {
	close: function (jq, region) {
		return jq.each(function () {
			var c = $(this);
			closePanel(region);
			closePanel('expand' + region.substr(0, 1).toUpperCase() + region.substr(1));
			c.layout('resize');

			function closePanel(region) {
				var p = c.layout('panel', region);
				if (p) {
					p.panel('close');
				}
			}
		})
	},
	open: function (jq, region) {
		return jq.each(function () {
			var c = $(this);
			var p = $(this).layout('panel', region);
			var p1 = $(this).layout('panel', 'expand' + region.substr(0, 1).toUpperCase() + region.substr(1));
			if (p.panel('options').collapsed) {
				p1.panel('open');
			} else {
				p.panel('open');
			}
			$(this).layout('resize');
		})
	}
})

		function pagerFilter(data) {
			if ($.isArray(data)) {    // is array
				data = {
					total: data.length,
					rows: data
				}
			}
			var target = this;
			var dg = $(target);
			var state = dg.data('datagrid');
			var opts = dg.datagrid('options');
			if (!state.allRows) {
				state.allRows = (data.rows);
			}
			if (!opts.remoteSort && opts.sortName) {
				var names = opts.sortName.split(',');
				var orders = opts.sortOrder.split(',');
				state.allRows.sort(function (r1, r2) {
					var r = 0;
					for (var i = 0; i < names.length; i++) {
						var sn = names[i];
						var so = orders[i];
						var col = $(target).datagrid('getColumnOption', sn);
						var sortFunc = col.sorter || function (a, b) {
							return a == b ? 0 : (a > b ? 1 : -1);
						};
						r = sortFunc(r1[sn], r2[sn]) * (so == 'asc' ? 1 : -1);
						if (r != 0) {
							return r;
						}
					}
					return r;
				});
			}
			var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
			var end = start + parseInt(opts.pageSize);
			data.rows = state.allRows.slice(start, end);
			return data;
		}

		var loadDataMethod = $.fn.datagrid.methods.loadData;
		var deleteRowMethod = $.fn.datagrid.methods.deleteRow;
		$.extend($.fn.datagrid.methods, {
			clientPaging: function (jq) {
				return jq.each(function () {
					var dg = $(this);
					var state = dg.data('datagrid');
					var opts = state.options;
					opts.loadFilter = pagerFilter;
					var onBeforeLoad = opts.onBeforeLoad;
					opts.onBeforeLoad = function (param) {
						state.allRows = null;
						return onBeforeLoad.call(this, param);
					}
					var pager = dg.datagrid('getPager');
					pager.pagination({
						onSelectPage: function (pageNum, pageSize) {
							opts.pageNumber = pageNum;
							opts.pageSize = pageSize;
							pager.pagination('refresh', {
								pageNumber: pageNum,
								pageSize: pageSize
							});
							dg.datagrid('loadData', state.allRows);
						}
					});
					$(this).datagrid('loadData', state.data);
					//if (opts.url) {
					//	$(this).datagrid('reload');
					//}
				});
			},
			loadData: function (jq, data) {
				jq.each(function () {
					$(this).data('datagrid').allRows = null;
				});
				return loadDataMethod.call($.fn.datagrid.methods, jq, data);
			},
			deleteRow: function (jq, index) {
				return jq.each(function () {
					var row = $(this).datagrid('getRows')[index];
					deleteRowMethod.call($.fn.datagrid.methods, $(this), index);
					var state = $(this).data('datagrid');
					if (state.options.loadFilter == pagerFilter) {
						for (var i = 0; i < state.allRows.length; i++) {
							if (state.allRows[i] == row) {
								state.allRows.splice(i, 1);
								break;
							}
						}
						$(this).datagrid('loadData', state.allRows);
					}
				});
			},
			getAllRows: function (jq) {
				return jq.data('datagrid').allRows;
			}
		})



	//if ($.fn.menu) {
	//	$.extend($.fn.menu.defaults, {
	//		itemHeight: 30
	//	});
	//}
	//if ($.fn.tabs) {
	//	$.extend($.fn.tabs.defaults, {
	//		tabHeight: 27
	//	});
	//}
	//if ($.fn.datagrid) {
	//	$.extend($.fn.datagrid.defaults, {
	//		editorHeight: 24
	//	});
	//}
	//if ($.fn.treegrid) {
	//	$.extend($.fn.treegrid.defaults, {
	//		editorHeight: 24
	//	});
	//}
	//$.map(['validatebox', 'textbox', 'passwordbox', 'filebox', 'searchbox',
	//	'combo', 'combobox', 'combogrid', 'combotree',
	//	'datebox', 'datetimebox', 'numberbox',
	//	'spinner', 'numberspinner', 'timespinner', 'datetimespinner'], function (plugin) {
	//		if ($.fn[plugin]) {
	//			$.fn[plugin].defaults.iconWidth = 18;
	//		}
	//});

})(jQuery);



