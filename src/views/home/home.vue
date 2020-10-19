<template>


  <div id="home">
      
      <navbar class="homenav"><span slot="center">首页</span></navbar><!-- 上方导航栏 -->
      <tabcontrol :title='["流行","精选","时尚"]' ref="tabcontrol1" class="tabcontrol" @tabclick="fatabclick" v-show="istabfixed" ></tabcontrol>
      <scroll class="scroll1" ref="scroll1" :probtype="3" :pullupload="true">
      <!-- 虽然有4张图片，但是都是占用一个地方，所以只需要获取一次↓ -->
      <homeswiper :banners="banners" @swiperimgok.once="swiperallright"></homeswiper>
      <recommendview :recommends="recommends"></recommendview>
      <featureview></featureview>                   <!-- 当子的tabclick被触发时，触发fatabclick -->
      <tabcontrol :title='["流行","精选","时尚"]' ref="tabcontrol2" @tabclick="fatabclick"></tabcontrol>
      
      <goodlist :goods="goods[whichtabcontrol].list"></goodlist><!-- 这里中括号里面的参数要用引号包裹，不然程序会去寻找叫pop的变量，显然没有，打引号就相当于把引号里面的内容传进去。 -->
      </scroll>

      <!-- 必须用native不然click是不能监听子组件的 -->
      <backtop @click.native="backclick()" v-show="backtopisshow" ></backtop>
                                             
  </div>
  
</template>

<script>
import navbar from '../../components/common/navbar/NavBar';
import homeswiper from '../home/childcomp/homeswiper';
import recommendview from '../home/childcomp/recommendview/recommendview';
import featureview from '../home/childcomp/featureview';

import tabcontrol from '../../components/content/tabcontrol/tabcontrol';
import goodlist from '../../components/content/goods/goodlist';
import backtop from '../../components/content/backtop/backtop';

import scroll from '../../components/common/betterscroll/scroll';
import alldebounce from '../../common/utils/alldebounce';

import {gethomemultidata,gethomegoods} from '../../network/home';

export default {
    data() {
        return {
            banners: [],
            recommends:[],
            goods:{
                pop:{page:0,list:[]},
                new:{page:0,list:[]},
                sell:{page:0,list:[]}
            },
            whichtabcontrol:'pop',
            backtopisshow:false,
            taboffsettop:0,
            istabfixed:false,
            savey:0
        }
    },
    components: {
        navbar,
        homeswiper,
        recommendview,
        featureview,
        tabcontrol,
        goodlist,
        scroll,
        backtop
    },
     created() {
             this.gethomemultidata()/* 获取轮播图和推荐的数据 */
             this.gethomegoods('pop')
             this.gethomegoods('new')/* ↑↓获取下面那3块的数据 */
             this.gethomegoods('sell')
    },
    activated() {/* 进入home页面时触发 */
        this.$refs.scroll1.scroll.scrollTo(0,this.savey,1)/* 读取savey的值，用scrollto进行跳转 */
         this.$refs.scroll1.scroll.refresh()
        console.log(this.savey)
    },
    deactivated() {/* 离开home页面时触发 */
        this.savey = this.$refs.scroll1.scroll.y/* 把离开时scroll的y保存在savey里面 */
    },

    mounted() {
     
          this.ifshowback()
          this.ifupload()
          let refresh = this.debounce(500)
          this.$bus.$on('imgloadcomplete',()=>{/*监听bus中的imgloadcomplete函数的执行，一旦其执行了便进行scroll的refresh操作 */
          if (this.$refs.scroll1) {
              /* this.$refs.scroll1.scroll.refresh() */
              console.log('goodlist图片让scroll刷新了');
              refresh()
          }
             })
           
          this.$refs.scroll1.scroll.on('scroll',(position)=>{
              //if (this.taboffsettop!=0) {
                  this.istabfixed = (-position.y)>this.taboffsettop
             //}
          })
    

             

    },
    methods: {
        /* 决定是隐藏还是显示control1 */
        /* ifshowcontrol1(){
            this.$refs.scroll1.scroll.on('scroll',(position)=>{
              if (this.taboffsettop!=0) {
                  this.istabfixed = (-position.y)>this.taboffsettop
              }
          })
        }, */
        swiperallright(){/* 当检测到swiper的img加载完成后把tabcontrol的offsettop给taboffsettop变量 */

                this.taboffsettop = this.$refs.tabcontrol2.$el.offsetTop/* 通过el才能获取到offsettop */
        },

        debounce(delay){
            var that = this
            let timer = null
            return function () {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    that.$refs.scroll1.scroll.refresh()
                   /*  console.log('ohohohohoohoo');测试语句 */
                }, delay);
            }
        },


      
        async gethomemultidata(){
            var a = await gethomemultidata() 
            this.banners = a.data.banner.list
            this.recommends = a.data.recommend.list /* 通过封装好的axios获取banner和recommand然后赋值给data里面的banners和recommends */
        },
        async gethomegoods(type){
               const page = this.goods[type].page+1/* 先用“假”page去请求数据 */
               var res = await gethomegoods(type,page)
               this.goods[type].list.push(...res.data.list)
               this.goods[type].page += 1

               if (this.$refs.scroll1) {
                   this.$refs.scroll1.scroll.finishPullUp()
               }
        },
        fatabclick(id){
            switch (id) { /* 根据传过来的id判断显示哪部分数据 */
                case 0:
                    this.whichtabcontrol = 'pop'
                    break;
                case 1:
                    this.whichtabcontrol = 'new'
                    break;
                case 2:
                    this.whichtabcontrol = 'sell'
                    break;
            }
                 this.$refs.tabcontrol1.currentitem = id
                 this.$refs.tabcontrol2.currentitem = id
        },
        backclick(){
            this.$refs.scroll1.scroll.scrollTo(0,0,300)
        },
        ifshowback(){
            this.$refs.scroll1.scroll.on('scroll',(position)=>{
              if ((-position.y)>1000) {/* 滚动条距离总scroll顶端的坐标 */
                   this.backtopisshow = true
              }else{
                  this.backtopisshow = false
                  
              }
        })
        },
        ifupload(){/* 上拉加载更多 */
            this.$refs.scroll1.scroll.on('pullingUp',()=>{
                console.log('okokook');
                this.gethomegoods(this.whichtabcontrol)
               

              
            })
           
        }
    },
}
</script>

<style scoped>/* 最好加上scoped，不然可能别的页面会有相同的class冲突 */


.homenav{
    background: #FF8E97;
    color: whitesmoke;
}
.scroll1{
 
     position: absolute;
     top: 44px;
     bottom: 49px;
     left: 0;
     right: 0; 
  

 
}
#home{
    height: 100vh;
}
</style>