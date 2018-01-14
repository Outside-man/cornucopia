var app = getApp();
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    navWidth: 100 / app.globalData.shopList.length,//tab标题宽度
    shopList: app.globalData.shopList,//商店列表
    money: app.globalData.money,//页面中临时的money
    space: app.globalData.space,//页面中临时的space
    curShopId: "",//当前商店的index
    curGoodsId: "",//当前商品的index
    modalHidden: false,
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  detail: function(e){
    var spaceList = app.globalData.spaceList
    var curShopId = e.currentTarget.dataset.shop
    var curGoodsId = e.currentTarget.dataset.goods
    var curshop = this.data.shopList[curShopId]
    var curNum = 0
    var curGoods = curshop.goods[curGoodsId]
    var money = Number(app.globalData.money)
    if (spaceList.hasOwnProperty(curGoods.id)){
      curNum = spaceList[curGoods.id].num
    }
    var maxNum = Math.min((curNum + Math.floor(money / curGoods.price)), curNum + curGoods.stock, app.globalData.space)
    this.setData({
      modalHidden: true,
      img: curGoods.img,
      name: curGoods.name,
      price: curGoods.price,
      tag: curGoods.tag,
      baseNum: curNum,
      curNum: curNum,
      maxNum: maxNum,
      money: money.toFixed(2),
      space: app.globalData.space,
      curShopId: curShopId,
      curGoodsId: curGoodsId
    })
  },
  count: function(e){
    var price = this.data.price
    var space = this.data.space
    var money = Number(this.data.money)
    var nowNum = e.detail.value
    if (nowNum != this.data.curNum){
      money = money - (nowNum - this.data.curNum) * price
      space = space - (nowNum - this.data.curNum)
    }
    this.setData({
      curNum: nowNum,
      money: money.toFixed(2),
      space: space
    })
  },
  onCancel: function(){
    this.setData({
      modalHidden:false
    })
  },
  onConfirm: function(){
    var curMoney = this.data.money
    var curSpace = this.data.space
    var curNum = this.data.curNum
    var curShopId = this.data.curShopId
    var curGood = app.globalData.shopList[curShopId].goods[this.data.curGoodsId]    
    var curStock = this.data.baseNum - curNum
    var goodsId = curGood.id
    var spaceList = app.globalData.spaceList
    
    app.globalData.money = curMoney
    app.globalData.space = curSpace
    curGood.stock += curStock
    if (spaceList.hasOwnProperty(goodsId)) {
      spaceList[goodsId].num = curNum
      
    }else{
      spaceList[goodsId] = new Object()
      spaceList[goodsId].img = curGood.img
      spaceList[goodsId].name = curGood.name
      spaceList[goodsId].tag = curGood.tag
      spaceList[goodsId].num = curNum
    }
    this.setData({
      shopList: app.globalData.shopList,//更新商店列表
      modalHidden: false
    })
    console.log(spaceList)
  },
  footerTap: app.footerTap
})