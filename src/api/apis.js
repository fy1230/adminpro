import axios from 'axios'
//设置服务器ip
axios.defaults.baseURL = 'http://127.0.0.1:5000'

//1.登录/users/checkLogin post
//account用户名
//password密码
export const API_login = (account, password) => axios.post('/users/checkLogin', { account, password })

//2.添加账号/users/add  post
//account   账号    
//password  密码
//userGroup 用户组
export const API_add = (account, password, userGroup) => axios.post('/users/add', { account, password, userGroup })

//3.获取账号列表    /users/list GET
// currentPage  当前页码
// pageSize 每页条数
export const API_account_list = (currentPage, pageSize) => axios.get('/users/list', { params: { currentPage, pageSize } })

// 4.删除账号   /users/del  GET
//id    要删除账号的id
export const API_del_account = (id) => axios.get('/users/del', { params: { id } })

//5.批量删除账号    /users/batchdel GET
//ids   要删除数据的id组成的数组（字符串格式的数组，如: ‘[1, 2, 3]’,需要转为字符串格式）
export const API_dels_account = (ids) => axios.get('/users/batchdel', { params: { ids } })

//6.修改账号    /users/edit POST
// id   要修改账号的id
//account   账号
//userGroup 用户组
export const API_modify_account = (id, account, userGroup) => axios.post('/users/edit', { id, account, userGroup })

//7.检查旧密码是否正确  /users/checkoldpwd  GET
//oldPwd    旧密码  
export const API_old_pwd = (oldPwd, id) => axios.get('/users/checkoldpwd', { params: { oldPwd, id } })

//8.修改密码  /users/editpwd    post
//newPwd    新密码
export const API_new_pwd = (newPwd, id) => axios.post('/users/editpwd', { newPwd, id })


//9.获取账号（个人中心）信息    /users/info  get
//id:用户id
export const API_personal = (id) => axios.get('/users/accountinfo', { params: { id } })



//11.验证token是否过期  /users/checktoken   get
//token     token
export const API_checktoken = (token) => axios.get('/users/checktoken', { params: { token } })

//12.添加分类   /goods/addcate
// cateName 分类名称
// state    是否启用
export const API_addcate = (cateName, state) => axios.post('/goods/addcate', { cateName, state })


//13.获取分类   /goods/catelist GET
//currentPage   当前页
//pageSize      每页条数
export const API_catelist = (currentPage, pageSize) => axios.get('/goods/catelist', { params: { currentPage, pageSize } })

//14.删除分类   /goods/delcate  GET
//id    分类id
export const API_delcate = (id) => axios.get('/goods/delcate', { params: { id } })

//15.修改分类  /goods/editcate
//id        分类id
//cateName  分类名称
//state     分类状态
export const API_editcate = (id, cateName, state) => axios.post('/goods/editcate', { id, cateName, state })
//16.查询所有分类名称
export const API_categories = () => axios.get('/goods/categories', { params: {} })


//18.添加商品  /goods/add   POST
//name  商品名称
//category  商品分类
// price   商品价格
// imgUrl  商品图片地址
// goodsDesc   商品描述
export const API_addgoods = (name, category, price, imgUrl, goodsDesc) => axios.post('/goods/add', { name, category, price, imgUrl, goodsDesc })

//19.获取商品列表   /goods/list
export const API_goods_list = (currentPage, pageSize) => axios.get('/goods/list', { params: { currentPage, pageSize } })

//20.删除商品   /goods/del  GET
//id    id
export const API_goods_del = (id) => axios.get('/goods/del', { params: { id } })

//21.修改商品  /goods/edit  POST
export const API_goods_edit = (id, name, category, price, imgUrl, goodsDesc) => axios.post('/goods/edit', { id, name, category, price, imgUrl, goodsDesc })

//22.获取订单列表(带查询功能)   /order/list GET
//currentPage   当前页码
//pageSize  每页条数
//orderNo   订单号  否
//consignee 收货人  否
//phone 手机号  否
//orderState    订单状态    否
//date  时间范围，字符串格类型如: ["2019-10-05 00:00:00","2019-10-10 00:00:00"] 否
export const API_order_list = (currentPage, pageSize, orderNo, consignee, phone, orderState, date) => axios.get('/order/list', { params: { currentPage, pageSize, orderNo, consignee, phone, orderState, date } })

//23.查询  /order/search
//currentPage   当前页码
//pageSize  每页条数
//orderNo   订单号  否
//consignee 收货人  否
//phone 手机号  否
//orderState    订单状态    否
//date  时间范围，字符串格类型如: ["2019-10-05 00:00:00","2019-10-10 00:00:00"] 否
export const API_order_search = (currentPage, pageSize, orderNo, consignee, phone, orderState, date) => axios.get('/order/list', { params: { currentPage, pageSize, orderNo, consignee, phone, orderState, date } })

//24.获取订单详情   /order/detail   GET
// id  id
export const API_order_detail = (id) => axios.get('/order/detail', { params: { id } })

//25.修改订单   /order/edit POST
// id	要修改账号的id
// orderNo	   	订单号
// orderTime	下单时间
// phone	   	电话
// consignee	收货人
// deliverAddress	送货地址
// deliveryTime	   	送达时间
// remarks	   	    备注
// orderAmount	   	订单金额
// orderState	   	订单状态
export const API_order_edit = (id, orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState) => axios.post('/order/edit', { id, orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState })

//26.获取店铺详情     /shop/info    GET
export const API_shop_info = () => axios.get('/shop/info', { params: {} })

//28.店铺内容修改   /shop/edit  post
// id	int	是	店铺id
// name	string	是	店铺名称
// bulletin	string	是	店铺公告
// avatar	string	是	店铺头像
// deliveryPrice	int	是	起送价格
// deliveryTime	int	是	送达时间
// description	string	是	店铺描述
// score	float	是	店铺好评率
// sellCount	int	是	店铺销量
// supports	string数组	是	活动支持
// date	string数组	是	营业时间
// pics	string数组	是	图片
export const API_shop_edit = (id, name, bulletin, avatar, deliveryPrice, deliveryTime, description, score, sellCount, supports, date, pics) => axios.post('/shop/edit', { id, name, bulletin, avatar, deliveryPrice, deliveryTime, description, score, sellCount, supports, date, pics })


//29.首页报表接口  /order/totaldata GET
export const API_totaldata = () => axios.get('order/totaldata', { params: {} })

//30.订单报表接口   /order/ordertotal   GET
//date 字符串格式数组，如["2019-10-01 00:00:00", "2019-10-10 00:00:00"]
export const API_ordertotal = (date) => axios.get('order/ordertotal', { params: { date } })
