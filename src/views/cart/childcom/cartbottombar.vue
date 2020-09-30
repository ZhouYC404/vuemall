<template>
  <div class="cartbottombar">
      <div class="checkall" @click="changechoose()">
          <img src="../../../assets/img/cart/tick.svg" alt="" class="check" :class="{'checkactive':ifallchoose}">
          <span>全选</span>
      </div>
      <div class="total">
          合计:{{totalprice}}
      </div>
      <div class="gotopay">
          去计算:({{cal}})
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            ifall:true
        }
    },
computed: {
    totalprice(){
         return '￥' + this.$store.state.cartlist.filter(item =>
        {return item.checked
        }).reduce((prev,item) => {
            return prev + item.price * item.count/* 返回checked属性为true（就是被选中的）的物品的价格乘以数量的总价格 */
        },0)    
    },
    cal(){
        let call = 0
        return this.$store.state.cartlist.filter(item =>{return item.checked}).reduce((pre,item)=>{
            return pre + item.count /* 去计算后面的数字，显示的是总数量 */
        },0)
    },
    ifallchoose(){
        if (this.$store.state.cartlist.length === 0) {
            return false
        }
                
        return !this.$store.state.cartlist.filter(item=>{return !item.checked}).length
    },
},
methods: {
    changechoose(){
        if (this.ifallchoose) {/* 当ifallchoose为true，就是不存在没被选中的时，所有checked都是true，那么我们把所有的checked都改为false */
            for (const it of this.$store.state.cartlist) {
                 it.checked = false
            }
        } else {/* 当ifallchoose为false，就是存在没被选中的物品，那么把checked全改为true */
            for (const it of this.$store.state.cartlist) {
                it.checked = true
            }
        }
    }
},
}
</script>

<style scoped>
.cartbottombar{
    height: 40px;
    background-color: #ccc;
    position: absolute;
    bottom: 49px;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
}
.checkall{
 line-height: 40px;
}
.checkall span{
    margin-left: 3px;
    vertical-align: middle;
}
.checkall img{
    margin-top: -4px;
    vertical-align: middle;
}
.check{
    border-radius: 50%;
    border: 2px solid #ccc;
    cursor: pointer;
}
.checkactive {
    background-color: #ff8198;
    border-color: #ff8198;
  }
  .checkall{
      flex-grow: 0.5;
  }
  .total{
      flex-grow: 1;
  }
  .gotopay{
      line-height: 40px;
      vertical-align: center;
      text-align: center;
      flex-grow: 0.5;
      background-color: crimson;
      color: whitesmoke;
  }
</style>