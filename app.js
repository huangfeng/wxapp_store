const tabBarLinks = ['pages/index/index', 'pages/category/index', 'pages/flow/index', 'pages/user/index',]; import siteinfo from './siteinfo.js'; import util from './utils/util.js'; App({ globalData: { user_id: null, }, api_root: siteinfo.siteroot + 'index.php?s=/api/', onLaunch(e) { let _this = this; _this.updateManager(); _this.onStartupScene(e.query); _this.timer = setInterval(function () { _this.updateTabBarNum(_this) }, 100); _this.updateTabBarNum(_this) }, updateTabBarNum: function (that) { var totalCartNum = wx.getStorageSync("totalCartNum"); var userNewsNum = wx.getStorageSync("userNewsNum"); var signState = wx.getStorageSync("signState"); if (!signState) { wx.showTabBarRedDot({ index: 2, }) } else { wx.hideTabBarRedDot({ index: 2, }) } if (totalCartNum) { wx.setTabBarBadge({ index: 3, text: "" + totalCartNum + "" }) } else { wx.removeTabBarBadge({ index: 3, }) } if (userNewsNum) { wx.showTabBarRedDot({ index: 4, }) } else { wx.hideTabBarRedDot({ index: 4, }) } }, onStartupScene(query) { let scene = this.getSceneData(query); let refereeId = query.referee_id ? query.referee_id : scene.uid; refereeId = parseInt(refereeId); refereeId > 0 && (this.saveRefereeId(refereeId)) }, getWxappId() { return siteinfo.uniacid || 10001 }, saveRefereeId(refereeId) { if (!wx.getStorageSync('referee_id')) wx.setStorageSync('referee_id', refereeId) }, getSceneData(query) { return query.scene ? util.scene_decode(query.scene) : {} }, onShow(options) { }, doLogin() { let pages = getCurrentPages(); if (pages.length) { let currentPage = pages[pages.length - 1]; "pages/login/login" != currentPage.route && wx.setStorageSync("currentPage", currentPage) } wx.navigateTo({ url: "/pages/login/login" }) }, getUserId() { return wx.getStorageSync('user_id') }, showSuccess(msg, callback) { wx.showToast({ title: msg, icon: 'success', mask: true, duration: 1500, success() { callback && (setTimeout(function () { callback() }, 1500)) } }) }, showError(msg, callback) { wx.showModal({ title: '友情提示', content: msg, showCancel: false, success(res) { callback && callback() } }) }, _get(url, data, success, fail, complete, check_login) { wx.showNavigationBarLoading(); let _this = this; data = data || {}; data.wxapp_id = _this.getWxappId(); let request = function () { data.token = wx.getStorageSync('token'); wx.request({ url: _this.api_root + url, header: { 'content-type': 'application/json' }, data: data, success(res) { if (res.statusCode !== 200 || typeof res.data !== 'object') { _this.showError('网络请求出错'); return false } if (res.data.code === -1) { wx.hideNavigationBarLoading(); _this.doLogin() } else if (res.data.code === 0) { _this.showError(res.data.msg, function () { fail && fail(res) }); return false } else { success && success(res.data) } }, fail(res) { _this.showError(res.errMsg, function () { fail && fail(res) }) }, complete(res) { wx.hideNavigationBarLoading(); complete && complete(res) }, }) }; check_login ? _this.doLogin(request) : request() }, _post_form(url, data, success, fail, complete, isShowNavBarLoading) { let _this = this; isShowNavBarLoading || true; data.wxapp_id = _this.getWxappId(); data.token = wx.getStorageSync('token'); if (isShowNavBarLoading == true) { wx.showNavigationBarLoading() } wx.request({ url: _this.api_root + url, header: { 'content-type': 'application/x-www-form-urlencoded', }, method: 'POST', data: data, success(res) { if (res.statusCode !== 200 || typeof res.data !== 'object') { _this.showError('网络请求出错'); return false } if (res.data.code === -1) { wx.hideNavigationBarLoading(); _this.doLogin(); return false } else if (res.data.code === 0) { _this.showError(res.data.msg, function () { fail && fail(res) }); return false } success && success(res.data) }, fail(res) { _this.showError(res.errMsg, function () { fail && fail(res) }) }, complete(res) { wx.hideNavigationBarLoading(); complete && complete(res) } }) }, validateUserInfo() { let user_info = wx.getStorageSync('user_info'); return !!wx.getStorageSync('user_info') }, updateManager() { if (!wx.canIUse('getUpdateManager')) { return false } const updateManager = wx.getUpdateManager(); updateManager.onCheckForUpdate(function (res) { }); updateManager.onUpdateReady(function () { wx.showModal({ title: '更新提示', content: '新版本已经准备好，即将重启应用', showCancel: false, success(res) { if (res.confirm) { updateManager.applyUpdate() } } }) }); updateManager.onUpdateFailed(function () { wx.showModal({ title: '更新提示', content: '新版本下载失败', showCancel: false }) }) }, getTabBarLinks() { return tabBarLinks }, navigationTo(url) { if (!url || url.length == 0) { return false } let tabBarLinks = this.getTabBarLinks(); if (tabBarLinks.indexOf(url) > -1) { wx.switchTab({ url: '/' + url }) } else { wx.navigateTo({ url: '/' + url }) } }, saveFormId(formId) { let _this = this; if (formId === 'the formId is a mock one') { return false } _this._post_form('wxapp.formId/save', { formId: formId }, null, null, null, false) }, getShareUrlParams(params) { let _this = this; return util.urlEncode(Object.assign({ referee_id: _this.getUserId() }, params)) }, wxPayment(option) { let options = Object.assign({ payment: {}, success: () => { }, fail: () => { }, complete: () => { }, }, option); wx.requestPayment({ timeStamp: options.payment.timeStamp, nonceStr: options.payment.nonceStr, package: 'prepay_id=' + options.payment.prepay_id, signType: 'MD5', paySign: options.payment.paySign, success(res) { options.success(res) }, fail(res) { options.fail(res) }, complete(res) { options.complete(res) } }) }, checkIsLogin() { return wx.getStorageSync('token') != '' && wx.getStorageSync('user_id') != '' }, getUserInfo(e, callback) { let App = this; if (e.detail.errMsg !== 'getUserInfo:ok') { return false } wx.showLoading({ title: "正在登录", mask: true }); wx.login({ success(res) { App._post_form('user/login', { code: res.code, user_info: e.detail.rawData, encrypted_data: e.detail.encryptedData, iv: e.detail.iv, signature: e.detail.signature, referee_id: wx.getStorageSync('referee_id') }, result => { wx.setStorageSync('token', result.data.token); wx.setStorageSync('user_id', result.data.user_id); callback && callback() }, false, () => { wx.hideLoading() }) } }) }, });