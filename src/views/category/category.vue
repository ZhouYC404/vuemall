<template>

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
          whichsubcategory(){//返回根据currentindex改变的数据给右上方页面
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
          
          this.categorydata = {...this.categorydata}
        })
      },
      },
      created() {
         
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
  
  }
</style>