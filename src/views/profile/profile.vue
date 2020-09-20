<template>
  <div id="profile">
    <navbar class="nav-bar"><div slot="center">我的</div></navbar>
    <user-info/>
    <account-info/>
    <normal-list-view :list-data="orderList"/>
    <normal-list-view :list-data="serviceList"/>
  </div>
</template>

<script>
  import navbar from '../../components/common/navbar/NavBar';
  import UserInfo from './childComponents/UserInfo'
  import AccountInfo from './childComponents/AccountInfo'
  import NormalListView from './childComponents/NormalListView'

  export default {
    name: "Profile",
    components: {
    	navbar,
      UserInfo,
      AccountInfo,
      NormalListView
    },
    data() {
    	return {
		    orderList: [
			    {icon: 'message.svg', info: '我的消息'},
			    {icon: 'pointer.svg', info: '积分商城'},
			    {icon: 'vip.svg', info: '会员卡'},
		    ],
		    serviceList: [
			    {icon: 'cart.svg', info: '我的购物车'},
			    {icon: 'shopping.svg', info: '下载购物APP'},
		    ]
      }
    }
  }
</script>

<style scoped>
  #profile {
    background-color: #f2f2f2;
  }

  .nav-bar {
    background-color:  #FF8E97;
    color: #fff;
  }
</style>
