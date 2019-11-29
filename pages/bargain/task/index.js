const App = getApp(); import util from '../../../utils/util.js'; import CountDown from '../../../utils/countdown.js'; import Dialog from '../../../components/dialog/dialog'; Page({ data: { taskEndTime: [], task: {}, active: {}, goods: {}, help_list: [], is_creater: false, is_cut: false, setting: {}, showBuyBtn: false, showShareBtn: false, showCatBtn: false, showOtherBtn: false, }, onLoad(options) { let _this = this; _this.setData({ task_id: options.task_id }) }, onShow() { let _this = this; _this.getTaskDetail() }, getTaskDetail() { let _this = this; App._get('bargain.task/detail', { task_id: _this.data.task_id }, (result) => { _this._initData(result.data) }) }, _initData(data) { let _this = this; _this._initShowBtn(data); data.taskEndTime = [{ date: data.task.end_time }]; _this.setData(data); if (!data.task.is_end) { CountDown.onSetTimeList(_this, 'taskEndTime') } }, _initShowBtn(data) { let _this = this, showBuyBtn = data.is_creater && !data.task.is_buy && data.task.status && (!data.active.is_floor_buy || data.task.is_floor), showCatBtn = !data.is_creater && !data.is_cut && !data.task.is_floor && data.task.status, showShareBtn = !showCatBtn && !data.task.is_floor && data.task.status, showOtherBtn = !showBuyBtn && !showShareBtn && !showCatBtn; _this.setData({ showBuyBtn, showShareBtn, showCatBtn, showOtherBtn, }) }, onTargetHome(e) { App.saveFormId(e.detail.formId); wx.switchTab({ url: '../../index/index', }) }, onToggleRules(e) { App.saveFormId(e.detail.formId); let _this = this; Dialog({ title: '砍价规则', message: _this.data.setting.bargain_rules, selector: '#zan-base-dialog', isScroll: true, buttons: [{ text: '关闭', color: 'red', type: 'cash' }] }) }, onTargetGoods(e) { let _this = this; App.saveFormId(e.detail.formId); wx.navigateTo({ url: `../goods/index?active_id=${_this.data.task.active_id}`, }) }, onTargetBargain(e) { App.saveFormId(e.detail.formId); wx.navigateTo({ url: '../index/index', }) }, onHelpCut(e) { let _this = this; App.saveFormId(e.detail.formId); if (_this.data.disabled == true) { return false } _this.setData({ disabled: true }); App._post_form('bargain.task/help_cut', { task_id: _this.data.task_id }, result => { App.showSuccess(result.msg, function () { wx.navigateBack() }); _this.getTaskDetail() }, false, () => { _this.setData({ disabled: false }) }) }, onCheckout(e) { let _this = this; App.saveFormId(e.detail.formId); let option = util.urlEncode({ order_type: 'bargain', task_id: _this.data.task.task_id, goods_sku_id: _this.data.task.spec_sku_id, }); wx.navigateTo({ url: `../../flow/checkout?${option}` }) }, onShareAppMessage() { let _this = this; let params = App.getShareUrlParams({ task_id: _this.data.task_id }); return { title: _this.data.active.share_title, path: `/pages/bargain/task/index?${params}` } }, })