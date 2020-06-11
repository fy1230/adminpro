import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login'
//引入api
import { API_checktoken } from "@/api/apis"


Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}


const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login,
        }, {

            path: '/index',
            name: 'index',
            component: () => import('../pages/Index'), children: [
                //无下拉框跳转
                { path: '/index/home', name: '首页', component: () => import('../pages/Index/Home'), meta: ['后台首页'] },

                { path: '/index/order', name: '订单管理', component: () => import('../pages/Index/Order'), meta: ['订单管理'] },
                // 店铺管理
                { path: '/index/shops_edit', name: '店铺修改', component: () => import('../pages/Index/shops/Shops_edit'), meta: ['店铺管理'] },
                //账号
                { path: '/index/Acc_list', name: '账号列表', component: () => import('../pages/Index/account/Acc_list'), meta: ['账号管理', '账号列表'] },
                { path: '/index/modify', name: '修改密码', component: () => import('../pages/Index/account/Modify'), meta: ['账号管理', '修改密码'] },
                { path: '/index/add', name: '添加账号', component: () => import('../pages/Index/account/Add'), meta: ['账号管理', '添加账号'] },
                //商品
                { path: '/index/goods_add', name: '添加商品', component: () => import('../pages/Index/goods/Goods_Add'), meta: ['商品管理', '添加商品'] },
                { path: '/index/goods_Category', name: '商品分类', component: () => import('../pages/Index/goods/Goods_Category'), meta: ['商品管理', '商品分类'] },
                { path: '/index/goods_list', name: '商品列表', component: () => import('../pages/Index/goods/Goods_list'), meta: ['商品管理', '商品列表'] },
                //销售统计
                { path: '/index/statistics', name: '商品统计', component: () => import('../pages/Index/sale/Statistics'), meta: ['销售统计', '商品统计'] },
                { path: '/index/order_statistics', name: '订单统计', component: () => import('../pages/Index/sale/Order_statistics'), meta: ['销售统计', '订单统计'] },
                //用户信息
                { path: '/index/my', name: '个人中心', component: () => import('../pages/Index/My'), meta: ['用户信息'] },
            ],
        }]
})


//添加前置路由
router.beforeEach((to, from, next) => {

    if (to.path != '/') {
        API_checktoken(localStorage.token).then(res => {
            if (res.data.code == 0) {//令牌有效
                next()
            } else {
                next('/')
            }
        })
    } else {
        next()
    }
})

//暴露
export default router
