<template>
  <div class="detailnavbar">
      <navbar class="detailin">
          <div slot="left" class="left iconfont icon-fanhui" @click="back()"></div>
          <div slot="center" class="title">
              <div v-for="(item,id) in this.title" :key="id" class="titleitem" :class="{red:isred(id)}" @click="thisred(id),gototheme(id)" >{{item}}</div>
          </div>
      </navbar>
  </div>
</template>

<script>
import navbar from '../../../components/common/navbar/NavBar';
export default {
     data() {
        return {
            title:['商品','参数','评论','推荐'],
            currentindex:0
        }
    }, 
   /*  props: {
        title:null,
            currentindex:0
    }, */
    methods: {
        thisred(id){
             this.currentindex = id
        },
        isred(id){
             return this.currentindex === id 
        },
        back(){
            this.$router.back()
        },
        gototheme(id){
             this.$emit('gototheme',id)
        }
    },
    computed: {
        
    },
components:{
    navbar
}
}
</script>

<style scoped>
@import'../../../assets/css/fontsize/iconfont.css';
.title{
    display: flex;
    font-size: 15px;
}
.titleitem{
    flex: 1;
}
.red{
    color: crimson;
}
.left{
    font-size: 20px;
    text-align: center;
}
.detailin{
    background-color: #fff;
}
</style>