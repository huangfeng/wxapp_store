const App = getApp(); Component({ options: { addGlobalClass: true, }, properties: { itemIndex: String, itemStyle: Object, params: Object, dataList: Object }, methods: { _onTargetGoods(e) { App.saveFormId(e.detail.formId); wx.navigateTo({ url: '/pages/sharing/goods/index?goods_id=' + e.detail.target.dataset.id, }) }, _onTargetSharingIndex(e) { App.saveFormId(e.detail.formId); wx.navigateTo({ url: `/pages/sharing/index/index`, }) }, } })