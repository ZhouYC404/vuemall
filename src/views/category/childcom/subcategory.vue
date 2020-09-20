<template>
<!-- 右上方的页面显示 -->
  <div class="subcategory" >
       <div class="subitem" v-for="(item,index) in subcategory.list" :key="index">
           <a :href="item.link">
           <img :src="item.image" alt="" @load="subcatimgok()">
           <p>{{item.title}}</p>
           </a>
       </div>
       
  </div>
</template>

<script>
export default {
   data() {
       return {
           
       }
   },
   methods:{
subcatimgok(){//刷新scroll的高度
   this.$bus.$emit('subcatimgok')
}
   },
   props:{
       subcategory:Object
   },
}
</script>

<style scoped>
.subcategory{
    display: flex;/* 因为这个flex，category.vue中#catscroll的flex:1不能关闭，关闭了页面会混乱；但是这个flex又不能去掉，图片不好排列，所以flex:1只好留着，但是目前不知道用处，两个flex嵌套产生bug了。。。 */
    flex-wrap: wrap;
    justify-content: space-evenly;
}
.subitem{
    width: 30%;
    text-align: center;
    padding-top: 10px;
}
img{
    width: 80%;
}
</style>