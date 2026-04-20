export const menuList = [
  { path: '/home', name: 'Home', meta: { title: '首页' }, roles: ['admin', 'user'] },
  { path: '/product', name: 'Product', meta: { title: '商品管理' }, roles: ['admin', 'user'] },
  { path: '/user', name: 'User', meta: { title: '用户管理' }, roles: ['admin'] },
  { path: '/chart', name: 'Chart', meta: { title: '数据图表' }, roles: ['admin', 'user'] },
  { path: '/profile', name: 'Profile', meta: { title: '个人中心' }, roles: ['admin', 'user'] },
  { path: '/resetPwd', name: 'ResetPwd', meta: { title: '修改密码' }, roles: ['admin', 'user'] },
  { path: '/log', name: 'Log', meta: { title: '操作日志' }, roles: ['admin'] },
  { path: '/editor', name: 'Editor', meta: { title: '内容编辑' }, roles: ['admin'] },
];