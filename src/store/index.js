import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartlist:[]
  },
  getters: {
     itemcount(state){
           return state.cartlist.length
     }
  },
  actions: {
    addcart(context,payload){/* 返回promise，让组件调用这个方法，并且方法成功执行之后，执行resolve函数 */
      return new Promise((resolve,reject)=>{
        let temp = null
      for (const item of context.state.cartlist) {/* 每次点击加入购物车都要判断：新加入的物品是否已经在购物车中存在过 */
        if (payload.iid === item.iid) {/* 如果存在过，直接把老的物品的count属性加一 */
          item.count +=1
          temp = item/* 并且让temp等于这个老物品，等于payload也行，一样的 */
          resolve('当前商品数量加1！')
        }
      }

      if (!temp) {/* 上面全部循环完毕，进行判断，如果temp是null，也就是上面循环中没有任何一个老物品与其相等，那么其就是新物品，给其增加count属性并赋值1并推入carlist中*/
        payload.count = 1
        payload.checked =true/* 添加一个checked属性，给购物车用的，购物车取消和打勾会改变这个checked */
        context.state.cartlist.push(payload)
        resolve('新物品添加成功！')
      }
      console.log('购物车中的物品和数量:');
      /* for (let i = 0; i < state.cartlist.length; i++) {
          console.log(state.cartlist[i].iid+':'+state.cartlist[i].count);
      } */
      for (const it of context.state.cartlist) {/* 打印cartlist而已 */
        console.log('id：'+it.iid+' 数量: '+it.count);
      }
      })
    },
  },
  mutations: {
    
  },
  modules: {
  }
})
