<template>
  <div class="recommend">
       <div class="recommendchild" v-for="(item,id) in recommends" :key="id">
         <a :href="item.link">
           <img :src="item.image" alt="" class="recommendimg">
           <p class="recommendtext">{{item.title}}</p>
         </a>
       </div>
  </div>
</template>

<script>
export default {
   props: {
       recommends:{
           type:Array,
           default: []
       }
   }
}
</script>

<style scoped>
    .recommend{
      margin-top: 5px;
      display: flex;
   
   
      padding-bottom: 10px;
      border-bottom:3px solid darkgray;
    }
    .recommendchild{
      display: flex;
      flex: 1;
       flex-direction: column;
       align-items: center;
    }
    .recommendimg{
      width: 70px;
      height: 70px;
    }
    .recommendtext{
      margin-top: 5px;
     text-align: center;
    }
</style>