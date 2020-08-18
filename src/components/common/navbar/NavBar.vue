<template>
  <div class="navbar">
      <div class="left"><slot name="left"></slot></div>
      <div class="center"><slot name="center"></slot></div>
      <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.navbar{
    display: flex;
    height: 44px;
    line-height: 44px;
    box-shadow: 0px 2px 1px rgba(100, 100, 100, .1);
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
}
.left{
    width: 60px;
    
}
.center{
    flex: 1;
    text-align: center;
    font-size: 30px;
}
.right{
    width: 60px;
   
}
</style>