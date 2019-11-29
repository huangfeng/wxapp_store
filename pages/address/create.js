let App = getApp(); Page({ data: { disabled: false, nav_select: false, name: '', region: '', phone: '', detail: '', error: '', }, onLoad: function (options) { }, saveData: function (e) { let _this = this, values = e.detail.value; values.region = this.data.region; App.saveFormId(e.detail.formId); if (!_this.validation(values)) { App.showError(_this.data.error); return false } _this.setData({ disabled: true }); App._post_form('address/add', values, function (result) { App.showSuccess(result.msg, function () { wx.navigateBack() }) }, false, function () { _this.setData({ disabled: false }) }) }, validation: function (values) { if (values.name === '') { this.data.error = '收件人不能为空'; return false } if (values.phone.length < 1) { this.data.error = '手机号不能为空'; return false } let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/; if (!reg.test(values.phone)) { this.data.error = '手机号不符合要求'; return false } if (!this.data.region) { this.data.error = '省市区不能空'; return false } if (values.detail === '') { this.data.error = '详细地址不能为空'; return false } return true }, bindRegionChange: function (e) { this.setData({ region: e.detail.value }) }, chooseAddress: function () { let _this = this; wx.chooseAddress({ success: function (res) { _this.setData({ name: res.userName, phone: res.telNumber, region: [res.provinceName, res.cityName, res.countyName], detail: res.detailInfo }) } }) }, })