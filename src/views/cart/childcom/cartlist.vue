<template>
   <div class="cartlist">
       <cartlistitem v-for="(item, index) in $store.state.cartlist" :key="index" :itemInfo="item"></cartlistitem>
   </div>
</template>

<script>
import cartlistitem from '../childcom/cartlistitem';
export default {
    components: {
        cartlistitem
    }
}
</script>

<style scoped>

</style>