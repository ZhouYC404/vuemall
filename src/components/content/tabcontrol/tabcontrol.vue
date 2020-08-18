<template>
  <div class="tabcontrol">
      <div class="items" :class="{isactive:currentitem===id}" v-for="(item,id) in title " :key="item" @click="itemclick(id)"><span>{{item}}</span></div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            currentitem:0/* 谁被点了，这个变量就等于谁的id */
        }
    },
 props : {
     title:{
         type:Array,
         default:[]
     }
 },
 methods: {
     itemclick(id){
         this.currentitem = id
         /* console.log(this.currentitem); */
         this.$emit('tabclick',id)/* 文字被点击的时候向父亲发送火箭 */
     },
 },
}
</script>

<style>
      .tabcontrol{
         display: flex;
         align-items: center;
         height: 44px;
        position: sticky;
        top: 44px;
        z-index: 9;
        background-color: whitesmoke;
        margin-bottom: 5px;
      }
      .items{
          flex: 1;
          text-align: center;
      }
      .isactive{
          color: crimson;
      }
      .items span{
          padding: 10px;
      }
      .isactive span{
         border-bottom: 3px crimson solid;
      }
</style>