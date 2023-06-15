var StatusOfDevices = {
	ReopenSocket: 0,
	countOpenSocket: -1,
	socket: null,
	socketexit: 1,
	init: function (socketexit) {
		clearInterval(StatusOfDevices.ReopenSocket);
		StatusOfDevices.countOpenSocket = 5;
		StatusOfDevices.socketexit = socketexit;
		if ("WebSocket" in window) {
			if (!StatusOfDevices.socket) {
				StatusOfDevices.opennew();
			} else {
				if (StatusOfDevices.socket.readyState == WebSocket.OPEN) {
					$("#infoSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} else if (StatusOfDevices.socket.readyState == WebSocket.CONNECTING) {
					$("#infoSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				} else if (StatusOfDevices.socket.readyState == WebSocket.CLOSING) {
					$("#infoSocket").html('<b>' + $.i18n('socket_closing') + '</b>');
				} else {
					StatusOfDevices.opennew();
				}

			}
			StatusOfDevices.socket.onerror = function (error) {
				var str = '<b>' + $.i18n('socket_err') + '</b>'
				$("#infoSocket").html(str);

			};
			StatusOfDevices.socket.onopen = function (event) {

				$("#infoSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				//message("<b>Cổng thông tin sự kiện đã được kết nối</b>");
			};
			StatusOfDevices.socket.onmessage = function (event) {
				var data = eval('(' + event.data + ')');
				if (data.machineid == -1) {
					$('#StatusDevices').tree('reload');
				} else {
					var node = $('#StatusDevices').tree('find', data.machineid);
					if (node) {
						$('#StatusDevices').tree('update', {
							target: node.target,
							iconCls: data.iconCls
						});
					}
				}
			};
			StatusOfDevices.socket.onclose = function (event) {
				//console.log(event)
				$("#infoSocket").html('<b>' + $.i18n('socket_closed') + '</b>');
				StatusOfDevices.ReopenSocket = setInterval(StatusOfDevices.TimerSocket, 1000);
			};
		} else {
			$("#infoSocket").html('<b>' + $.i18n('socket_not_support') + '</b>');
		}
	},
	close: function () {
		if (StatusOfDevices.socket.readyState == WebSocket.OPEN) {
			StatusOfDevices.socket.close();
		}
	},
	send: function () {
		var data = { action: 'close' };
		StatusOfDevices.socket.send(JSON.stringify(data));
	},

	opennew: function () {
		if (StatusOfDevices.socketexit == 0) {
			try {
				$("#infoSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				var hostname = window.location.hostname;
				var port = parseInt(window.location.port);
				var proto = String(window.location.protocol);
				if (!port) port = proto.includes('https') ? 443 : 80;
				var url = proto.includes('https') ? 'wss://' + hostname + ':' + port + '/statusofdevice' : 'ws://' + hostname + ':' + port + '/statusofdevice';
				StatusOfDevices.socket = null;
				StatusOfDevices.socket = new WebSocket(url);
				StatusOfDevices.socket.binaryType = 'arraybuffer';

			} catch (err) { message(err) }
		}
	},
	TimerSocket: function () {
		StatusOfDevices.countOpenSocket -= 1
		var str = $.i18n('socket_wait_connect', EventsOfDevices.countOpenSocket);
		$("#infoSocket").html('<b>' + str + '</b>');
		if (StatusOfDevices.countOpenSocket == 0) {
			clearInterval(StatusOfDevices.ReopenSocket);
			StatusOfDevices.countOpenSocket = 5;
			StatusOfDevices.init(StatusOfDevices.socketexit);
		}
	}
}
var EventsOfDevices = {
	ReopenSocket: 0,
	countOpenSocket: -1,
	socket: null,
	//machineid: 0,
	socketexit: 1,
	init: function (socketexit) {
		clearInterval(EventsOfDevices.ReopenSocket);
		EventsOfDevices.countOpenSocket = 5;
		EventsOfDevices.socketexit = socketexit;
		if ("WebSocket" in window) {
			if (!EventsOfDevices.socket) {
				EventsOfDevices.opennew();
			} else {
				if (EventsOfDevices.socket.readyState == WebSocket.OPEN) {
					$("#infoEventSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} else if (EventsOfDevices.socket.readyState == WebSocket.CONNECTING) {
					$("#infoEventSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				} else if (EventsOfDevices.socket.readyState == WebSocket.CLOSING) {
					$("#infoEventSocket").html('<b>' + $.i18n('socket_closed') + '</b>');
				} else {
					EventsOfDevices.opennew();
				}

			}
			EventsOfDevices.socket.onerror = function (error) {
				console.log(error);
				var str = '<b>' + $.i18n('socket_err') + '</b>'
				$("#infoEventSocket").html(str);

			};
			EventsOfDevices.socket.onopen = function (event) {
				try {
					$("#infoEventSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} catch (err) { console.log(err); }
			};
			EventsOfDevices.socket.onmessage = function (event) {
				var data = eval('(' + event.data + ')');
				if (data.eventinfokey) {
					var row = {
						timestr: data.timestr,
						eventinfo: $.i18n(data.eventnamekey),
						sessionname: data.devicename,
						colorcode: data.colorcode,
						info: GetInfoString(data),
						subinfo: data.subinfo
					}
					var opt1 = $('#swNewInfo').checkbox('options');
					if (opt1.checked == true) {
						$('#tbEvents').datagrid('insertRow', { index: 0, row: row });
					} else {
						$('#tbEvents').datagrid('appendRow', row);
					}
					var len = $('#tbEvents').datagrid('getRows').length;
					if (len > 200) {
						for (var i = 0; i < len - 200; i++) {
							$('#tbEvents').datagrid('deleteRow', i);
						}
					}
					//var opt1 = $('#swNewInfo').switchbutton('options');
					if (opt1.checked == false) {
						var lastIndex = $('#tbEvents').datagrid('getRows').length - 1;

						$('#tbEvents').datagrid('scrollTo', lastIndex);
					}
				} else {
					console.log(data);
                }
				
			};
			EventsOfDevices.socket.onclose = function (event) {
				try {
					$("#infoEventSocket").html('<b>' + $.i18n('socket_closed') + '</b>');
					EventsOfDevices.ReopenSocket = setInterval(EventsOfDevices.TimerSocket, 1000);
				} catch (err) { console.log(err); }
			};
		} else {
			$("#infoEventSocket").html('<b>' + $.i18n('socket_not_support') + '</b>');
		}
	},
	close: function () {
		if (EventsOfDevices.socket) {
			if (EventsOfDevices.socket.readyState == WebSocket.OPEN) {
				EventsOfDevices.socket.close();
			}
		}
	},
	send: function (data) {
		if (EventsOfDevices.socket.readyState == WebSocket.OPEN) {
			EventsOfDevices.socket.send(JSON.stringify(data));
		}
	},
	sendClose: function () {
		if (EventsOfDevices.socket.readyState == WebSocket.OPEN) {
			var data = { action: 'close' };
			EventsOfDevices.socket.send(JSON.stringify(data));
		}
	},
	opennew: function () {
		if (EventsOfDevices.socketexit == 0) {
			try {

				$("#infoEventSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				var hostname = window.location.hostname;
				var port = parseInt(window.location.port);
				var proto = String(window.location.protocol);
				if (!port) port = proto.includes('https') ? 443 : 80;
				var url = proto.includes('https') ? 'wss://' + hostname + ':' + port + '/eventsofdevice'
					: 'ws://' + hostname + ':' + port + '/eventsofdevice';
				EventsOfDevices.socket = null;
				EventsOfDevices.socket = new WebSocket(url);
				EventsOfDevices.socket.binaryType = 'arraybuffer';

			} catch (err) { message(err) }
		}
	},
	TimerSocket: function () {
		EventsOfDevices.countOpenSocket -= 1
		var str = $.i18n('socket_wait_connect', EventsOfDevices.countOpenSocket);
		$("#infoEventSocket").html('<b>' + str + '</b>');
		if (EventsOfDevices.countOpenSocket == 0) {
			clearInterval(EventsOfDevices.ReopenSocket);
			EventsOfDevices.countOpenSocket = 5;
			EventsOfDevices.init(EventsOfDevices.socketexit);
		}
	}
}

var StatusOfBasicCmdDevices = {
	ReopenSocket: 0,
	countOpenSocket: -1,
	socket: null,
	socketexit: 1,
	init: function (socketexit) {
		clearInterval(StatusOfBasicCmdDevices.ReopenSocket);
		StatusOfBasicCmdDevices.countOpenSocket = 5;
		StatusOfBasicCmdDevices.socketexit = socketexit;
		if ("WebSocket" in window) {
			if (!StatusOfBasicCmdDevices.socket) {
				StatusOfBasicCmdDevices.opennew();
			} else {
				if (StatusOfBasicCmdDevices.socket.readyState == WebSocket.OPEN) {
					$("#infoBasicCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} else if (StatusOfBasicCmdDevices.socket.readyState == WebSocket.CONNECTING) {
					$("#infoBasicCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				} else if (StatusOfBasicCmdDevices.socket.readyState == WebSocket.CLOSING) {
					$("#infoBasicCmdSocket").html('<b>' + $.i18n('socket_closing') + '</b>');
				} else {
					StatusOfBasicCmdDevices.opennew();
				}

			}
			StatusOfBasicCmdDevices.socket.onerror = function (error) {
				 var str = '<b>' + $.i18n('socket_err') + '</b>'
				$("#infoBasicCmdSocket").html(str);

			};
			StatusOfBasicCmdDevices.socket.onopen = function (event) {
				$("#infoBasicCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
			};
			StatusOfBasicCmdDevices.socket.onmessage = function (event) {
				var data = eval('(' + event.data + ')');
				if (data.machineid == -1) {
					$('#BasicCmdDevices').tree('reload');
				} else {
					var node = $('#BasicCmdDevices').tree('find', data.machineid);
					if (node) {
						$('#BasicCmdDevices').tree('update', {
							target: node.target,
							iconCls: data.iconCls
						});
					}
				}
			};
			StatusOfBasicCmdDevices.socket.onclose = function (event) {
				$("#infoBasicCmdSocket").html('<b>' + $.i18n('socket_closed') + '</b>');
				StatusOfBasicCmdDevices.ReopenSocket = setInterval(StatusOfBasicCmdDevices.TimerSocket, 1000);
			};
		} else {
			$("#infoBasicCmdSocket").html('<b>' + $.i18n('socket_not_support') + '</b>');
		}
	},
	close: function () {
		if (StatusOfBasicCmdDevices.socket.readyState == WebSocket.OPEN) {
			StatusOfBasicCmdDevices.socket.close();
		}
	},
	send: function () {
		var data = { action: 'close' };
		StatusOfBasicCmdDevices.socket.send(JSON.stringify(data));
	},

	opennew: function () {
		if (StatusOfBasicCmdDevices.socketexit == 0) {
			try {
				$("#infoBasicCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				var hostname = window.location.hostname;
				var port = parseInt(window.location.port);
				var proto = String(window.location.protocol);
				if (!port) port = proto.includes('https') ? 443 : 80;
				var url = proto.includes('https') ? 'wss://' + hostname + ':' + port + '/statusofdevice' : 'ws://' + hostname + ':' + port + '/statusofdevice';
				StatusOfBasicCmdDevices.socket = null;
				StatusOfBasicCmdDevices.socket = new WebSocket(url);
				StatusOfBasicCmdDevices.socket.binaryType = 'arraybuffer';

			} catch (err) { message(err) }
		}
	},
	TimerSocket: function () {
		StatusOfBasicCmdDevices.countOpenSocket -= 1
		var str = $.i18n('socket_wait_connect', StatusOfBasicCmdDevices.countOpenSocket);
		$("#infoBasicCmdSocket").html('<b>' + str + '</b>');
		if (StatusOfBasicCmdDevices.countOpenSocket == 0) {
			clearInterval(StatusOfBasicCmdDevices.ReopenSocket);
			StatusOfBasicCmdDevices.countOpenSocket = 5;
			StatusOfBasicCmdDevices.init(StatusOfBasicCmdDevices.socketexit);
		}
	}
}
var EventsOfCommands = {
	ReopenSocket: null,
	countOpenSocket: -1,
	socket: null,
	machineids: null,
	socketexit: 1,
	clientID: "",
	init: function (socketexit) {
		clearInterval(EventsOfCommands.ReopenSocket);
		EventsOfCommands.countOpenSocket = 5;
		EventsOfCommands.socketexit = socketexit;
		if ("WebSocket" in window) {
			if (!EventsOfCommands.socket) {
				EventsOfCommands.opennew();
			} else {
				if (EventsOfCommands.socket.readyState == WebSocket.OPEN) {
					$("#infoEventCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} else if (EventsOfCommands.socket.readyState == WebSocket.CONNECTING) {
					$("#infoEventCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				} else if (EventsOfCommands.socket.readyState == WebSocket.CLOSING) {
					$("#infoEventCmdSocket").html('<b>' + $.i18n('socket_closing') + '</b>');
				} else {
					EventsOfCommands.opennew();
				}

			}
			EventsOfCommands.socket.onerror = function (error) {
				var str = '<b>' + $.i18n('socket_err') + '</b>'
				$("#infoEventCmdSocket").html(str);

			};
			EventsOfCommands.socket.onopen = function (event) {
				try {
					$("#infoEventCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} catch (err) { console.log(err); }
			};
			EventsOfCommands.socket.onmessage = function (event) {
				var data = eval('(' + event.data + ')');
				if (data.eventinfokey) {
					var row = {
						timestr: data.timestr,
						eventinfo: $.i18n(data.eventnamekey),
						sessionname: data.devicename,
						colorcode: data.colorcode,
						info: GetInfoString(data),
						subinfo: data.subinfo
					}
					$('#tbCmdEvents').datagrid('appendRow', row);
					var len = $('#tbCmdEvents').datagrid('getRows').length;
					if (len > 200) {
						for (var i = 0; i < len - 200; i++) {
							$('#tbCmdEvents').datagrid('deleteRow', i);
						}
					}
					len = $('#tbCmdEvents').datagrid('getRows').length;
					$('#tbCmdEvents').datagrid('scrollTo', len - 1);
				} else {
					console.log(data);
				}
			};
			EventsOfCommands.socket.onclose = function (event) {
				try {
					$("#infoEventCmdSocket").html('<b>' + $.i18n('socket_closed') + '</b>');
					EventsOfCommands.ReopenSocket = setInterval(EventsOfCommands.TimerSocket, 1000);
				} catch (err) { console.log(err); }
			};
		} else {
			$("#infoEventCmdSocket").html('<b>' + $.i18n('socket_not_support') + '</b>');
		}
	},
	close: function () {
		if (EventsOfCommands.socket) {
			if (EventsOfCommands.socket.readyState == WebSocket.OPEN) {
				EventsOfCommands.socket.close();
			}
		}
	},
	sendClose: function () {
		if (EventsOfCommands.socket.readyState == WebSocket.OPEN) {
			var data = { action: 'close' };
			EventsOfCommands.socket.send(JSON.stringify(data));
		}
	},
	send: function (data) {
		if (EventsOfCommands.socket.readyState == WebSocket.OPEN) {
			EventsOfCommands.socket.send(JSON.stringify(data));
		}
	},
	sendmachineids: function () {
		if (EventsOfCommands.socket.readyState == WebSocket.OPEN) {
			var data = { machineids: EventsOfCommands.machineids };
			EventsOfCommands.socket.send(JSON.stringify(data));
		}
	},
	opennew: function () {
		if (EventsOfCommands.socketexit == 0) {
			try {

				$("#infoEventCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				var hostname = window.location.hostname;
				var port = parseInt(window.location.port);
				var proto = String(window.location.protocol);
				if (!port) port = proto.includes('https') ? 443 : 80;
				var url = proto.includes('https') ? 'wss://' + hostname + ':' + port + '/eventsofcommands?clientid=' + EventsOfCommands.clientID
					: 'ws://' + hostname + ':' + port + '/eventsofcommands?clientid=' + EventsOfCommands.clientID;
				EventsOfCommands.socket = null;
				EventsOfCommands.socket = new WebSocket(url);
				EventsOfCommands.socket.binaryType = 'arraybuffer';

			} catch (err) { message(err) }
		}
	},
	TimerSocket: function () {
		EventsOfCommands.countOpenSocket -= 1
		var str = $.i18n('socket_wait_connect', EventsOfCommands.countOpenSocket);
		$("#infoEventCmdSocket").html('<b>' + str + '</b>');
		if (EventsOfCommands.countOpenSocket == 0) {
			clearInterval(EventsOfCommands.ReopenSocket);
			EventsOfCommands.countOpenSocket = 5;
			EventsOfCommands.init(EventsOfCommands.socketexit);
		}
	}
}

var StatusOfUserCmdDevices = {
	ReopenSocket: 0,
	countOpenSocket: -1,
	socket: null,
	socketexit: 1,
	init: function (socketexit) {
		clearInterval(StatusOfUserCmdDevices.ReopenSocket);
		StatusOfUserCmdDevices.countOpenSocket = 5;
		StatusOfUserCmdDevices.socketexit = socketexit;
		if ("WebSocket" in window) {
			if (!StatusOfUserCmdDevices.socket) {
				StatusOfUserCmdDevices.opennew();
			} else {
				if (StatusOfUserCmdDevices.socket.readyState == WebSocket.OPEN) {
					$("#infoUserCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} else if (StatusOfUserCmdDevices.socket.readyState == WebSocket.CONNECTING) {
					$("#infoUserCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				} else if (StatusOfUserCmdDevices.socket.readyState == WebSocket.CLOSING) {
					$("#infoUserCmdSocket").html('<b>' + $.i18n('socket_closing') + '</b>');
				} else {
					StatusOfUserCmdDevices.opennew();
				}

			}
			StatusOfUserCmdDevices.socket.onerror = function (error) {
				var str = '<b>' + $.i18n('socket_err') + '</b>'
				$("#infoUserCmdSocket").html(str);

			};
			StatusOfUserCmdDevices.socket.onopen = function (event) {
				$("#infoUserCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
			};
			StatusOfUserCmdDevices.socket.onmessage = function (event) {
				var data = eval('(' + event.data + ')');
				if (data.machineid == -1) {
					$('#UserCmdDevices').tree('reload');
				} else {
					var node = $('#UserCmdDevices').tree('find', data.machineid);
					if (node) {
						$('#UserCmdDevices').tree('update', {
							target: node.target,
							iconCls: data.iconCls
						});
					}
				}
			};
			StatusOfUserCmdDevices.socket.onclose = function (event) {
				$("#infoUserCmdSocket").html('<b>' + $.i18n('socket_closed') + '</b>');
				StatusOfUserCmdDevices.ReopenSocket = setInterval(StatusOfUserCmdDevices.TimerSocket, 1000);
			};
		} else {
			$("#infoUserCmdSocket").html('<b>' + $.i18n('socket_not_support') + '</b>');
		}
	},
	close: function () {
		if (StatusOfUserCmdDevices.socket.readyState == WebSocket.OPEN) {
			StatusOfUserCmdDevices.socket.close();
		}
	},
	send: function () {
		var data = { action: 'close' };
		StatusOfUserCmdDevices.socket.send(JSON.stringify(data));
	},

	opennew: function () {
		if (StatusOfUserCmdDevices.socketexit == 0) {
			try {
				$("#infoUserCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				var hostname = window.location.hostname;
				var port = parseInt(window.location.port);
				var proto = String(window.location.protocol);
				if (!port) port = proto.includes('https') ? 443 : 80;
				var url = proto.includes('https') ? 'wss://' + hostname + ':' + port + '/statusofdevice' : 'ws://' + hostname + ':' + port + '/statusofdevice';
				StatusOfUserCmdDevices.socket = null;
				StatusOfUserCmdDevices.socket = new WebSocket(url);
				StatusOfUserCmdDevices.socket.binaryType = 'arraybuffer';

			} catch (err) { message(err) }
		}
	},
	TimerSocket: function () {
		StatusOfUserCmdDevices.countOpenSocket -= 1
		var str = $.i18n('socket_wait_connect', StatusOfUserCmdDevices.countOpenSocket );
		$("#infoUserCmdSocket").html('<b>' + str + '</b>');
		if (StatusOfUserCmdDevices.countOpenSocket == 0) {
			clearInterval(StatusOfUserCmdDevices.ReopenSocket);
			StatusOfUserCmdDevices.countOpenSocket = 5;
			StatusOfUserCmdDevices.init(StatusOfUserCmdDevices.socketexit);
		}
	}
}
var EventsOfUserCommands = {
	ReopenSocket: null,
	countOpenSocket: -1,
	socket: null,
	machineids: null,
	socketexit: 1,
	clientID: "",
	init: function (socketexit) {
		clearInterval(EventsOfUserCommands.ReopenSocket);
		EventsOfUserCommands.countOpenSocket = 5;
		EventsOfUserCommands.socketexit = socketexit;
		if ("WebSocket" in window) {
			if (!EventsOfUserCommands.socket) {
				EventsOfUserCommands.opennew();
			} else {
				if (EventsOfUserCommands.socket.readyState == WebSocket.OPEN) {
					$("#infoEventUserCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} else if (EventsOfUserCommands.socket.readyState == WebSocket.CONNECTING) {
					$("#infoEventUserCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				} else if (EventsOfUserCommands.socket.readyState == WebSocket.CLOSING) {
					$("#infoEventUserCmdSocket").html('<b>' + $.i18n('socket_closing') + '</b>');
				} else {
					EventsOfUserCommands.opennew();
				}

			}
			EventsOfUserCommands.socket.onerror = function (error) {
				var str = '<b>' + $.i18n('socket_err') + '</b>'
				$("#infoEventUserCmdSocket").html(str);

			};
			EventsOfUserCommands.socket.onopen = function (event) {
				try {
					$("#infoEventUserCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} catch (err) { console.log(err); }
			};
			EventsOfUserCommands.socket.onmessage = function (event) {
				var data = eval('(' + event.data + ')');
				if (data.eventinfokey) {
					var row = {
						timestr: data.timestr,
						eventinfo: $.i18n(data.eventnamekey),
						sessionname: data.devicename,
						colorcode: data.colorcode,
						info: GetInfoString(data),
						subinfo: data.subinfo
					}
					$('#tbUserCmdEvents').datagrid('appendRow', row);
					var len = $('#tbUserCmdEvents').datagrid('getRows').length;
					if (len > 200) {
						for (var i = 0; i < len - 200; i++) {
							$('#tbUserCmdEvents').datagrid('deleteRow', i);
						}
					}
					len = $('#tbUserCmdEvents').datagrid('getRows').length;
					$('#tbUserCmdEvents').datagrid('scrollTo', len - 1);
				} else {
					console.log(data);
				}
			};
			EventsOfUserCommands.socket.onclose = function (event) {
				try {
					$("#infoEventUserCmdSocket").html('<b>' + $.i18n('socket_closed') + '</b>');
					EventsOfUserCommands.ReopenSocket = setInterval(EventsOfUserCommands.TimerSocket, 1000);
				} catch (err) { console.log(err); }
			};
		} else {
			$("#infoEventUserCmdSocket").html('<b>' + $.i18n('socket_not_support') + '</b>');
		}
	},
	close: function () {
		if (EventsOfUserCommands.socket) {
			if (EventsOfUserCommands.socket.readyState == WebSocket.OPEN) {
				EventsOfUserCommands.socket.close();
			}
		}
	},
	sendClose: function () {
		if (EventsOfUserCommands.socket.readyState == WebSocket.OPEN) {
			var data = { action: 'close' };
			EventsOfUserCommands.socket.send(JSON.stringify(data));
		}
	},
	send: function (data) {
		if (EventsOfUserCommands.socket.readyState == WebSocket.OPEN) {
			EventsOfUserCommands.socket.send(JSON.stringify(data));
		}
	},
	sendmachineids: function () {
		if (EventsOfUserCommands.socket.readyState == WebSocket.OPEN) {
			var data = { machineids: EventsOfUserCommands.machineids };
			EventsOfUserCommands.socket.send(JSON.stringify(data));
		}
	},
	opennew: function () {
		if (EventsOfUserCommands.socketexit == 0) {
			try {

				$("#infoEventUserCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				var hostname = window.location.hostname;
				var port = parseInt(window.location.port);
				var proto = String(window.location.protocol);
				if (!port) port = proto.includes('https') ? 443 : 80;
				var url = proto.includes('https') ? 'wss://' + hostname + ':' + port + '/eventsofusercommands?clientid=' + EventsOfUserCommands.clientID
					: 'ws://' + hostname + ':' + port + '/eventsofusercommands?clientid=' + EventsOfUserCommands.clientID;
				EventsOfUserCommands.socket = null;
				EventsOfUserCommands.socket = new WebSocket(url);
				EventsOfUserCommands.socket.binaryType = 'arraybuffer';

			} catch (err) { message(err) }
		}
	},
	TimerSocket: function () {
		EventsOfUserCommands.countOpenSocket -= 1
		var str = $.i18n('socket_wait_connect', EventsOfUserCommands.countOpenSocket );
		$("#infoEventUserCmdSocket").html('<b>' + str + '</b>');
		if (EventsOfUserCommands.countOpenSocket == 0) {
			clearInterval(EventsOfUserCommands.ReopenSocket);
			EventsOfUserCommands.countOpenSocket = 5;
			EventsOfUserCommands.init(EventsOfUserCommands.socketexit);
		}
	}
}

var StatusOfUserDevDevices = {
	ReopenSocket: 0,
	countOpenSocket: -1,
	socket: null,
	socketexit: 1,
	init: function (socketexit) {
		clearInterval(StatusOfUserDevDevices.ReopenSocket);
		StatusOfUserDevDevices.countOpenSocket = 5;
		StatusOfUserDevDevices.socketexit = socketexit;
		if ("WebSocket" in window) {
			if (!StatusOfUserDevDevices.socket) {
				StatusOfUserDevDevices.opennew();
			} else {
				if (StatusOfUserDevDevices.socket.readyState == WebSocket.OPEN) {
					$("#infoUserDevSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} else if (StatusOfUserDevDevices.socket.readyState == WebSocket.CONNECTING) {
					$("#infoUserDevSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				} else if (StatusOfUserDevDevices.socket.readyState == WebSocket.CLOSING) {
					$("#infoUserDevSocket").html('<b>' + $.i18n('socket_closing') + '</b>');
				} else {
					StatusOfUserDevDevices.opennew();
				}

			}
			StatusOfUserDevDevices.socket.onerror = function (error) {
				var str = '<b>' + $.i18n('socket_err') + '</b>'
				$("#infoUserDevSocket").html(str);

			};
			StatusOfUserDevDevices.socket.onopen = function (event) {
				$("#infoUserDevSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
			};
			StatusOfUserDevDevices.socket.onmessage = function (event) {
				var data = eval('(' + event.data + ')');
				if (data.machineid == -1) {
					$('#UserDevCmdDevices').tree('reload');
				} else {
					var node = $('#UserDevCmdDevices').tree('find', data.machineid);
					if (node) {
						$('#UserDevCmdDevices').tree('update', {
							target: node.target,
							iconCls: data.iconCls
						});
					}
				}
			};
			StatusOfUserDevDevices.socket.onclose = function (event) {
				$("#infoUserDevSocket").html('<b>' + $.i18n('socket_closed') + '</b>');
				StatusOfUserDevDevices.ReopenSocket = setInterval(StatusOfUserDevDevices.TimerSocket, 1000);
			};
		} else {
			$("#infoUserDevSocket").html('<b>' + $.i18n('socket_not_support') + '</b>');
		}
	},
	close: function () {
		if (StatusOfUserDevDevices.socket.readyState == WebSocket.OPEN) {
			StatusOfUserDevDevices.socket.close();
		}
	},
	send: function () {
		var data = { action: 'close' };
		StatusOfUserDevDevices.socket.send(JSON.stringify(data));
	},

	opennew: function () {
		if (StatusOfUserDevDevices.socketexit == 0) {
			try {
				$("#infoUserDevSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				var hostname = window.location.hostname;
				var port = parseInt(window.location.port);
				var proto = String(window.location.protocol);
				if (!port) port = proto.includes('https') ? 443 : 80;
				var url = proto.includes('https') ? 'wss://' + hostname + ':' + port + '/statusofdevice' : 'ws://' + hostname + ':' + port + '/statusofdevice';
				StatusOfUserDevDevices.socket = null;
				StatusOfUserDevDevices.socket = new WebSocket(url);
				StatusOfUserDevDevices.socket.binaryType = 'arraybuffer';

			} catch (err) { message(err) }
		}
	},
	TimerSocket: function () {
		StatusOfUserDevDevices.countOpenSocket -= 1
		var str = $.i18n('socket_wait_connect', StatusOfUserDevDevices.countOpenSocket);
		$("#infoUserDevSocket").html('<b>' + str + '</b>');
		if (StatusOfUserDevDevices.countOpenSocket == 0) {
			clearInterval(StatusOfUserDevDevices.ReopenSocket);
			StatusOfUserDevDevices.countOpenSocket = 5;
			StatusOfUserDevDevices.init(StatusOfUserDevDevices.socketexit);
		}
	}
}
var EventsOfUserDevCommands = {
	ReopenSocket: null,
	countOpenSocket: -1,
	socket: null,
	machineids: null,
	socketexit: 1,
	clientID: "",
	init: function (socketexit) {
		clearInterval(EventsOfUserDevCommands.ReopenSocket);
		EventsOfUserDevCommands.countOpenSocket = 5;
		EventsOfUserDevCommands.socketexit = socketexit;
		if ("WebSocket" in window) {
			if (!EventsOfUserDevCommands.socket) {
				EventsOfUserDevCommands.opennew();
			} else {
				if (EventsOfUserDevCommands.socket.readyState == WebSocket.OPEN) {
					$("#infoUserDevCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} else if (EventsOfUserDevCommands.socket.readyState == WebSocket.CONNECTING) {
					$("#infoUserDevCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				} else if (EventsOfUserDevCommands.socket.readyState == WebSocket.CLOSING) {
					$("#infoUserDevCmdSocket").html('<b>' + $.i18n('socket_closing') + '</b>');
				} else {
					EventsOfUserDevCommands.opennew();
				}

			}
			EventsOfUserDevCommands.socket.onerror = function (error) {
				var str = '<b>' + $.i18n('socket_err') + '</b>'
				$("#infoUserDevCmdSocket").html(str);

			};
			EventsOfUserDevCommands.socket.onopen = function (event) {
				try {
					$("#infoUserDevCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} catch (err) { console.log(err); }
			};
			EventsOfUserDevCommands.socket.onmessage = function (event) {
				var data = eval('(' + event.data + ')');
				if (data.eventinfokey) {
					var row = {
						timestr: data.timestr,
						eventinfo: $.i18n(data.eventnamekey),
						sessionname: data.devicename,
						colorcode: data.colorcode,
						info: GetInfoString(data),
						subinfo: data.subinfo
					}
					$('#tbUserDevCmdEvent').datagrid('appendRow', row);
					var len = $('#tbUserDevCmdEvent').datagrid('getRows').length;
					if (len > 200) {
						for (var i = 0; i < len - 200; i++) {
							$('#tbUserDevCmdEvent').datagrid('deleteRow', i);
						}
					}
					len = $('#tbUserDevCmdEvent').datagrid('getRows').length;
					$('#tbUserDevCmdEvent').datagrid('scrollTo', len - 1);
				} else {
					console.log(data);
				}
			};
			EventsOfUserDevCommands.socket.onclose = function (event) {
				try {
					$("#infoUserDevCmdSocket").html('<b>' + $.i18n('socket_closed') + '</b>');
					EventsOfUserDevCommands.ReopenSocket = setInterval(EventsOfUserDevCommands.TimerSocket, 1000);
				} catch (err) { console.log(err); }
			};
		} else {
			$("#infoUserDevCmdSocket").html('<b>' + $.i18n('socket_not_support') + '</b>');
		}
	},
	close: function () {
		if (EventsOfUserDevCommands.socket) {
			if (EventsOfUserDevCommands.socket.readyState == WebSocket.OPEN) {
				EventsOfUserDevCommands.socket.close();
			}
		}
	},
	sendClose: function () {
		if (EventsOfUserDevCommands.socket.readyState == WebSocket.OPEN) {
			var data = { action: 'close' };
			EventsOfUserDevCommands.socket.send(JSON.stringify(data));
		}
	},
	send: function (data) {
		if (EventsOfUserDevCommands.socket.readyState == WebSocket.OPEN) {
			EventsOfUserDevCommands.socket.send(JSON.stringify(data));
		}
	},
	sendmachineids: function () {
		if (EventsOfUserDevCommands.socket.readyState == WebSocket.OPEN) {
			var data = { machineids: EventsOfUserDevCommands.machineids };
			EventsOfUserDevCommands.socket.send(JSON.stringify(data));
		}
	},
	opennew: function () {
		if (EventsOfUserDevCommands.socketexit == 0) {
			try {

				$("#infoUserDevCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				var hostname = window.location.hostname;
				var port = parseInt(window.location.port);
				var proto = String(window.location.protocol);
				if (!port) port = proto.includes('https') ? 443 : 80;
				var url = proto.includes('https') ? 'wss://' + hostname + ':' + port + '/eventsofusercommands?clientid=' + EventsOfUserDevCommands.clientID
					: 'ws://' + hostname + ':' + port + '/eventsofusercommands?clientid=' + EventsOfUserDevCommands.clientID;
				EventsOfUserDevCommands.socket = null;
				EventsOfUserDevCommands.socket = new WebSocket(url);
				EventsOfUserDevCommands.socket.binaryType = 'arraybuffer';

			} catch (err) { message(err) }
		}
	},
	TimerSocket: function () {
		EventsOfUserDevCommands.countOpenSocket -= 1
		var str = $.i18n('socket_wait_connect', EventsOfUserDevCommands.countOpenSocket);
		$("#infoUserDevCmdSocket").html('<b>' + str + '</b>');
		if (EventsOfUserDevCommands.countOpenSocket == 0) {
			clearInterval(EventsOfUserDevCommands.ReopenSocket);
			EventsOfUserDevCommands.countOpenSocket = 5;
			EventsOfUserDevCommands.init(EventsOfUserDevCommands.socketexit);
		}
	}
}

var StatusOfEnrollCmdDevices = {
	ReopenSocket: 0,
	countOpenSocket: -1,
	socket: null,
	socketexit: 1,
	init: function (socketexit) {
		clearInterval(StatusOfEnrollCmdDevices.ReopenSocket);
		StatusOfEnrollCmdDevices.countOpenSocket = 5;
		StatusOfEnrollCmdDevices.socketexit = socketexit;
		if ("WebSocket" in window) {
			if (!StatusOfEnrollCmdDevices.socket) {
				StatusOfEnrollCmdDevices.opennew();
			} else {
				if (StatusOfEnrollCmdDevices.socket.readyState == WebSocket.OPEN) {
					$("#infoEnrollCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} else if (StatusOfEnrollCmdDevices.socket.readyState == WebSocket.CONNECTING) {
					$("#infoEnrollCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				} else if (StatusOfEnrollCmdDevices.socket.readyState == WebSocket.CLOSING) {
					$("#infoEnrollCmdSocket").html('<b>' + $.i18n('socket_closing') + '</b>');
				} else {
					StatusOfEnrollCmdDevices.opennew();
				}

			}
			StatusOfEnrollCmdDevices.socket.onerror = function (error) {
				var str = '<b>' + $.i18n('socket_err') + '</b>'
				$("#infoEnrollCmdSocket").html(str);

			};
			StatusOfEnrollCmdDevices.socket.onopen = function (event) {
				$("#infoEnrollCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
			};
			StatusOfEnrollCmdDevices.socket.onmessage = function (event) {
				var data = eval('(' + event.data + ')');
				if (data.machineid == -1) {
					$('#treeEnrollDev').tree('reload');
				} else {
					var node = $('#treeEnrollDev').tree('find', data.machineid);
					if (node) {
						$('#treeEnrollDev').tree('update', {
							target: node.target,
							iconCls: data.iconCls
						});
					}
				}
			};
			StatusOfEnrollCmdDevices.socket.onclose = function (event) {
				$("#infoEnrollCmdSocket").html('<b>' + $.i18n('socket_closed') + '</b>');
				StatusOfEnrollCmdDevices.ReopenSocket = setInterval(StatusOfEnrollCmdDevices.TimerSocket, 1000);
			};
		} else {
			$("#infoEnrollCmdSocket").html('<b>' + $.i18n('socket_not_support') + '</b>');
		}
	},
	close: function () {
		if (StatusOfEnrollCmdDevices.socket.readyState == WebSocket.OPEN) {
			StatusOfEnrollCmdDevices.socket.close();
		}
	},
	send: function () {
		var data = { action: 'close' };
		StatusOfEnrollCmdDevices.socket.send(JSON.stringify(data));
	},

	opennew: function () {
		if (StatusOfEnrollCmdDevices.socketexit == 0) {
			try {
				$("#infoEnrollCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				var hostname = window.location.hostname;
				var port = parseInt(window.location.port);
				var proto = String(window.location.protocol);
				if (!port) port = proto.includes('https') ? 443 : 80;
				var url = proto.includes('https') ? 'wss://' + hostname + ':' + port + '/statusofdevice' : 'ws://' + hostname + ':' + port + '/statusofdevice';
				StatusOfEnrollCmdDevices.socket = null;
				StatusOfEnrollCmdDevices.socket = new WebSocket(url);
				StatusOfEnrollCmdDevices.socket.binaryType = 'arraybuffer';

			} catch (err) { message(err) }
		}
	},
	TimerSocket: function () {
		StatusOfEnrollCmdDevices.countOpenSocket -= 1
		var str = $.i18n('socket_wait_connect', StatusOfEnrollCmdDevices.countOpenSocket);
		$("#infoEnrollCmdSocket").html('<b>' + str + '</b>');
		if (StatusOfEnrollCmdDevices.countOpenSocket == 0) {
			clearInterval(StatusOfEnrollCmdDevices.ReopenSocket);
			StatusOfEnrollCmdDevices.countOpenSocket = 5;
			StatusOfEnrollCmdDevices.init(StatusOfEnrollCmdDevices.socketexit);
		}
	}
}
var EventsOfEnrollCommands = {
	ReopenSocket: null,
	countOpenSocket: -1,
	socket: null,
	machineids: null,
	socketexit: 1,
	clientID: "",
	init: function (socketexit) {
		clearInterval(EventsOfEnrollCommands.ReopenSocket);
		EventsOfEnrollCommands.countOpenSocket = 5;
		EventsOfEnrollCommands.socketexit = socketexit;
		if ("WebSocket" in window) {
			if (!EventsOfEnrollCommands.socket) {
				EventsOfEnrollCommands.opennew();
			} else {
				if (EventsOfEnrollCommands.socket.readyState == WebSocket.OPEN) {
					$("#infoEventEnrollCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} else if (EventsOfEnrollCommands.socket.readyState == WebSocket.CONNECTING) {
					$("#infoEventEnrollCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				} else if (EventsOfEnrollCommands.socket.readyState == WebSocket.CLOSING) {
					$("#infoEventEnrollCmdSocket").html('<b>' + $.i18n('socket_closing') + '</b>');
				} else {
					EventsOfEnrollCommands.opennew();
				}

			}
			EventsOfEnrollCommands.socket.onerror = function (error) {
				var str = '<b>' + $.i18n('socket_err') + '</b>'
				$("#infoEventEnrollCmdSocket").html(str);

			};
			EventsOfEnrollCommands.socket.onopen = function (event) {
				try {
					$("#infoEventEnrollCmdSocket").html('<b>' + $.i18n('socket_connected') + '</b>');
				} catch (err) { console.log(err); }
			};
			EventsOfEnrollCommands.socket.onmessage = function (event) {
				var data = eval('(' + event.data + ')');
				if (data.eventinfokey) {
					var row = {
						timestr: data.timestr,
						eventinfo: $.i18n(data.eventnamekey),
						sessionname: data.devicename,
						colorcode: data.colorcode,
						info: GetInfoString(data),
						subinfo: data.subinfo
					}
					$('#tbEnrollEvents').datagrid('appendRow', row);
					var len = $('#tbEnrollEvents').datagrid('getRows').length;
					if (len > 200) {
						for (var i = 0; i < len - 200; i++) {
							$('#tbEnrollEvents').datagrid('deleteRow', i);
						}
					}
					len = $('#tbEnrollEvents').datagrid('getRows').length;
					$('#tbEnrollEvents').datagrid('scrollTo', len - 1);
				} else {
					console.log(data);
				}
			};
			EventsOfEnrollCommands.socket.onclose = function (event) {
				try {
					$("#infoEventEnrollCmdSocket").html('<b>' + $.i18n('socket_closed') + '</b>');
					EventsOfEnrollCommands.ReopenSocket = setInterval(EventsOfEnrollCommands.TimerSocket, 1000);
				} catch (err) { console.log(err); }
			};
		} else {
			$("#infoEventEnrollCmdSocket").html('<b>' + $.i18n('socket_not_support') + '</b>');
		}
	},
	close: function () {
		if (EventsOfEnrollCommands.socket) {
			if (EventsOfEnrollCommands.socket.readyState == WebSocket.OPEN) {
				EventsOfEnrollCommands.socket.close();
			}
		}
	},
	sendClose: function () {
		if (EventsOfEnrollCommands.socket.readyState == WebSocket.OPEN) {
			var data = { action: 'close' };
			EventsOfEnrollCommands.socket.send(JSON.stringify(data));
		}
	},
	send: function (data) {
		if (EventsOfEnrollCommands.socket.readyState == WebSocket.OPEN) {
			EventsOfEnrollCommands.socket.send(JSON.stringify(data));
		}
	},
	sendmachineids: function () {
		if (EventsOfEnrollCommands.socket.readyState == WebSocket.OPEN) {
			var data = { machineids: EventsOfEnrollCommands.machineids };
			EventsOfEnrollCommands.socket.send(JSON.stringify(data));
		}
	},
	opennew: function () {
		if (EventsOfEnrollCommands.socketexit == 0) {
			try {

				$("#infoEventEnrollCmdSocket").html('<b>' + $.i18n('socket_connecting') + '</b>');
				var hostname = window.location.hostname;
				var port = parseInt(window.location.port);
				var proto = String(window.location.protocol);
				if (!port) port = proto.includes('https') ? 443 : 80;
				var url = proto.includes('https') ? 'wss://' + hostname + ':' + port + '/eventsofenrollcommands?clientid=' + EventsOfEnrollCommands.clientID
					: 'ws://' + hostname + ':' + port + '/eventsofenrollcommands?clientid=' + EventsOfEnrollCommands.clientID;
				EventsOfEnrollCommands.socket = null;
				EventsOfEnrollCommands.socket = new WebSocket(url);
				EventsOfEnrollCommands.socket.binaryType = 'arraybuffer';

			} catch (err) { message(err) }
		}
	},
	TimerSocket: function () {
		EventsOfEnrollCommands.countOpenSocket -= 1
		var str = $.i18n('socket_wait_connect', EventsOfEnrollCommands.countOpenSocket);
		$("#infoEventEnrollCmdSocket").html('<b>' + str + '</b>');
		if (EventsOfEnrollCommands.countOpenSocket == 0) {
			clearInterval(EventsOfEnrollCommands.ReopenSocket);
			EventsOfEnrollCommands.countOpenSocket = 5;
			EventsOfEnrollCommands.init(EventsOfEnrollCommands.socketexit);
		}
	}
}


function GetInfoString(item) {
	if (item.eventinfokey == 'request') {
		//var info = item.devicename + ' - ' + $.i18n('event_request');
		var info =  $.i18n('event_request');
		return info;
	} else if (item.eventinfokey == 'start') {
		var info = item.devicename + item.data.pushver;
		return info
	} else if (item.eventinfokey == 'info') {
		var info = $.i18n('fwversion') + ': ' + item.data.fwversion;
		info = info + '; ' + $.i18n('usercount') + ': ' + item.data.usercount;
		info = info + '; ' + $.i18n('fpcount') + ': ' + item.data.fpcount;
		info = info + '; ' + $.i18n('attcount') + ': ' + item.data.attcount;
		info = info + '; ' + $.i18n('facecount') + ': ' + item.data.facecount;
		info = info + '; ' + $.i18n('ipaddress') + ': ' + item.data.ipaddress;
		return info;
	} else if (item.eventinfokey == 'unregistered') {
		var info = item.devicename + ' - ' + $.i18n('dev_unregistered');
		return info;
	} else if (item.eventinfokey == 'err') {
		var info = item.errmessage;
		return info;
	} else if (item.eventinfokey == 'cmd') {
		if (item.eventnamekey == 'cmd_result') {
			let result = parseInt( item.data.result) == 0 ? 'OK' : item.data.result 
			var info = '(' + result + ') ' + $.i18n(item.data.descriptionkey);
			return info
		} else {
			var info = $.i18n(item.data.descriptionkey);
			return info
		}
	} else if (item.eventinfokey == 'attlog') {
		var info = $.i18n('pin') + ': ' + item.data.pin;
		info = info + '; ' + $.i18n('time') + ': ' + item.data.time;
		info = info + '; ' + $.i18n('att_status') + ': ' + item.data.status;
		info = info + '; ' + $.i18n('verify') + ': ' + item.data.verify;
		info = info + '; ' + $.i18n('workcode') + ': ' + item.data.workcode;
		return info
	} else if (item.eventinfokey == 'user') {
		var info = $.i18n('pin') + ': ' + item.data.pin;
		info = info + '; ' + $.i18n('name') + ': ' + item.data.name;
		info = info + '; ' + $.i18n('userprivilege') + ': ' + SelPriObj.PrivilegeName(parseInt(item.data.pri));
		info = info + '; ' + $.i18n('userpw') + ': ' + item.data.passwd;
		info = info + '; ' + $.i18n('usercardno') + ': ' + item.data.card;
		return info
	} else if (item.eventinfokey == 'biodata') {
		var info = $.i18n('pin') + ': ' + item.data.pin;
		info = info + '; ' + $.i18n('no.') + ': ' + item.data.no;
		return info
	} else if (item.eventinfokey == 'biophoto') {
		var info = $.i18n('pin') + ': ' + item.data.pin;
		info = info + '; ' + $.i18n('filename') + ': ' + item.data.filename;
		return info
	} else if (item.eventinfokey == 'attphoto') {
		var info = '<img src="' + item.data.content + '" style="width:100px;height:110px;" />'
		info = info + ' ' + item.data.photocode;
		info = info + ' --> ' + $.i18n(item.data.descriptionkey);
		return info
	} else if (item.eventinfokey == 'cmddata') {
		var result = parseInt(item.data.result) == 0 ? 'OK' : item.data.result 
		if (item.data.no == -1) {
			if (item.eventnamekey == 'cmd_result') {
				var info = '(' + result + ') ' + $.i18n(item.data.descriptionkey);
				info = info + '; ' + $.i18n('pin') + ': ' + item.data.pin;
				return info
			} else {
				var info = $.i18n(item.data.descriptionkey);
				info = info + '; ' + $.i18n('pin') + ': ' + item.data.pin;
				return info
			}
		} else {
			if (item.eventnamekey == 'cmd_result') {
				var info = '(' + result + ') ' + $.i18n(item.data.descriptionkey);
				info = info + '; ' + $.i18n('pin') + ': ' + item.data.pin;
				info = info + '; ' + $.i18n('fpindex') + ': ' + item.data.no;
				return info
			} else {
				var info = $.i18n(item.data.descriptionkey);
				info = info + '; ' + $.i18n('pin') + ': ' + item.data.pin;
				info = info + '; ' + $.i18n('fpindex') + ': ' + item.data.no;
				return info
			}
		}
	} else if (item.eventinfokey == 'cmdenroll') {
		var result = parseInt(item.data.result) == 0 ? 'OK' : item.data.result
		if (parseInt(item.data.result) == 2) {
			var info = '(' + result + ') ' + $.i18n(item.data.descriptionkey);
			info = info + ' --> ' + $.i18n('cmd_enroll_result_2');
			return info
		} else if (parseInt(item.data.result) == 4) {
			var info = '(' + result + ') ' + $.i18n(item.data.descriptionkey);
			info = info + ' --> ' + $.i18n('cmd_enroll_result_4');
			return info
		} else if (parseInt(item.data.result) == 5) {
			var info = '(' + result + ') ' + $.i18n(item.data.descriptionkey);
			info = info + ' --> ' + $.i18n('cmd_enroll_result_5');
			return info

		} else if (parseInt(item.data.result) == 6) {
			var info = '(' + result + ') ' + $.i18n(item.data.descriptionkey);
			info = info + ' --> ' + $.i18n('cmd_enroll_result_6');
			return info
		} else if (parseInt(item.data.result) == 7) {
			var info = '(' + result + ') ' + $.i18n(item.data.descriptionkey);
			info = info + ' --> ' + $.i18n('cmd_enroll_result_7');
			return info
		} else {
			if (item.data.no == -1) {
				if (item.eventnamekey == 'cmd_result') {
					var info = '(' + result + ') ' + $.i18n(item.data.descriptionkey);
					info = info + '; ' + $.i18n('pin') + ': ' + item.data.pin;
					return info
				} else {
					var info = $.i18n(item.data.descriptionkey);
					info = info + '; ' + $.i18n('pin') + ': ' + item.data.pin;
					return info
				}
			} else {
				if (item.eventnamekey == 'cmd_result') {
					var info = '(' + result + ') ' + $.i18n(item.data.descriptionkey);
					info = info + '; ' + $.i18n('pin') + ': ' + item.data.pin;
					info = info + '; ' + $.i18n('fpindex') + ': ' + item.data.no;
					return info
				} else {
					var info = $.i18n(item.data.descriptionkey);
					info = info + '; ' + $.i18n('pin') + ': ' + item.data.pin;
					info = info + '; ' + $.i18n('fpindex') + ': ' + item.data.no;
					return info
				}
			}
        }
	} else if (item.eventinfokey == 'undevice') {
		var info = $.i18n(item.subinfo);
		return info;
	} else {
		return '';
    }
}

var AttCal = {
	Acttion: 'StartAttCal',
	socket: null,
	index: -1, //bat dau tinh cong
	users: null,
	Startdate: null,
	Enddate: null,
	off: 0,
	createMessage: function () {
		if (AttCal.index == -1) {//Bat dau tinh cong
			var data = { Action: AttCal.Acttion };
			return data;
		} else { //Tinh cong cho nhan vien
			if (AttCal.off == 0) {
				if (AttCal.index <= AttCal.users.length - 1) {
					var user = AttCal.users[AttCal.index];
					var data = {
						action: 'UserAttCal',
						userenrollnumber: user.userenrollnumber,
						userfullcode: user.userfullcode,
						userfullname: user.userfullname,
						schid: user.schid,
						startdate: AttCal.Startdate,
						enddate: AttCal.Enddate
					};
					var perCent = AttCal.index / AttCal.users.length;
					perCent = Math.round(perCent * 100)
					$('#AttCalP').progressbar('setValue', perCent);
					return data;
				} else if (AttCal.index == AttCal.users.length) {
					var data = { action: "EndAttCal" };
					var perCent = AttCal.index / AttCal.users.length;
					perCent = Math.round(perCent * 100)
					$('#AttCalP').progressbar('setValue', perCent);
					return data;
				} else {
					var data = { action: "Close" };
					return data;
				}
			} else {
				var data = { action: "Close" };
				return data;
			}

		}
	},
	init: function () {
		if ("WebSocket" in window) {
			var hostname = window.location.hostname;
			var port = parseInt(window.location.port);
			var proto = String(window.location.protocol);
			if (!port) port = proto.includes('https') ? 443 : 80;
			var url = proto.includes('https') ? 'wss://' + hostname + ':' + port + '/eventattcal' : 'ws://' + hostname + ':' + port + '/eventattcal';
			AttCal.socket = new WebSocket(url);
			AttCal.socket.binaryType = 'arraybuffer';
			AttCal.socket.onopen = function (event) {
				var TimeStr = mydatetimeformatter(new Date());
				var data = { timestr: TimeStr, info: $.i18n('socket_connected'), colorcode: '#800080', langcode: 'socket_connected' }
				AttCal.index = -1;
				AttCal.off = 0;
				AttCal.users = $("#tbUserAtt").datagrid('getChecked');
				AttCal.Startdate = $("#startdateAtt").datetimespinner('getValue');
				AttCal.Enddate = $("#enddateAtt").datetimespinner('getValue');
				AttCal.logs(JSON.stringify(data));
			};
			AttCal.socket.onmessage = function (event) {
				AttCal.logs(event.data);
			};
			AttCal.socket.onoerror = function (event) {
				var TimeStr = mydatetimeformatter(new Date());
				var data = { timestr: TimeStr, info: $.i18n('socket_err'), colorcode: '#FF0000', langcode: 'socket_err' }
				AttCal.logs(JSON.stringify(data));
			};
			AttCal.socket.onclose = function (event) {
				var TimeStr = mydatetimeformatter(new Date());
				var data = { timettr: TimeStr, info: $.i18n('socket_closed'), colorcode: '#800080', langcode: 'socket_closed' }
				AttCal.logs(JSON.stringify(data));
				if (AttCal.off == 1) { $('#AttCalW').dialog('close'); };
			};
		} else {
			var TimeStr = mydatetimeformatter(new Date());
			var data = { timestr: TimeStr, info: $.i18n('socket_not_support'), colorcode: '#FF0000', langcode: 'socket_not_support' }
			AttCal.logs(JSON.stringify(data));
		}
	},
	logs: function (data) {
		var row = eval('(' + data + ')');
		var TimeStr = mydatetimeformatter(new Date());
		var newrow;
		if (row.iserror) {
			newrow = {
				timestr: TimeStr,
				info: row.info,
				colorcode: row.colorcode
			}
		} else {
			if (row.userfullcode) {
				newrow = {
					timestr: TimeStr,
					colorcode: row.colorcode,
					info: $.i18n(row.langcode) + ': ' + row.userfullcode + '-' + row.userfullname
				}
			} else {
				newrow = {
					timestr: TimeStr,
					colorcode: row.colorcode,
					info: $.i18n(row.langcode)
				}
            }
        }
		$('#tbAttCalLogs').datagrid('appendRow', newrow);
		var lastIndex = $('#tbAttCalLogs').datagrid('getRows').length - 1;
		$('#tbAttCalLogs').datagrid('scrollTo', lastIndex);
		AttCal.send();
		AttCal.index = parseInt(AttCal.index) + 1;
	},
	send: function () {
		if (AttCal.socket.readyState == WebSocket.OPEN) {
			var data = AttCal.createMessage();
			AttCal.socket.send(JSON.stringify(data));
		}

	},
	close: function () {
		if (AttCal.socket.readyState == 1) {//đang mở
			AttCal.socket.close();
		}
	}
};
var ImportUser = {
	Acttion: 'ImportUser',
	socket: null,
	index: 0,
	users: null,
	iscommd: false,
	createMessage: function () {
		if (ImportUser.index <= ImportUser.users.length - 1) {
			var user = ImportUser.users[ImportUser.index];
			var data = {
				Action: 'ImportUser',
				userfullcode: user.userfullcode,
				userfullname: user.userfullname,
				userhireday: user.userhireday,
				gender: user.gender,
				userenrollname: user.userenrollname,
				userenrollnumber: user.userenrollnumber,
				department: user.department,
				usercardno: user.usercardno,
				iscommd: ImportUser.iscommd
			};
			return data;

		} else {
			var data = { Action: "Close" };
			return data;
		}

	},
	init: function () {
		if ("WebSocket" in window) {
			var hostname = window.location.hostname;
			var port = parseInt(window.location.port);
			var proto = String(window.location.protocol);
			if (!port) port = proto.includes('https') ? 443 : 80;
			var url = proto.includes('https') ? 'wss://' + hostname + ':' + port + '/eventimportuser?locale=' + i18n.locale :
				'ws://' + hostname + ':' + port + '/eventimportuser?locale=' + i18n.locale;
			ImportUser.socket = new WebSocket(url);
			ImportUser.socket.binaryType = 'arraybuffer';
			ImportUser.socket.onopen = function (event) {
				try {
					var TimeStr = mydatetimeformatter(new Date());
					var data = { timestr: TimeStr, info: $.i18n('socket_connected'), colorcode: '#800080', langcode: 'socket_connected' };
					ImportUser.index = 0;
					ImportUser.users = $("#tbDataImport").datagrid('getData').rows;
					ImportUser.logs(JSON.stringify(data));
				} catch (err) { message(err) }

			};
			ImportUser.socket.onmessage = function (event) {
				ImportUser.logs(event.data);
			};
			ImportUser.socket.onoerror = function (event) {
				var TimeStr = mydatetimeformatter(new Date());
				var data = data = { timestr: TimeStr, info: $.i18n('socket_err'), colorcode: '#FF0000', langcode: 'socket_err' };
				ImportUser.logs(JSON.stringify(data));
			};
			ImportUser.socket.onclose = function (event) {
				var TimeStr = mydatetimeformatter(new Date());
				var data = { timettr: TimeStr, info: $.i18n('socket_closed'), colorcode: '#800080', langcode: 'socket_closed' };
				ImportUser.logs(JSON.stringify(data));

			};
		} else {
			var TimeStr = mydatetimeformatter(new Date());
			var data = { timestr: TimeStr, info: $.i18n('socket_not_support'), colorcode: '#FF0000', langcode: 'socket_not_support' };
			ImportUser.logs(JSON.stringify(data));
		}
	},
	logs: function (data) {
		var row = eval('(' + data + ')');
		var TimeStr = mydatetimeformatter(new Date());
		$('#tbImportLog').datagrid('appendRow', { timestr: TimeStr, info: row.info, ColorCode: row.colorcode });
		var lastIndex = $('#tbImportLog').datagrid('getRows').length - 1;
		$('#tbImportLog').datagrid('scrollTo', lastIndex);
		ImportUser.send();
		ImportUser.index = ImportUser.index + 1;
	},
	send: function () {
		if (ImportUser.socket.readyState == 1) {//đang mở
			var data = ImportUser.createMessage();
			ImportUser.socket.send(JSON.stringify(data));
		}
	},
	close: function () {
		if (ImportUser.socket.readyState == 1) {//đang mở
			ImportUser.socket.close();
		}
	}
};


