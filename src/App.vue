<template>
  <div id="app">
   
      <keep-alive exclude="detail"><!-- 从别的页面跳回来不会重新刷新，除了detail页面，因为如果detail页面也不刷新的话，每次点进去都是一样的了 -->
                    <!-- 记得在组件detail中加上name，不然exclude无效 -->
      <router-view></router-view>
      </keep-alive>

      <MainTabBar></MainTabBar>
  </div>
</template>

<script>
import MainTabBar from './components/content/mainTabbar/MainTabBar';


export default {
  name: 'app',
components: {
    MainTabBar
}
}
</script>

<style>
@import "./assets/css/base.css";
</style>