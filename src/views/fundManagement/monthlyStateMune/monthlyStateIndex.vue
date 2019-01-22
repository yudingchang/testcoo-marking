<template>
  <div class="monthlyStateIndex">
   <el-row>
    <!-- 测库月结 -->
    <el-col :span="24" class="testcoo-repayment repayment-title">
      <p>测库月结</p>
      <div class="outAccount">
        <!-- outAccount-title -->
        <div class="outAccount-title">
          <span>已出账</span>
          <span @click="checkAlreadyPay">
            <span>查看已还款</span>
            <i class="iconfont icon-hebingxingzhuang7"></i>
          </span>
        </div>
        <!-- outAccount-accumulative -->
        <ul class="outAccount-accumulative">
          <li>累计已出账总金额:</li>
          <li>人民币</li>
          <li>￥{{outAccountTotal.CNY}}</li>
          <li></li>
          <li>美元</li>
          <li>${{outAccountTotal.USD}}</li>
        </ul>
        <!-- outAccount-bill -->
        <div class="outAccount-bill" v-for="(item,index) in outAccountBillData" :key="index">
          <p class="outAccount-bill-warn" v-if="item.status == 0">请在规定时间还款,否则将影响您的信誉，导致您无法下单</p>
          <ul class="outAccount-bill-per">
            <li>
              <p>{{item.year_month.year}}年{{item.year_month.month}}月账单</p>
              <p>
                <span>最后还款日期：</span>
                <span>{{item.repayment_days.year}}.{{item.repayment_days.month}}.{{item.repayment_days.day}}</span>
              </p>
            </li>
            <li></li>
            <li>
              <p>{{ item.currency == "CNY"?"人民币账单":"美元账单"}}:{{$t(item.currency)}}{{item.price}}</p>
              <p @click="outAccountMoneyPay(item.currency)" v-show="item.status == 0">{{ item.currency == "CNY"?"人民币":"美元"}}还款</p>
              <p v-show="item.status == 1"><span>失败</span><span></span></p>
              <p v-show="item.status == 2"><span>还款中</span><span></span></p>
            </li>
            <li><p @click="checkPayDetail(item.id)">查看详情</p></li>
          </ul>
        </div>
        <!-- outAccount-blank -->
        <div class="outAccount-blank" v-if="outAccountBlank">
          <p></p>
          <p>暂无已出账单</p>
        </div>  
      </div>
    </el-col>
    <!-- 月结未出账 -->
    <el-col :span="24" class="testcoo-outstanding outstanding-title">
      <!-- outstanding -->
      <ul class="outstanding">
        <li>未出账</li>
        <li @click="OutstandingAccountDeTotal">
          <span>更多</span>
          <span><i class="iconfont icon-hebingxingzhuang7"></i></span>
        </li>
      </ul>
      <!-- outstandingAccount -->
      <div class="outstandingAccount">
        <!-- outstandingAccount-info -->
        <div class="outstandingAccount-info">
          <ul>
            <li>累计未出账：</li>
            <li>人民币</li>
            <li>￥8989.89</li>
            <li></li>
            <li>美元</li>
            <li>$8989.89</li>
            <li>创建时间</li>
            <li>
               <div class="block">
                <el-date-picker
                  v-model="valueStartTime"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </li>
            <li></li>
            <li>
               <div class="block">
                <el-date-picker
                  v-model="valueEndTime"
                  type="date"
                  @blur="checkOutStanding"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </li>
          </ul>
          <!-- outstandingAccount-table -->
          <div class="outstandingAccount-table">
           <el-table
              :header-cell-style="{background:'#F5F8FA'}"
              align="left"
              :data="outstandingAccountTableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              style="width: 100%">
              <el-table-column
              prop="year_month"
              label="月份"
              width="339">
              </el-table-column>
              <el-table-column
              label="流水号"
              width="300">
              <template slot-scope="scope">
                  <el-button @click="outstandingHandleClick(scope.row,scope.$index)" type="text" size="small"></el-button>
              </template>
              </el-table-column>
              <el-table-column
              prop="year_month"
              label="支付方式"
              width="300">
              </el-table-column>
              <el-table-column
              prop="year_month"
              label="总金额"
              >
              </el-table-column>
           </el-table>
          </div>
        </div>
        <!-- outstandingAccount-pagination -->
        <div class="outstandingAccount-pagination">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[6]" 
              :page-size="pagesize"         
              layout="total, sizes, prev, pager, next, jumper"
              :total="outstandingAccountTableData.length">    
          </el-pagination>
        </div>
        <!-- outstandingAccount-blank -->
        <div class="outstandingAccount-blank" v-if="outstandingAccountBlank">
          <p></p>
          <p>暂无未出账单</p>
        </div>
      </div>
    </el-col>
   </el-row>
   <!-- monthly-pay-detail测库月结单月账单还款页面 -->
   <!-- <monthly-pay-detail v-if="monthlyPayDetail" v-bind:outAccountPayMay="outAccountPayMayF"></monthly-pay-detail> -->
   <!-- monthly-reimbursement测库月结已出账还款明细 -->
   <!-- <monthly-reimbursement v-if="monthlyReimbursement" v-on:ReimbursementD="ReimbursementData"></monthly-reimbursement> -->
   <!-- reimbursement-detail测库月结已出账还款明细单月查看详情 -->
   <!-- <reimbursement-detail v-if="ReimbursementDetail" v-bind:ReimbursementDetailDataId="ReimbursementDetailDataId"></reimbursement-detail> -->
   <!-- monthly-bill-detail测库月结单笔账单详情页面 -->
   <!-- <monthly-bill-detail v-if="monthlyBillDetail" v-bind:monthlyBilldata="monthlyBilldataId"></monthly-bill-detail> -->
   <!-- outstanding-account-de测库月结未出账明细页面  -->
   <!-- <outstanding-account-de v-if="OutstandingAccountDe"></outstanding-account-de> -->
  </div>
</template>

<script>
import monthlyPayDetail from './monthlypayDetail.vue'
import monthlyBillDetail from './monthlyBillDetail.vue'
import monthlyReimbursement from './monthlyReimbursement.vue'
import ReimbursementDetail from './ReimbursementDetail.vue'
import OutstandingAccountDe from './OutstandingAccountDe.vue'
import {outAccountData,outstandingAccount} from '@/api/monthlyState'
export default{
  name: 'monthlyStateIndex',
  data(){
    return {
      //选择开始日期
      valueStartTime:"",

      //选择截止日期
      valueEndTime:"",

      outAccountTotal:[], //已出账所有账单总额
      outAccountBillData:[], //已出账数据

      //暂无已出账单
      outAccountBlank:false,

      //暂无未出账单
      outstandingAccountBlank:false,

      currentPage:1,   //初始页
      pagesize:6,    //每页的数据
      outstandingAccountTableData:[],  //monthlyState 测库月结出账列表数据

    }
  },
  components:{},
  created(){
    this.getOutAccountData()
    this.getOutstandingAccount()
  },
  methods:{
    //已出账-页面加载获取已出账数据
    getOutAccountData(){
      outAccountData().then(response =>{
        // console.log(response.data.data.list)
        if(response.data.code == 0){
          this.outAccountBillData=response.data.data.list
          this.outAccountTotal=response.data.data.total
        }
      })
    },

    //点击查看已还款明细
    checkAlreadyPay(){
      this.$router.push({ path: 'monthlyReimbursement', query: {  } })
    },


    //已出账-点击查看详情
    checkPayDetail(val){
     this.$router.push({ path: 'monthlyBillDetail', query: { orderId: val.id } })

    },

    //点击账单还款进入还款界面详情
    outAccountMoneyPay(val){
     this.$router.push({ path: 'monthlypayDetail' })
    },

    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
            this.pagesize = size;
            console.log(this.pagesize)  //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage){
            this.currentPage = currentPage;
            console.log(this.currentPage)  //点击第几页
    },
    getOutstandingAccount(){
      outstandingAccount().then(response =>{
        if(response.data.code == 0){
          this.outstandingAccountTableData=response.data.data.list
        }
      })
    },

    //月结未出账
    outstandingHandleClick(row,index){
      this.$router.push({ path: '' })
    },

    //光标离开触发查询
    checkOutStanding(){
      this.getOutstandingAccount({
        // 参数
      })
      console.log("光标离开截止日期")
    },

    //月结未出账明细
    OutstandingAccountDeTotal(){
     this.$router.push({ path: 'OutstandingAccountDe', query: {  } })
    },

  }
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
//dom样式
 .monthlyStateIndex{
   padding:32px 0 0 100px;
  //  testcoo-repayment
   .testcoo-repayment{
     margin-bottom:32px;
     p{
       height:33px;
       font-size:18px;
       margin-bottom:24px;
       line-height:33px;
       color:#50688C;
     }
     .outAccount{
       margin:0 100px 0 1px;
       border:1px solid #DFE3E9;
       .outAccount-title{
         height:61px;
         line-height: 61px;
         background:#ffffff;
         span:nth-child(1){
           float:left;
           margin-left:25px;
           color:#50688C;
           font-size:16px;
         }
         span:nth-child(2){
           float:right;
           margin-right:40px;
           cursor:pointer;
           height:61px;
           line-height: 61px;
           span{
             color:rgba(255,168,0,1);
             font-size:16px;
           }
           i{
             color:rgba(255,168,0,1);
             font-size:14px;
             margin-left:6px;
           }
         }
       }
      //  outAccount-accumulative
       .outAccount-accumulative{
         height:88px;
         line-height: 88px;
         li{
           float:left;
         }
         li:nth-child(1){
           margin:0 40px 0 24px;
           color:#50688C;
           font-size:16px;
         }
         li:nth-child(2),li:nth-child(5){
           font-size:16px;
           color:#50688C;
           margin-right:16px;
         }
         li:nth-child(3),li:nth-child(6){
           font-size:22px;
           color:#158BE4;
           margin-right:80px;
         }
         li:nth-child(4){
           width:1px;
           height:40px;
           background:#A5B3C5;
           margin-top:24px;
           margin-right:40px;
         }
       }
      //  outAccount-bill
       .outAccount-bill{
         border-bottom:1px solid #DFE3E9;
         padding:16px 0 21px 0;
         background:#FFFFFF;
         .outAccount-bill-warn{
           height:30px;
           font-size:14px;
           color:#EF3535;
           margin-left:25px;
         }
         .outAccount-bill-per{
           height:70px;
           line-height: 70px;
           li{
             float:left;
           }
           li:nth-child(1){
             margin-left:25px;
             width:341px;
             p:nth-child(1){
               height:24px;
               font-size:16px;
               line-height: 24px;
               margin-bottom:11px;
               color:#50688C;
             }
             p:nth-child(2){
               height:25px;
               line-height:25px;
               margin-bottom:0;
               span{
                 color:#7F8FA4;
               }
               span:nth-child(1){
                 font-size:14px;
               }
               span:nth-child(2){
                 font-size:14px;
               }
             }
           }
           li:nth-child(2){
             width:1px;
             height:40px;
             background:#A5B3C5;
             margin:14px 96px 0 80px; 
           }
           li:nth-child(3){
             p:nth-child(1){
               height:28px;
               width:180px;
               text-align: center;
               line-height: 28px;
               margin-bottom:10px;
               font-size:18px;
               color:#50688C;
             }
             p:nth-child(2){
               width:150px;
               height:32px;
               border-radius:4px;
               background:#67C23A;
               color:#fff;
               font-size:14px;
               text-align: center;
               line-height: 32px;
               margin:0 0 0 7px;
                // display: none;
               cursor:pointer;
             }
             p:nth-child(3){
               width:159px;
               height:32px;
               border-radius:4px;
               margin:0 0 0 2px;
               border:1px solid #DFE3E9;
               line-height: 32px;
               overflow: hidden;
              //  display:none;
               span{
                 float:left;
               }
               span:nth-child(1){
                 display: inline-block;
                 width:126px;
                 height:32px;
                 text-align: center;
                 line-height:32px;
                 color:#EF3535;
                 font-size:14px;
                 border-right:1px solid #DFE3E9;
                
               }
               span:nth-child(2){
                 display: inline-block;
                 width:31px;
                 height:32px;
                 text-align: center;
                 line-height:32px;
                 color:#fff;
                 background:#EF3535;
                 font-size:14px; 
               }
             }
             p:nth-child(4){
               width:159px;
               height:32px;
               border-radius:4px;
               margin:0 0 0 3px;
               border:1px solid #DFE3E9;
               line-height: 32px;
               overflow: hidden;
              //  display:none;
               span{
                 float:left;
               }
               span:nth-child(1){
                 display: inline-block;
                 width:126px;
                 height:32px;
                 text-align: center;
                 line-height:32px;
                 color:#768CAA;
                 font-size:14px;
                 border-right:1px solid #DFE3E9;
                
               }
               span:nth-child(2){
                 display: inline-block;
                 width:31px;
                 height:32px;
                 text-align: center;
                 line-height:32px;
                 color:#fff;
                 background:#39B54A;
                 font-size:14px; 
               }
             }
           }
           li:nth-child(4){
             float:right;
             margin-right:39px;
             margin-top:16px;
             p{
               margin-bottom:0;
               color:#354052;
               font-size:14px;
               width:130px;
               height:36px;
               border:1px solid #CED0DA;
               border-radius:4px;
               text-align: center;
               cursor:pointer;
             }
           }
         } 
       }
       //outAccount-blank
       .outAccount-blank{
        height:151px;
        background:#fff;
        p:nth-child(1){
          height:63px;
          margin:24px 0 10px;
          line-height: 63px;
          text-align: center;
          font-size: 20px;
        }
        p:nth-child(2){
          height:33px;
          font-size:20px;
          color:#164061;
          line-height: 33px;
          text-align: center;
          margin-bottom:0;
        }
       }
     }
   }
  //  testcoo-outstanding
  .testcoo-outstanding{
    // outstanding
    .outstanding{
      height:51px;
      li:nth-child(1){
        float:left;
        color:#50688C;
        font-size:16px;
      }
      li:nth-child(2){
        float:right;
        margin-right:135px;
        cursor:pointer;
        span:nth-child(1){
          color:#FFA800;
          font-size:16px;
          margin-right:7px;
        }
        span:nth-child(2){
          color:#FFA800;
          font-size:16px;
          i{
            font-size:14px;
            color:rgba(255,168,0,1);
          }
        }
      }
    }
    // outstandingAccount
    .outstandingAccount{
      margin:0 100px 0 1px;
      // border:1px solid #E6EAEE;
      // outstandingAccount-info
      .outstandingAccount-info{
        height:512px;
        background:#FFFFFF;
        border:1px solid #E6EAEE;
        ul{
          height:90px;
          line-height: 90px;
          li{
            float:left;
          }
          li:nth-child(1){
            margin-left:40px;
            font-size:16px;
            color:#50688C;
          }
          li:nth-child(2){
            margin-left:40px;
            font-size:16px;
            color:#50688C;
          }
          li:nth-child(3){
            margin-left:20px;
            font-size:22px;
            color:#158BE4;
          }
          li:nth-child(4){
            margin:25px 40px 0;
            width:1px;
            height:40px;
            background:#A5B3C5;
          }
          li:nth-child(5){
            font-size:16px;
            color:#50688C;
          }
          li:nth-child(6){
            margin-left:16px;
            font-size:22px;
            color:#158BE4;
          }
          li:nth-child(7){
            margin:0 16px 0 40px;
            font-size:16px;
            color:#50688C;
          }
          li:nth-child(9){
            width:12px;
            height:1px;
            background:#C5D0DE;
            margin:45px 10px 0;

          }
        }
        .outstandingAccount-table{
          height:420px;
        }
      }
      //outstandingAccount-pagination
      .outstandingAccount-pagination{
        padding-left:314px;
        margin-top:24px;
        margin-bottom:37px;
      }
      // outstandingAccount-blank
      .outstandingAccount-blank{
        height:150px;
        background:#fff;
        p:nth-child(1){
          height:63px;
          line-height: 63px;
          text-align: center;
          margin:24px 0 10px;

        }
        p:nth-child(2){
          height:33px;
          line-height: 33px;
          text-align: center;
          font-size: 20px;
          color:#164061;
        }    
      }
    }
  }
 }
</style>


<style rel="stylesheet/scss" lang="scss">
//elelment-ui样式改变
.monthlyStateIndex{
  .outstandingAccount{
    .outstandingAccount-table{
      //el-table
       .el-table th{
            height:60px;
        }
        .el-table td{
            height:60px;
        }
        .el-table .cell{
            padding:0;
        }
        .el-table th div, .el-table th>.cell{
            padding:0;
            color:#50688C;
            font-size:14px;
            text-align:left;
        }
        .el-table th:nth-child(1)>.cell{
            padding-left:40px;
        }
        .el-table td:nth-child(1) div{
            padding-left:40px;
        }
        .el-button--text{
            width:100%;
            color:#158BE4;
            text-align:left;
        }
        
    }
    //pagination
    .outstandingAccount-pagination{
       .el-pagination__total{
            width:88px;
            height:36px;
            border:1px solid #CED0DA;
            border-radius:4px;
            text-align:center;
            line-height:36px;
            color:#7F8FA4;
            font-size:14px;
        }
        .el-pagination .el-select .el-input .el-input__inner{
            height:36px;
            background:#F3F6F9;
        }
        .el-pagination .btn-prev{
            width:36px;
            height:36px;
            border:1px solid #CED0DA;
            border-radius:4px;
            padding:0;
            margin-right:15px;
            background:#F3F6F9; 
        }
        .el-pagination .btn-next{
            width:36px;
            height:36px;
            border:1px solid #CED0DA;
            border-radius:4px;
            padding:0;
            margin-left:15px;
            background:#F3F6F9;
        }
        .el-pager li{
            width:36px;
            height:36px;
            border:1px solid #CED0DA;
            border-radius:4px;
            padding:0;
            line-height:36px;
            text-align:center;
            margin-right:10px;
            color:#7F8FA4;
            background:#F3F6F9;
        }
        .el-pager li:last-child{
            margin-right:0;
        }
        .el-pager li.active{
            background:#158BE4;
            color:#fff;
            border:none;
        }
        .el-pagination__jump{
            width:110px;
            height:36px;
            border:1px solid #CED0DA;
            line-height:36px;
            padding-left:14px;
            background:#CED0DA;
            border-radius:2px;
            color:#fff;
            margin-left:15px;
        }
        .el-pagination__editor.el-input{
            float:right;
            height:36px;
            margin:0;
            padding:0;
            background:#F3F6F9;
        }
        .el-pagination__editor.el-input .el-input__inner{
            border:none;
            height:35px;
            line-height:35px;
            text-align:center;
            border-radius:0;
            padding:0;
            background:#F3F6F9;
            border-bottom:1px solid #CED0DA;
        }
        .el-pagination__jump:focus{
            background:#158BE4;
            border:1px solid #158BE4;
            color:#fff;
        }
    }
  }
}
</style>



