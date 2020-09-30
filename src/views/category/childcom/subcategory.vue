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
    display: flex;
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