// miniprogram/pages/question/question.js
const app = getApp()
const { formatTime } = require("../../util/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qs1: {
      req: "1、你的腰部线条属于:",
      ans: [{
        value: '腹部扁平、腰部曲线较明显、典型的纤纤细腰',
        opt: 2
      }, {
        value: '腰部线条不明显甚至没线条',
        opt: 4
      }]
    },
    qs2: {
      req: "2、看肩部和臀部的宽度比例:",
      ans: [{
        value: '肩宽＝臀部',
        opt: "X"
      }, {
        value: '肩宽＞臀宽',
        opt: "Y"
      }, {
        value: '肩宽＜臀宽',
        opt: 3
      }, {
        value: '不确定',
        opt: 3
      }]
    },
    qs3: {
      req: '3、看上下身比例（单薄&粗壮）:',
      ans: [{
        value: '上下身差不多',
        opt: 'X'
      }, {
        value: '下身细长，上身肥胖、粗壮',
        opt: 'Y'
      }, {
        value: '上身单薄，下身胖、粗壮',
        opt: "A"
      }, {
        value: "不确定",
        opt: 8
      }, {
        value: "都不是",
        opt: "N"
      }]
    },
    qs4: {
      req: "4、看肩部和臀部的宽度比例:",
      ans: [{
        value: "肩宽＝臀部",
        opt: 6
      }, {
        value: "肩宽＜臀宽",
        opt: 9
      }, {
        value: '肩宽＞臀宽',
        opt: "O"
      }, {
        value: '不确定',
        opt: 5
      }]
    },
    qs5: {
      req: "5、看上下身比例（轻重）:",
      ans: [{
        value: '上身单薄下身沉重（肥胖/粗壮）',
        opt: "A"
      }, {
        value: "上下身差不多",
        opt: 6
      }, {
        value: "都不是或不确定",
        opt: "N"
      }]
    }, qs6: {
      req: "6、看体型宽扁度:",
      ans: [{
        value: '体型偏扁平',
        opt: "H"
      }, {
        value: "体型偏圆润",
        opt: "O"
      }, {
        value: "不确定",
        opt: 7
      }, {
        value: "都不是",
        opt: "N"
      }]
    },
    qs7: {
      req: "7、看肩部形状:",
      ans: [{
        value: '圆润',
        opt: "O"
      }, {
        value: "宽平",
        opt: "H"
      }, {
        value: "不确定或都不是",
        opt: "N"
      }]
    },
    qs8: {
      req: "8、看臀部形状:",
      ans: [{
        value: '相对上身比例适合，显圆润',
        opt: "X"
      }, {
        value: "相对上身偏小",
        opt: "Y"
      }, {
        value: "不确定或都不是",
        opt: "N"
      }]
    },
    qs9: {
      req: "9、看肩部:",
      ans: [{
        value: '肩膀圆润、背部厚实',
        opt: "O"
      }, {
        value: "背部单薄、胸部往往偏小",
        opt: "A"
      }, {
        value: "都不是",
        opt: "N"
      }]
    },
    qs10: {
      req: '10、转自测:',
      ans: [{
        value: '测试系统遇到你就跑火星上去了！不过，别着急，对应下文每种身型特征，你就能找准自己的体形！',
        opt: ""
      }]
    },
    opt: null,
    hasTest: false,
    nowqs: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options.qs)
    this.setData({ nowqs: that.data['qs' + options.qs] });
  },

  radioChange(e) {
    const checked = e.detail.value;
    console.log(isNaN(checked))
    this.setData({ opt: checked });

  },

  continue() {
    if (this.data.hasTest) {
      return;
    }
    if (!isNaN(this.data.opt)) {
      wx.redirectTo({
        url: 'question?qs=' + this.data.opt
      })
    } else {
      this.setData({
        hasTest: true
      })
      this.onQuery()
    }
  },
  onQuery: function () {
    let that = this;
    const db = wx.cloud.database()
    // 查询当前用户答题信息
    db.collection('answer').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        if (res.data && res.data.length) {
          wx.showLoading({
            title: '正在测评中',
          })
          setTimeout(() => {
            wx.hideLoading({
              success: (res) => {
                wx.navigateTo({
                  url: '../answer/answer?tx=' + that.data.opt
                })
              },
            })

          }, 1500)
        } else {
          this.onAdduserInfo();
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询用户失败'
        })
      }
    })
  },
  onAdduserInfo: function () {
    let time = formatTime(new Date());
    let that = this;
    const db = wx.cloud.database();
    db.collection('answer').add({
      data: {
        ...app.globalData.userInfo,
        shape: that.data.opt,
        date: time
      },
      success: res => {
        wx.showLoading({
          title: '正在测评中',
        })
        setTimeout(() => {
          wx.hideLoading({
            success: (res) => {
              wx.navigateTo({
                url: '../answer/answer?tx=' + that.data.opt
              })
            },
          })

        }, 1500)

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})