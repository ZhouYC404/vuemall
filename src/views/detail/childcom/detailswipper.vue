<template>
       <swiper class="detailswiper">
           <swiperitem v-for="(item,id) in swiperimage" :key="id" >
               <img :src="item" alt="" class="img" @load="swiperimgok()">
           </swiperitem>
       </swiper>
</template>

<script>
import {swiper,SwiperItem, Swiper} from '../../../components/common/swiper/index';
export default {
    props: {
       swiperimage:{
           type:Array,
           default:[]
       }
    },
 components: {
     swiper:Swiper,
     swiperitem:SwiperItem
 },
 methods: {
     swiperimgok(){
         this.$bus.$emit('detailswiperimgok')
     }
 },
}
</script>

<style>
.detailswiper{
    height: 100%;
    width: 100vw;
    /* overflow: hidden; */
}

</style>