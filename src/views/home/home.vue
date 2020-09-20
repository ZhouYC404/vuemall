<template>
<!-- 首页绕脑部分--tabcontrol和goodlist总结：
tabcontrol：
1：首先通过props传三个信息：‘流行’，‘精选’，‘时尚’进去，告诉tabcontrol遍历几个；
2：点谁谁变红，就是和变红案例一样；
3：第二步点击时顺带发送一颗携带被点击者的id的火箭给父组件；
goodlist：
1：创建一个大对象保存所有数据，再创建三个小对象，小对象中的小数组分别保存‘流行’，‘精选’，‘时尚’的数据；
2：当tabcontrol步骤中的3触发时，会发一个id过来告诉我们谁被点击了，通过一个叫fatabclick的函数接收并通过id的值改变变量whichtabcontrol的值；
3：通过whichtabcontrol的值去响应式地传递哪部分数据过去，让goodlist子组件渲染。
倒序：要显示的数据由goods[xx].list决定-xx由传过来的id决定-传过来的id由谁被点击决定。
全程响应式，所以我们再次请求到之后的数据只要把其放入原来的3个数组中，页面就会自动显示更多！！！！！！！
-->

<!-- bus比vuex好的地方：vuex是用来存储状态的，如果我想让别的组件知道我的状态并做出改变，那么：
vue：组件完成行动-改变vuex中变量的值-另一个组建监听vuex中的变量改变-租出行动
bus：组件完成行动emit一个事件（函数）-另一边用$bus.$on监听那个函数有没有被发送并做出行动，比vuex少一步骤
但是如果想要存储状态，那么还是要用vuex，bus不能保存状态（变量的值这种），而且如果另一个组件没有被创建出来那么就不能用on实时监听了！ -->

<!-- 小知识点：$refs.xx.x可以获取xx子组件中的数据x（data,methods之类），但是这种是单方面获取的方式，没有交互效果，像子组件点击，父组件做出反应这种就不能用refs；
而emit on的父子通信就可以让两方进行交互效果；
refs.xx.$el可以直接获取子组件的offsettop这种原生的dom方面的属性；
父组件不能直接操作子组件的原生click这种事件，如果要操作，需要用@click.native才行 -->

  <div id="home">
      
      <navbar class="homenav"><span slot="center">首页</span></navbar><!-- 上方导航栏 -->
      <tabcontrol :title='["流行","精选","时尚"]' ref="tabcontrol1" class="tabcontrol" @tabclick="fatabclick" v-show="istabfixed" ></tabcontrol>
      <scroll class="scroll1" ref="scroll1" :probtype="3" :pullupload="true"><!-- 给scroll一个ref让父组件可以通过$refs.scroll.xxx调用其xxx数据，那还需要emit干嘛？ -->   <!-- 给probtype传值，需要用v-bind，不然3会被当成字符串 -->
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
      /* 方法1：老师的那种封装 */  /* this.ifshowback()
          this.ifupload()
          let refresh = alldebounce(this.$refs.scroll1.refresh,5)
          this.$bus.$on('imgloadcomplete',()=>{
          if (this.$refs.scroll1) {
              refresh()
          }
             })  */
          /* 方法2：自己写的没封装，主要是老师scroll里面有一个refresh函数我没有， this.$refs.scroll1.scroll.refresh()而老师是this.$refs.scroll1.refresh()，这里会出问题，搞得我没封装了  */    
          this.ifshowback()
          this.ifupload()
          let refresh = this.debounce(500)
          this.$bus.$on('imgloadcomplete',()=>{/*监听bus中的imgloadcomplete函数的执行，一旦其执行了便进行scroll的refresh操作 */
          if (this.$refs.scroll1/* 判断这个：this.$refs.scroll1.scroll反而不行，见了鬼了  */) {
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
        
        ifshowcontrol1(){/* 决定是隐藏还是显示control1 */
            this.$refs.scroll1.scroll.on('scroll',(position)=>{
              if (this.taboffsettop!=0) {/* 当control2的offsettop不是0也就是获取到了真正的值的时候（一定会获取到真正的值的，因为做了轮播图的图片加载判断，加载完了这个taboffsettop才会改变，极少情况会有bug），判断滚轮和taboffsettop的相对位置并且操作istabfixed的值，tabcontrol1根据istabfixed的值决定显示还是不显示 */
                  this.istabfixed = (-position.y)>this.taboffsettop
              }
          })
        },
        swiperallright(){/* 当检测到swiper的img加载完成后把tabcontrol的offsettop给taboffsettop变量 */

                this.taboffsettop = this.$refs.tabcontrol2.$el.offsetTop/* 通过el才能获取到offsettop */
        },

        debounce(delay){/* 本来这里不只是传delay的，要把this.$ref.xxxxx也传进来，但是bug解决不了，其实不传this.$ref就没有封装了意义了。。不过还是体会一下闭包的思想把！ */
        /* 主要的语句就是下面return后面的那个function，很短就3句，debounce只是起一个存放“伪全局变量timer”的作用的，他只会被触发一次--let xx = debounce(xxx)，这样xx就拿到了最主要的function了，其实就是把timer定义为定时器，设定delay，每执行一次refresh就会clear掉之前的timer，这样做到scroll.refresh不会执行很多次了，delay越大，就说明上一个timer被顶掉的概率越大。 */
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


        /* 这种写在methods里面然后再上面的created里面调用，this.banners可以获取到data里面的banners，但是如果直接写到created里面用匿名函数自调用就不行，应该是因为this在created里面调用了这个函数，那么这个函数中的this就指向this，就可以获取到data里面的变量了，但是this.gethomexxx不是一个整体吗？函数的名字就叫做this.gethomexxx啊？额，，，不晓得了。*/
        async gethomemultidata(){
            var a = await gethomemultidata() 
            this.banners = a.data.banner.list
            this.recommends = a.data.recommend.list /* 通过封装好的axios获取banner和recommand然后赋值给data里面的banners和recommends */
        },
        async gethomegoods(type){
               const page = this.goods[type].page+1/* 先用“假”page去请求数据 */
               var res = await gethomegoods(type,page)
               this.goods[type].list.push(...res.data.list)/* push的特殊写法，list是一个包含多个对象的数组，前面加点点点可以直接把list中的每一个对象依次push进来。P161 19分钟*/
               this.goods[type].page += 1/* 等确实请求到page参数的数据的时候才把goods里面的真page+1 */

               if (this.$refs.scroll1) {
                   this.$refs.scroll1.scroll.finishPullUp()
               }
        },
        fatabclick(id){/* 判断火箭上的id，通过id确定显示哪个页面 */
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
            }/* 下面两条语句用来让一个control的item被点击时，另一个也会改变颜色，本来应该让他们互相监听，但是非常麻烦，让他们的共同父亲监听就行 */
                 this.$refs.tabcontrol1.currentitem = id
                 this.$refs.tabcontrol2.currentitem = id
        },
        backclick(){
            this.$refs.scroll1.scroll.scrollTo(0,0,300)/* 通过refs获取到scroll1这个子组件的scroll变量，也就是new出来的bscroll对象，可以调用其scrollto这个方法返回顶部，第一个和第二个是返回到哪里，第三个参数是返回的过渡时间 */
        },
        ifshowback(){/* 通过ref拿到子组件的scroll，然后就可以在home中使用其on方法了，也可以把这个函数写到scroll里面去，ref也可以拿到methods，但是this的指向不对了，所以不行 */
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
                /* 已经封装到gethomegoods里面去了，逻辑没问题，但是他就是会卡主因为refresh？，会因为划不动一直划而多请求了数据。 */

                 /* this.$refs.scroll1.scroll.finishPullUp() *//* 上面那条gethomegoods是异步的，感觉把这个finish放在gethomegodds里面好像好点？但是感觉再重新封装一个上拉版的gethomegoods更好，因为第一次打开页面加载数据的时候并没有用到上拉加载。但是懒得改了，这样造成的问题就是数据会重复，一个90的数组，可能中间30和后面30是一样的数据，因为重复请求了*/
            })
           
        }
    },
}
</script>

<style scoped>/* 最好加上scoped，不然可能别的页面会有相同的class冲突 */
/* 整个页面是上面的navbar是sticky，中间的scroll绝对定位，下面的fixed，都要用定位是因为定位才拥有z-index属性！ */


.homenav{
    background: #FF8E97;
    color: whitesmoke;
}
.scroll1{
    /* 下面的方法让scroll能够滚动，因为必须要给其高度 */
     /* 方法1： */
     position: absolute;
     top: 44px;
     bottom: 49px;
     left: 0;
     right: 0; 
    /*方法2：  height: calc(100vh - 93px); ，为什么减去93而不是底部的49呢？因为用了scroll的话，顶部的44的navbar就不会动了，动的是scroll里面的内容，既然他不会动了，那么也就一直是relative的状态了，scroll部分不会挤上去，不需要减去了。*/

    /* 都会让sticky失效，只要有betterscroll的存在，sticky都会失效，好像fixed也会 */
}
#home{
    height: 100vh;
}
</style>