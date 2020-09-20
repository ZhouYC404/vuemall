<template>
      <scroll id="menuscroll" ref="tabmenuscroll" class="tabmenu">
       
         <div class="menu">
             <div class="menuitem" v-for="(item,index) in categories" :key="index" :class="{active:index === currentindex}" @click="itemclick(index)">{{item.title}}</div>
         </div>
        
      </scroll>
</template>

<script>
import scroll from '../../../components/common/betterscroll/scroll';
export default {
data() {
    return {
        currentindex:0
    }
},
components: {
    scroll
},
props:{
    categories:Array
},
methods: {
    itemclick(index){
        this.currentindex = index
        this.$emit('menuitemselect',index)
    }
},
mounted() {
  /* setTimeout(() => {
    this.$refs.tabmenuscroll.refresh()
  }, 2000); */
},
}
</script>

<style scoped>
 .tabmenu {
    background-color: #f6f6f6;
    height: calc(100vh - 49px - 44px);
    overflow: hidden;
    width: 100px;
    box-sizing: border-box;
  }

  .menuitem {
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 14px;
  }

  .menuitem.active {
    font-weight: 700;
    color:  #F898A7;
    background-color: #fff;
    border-left: 3px solid  #F898A7;
  }
</style>