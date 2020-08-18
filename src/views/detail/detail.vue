<template>
  <div class="detail">
        <detailnavbar @gototheme="gototheme" ref="detailnavbar"></detailnavbar>
        <scroll class="detailscroll" ref="scroll1">
            <div class="swiperout">
        <detailswiper :swiperimage="topimage"></detailswiper>
        </div>
       <detailbaseinfo :goods="goods"></detailbaseinfo>
       <detailshopinfo :shop="shop"></detailshopinfo>
       <detailgoodsinfo :detailInfo="detailinfo"></detailgoodsinfo>
       <detailparaminfo :paramInfo="paraminfo" ref="detailparaminfo"></detailparaminfo>
       <detailcommentinfo :commentInfo="commentinfo" ref="detailcommentinfo"></detailcommentinfo>
       <goodlist :goods="recommends" ref="detailrecommend"></goodlist>
        </scroll>
        <detailbottombar class="bottombar" @addToCart="addtocart" ></detailbottombar>
        <backtop @click.native="detailbackclick()" v-show="detailbackisshow"></backtop>
  </div>
</template>

<script>
import detailnavbar from './childcom/detailnavbar';
import {getdetail,Goods,Shop,GoodsParam,getrecommend} from '../../network/detail.js';
import detailswiper from './childcom/detailswipper';
import detailbaseinfo from './childcom/detailbaseinfo';
import detailshopinfo from './childcom/detailshopinfo';
import scroll from '../../components/common/betterscroll/scroll';
import detailgoodsinfo from './childcom/detailgoodsinfo';
import detailparaminfo from './childcom/detailparaminfo';
import detailcommentinfo from './childcom/detailcommentinfo';
import alldebounce from '../../common/utils/alldebounce';
import goodlist from '../../components/content/goods/goodlist';
import detailbottombar from './childcom/detailbottombar';
import backtop from '../../components/content/backtop/backtop';

export default {
    name:'detail',
data() {
    return {
        /*  title:['商品','参数','评论','推荐'],
         currentindex:0, */

        iid:null,
        topimage:null,
        goods:{},
        shop:{},
        detailinfo:{},
        paraminfo:{},
        commentinfo:{},
        recommends:[],
        themetopy:[],
        getthemetopy:null,
        detailbackisshow:false
    }
},
methods: {
    sendtitle(){
        return this.title
    },
    sendcurrentindex(){
        return this.currentindex
    },
    gototheme(id){
          /* 根据传过来的id，拿id去themetopy对应看怎么跳*/
                  if(this.$refs.scroll1){
                this.$refs.scroll1.scroll.scrollTo(0,-this.themetopy[id],100)
                  }
    },
    detailbackclick(){
        this.$refs.scroll1.scroll.scrollTo(0,0,300)
    },
   async addtocart(){/* 传给购物车的数据 */
    /* 下面有些数据的属性名是继承自class类里面的，真实数据是来自axios的 */
    /* axios数据给goods（goods继承自Goods类）---goods数据给product */
        const product = {}
        product.image = this.topimage[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = parseInt(this.goods.nowPrice).toFixed(2)
        product.iid = this.iid
       let res = await this.$store.dispatch('addcart',product)/* 这句await需要把addtocart变成async，如果觉得不妥可以在methods里面包一个async函数，把这句话和下面的log放进去！在这里调用那个函数 */
       console.log(res);
    }
},
components: {
    detailnavbar,
    detailswiper,
    detailbaseinfo,
    detailshopinfo,
    scroll,
    detailgoodsinfo,
    detailparaminfo,
    detailcommentinfo,
    goodlist,
    detailbottombar,
    backtop
    
},
async created() {
this.iid = this.$route.params.iid/* 拿到路由中的iid */
    let result = await getdetail(this.iid)/* 根据iid请求总数据 */
    /* 下面分类保存数据： */
    this.topimage = result.result.itemInfo.topImages/* 用topimage保存轮播图的图片 */
    //console.log(this.topimage.result.itemInfo.topImages);
    this.goods =new Goods(result.result.itemInfo,result.result.columns,result.result.shopInfo.services)
    /* console.log(this.goods); */
    this.shop = new Shop(result.result.shopInfo)
    /* console.log(this.shop); */
    this.detailinfo = result.result.detailInfo
    /* console.log(this.detailinfo); */
    this.paraminfo = new GoodsParam(result.result.itemParams.info,result.result.itemParams.rule)
    /* console.log(result.result); */
    if (result.result.rate.cRate !==0) {
        this.commentinfo = result.result.rate.list[0]
       /*  console.log(this.commentinfo); */
    }
    let tempcommend = await getrecommend()
    this.recommends = tempcommend.data.list
    /* console.log(this.recommends); */

},
mounted() {
      this.$refs.scroll1.scroll.on('scroll',(position)=>{/* 决定回到顶部按钮是否显示 */
             if ((-position.y)>1000) {
                 this.detailbackisshow =true
             } else {
                 this.detailbackisshow = false
             }
      })


     this.getthemetopy = alldebounce(()=>{/* 让themetopy获取每个部分真实的offsettop值 */
               this.themetopy = []
               this.themetopy.push(0)
               this.themetopy.push(this.$refs.detailparaminfo.$el.offsetTop) 
               this.themetopy.push(this.$refs.detailcommentinfo.$el.offsetTop) 
               this.themetopy.push(this.$refs.detailrecommend.$el.offsetTop) 
               console.log(this.themetopy);
            })

    let refresh = alldebounce(this.$refs.scroll1.refresh,500)
          this.$bus.$on('detailimgok',()=>{/* bus中的emit在detailgoodsinfo里面 */
          if (this.$refs.scroll1) {
              refresh()/* 主要是为了刷新scroll的高度，滑动不卡壳 */
              this.getthemetopy()/* 每次图片更新都执行getthemetopy，重置themetopy的参数，点击顶部才能进行正确的跳转 */
              console.log('goodinfo图片让scroll刷新了！');
          }
             })
             this.$bus.$on('detailgoodlistok',()=>{/* 和上面一样，不过是监听goodlist就是最下面的推荐板块的图片的加载并刷新scroll*/
          if (this.$refs.scroll1) {
              refresh()
              this.getthemetopy()
              console.log('goodlist图片让scroll刷新了！');
          }
             })
             this.$bus.$on('detailswiperimgok',()=>{
                 if (this.$refs.scroll1) {
              refresh()
              this.getthemetopy()
              console.log('swiper图片让scroll刷新了！');
          }
             })

             this.$refs.scroll1.scroll.on('scroll',(position)=>{
                 let y = -position.y
                 /* console.log('y:'+y);
                 console.log('0:'+ this.themetopy[0]);
                 console.log('1:'+this.themetopy[1]);
                 console.log('2:'+this.themetopy[2]);
                 console.log('3:'+this.themetopy[3]);
                 console.log(this.currentindex); 
                 console.log(this.themetopy[2] > y > this.themetopy[1]); */
                 /* 老师的方法是用每次滚动时，for循环遍历themetopy，遍历里面加上if判断值在不在topy[i]和[i+1]之间，这个前提是currentindex就是要传0 1 2 3，而且数组下标又恰好是0 1 2 3，如果currentindex要传的是文字之类的，那就不行了,但是恰好我们的navbar里面用了v-for存储的每个id就是数字·，所以用这种方法可以的。*/
                 if (y < this.themetopy[1]){
                     this.$refs.detailnavbar.currentindex =0
                 }else if ( y >= this.themetopy[1] && y<this.themetopy[2]) {
                     this.$refs.detailnavbar.currentindex  = 1
                 }else if ( y >= this.themetopy[2] && y<this.themetopy[3]) {
                     this.$refs.detailnavbar.currentindex  = 2
                 }else if(y >= this.themetopy[3])
                 {   this.$refs.detailnavbar.currentindex = 3
                 }
          })     
            
},
async activated() {
    /* this.iid = this.$route.params.iid
    console.log(this.iid);
    let a = await getdetail(this.iid)
    console.log(a); */
},
}
</script>

<style scoped>
.detail{
    height: 100vh;
   position: relative;
   z-index: 14;
   background-color: #fff;/* 覆盖掉下面的原来的4个图标的tabbar */
}
.detailnavbar{
    width: 100%;
    background-color: #fff;
}
.swiperout{
    height: 40vh;
}
.detailscroll{
    position: absolute;
     top: 47px;
     left: 0;
     right: 0; 
     bottom: 49px;
     background-color: #fff;
}
.bottombar{
    z-index: 15;
}
</style>