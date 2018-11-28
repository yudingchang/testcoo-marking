<template>
  <div class="walletAccount">
    <!-- wallet-index -->
    <div v-if="walletIndex" class="wallet-index">
      <div class="walletAccount-Ac">
        <p class="walletAccount-Ac-name">钱包账户</p>
        <div class="walletAccount-Ac-recharge">
          <div class="walletAccount-Ac-recharge-rmb">
            <p>
              <span>人民币</span>
              <span>￥ 8989.89</span>
            </p>
            <p @click="jumpPay">去充值</p>
          </div>
          <div class="walletAccount-Ac-recharge-line"/>
          <div class="walletAccount-Ac-recharge-dollar">
            <p>
              <span>美元</span>
              <span>$ 8989.89</span>
            </p>
            <p>去充值</p>
          </div>
        </div>
      </div>
      <div class="walletAccount-detail">
        <p class="walletAccount-detail-name">钱包明细</p>
        <div class="walletAccount-detail-list">
          <ul>
            <li>创建时间</li>
            <li>
              <div class="block">
                <el-date-picker
                  v-model="value10"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"/>
              </div>
            </li>
            <li/>
            <li>
              <div class="block">
                <el-date-picker
                  v-model="value11"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"/>
              </div>
            </li>
            <li>交易类型</li>
            <li>
              <el-select v-model="value1" placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </li>
            <li>状态</li>
            <li>
              <el-select v-model="value2" placeholder="请选择">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </li>
            <li>查询</li>
          </ul>
          <ul>
            <el-table
              :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              style="width: 100%">
              <el-table-column
                prop="date"
                label="流水号"
                width="198"/>
              <el-table-column
                prop="name"
                label="创建时间"
                width="200"/>
              <el-table-column
                prop="address"
                label="金额"
                width="200"/>
              <el-table-column
                prop="name"
                label="交易类型"
                width="200"/>
              <el-table-column
                prop="name"
                label="状态"
                width="200"/>
              <el-table-column
                prop="name"
                label="操作"
                width="381"/>
            </el-table>
          </ul>
          <ul>
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[5, 10, 20, 40]"
              :page-size="pagesize"
              :total="tableData.length"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"/>
          </ul>
        </div>
      </div>
    </div>
    <!-- wallet-pay -->
    <div v-if="walletPayRmb" class="wallet-pay-Rmb">
      <p>人民币充值</p>
      <ul class="wallet-pay-Rmb-ul">
        <li>充值金额</li>
        <li @click="sumMin">{{ sum.min }}元</li>
        <li @click="sumMinA">{{ sum.minA }}元</li>
        <li @click="sumMinAA">{{ sum.minAA }}元</li>
        <li @click="sumMinAAA">{{ sum.minAAA }}元</li>
      </ul>
      <p>
        <input id="sumFin" v-model="sumFin" type="text" placeholder="输入">
        <span>元</span>
      </p>
      <div class="payment">
        <p>付款方式</p>
        <div class="paymentAll">
          <ul class="paymentAll-ul">
            <li>
              <el-radio v-model="radio" label="1"/>
              <img src="" alt="">
              <span>银联</span>
            </li>
            <li>
              <el-radio v-model="radio" label="2"/>
              <img src="" alt="">
              <span>支付宝</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 点击提交 -->
      <el-button type="text" @click="open5">确定付款</el-button>
    </div>
  </div>
</template>

<script>
import { tableDate } from '@/api/walletDetail'
export default {
  name: 'WalletAccount',
  components: { },
  data() {
    return {
      value10: '',
      value11: '',
      // options1交易类型
      options1: [{
        value: '选项1',
        label: '订单付款'
      }, {
        value: '选项2',
        label: '白条还款'
      }, {
        value: '选项3',
        label: '充值'
      }, {
        value: '选项4',
        label: '订单退款'
      }],
      // options2状态
      options2: [{
        value: '选项1',
        label: '待付款'
      }, {
        value: '选项2',
        label: '待审核'
      }, {
        value: '选项3',
        label: '审核中'
      }, {
        value: '选项4',
        label: '成功'
      }, {
        value: '选项5',
        label: '失败'
      }, {
        value: '选项6',
        label: '已关闭'
      }],
      // value1是交易类型数据
      value1: '',
      // value2是状态类型数据
      value2: '',
      // 表格数据tableData
      tableData: [],
      currentPage: 1, // 初始页
      pagesize: 10, // 每页的数据

      // walletindex
      walletIndex: true,
      // walletPay
      walletPayRmb: false,
      sum: {
        min: '700',
        minA: '1000',
        minAA: '5000',
        minAAA: '10000'
      },
      sumFin: '',
      radio: '1'
    }
  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.fullPath
    // }
  },
  created() {
    this.tableDateA()
  },
  mounted() {
    // console.log(this.$route.fullPath)

  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size
      console.log(this.pagesize) // 每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },
    // 获取钱包明细状态信息
    tableDateA() {
      tableDate().then(response => {
        if (response.data.code == 0) {
          this.tableData = response.data.data.list
        }
        console.log(this.tableData)
      })
    },
    // 跳转支付
    jumpPay() {
      this.walletIndex = false,
      this.walletPayRmb = true
    },
    // walletPayRmb
    sumMin() {
      this.sumFin = this.sum.min
    },
    sumMinA() {
      this.sumFin = this.sum.minA
    },
    sumMinAA() {
      this.sumFin = this.sum.minAA
    },
    sumMinAAA() {
      this.sumFin = this.sum.minAAA
    },

    // 提交传递数据
    open5() {
      this.$alert('', '', {
        dangerouslyUseHTMLString: true
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
li{
    list-style:none;
}
.walletAccount{
    padding-left:100px;
    // height:600px;
    overflow:hidden;
    .walletAccount-Ac{
        margin-bottom:32px;
        .walletAccount-Ac-name{
            height:33px;
            line-height:33px;
            font-size:16px;
            font-weight:100;
            color:#50688C;
            margin:24px 0;
        }
        .walletAccount-Ac-recharge{
            width:770px;
            height:168px;
            border:1px solid #E6EAEE;
            border-radius:4px;
            background:#fff;
            .walletAccount-Ac-recharge-rmb{
                width:383.5px;
                height:168px;
                float:left;
                p:nth-child(1){
                    height:35px;
                    margin-top:32px;
                    span:nth-child(1){
                        color:#50688C;
                        font-size:24px;
                        margin-left:67px;
                    }
                    span:nth-child(2){
                        color:#158BE4;
                        font-size:26px;
                        margin-left:37px;
                    }
                }
               p:nth-child(2){
                   height:40px;
                   width:120px;
                   background:#67C23A;
                   text-align:center;
                   line-height:40px;
                   border-radius:4px;
                   color:#fff;
                   font-size:16px;
                   margin-left:132px;
                   cursor:pointer;
               }
            }
            .walletAccount-Ac-recharge-line{
                width:1px;
                height:80px;
                margin-top:46px;
                float:left;
                background:#DFE3E9;
            }
            .walletAccount-Ac-recharge-dollar{
                width:383.5px;
                height:168px;
                float:left;
                p:nth-child(1){
                    height:35px;
                    margin-top:32px;
                    span:nth-child(1){
                        color:#50688C;
                        font-size:24px;
                        margin-left:67px;
                    }
                    span:nth-child(2){
                        color:#158BE4;
                        font-size:26px;
                        margin-left:37px;
                    }
                }
               p:nth-child(2){
                   height:40px;
                   width:120px;
                   background:#67C23A;
                   text-align:center;
                   line-height:40px;
                   border-radius:4px;
                   color:#fff;
                   font-size:16px;
                   margin-left:132px;
                   cursor:pointer;
               }
            }
        }
    }
    .walletAccount-detail{
        // background:#fff;
        .walletAccount-detail-name{
            height:33px;
            line-height: 33px;
            font-size:16px;
            color:#50688C;
            margin:24px 0;
        }
        .walletAccount-detail-list{
            width:100%;
            height:682px;
            border:1px solid #E6EAEE;
            border-radius:4px;
            background:#fff;
            padding-left:40px;
            padding-top:19px;
            ul:nth-child(1){
                height:36px;
                line-height:36px;
                 li{
                    list-style:none;
                    float:left;

                }
                li:nth-child(1){
                    margin-right:16px;
                    font-size:16px;
                    color:#50688C;
                }
                li:nth-child(3){
                    margin:18px 10px 0;
                    width:12px;
                    height:1px;
                    background:#C5D0DE;

                }
                li:nth-child(5){
                    margin-left:32px;
                    font-size:16px;
                    color:#50688C;
                }
                li:nth-child(6){
                    margin-left:16px;
                }
                li:nth-child(7){
                    margin-left:32px;
                    font-size:16px;
                    color:#50688C;
                    margin-right:16px;
                }
                li:nth-child(9){
                    margin-left:32px;
                    width:100px;
                    height:36px;
                    border-radius:4px;
                    background:#67C23A;
                    text-align: center;
                    line-height:36px;
                    color:#fff;
                    font-size:16px;
                    cursor:pointer;
                }
            }
            ul:nth-child(2){
                margin-top:18px;
                width:100%;
                background:#F5F8FA;
            }
            ul:nth-child(3){
                margin-left:314px;
            }
        }
    }
    // wallet-pay
    .wallet-pay-Rmb{
        padding-left:100px;
        padding-top:38px;
        p:nth-child(1){
            height:25px;
            line-height: 25px;
            font-size:16px;
            color:#50688C;
            margin-bottom:30px;
        }
        .wallet-pay-Rmb-ul{
            height:40px;
            padding:0;
            margin-bottom:24px;
            li{
                width:140px;
                height:100%;
                border:1px solid #C0C4CC;
                border-radius:4px;
                float:left;
                text-align:center;
                line-height: 40px;
                color:#909399;
                font-size:14px;
                margin-right:30px;
                cursor:pointer;
            }
            li:nth-child(1){
                border:none;
                width:64px;
                margin-right:26px;

            }
            .addBg{
                background:#67C23A;
                color:#fff;
            }
        }
        p:nth-child(3){
            height:40px;
            margin-left:90px;
            position:relative;
            width:300px;
            #sumFin{
                width:284px;
                height:100%;
                border:1px solid #C0C4CC;
                outline: none;
                border-radius:4px;
                color:#909399;
                font-size:14px;
                padding-left:16px;
                background:#F3F6F9;
            }
            span{
                color:#909399;
                font-size:14px;
                position:absolute;
                right:26px;
                top:13px;
            }
        }
        //payment
        .payment{
            height:240px;
            p{
                height:80px;
                color:#50688C;
                font-size:14px;
                float:left;
                line-height:80px;
            }
            .paymentAll{
                float:left;
                .paymentAll-ul{
                    height:160px;
                    width:660px;
                    li{
                        height:80px;
                        width:660px;
                        line-height:80px;
                        border-bottom:1px solid #C0C4CC;
                        padding-left:54px;
                        input[type="radio"]{
                            display:inline-block;
                            vertical-align: middle;
                            width:26px;
                            height:26px;
                            border:1px solid red;
                            background-color:#F3F6F9;
                        }
                        input[type="radio"]:checked{
                            background-color:#F3F6F9;
                            background-clip: inherit;
                        }
                    }
                }
            }

        }
        //propsData
        .propsData{
            width:250px;
            height:50px;
            border:none;
            border-radius:4px;
            text-align: center;
            line-height: 50px;
            background:#FFA800;
            color:#fff;
            font-size:18px;
            margin-left:147px;
            cursor:pointer;
        }
    }

}

</style>

