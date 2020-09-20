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

/* 上面的template就是下面的这个叫做app的组件的html和css了，不需要在下面写template：xxx这种形式，因为这是vue文件，自动关联的，而且template里面的东西不会显示，而是当组件（app）被main.js引用，main.js又被index.html文件引用的时候，template才会显示*/
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