<template>
<div class="gooditems" @click="itemclick()">
  
   <div>
       <img :src="whichtype()" alt="" @load="imgloadok()"><!-- 新属性@load，可以监听这个标签的内容是否加载完毕，加载完毕就执行imgloadok函数 -->
   </div>
   <div class="goodsinfo">
       <p>{{gooditems.title}}</p>
       <span class="price">{{gooditems.price}}</span>
       <span class="collect">{{gooditems.cfav}}</span>
   </div>

   </div>
</template>

<script>
export default {
props: {
    gooditems:{
        type:Object,
        default:{}
    }
},
methods: {
  imgloadok(){
    if (this.$route.path.indexOf('/home') != -1) {
      this.$bus.$emit('imgloadcomplete')/* 一旦imgloadok函数触发，就发射一个叫做imgloadcomplete的函数去bus */
    }else if(this.$route.path.indexOf('/detail') != -1){
        this.$bus.$emit('detailgoodlistok')
    }else if(this.$route.path.indexOf('/category') != -1){
       this.$bus.$emit('catdetailimgok')
    }
    
  },
  itemclick(){
    this.$router.push('/detail/' + this.gooditems.iid)
    
  },
    whichtype(){
      /* return this.gooditems.show.img || this.gooditems.image */ /* 换个位置就不行了，佛了 */
    return this.gooditems.img || this.gooditems.image  || this.gooditems.show.img
  }
},
}
</script>

<style>
.gooditems {
    padding-bottom: 40px;
    position: relative;

    width: 48%;
  }

  .gooditems img {
    width: 100%;
    border-radius: 5px;
  }

  .goodsinfo {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goodsinfo p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goodsinfo .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goodsinfo .collect {
    position: relative;
  }

  .goodsinfo .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("../../../assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>