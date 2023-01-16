export default defineAppConfig({
  pages: [
    'pages/initiate/index',
    'pages/index/index',
    'pages/result/index',
    'pages/college/index',
    'pages/category/index',
    'pages/find/index',
    'pages/findContent/index',
    'pages/my/index',
    'pages/myContent/index',
    'pages/advance/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#158AD2',
    position: 'bottom',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: './assets/images/pie.png',
        selectedIconPath: './assets/images/pie-active.png',
        text: '首页'
      },
      {
        pagePath: 'pages/result/index',
        iconPath: './assets/images/ping.png',
        selectedIconPath: './assets/images/ping-active.png',
        text: '复试'
      },
      {
        pagePath: 'pages/find/index',
        iconPath: './assets/images/college.png',
        selectedIconPath: './assets/images/college-active.png',
        text: '发现'
      },
      {
        pagePath: 'pages/my/index',
        iconPath: './assets/images/me.png',
        selectedIconPath: './assets/images/me-active.png',
        text: '我的'
      }
    ]
  }
})
