const App = getApp(); Component({ options: { addGlobalClass: true, }, properties: { itemIndex: String, itemStyle: Object, params: Object, dataList: Object, }, methods: { _onTargetIndex(e) { App.saveFormId(e.detail.formId); wx.navigateTo({ url: '/pages/article/index' }) }, _onTargetDetail(e) { App.saveFormId(e.detail.formId); wx.navigateTo({ url: '/pages/article/detail/index?article_id=' + e.detail.target.dataset.id }) }, } })