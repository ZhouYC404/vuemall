<template>
<!-- categories数据显示流程：
1.组件被创建时直接通过getcategories函数请求数据；
2.把数据存入categories；
3.把父组件中的categoires存入子组件，:categories="categories"；
4.子组件显示全部；-->
<!-- 
  subcategory数据显示流程：
  1.首先tabmenu被点击，通过menuitemselect将被点击的index传给父组件，父组件通过whoisselected接收index并请求和index对应的数据；
  2.在请求数据的时候根据index改变currentindex，并成功请求到数据存入 this.categorydata[index].subcategories；
  3.因为subcategory组件中绑定了whichsubcategory函数，此函数根据currentindex动态返回subcategories数据，所以在2中改变了currentindex，显示的数据就响应式地改变了。
  4.子组件把whichsubcategory函数返回的数据存入subcategory，并显示在页面上；
 -->
 <!-- 
   categorydetail数据显示流程：
   1-2.和subcategory一样，因为请求数据是嵌套式的，只是数据存入this.categorydata[this.currentindex].categorydetail[type]；
   注意在请求subcategory数据时，会顺便执行以下三句话：
   this.getcategorydetail('pop')
   this.getcategorydetail('sell')
   this.getcategorydetail('new')
   说明只要我们点击了左边的分类，这个分类的所有数据（包括右上和右下）就立马会被全部请求完，我们点击tabcontrol只是决定！显示！哪部分罢了。
   3.当我们点击tabcontrol时，子组件会emit带有index的事件给父组件，父组件通过tabclick函数改变detailtype的值；
   4.通过shoudetail函数根据detailtype的值，把对应的数据返回给子组件的goods数组；
   5.goodlist组件通过goods显示对应的数据；
  -->
  <!-- 
    关于刷新高度流程：
    1.goodlistitem的img有@load，加载完后会触发一个函数，此函数根据route中的path判断该向bus中发送哪个事件；
    2.home，category，detail页面都监听bus中的img触发事件(3个)，只不过监听的事件不一样（总不可能去监听不属于自己页面的图片吧）；
    3.监听到后即刻触发refresh刷新scroll的高度，使页面滚动不卡顿；
   -->
  <div class="category">
       <navbar class="cnavbar"><span slot="center">商品分类</span></navbar>
       <tabcontrol v-show="istabfixed" class="tabcontrol1" :title="['综合','新品','销量']" @tabclick="tabclick" ref="tabcontrol1"></tabcontrol>
       <div class="content">
           <!-- 左侧分类栏↓ -->
           <tabmenu :categories="categories" @menuitemselect="whoisselected"></tabmenu>
           <!-- 右侧数据显示栏↓ -->
           <scroll id="catscroll" ref="catscroll">
                   <subcategory :subcategory="whichsubcategory()" class="subcategory"></subcategory>
                   <tabcontrol class="tabcontrol2" :title="['综合','新品','销量']" @tabclick="tabclick" ref="tabcontrol2"></tabcontrol>
                   <goodlist :goods="showdetail()"></goodlist>
           </scroll> 
           <!-- 右下角小飞机↓ -->
           <backtop @click.native="backclick()" v-show="backtopisshow"></backtop>
       </div>
  </div>
</template>

<script>
import navbar from '../../components/common/navbar/NavBar';
import tabmenu from './childcom/tabmenu';
import scroll from '../../components/common/betterscroll/scroll';
import tabcontrol from '../../components/content/tabcontrol/tabcontrol';
import subcategory from './childcom/subcategory';
import goodlist from '../../components/content/goods/goodlist';
import backtop from '../../components/content/backtop/backtop';
import {getCategory, getSubcategory, getCategoryDetail} from "../../network/categories";
export default {
      data() {
          return {
              categories:[],//左边标志类数据
              categorydata:{},//右边整体数据
              currentindex:-1,//存储左边分类栏目谁被点击了
              istabfixed:false,//决定tabcontrol是否显示
              taboffsettop:0,//决定tabcontrol1在多少范围内隐藏
              detailtype:'pop',//决定显示哪个右下部分数据(pop,new.sell)
              backtopisshow:true//决定返回顶部小飞机是否显示~
          }
      },
      components: {
          navbar,
          tabmenu,
          scroll,
          tabcontrol,
          subcategory,
          goodlist,
          backtop
      },
      methods: {
        backclick(){
            this.$refs.catscroll.scroll.scrollTo(0,0,300)
        },
        showdetail(){//判断返回哪部分（pop,sell还是new）数据
            if (this.currentindex === -1) return []
        return this.categorydata[this.currentindex].categorydetail[this.detailtype]
        },
        tabclick(index){//当tabclick被点击时，改变detailtype
          console.log('ok');
          switch (index) { /* 根据传过来的index判断显示哪部分数据 */
                case 0:
                    this.detailtype = 'pop'
                    break;
                case 1:
                    this.detailtype = 'new'
                    break;
                case 2:
                    this.detailtype = 'sell'
                    break;
            }
              this.$refs.tabcontrol1.currentitem = index
              this.$refs.tabcontrol2.currentitem = index
        },
          catdebounce(){//防抖函数，图片刷新，调用此函数
              let timer = null
              let that = this
              return function () {
                  clearTimeout(timer)
                  timer = setTimeout(() => {
                    console.log('进入刷新');
                      that.$refs.catscroll.refresh()
                  }, 2000);
              }
          },
          whichsubcategory(){//返回根据currentindex改变的数据给右上方页面，响应式的，根据currentindex不同，此函数会及时响应不同数据给 <subcategory :subcategory="whichsubcategory()"></subcategory>中的subcategory。
               if (this.currentindex === -1) {
                   return {}
               }
               return this.categorydata[this.currentindex].subcategories
          },
       whoisselected(index){
           //根据子组件emit过来的index请求左边被点击的分类的数据
           this.getsubcategory(index)
       },
          //请求标志性数据↓
          getcategories(){
          getCategory().then(res => {
          // 1)保存分类数据
          this.categories = res.data.category.list
          //console.log('category数据：');
          //console.log(this.categories);//←只有一些标志类的数据，比如title：正在流行，maikey是一串数字这种。
          //顺便初始化一下categorydata的格式，以便之后添加数据
          for (let i = 0; i < this.categories.length; i++) {
            this.categorydata[i] = {
              subcategories: {},
              categorydetail: {
                'pop': [],
                'new': [],
                'sell': []
              }
            }
          }
          // 3.请求右边的数据，真正的数据开始请求了！！
          //首先破例请求一次0，也就是“正在流行”
          this.getsubcategory(0)
        })
          },
          //2、根据分类栏目的下标去请求相应的数据
          getsubcategory(index){
              //让currentindex一开始就等于0，也就是“正在流行”
              this.currentindex = index;
        const mailkey = this.categories[index].maitKey;//一串乱七八糟的数字
        getSubcategory(mailkey).then(res => {//根据这个maikey数字去请求对应的数据
        //console.log('右上方subcategory数据：');
        //console.log(res.data);
          this.categorydata[index].subcategories = res.data//右上方的数据存储成功！
          //不理解↓
          //-----
          this.categorydata = {...this.categorydata}
//下面开始请求右下方的数据~~~~~~~
          this.getcategorydetail('pop')
          this.getcategorydetail('sell')
          this.getcategorydetail('new')
        })
          },
          getcategorydetail(type) {
        // 1)获取请求的miniWallkey
        const miniWallkey = this.categories[this.currentindex].miniWallkey;//也是一串乱七八糟的数字
        // 2)发送请求,传入miniWallkey和type
        getCategoryDetail(miniWallkey, type).then(res => {//根据数字和type(pop sell 或者new)去请求
       // console.log("右下方categorydetail数据：");
        //console.log(res);
          this.categorydata[this.currentindex].categorydetail[type] = res//右下方数据保存成功！
          //不理解↓
          this.categorydata = {...this.categorydata}
        })
      },
      },
      created() {
          //数据请求过程：
        /*
        1：请求categories 标志类数据，也就是左边的小字以及一些maitkey这种标志类数字；并且初始化categorudata的数据结构（右边的数据）
        2： 请求subcategories（右上方）；
        3：请求categorydetail（右下方）；
         */
        //明明有3步请求过程，但是页面开始创建的时候只有下面一行语句，因为请求是嵌套式的，this.getcategories的最后一句就是this.getsubcategory(0),this.getsubcategory得最后一句就是this.getcategorydetail；
         this.getcategories()
      },
      mounted() {
        //防抖刷新
          let refresh = this.catdebounce()
          this.$bus.$on('subcatimgok',()=>{//在收到总线中右上方的图片刷新事件时，触发防抖
              if (this.$refs.catscroll) {
                console.log('监听右上方图片是否加载中...');
                  refresh()
                  this.taboffsettop = this.$refs.tabcontrol2.$el.offsetTop
                  //↑当图片加载完，刷新tabcontrol2的offsettop值，并给taboffsettop，好让tabcontrol1知道自己在什么时候隐藏，懒得防抖了。。
              }
          })
          this.$bus.$on('catdetailimgok',()=>{
            if (this.$refs.catscroll) {
              console.log('监听右下方图片是否加载中...');
                  refresh()
              }
          })
          this.$refs.catscroll.scroll.on('scroll',(position)=>{//开监听器,为了顶部tabcontrol和backtop小飞机的隐藏
          /* 顶部相关： */
            this.istabfixed = (-position.y)>this.taboffsettop//如果页面滚动到tabcontrol2的位置了(taboffsettop保存了tabcontrol2的位置)，istabfixed就为true，也就是立马显示tabcontrol1
            /* 小飞机相关： */
            if ((-position.y)>2000) {//如果页面滚到到大于2000的位置，显示小飞机
              this.backtopisshow = true
            }else{
              this.backtopisshow = false
            }
          })
          
      },
}
</script>

<style scoped>
.cnavbar{/* 顶部 */
    background-color:  #FF8E97;
    color: aliceblue;
}
.content {/* 中心页面 */
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;
    display: flex;
  }
  .subcategory{
    margin-bottom: 10px;
  }
  .tabcontrol1{/* 三个选项那块 */
    position: absolute;
    width: calc(100% - 101px);
    z-index: 3;
    right: 0;
  }
   #catscroll {/* 中心右边部分 */
    overflow: hidden;
     width: calc(100% - 101px); 
    height: calc(100vh - 49px - 44px);
    /* flex: 1; */
     /* flex:1，去掉会产生bug，因为subcategory.vue中#catscroll设置了flex和这个产生了冲突？
        不去掉感觉多余，实在看不顺眼，把上面的width: calc(100% - 101px); 打开，把这条关闭也行； */
  }
</style>