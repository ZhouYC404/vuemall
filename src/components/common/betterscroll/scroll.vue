<template>
  <div class="wrapper" ref="wrapper">
      <div class="content">
          <slot></slot>
      </div>
  </div>
</template>

<script>
import bscroll from 'better-scroll';
export default {
  data() {
    return {
      scroll:[],
    }
  },
  props: {
     probtype:{
        type:Number,
        default:3
      },
      pullupload:{
        type:Boolean,
        default:false
      }
  },
  mounted() {/* 这里必须是mounted，如果是created不行，当created时，标签还没有被渲染出来，拿不到ref */
      this.scroll = new bscroll(this.$refs.wrapper,{/* 用ref才能获取我这个组件里面的wrapper，用".wrapper"可能会获取到别的组件中的wrapper */
         click:true,
         probeType:this.probtype,
         pullUpLoad:this.pullupload
      })
      
  },
  methods: {
    refresh() {
        this.scroll&&this.scroll.refresh()
        console.log('刷新成功!');
      }
}}
</script>

<style>

</style>