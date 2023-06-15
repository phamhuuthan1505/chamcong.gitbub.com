var Render; 
var IsReCaptcha = "1";
var myKey; var myIV;
var ivLen = 8; var keyLen = 16;
$(function () {
	//$('body').layout('panel', 'center').panel('close');
	
	GetRender('login?recaptchav3render')
	i18n = $.i18n();
	var locale = getCookie("CurrentLocale");
	if (locale=="") locale = 'vi';
	i18n.locale = locale;
	if (locale == 'vi') {
		i18n.load({ 'vi': 'login?getlanguage&locale=' + locale }).done(function () { i18nDone(); });
	} else {
		i18n.load({ 'en': 'login?getlanguage&locale=' + locale }).done(function () { i18nDone(); });
	}
	
	
});
function i18nDone() {
	$('#locale').combobox({
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
			var locale = record.value;
			i18n.locale = locale;
			if (locale == 'vi') {
				i18n.load({ 'vi': 'login?getlanguage&locale=' + locale }).done(function () { SetContrrol(); });
			} else {
				i18n.load({ 'en': 'login?getlanguage&locale=' + locale }).done(function () { SetContrrol(); });
			}
        }
	}).combobox('setValue', i18n.locale);;

	SetContrrol();
	//$("body").show();
	//$("body").layout();
	$("#myBody").show();
	$('#myBody').layout().layout('resize', {
		width: '100%',
		height: '100%'
	});
//	
	
}
function SetContrrol() {
	$('#useraccount').textbox({
		prompt: $.i18n('accountname'),
		iconCls: 'icon-useraccount',
		iconWidth: 38,
		required: true,
		validateOnCreate: false,
		missingMessage: $.i18n('field_required')
	}).textbox('textbox').bind('keydown', function (e) {
		if (e.keyCode == 13) {	// when press ENTER key, accept the inputed value.
			TravelSteps();
		}
	});
	//console.log($('#useraccount').textbox());
	$('#userpass').passwordbox({
		prompt: $.i18n('userpw'),
		required: true,
		validateOnCreate: false,
		validateOnBlur: true,
		iconWidth: 38,
		missingMessage : $.i18n('field_required')
	}).passwordbox('textbox').bind('keydown', function (e) {
		if (e.keyCode == 13) {	// when press ENTER key, accept the inputed value.
			TravelSteps();
		}
	});
	$('#btsendLogin').linkbutton({
		iconCls: 'icon-login',
		text: $.i18n('login')
	});
	$('#softname').html($.i18n('softname'));
	$('#verid').html($.i18n('myver'));
	$('#copyright').html($.i18n('copyright'));
	$('#lastupdate').html($.i18n('lastupdated'));
}
var PrettyCode = function() {
		grecaptcha.ready(function() {
		  grecaptcha.execute(Render, {action: 'login'})
		  .then(function(token) {
		  $("#captcha").textbox('setValue',token);
		  });
		});
	};
function GetRender(url){try{
	$.get(url,function(data, status, xhr){
		var data = eval('('+data+')');
		Render = data.Render;
		IsReCaptcha =  data.IsReCaptcha;
		if (data.IsReCaptcha == "1") {
		  var head = document.head;
		  var script = document.createElement('script');
		  script.src ='https://www.google.com/recaptcha/api.js?render=' + data.Render; //6Ldbd3sUAAAAAEFNdUXAmnq4kzxwVlIFxogRChNr';
		  head.appendChild(script);
		  script.onreadystatechange = PrettyCode;
		  script.onload = PrettyCode;
		}
	   
	});
}catch(err){message(err)}}
function TravelSteps(){try{
	var captcha = $("#captcha").textbox('getText');
	if (IsReCaptcha == "1") { if (!captcha) { $.messager.alert($.i18n('mytitle'), "Captcha null!", 'info'); return; } }
	if (!$("#useraccount").textbox('isValid')) {
		$("#useraccount").textbox('textbox').focus();
		return;
	}
	if (!$("#userpass").passwordbox('isValid')) {
		$("#userpass").passwordbox('textbox').focus();
		return;
	}
		var useraccount =$("#useraccount").textbox('getText');
		var userpass =$("#userpass").passwordbox('getValue');
		var str = 'useraccount=' + useraccount + '\t' + 'userpass=' + userpass;
		var doc = {
			captcha: captcha,
			useraccount: AES_Encrypt(str)
		}
	$.post('login?query&locale=' + i18n.locale,JSON.stringify(doc),
			function (data, status, xhr) {
			  data = eval('('+data+')');
			  if (data.state=='error'){
				  $.messager.alert($.i18n('mytitle'),data.message,'error');
			  } else {
				  let locale = $('#locale').combobox('getValue');
				 setCookie("CurrentLocale",locale,365)		
			 }
			 window.location.replace(getRootUrl() );
		  });
	
} catch (err) { message(err) }
}
function AES_Encrypt(plaintext) {
	var key = CryptoJS.lib.WordArray.random(keyLen);
	var iv = CryptoJS.lib.WordArray.random(ivLen);
	key = CryptoJS.enc.Utf8.parse(key.toString());
	iv = CryptoJS.enc.Utf8.parse(iv.toString());

	var myKey = Unibabel.hexToBuffer(key.toString());
	var myIV = Unibabel.hexToBuffer(iv.toString());

	var encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
	var myEncrypted = Unibabel.hexToBuffer(encrypted.ciphertext.toString());
	var ciphered = join2Parts(join2Parts(myIV, myKey), myEncrypted);
	var base64 = Unibabel.bufferToBase64(ciphered).replace(/\-/g, '+').replace(/_/g, '\/');
	while (base64.length % 4) {
		base64 += '=';
	}
	return base64;
}
function join2Parts(prt1, prt2) {
	var buf = new Uint8Array(prt1.length + prt2.length);
	Array.prototype.forEach.call(prt1, function (byte, i) {
		buf[i] = byte;
	});
	Array.prototype.forEach.call(prt2, function (byte, i) {
		buf[prt1.length + i] = byte;
	});
	return buf;
}



