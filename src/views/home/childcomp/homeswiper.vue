<template>
 <div>
      <swiper>
          <!--  :key="item"加了又弹出vue warn，不加又有红波浪，只有key = id才行，等于item就会报vue warn-->
          <swiper-item v-for="(item,id) in banners" :key="id">
              <a :href="item.link">
                  <img :src="item.image" alt="" @load="swiperimgok()">
              </a>
          </swiper-item>
      </swiper>
 </div> 
</template>

<script>
import {Swiper,SwiperItem} from '../../../components/common/swiper/index';
export default {
    props: {
      banners:{
          type:Array,
          default:[]
      }
    },
    methods: {
        swiperimgok(){/* 图片加载完成发送火箭 */
            this.$emit('swiperimgok')
        }
    },
 components: {
     Swiper,
     SwiperItem
 }
}
</script>

<style>

</style>