<template>
  <div class="goods">
       <goodlistitem v-for="(item,id) in goods" :key="id" :gooditems="item" ></goodlistitem>
  </div>
</template>

<script>
import goodlistitem from './goodlistitem';
export default {
  props: {
      goods:{
          type:Array,
          default:[]
      }
  },
  components: {
      goodlistitem
  }
}
</script>

<style>
.goods{
  display: flex;
  flex-wrap: wrap;/* 设置wrap，满了自动换行，也就是一行显示两个，3个就满了就掉下去 */
  justify-content: space-evenly;
}
</style>