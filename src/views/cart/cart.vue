<template>
  <div class="cart">
      <navbar class="cartnav">
          <div slot="center" class="center">购物车({{$store.getters.itemcount}})</div>
      </navbar>
       <scroll class="cartscroll">
            <cartlist></cartlist>
       </scroll>
       <cartbottombar></cartbottombar>
  </div>
</template>

<script>
import navbar from '../../components/common/navbar/NavBar';
import scroll from '../../components/common/betterscroll/scroll';
import cartlist from '../cart/childcom/cartlist';
import cartbottombar from './childcom/cartbottombar';
export default {
 components: {
     navbar,
     scroll,
     cartlist,
     cartbottombar
 },

}

</script>

<style scoped>
.cart{
    height: 100vh;
}
.cartnav{
    background-color: #FF8E97;
}
.center{
    color: white;
}
.cartscroll{
    position: absolute;
    top: 47px;
    left: 0;
    right: 0;
    bottom: 89px;
    background-color: #fff;
}
</style>