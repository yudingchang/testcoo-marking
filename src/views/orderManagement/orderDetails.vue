<template>
  <div class="order-detail" v-loading="loading">
    <el-row>
      <el-col :span="24">
        <!-- 订单号orderNumber -->
        <div class="order-number">
            <span>订单号: {{number}}</span><span class="greencolor orderstate">({{marking_name}})</span>
            <span>下单时间: {{created_at}}</span>
            <div class="payIcon closeIcon" @click="DetailPayment" v-if="can.pay">
              <i class="iconfont icon-fukuan"></i>
              <p>立即付款</p>
            </div>
            <div class="closeIcon" v-if="can.close">
                <i class="iconfont icon-guanbi_"/>
                <p>关闭</p>
            </div>
            <div class="copyIcon closeIcon">
                <i class="iconfont icon-fuzhi"/>
                <p>复制</p>
            </div>
            <div class="modifyIcon closeIcon" v-if="can.modify">
                <i class="iconfont icon-fuzhi"/>
                <p>修改</p>
            </div>
            <div class="deleteIcon closeIcon" v-if="can.delete">
                <i class="iconfont icon-fuzhi"/>
                <p>删除</p>
            </div>
            <div class="refundIcon closeIcon" v-if="can.refund">
                <i class="iconfont icon-fuzhi"/>
                <p>退单</p>
            </div>  
        </div>
        <!-- 关闭订单相关原因和备注 -->
        <div class="OrderClosed" v-if="can.close">
          <p><span>关闭原因:</span><span>重复下单</span></p>
          <!-- <p><span>备注信息:</span><span>无</span></p> -->
        </div>
        <!-- 追加付款信息 -->
        <div class="supplierInformation">
            <p>付款信息</p>
            <p v-if=" can.later_pay "><span class="manDay">订单工作量{{workload}}MD需付款</span><span class="payNumber"><span>¥{{CNYpay}}</span><span>/${{USDpay}}</span></span><span class="btn" @click="payImmediately(orderId)">立即付款</span></p>  
        </div>
        <!-- 付款信息 -->
        <!-- <div class="paymentInfoTitle"><p>付款信息</p></div> -->
        <!-- 已付款信息框 -->
        <div class="accountPaidInfo">
          <ul>
            <li>订单金额</li>
            <li><span v-if="CNYpay != ''">￥{{ CNYpay }}</span><span v-if="CNYpay != '' && USDpay !=''">/</span><span v-if="USDpay !=''">${{ USDpay }}</span></li>
            <li>工作量：</li>
            <li>{{workload}}人天</li>
            <li v-if=" can.later_pay ">其它费用：￥500.00 (车票￥50.00、住宿￥450.00)</li>
          </ul>
          <div class="middle-paiInfo">
            <ul>
            <li>付款金额</li>
            <li><span v-if="CNYpay != ''">￥{{ CNYpay }}</span><span v-if="CNYpay != '' && USDpay !=''">/</span><span v-if="USDpay !=''">${{ USDpay }}</span></li>
            <li>付款方式</li>
            <li>{{  }}</li>
            <li>创建时间</li>
            <li>{{ created_at }}</li>
            <li>付款时间</li>
            <li>2018-05-25 10:00</li>
          </ul>
          <ul>
            <li>¥500.00(其他费用)</li>
            <li>付款方式</li>
            <li>支付宝</li>
            <li>付款时间</li>
            <li>2018-05-25 10:00</li>
          </ul>
          </div>
          <ul>
            <li>发票类型</li>
            <li>普通发票</li>
            <li @click="checkInvoice">查看详情</li>
          </ul>
        </div>
        <!-- 产品信息框 -->
        <div class="productInformation">
          <p class="productInformation-title">产品信息</p>
          <el-tabs v-model="editableTabsValue2" type="card" >
            <el-tab-pane
              v-for="(item, index) in editableTabs2"
              :key="index"
              :label="'产品' + (index + 1)"
              :name="'tab' + (index + 1)">
              <div class="content">
                <el-form :model="item"  label-width="80px" class="demo-ruleForm">
                  <el-form-item label="产品名称" prop="name">
                      <span class="left30">{{item.name}}</span>
                    <!-- <el-input v-model="item.name" placeholder="请输入产品名称" style="width:500px;"/>
                    <div class="copy" @click="copy(item,index)">
                      <i class="iconfont icon-fuzhi_"/>
                      <p>复制</p>
                    </div> -->
                  </el-form-item>
                  <el-form-item label="产品货号">
                      <span class="left30">{{item.number}}</span>
                    <!-- <el-input v-model="item.number" placeholder="请输入产品货号" style="width:500px;"/> -->
                  </el-form-item>
                  <el-form-item v-for="(val,i) in item.PO" :key="i" label="P.O号">
                      <span class="left30">{{val.number}}</span>
                      <span class="left30">{{val.quantity}}</span>
                      <span>{{val.unit}}</span>
                    <!-- <el-input v-model="val.number" placeholder="请输入P.O号" style="width:155px;"/> -->
                    <!-- <el-input v-model="val.quantity" placeholder="请输入数量" class="input-with-select" style="width:240px;">
                      <el-select slot="append" v-model="val.unit" style="width:100px" placeholder="请选择">
                        <el-option label="件" value="1"/>
                        <el-option label="个" value="2"/>
                        <el-option label="条" value="3"/>
                      </el-select>
                    </el-input> -->
                    <!-- <el-button type="success" icon="el-icon-plus" @click="addPO(val,index)"> P.O 号</el-button>
                    <el-button v-if="i>0" type="danger" icon="el-icon-minus" @click="removePO(val,index,i)"> P.O 号</el-button> -->
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- 供应商信息框 -->
        <div class="supplierDetail">
            <p>供应商信息</p>
            <div class="supplierContent">
                <el-form ref="item" :model="supplier"  label-width="100px" class="demo-ruleForm">
                  <el-form-item label="供应商名称" prop="name">
                          <span class="left30">{{supplier.name}}</span>
                  </el-form-item>
                  <el-form-item label="联系人姓名" prop="name">
                          <span class="left30">{{supplier.last_name + supplier.first_name}}</span>
                  </el-form-item>
                  <el-form-item label="手机号码" prop="name">
                          <span class="left30">{{supplier.phone_number}}</span>
                  </el-form-item>
                  <el-form-item label="电子邮箱" prop="name">
                          <span class="left30">{{supplier.email}}</span>
                  </el-form-item>
                  <el-form-item label="验货地址" prop="name">
                          <span class="left30">{{supplier.address_summary + supplier.address_detail}}</span>
                  </el-form-item>
                </el-form>  
            </div>
        </div>
        <!-- 验货基本信息框 -->
        <div class="examineGoodsMessage">
            <p>验货基本信息</p>
            <div class="examineGoodContent">
              <el-form ref="item"  label-width="100px" class="demo-ruleForm">
                <!-- <el-form-item label="产品总数" prop="name">
                        <span class="left30">{{supplierName}}</span>
                </el-form-item> -->
                <!-- <el-form-item label="抽样数" prop="name">
                        <span class="left30">{{supplierFullName}}</span>
                </el-form-item> -->
                <el-form-item label="预计验货时间" prop="name">
                        <span class="left30">{{inspection_dates}}</span>
                </el-form-item>
                <el-form-item label="实际验货时间" prop="name" v-if="marking != 'INIT' && 'WAIT_QUOTE'">
                        <span class="left30">{{inspection_first_date}}</span>
                </el-form-item>
                <el-form-item label="验货类型" prop="name">
                        <span class="left30">{{inspection.inspection_type_name}}</span>
                </el-form-item>
                <el-form-item label="是否提供样品" prop="name">
                    <p><span class="left30">{{inspection.sample_type_name}}</span></p>
                    <p class="left30"><span>测库收件人</span><span class="left30">{{address}}</span></p>
                    <p class="left30"><span>联系电话</span><span class="left30">{{address}}</span></p>
                    <p class="left30"><span>地址</span><span class="left30">{{address}}</span></p>
                </el-form-item>
              </el-form>  
            </div>
        </div>
        <!-- 报告表格列表 -->
        <div class="reportList">
            <el-table
              :data="tableData"
              border
              style="width: 90%">
              <el-table-column
              prop="number"
              label="报告"
              align='center'
              width="160">
              </el-table-column>
              <!-- <el-table-column
              label="包含产品"
              align='center'
              width="160">
              <template slot-scope="scope">
                <el-button type="text" size="small">{{ _.forEach( scope.row.products, function(value){ return value.name } ) }}</el-button>
                <el-button v-if="true" @click="checkNameHandleClick(scope.row.data)" type="text" size="small"><i class="iconfont icon-IconCopy"></i></el-button>
              </template>
              </el-table-column> -->
              <!-- <el-table-column
              prop=""
              label="产品数量"
              align='center'
              width="140">
              </el-table-column> -->
              <!-- <el-table-column
              prop="address"
              align='center'
              width="140"
              label="抽样数量">
              </el-table-column> -->
              <el-table-column
              prop="sampling.type"
              align='center'
              width="200"
              label="抽样标准">
              </el-table-column>
              <el-table-column
              align='center'
              width="150"
              label="报告语言">
              <template slot-scope="scope">
                <span>{{ scope.row.locale == 'zh_CN'?'中文':'英文' }}</span>
              </template>
              </el-table-column>
              <el-table-column
              prop="address"
              align='center'
              width="220"
              label="报告接收邮箱">
              </el-table-column>
              <el-table-column
              prop="address"
              align='center'
              label="报告模版">
              </el-table-column>
          </el-table>
        </div>
        <!-- 其他要求 -->
        <div class="otherRequirements">
            <p>其它要求</p>
            <div class="otherRequirementsContent">
                <div><span class="requirementText">要求内容</span><span>{{description}}</span></div>
                <div>
                    <span class="requirementText">检验资料</span>
                    <ShowFile :fileList="files"></ShowFile>
                </div>
            </div>
        </div>
        <!-- 返回button -->
        <div class="goback-button">
          <el-button type="primary" @click="confirm">返回</el-button>
        </div>
        <!-- 包含名称展开Dialog -->
        <div class="nameExpend-Dialog">
          <el-dialog title="全部产品名称" :visible.sync="expendProductsDialog">
            <el-table
                :data="ProductsNameTableData"
                height="250"
                border
                style="width: 100%">
                <el-table-column
                label="序号"
                width="108">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
                </el-table-column>
                <el-table-column
                label="产品名称"
                >
                <template slot-scope="scope">
                    {{ scope.row }}
                </template>
                </el-table-column>
            </el-table>
          </el-dialog>
        </div>
        <!-- 开票详情-普通发票Dialog -->
        <div class="InvoiceDetails-common">
          <el-dialog
            title=""
            :visible.sync="commonDialog"
            width="30%">
            <p>开票详情</p>
            <p><span>开票类型</span><span>普通发票</span></p>
            <p><span>单位名称</span><span>测库有限公司</span></p>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="commonDialog = false">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- 开票详情-增值税发票Dialog -->
        <div class="InvoiceDetails-VAT">
          <el-dialog
            title=""
            :visible.sync="VATDialog"
            width="30%">
            <p>开票详情</p>
            <p><span>开票类型</span><span>普通发票</span></p>
            <p><span>单位名称</span><span>测库有限公司</span></p>
            <p><span>纳税人识别号</span><span>57854882825845636</span></p>
            <p><span>开户银行</span><span>工商银行</span></p>
            <p><span>银行账号</span><span>625550214642050</span></p>
            <p><span>单位电话</span><span>测库有限公司</span></p>
            <p><span>单位地址</span><span>杭州市滨江区网商路365号</span></p>
            <p>寄票地址</p>
            <p><span>收件人</span><span>测库有限公司</span></p>
            <p><span>收件人电话</span><span>测库有限公司</span></p>
            <p><span>收件人地址</span><span>测库有限公司</span></p>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="VATDialog = false">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ShowFile from "../../components/showfile"
import { getOrderList } from "@/api/order";
export default {
  data() {
    return {
      loading:'',
      orderId:this.$route.query.orderId,
      can: [],
      number: "",
      marking: '',
      marking_name: "",
      inspection:[],
      inspection_dates:'',
      inspection_first_date: '',
      created_at: "",
      description:'',
      workload: 1,
      files:[],
    //   fileList:'',
      CNYpay: "",
      USDpay: "",
      supplier:{},
      supplierName:'',
      supplierFullName:'',
      phone:'',
      email:'',
      address:'',
      tableData: [],
      editableTabs2: [
        {
          number: "",
          name: "",
          title: "",
          PO: [
            {
              number: "",
              quantity: "",
              unit: ""
            }
          ]
        },
        {
          number: "",
          name: "",
          title: "",
          PO: [
            {
              number: "",
              quantity: "",
              unit: ""
            },
            {
              number: "",
              quantity: "",
              unit: ""
            }
          ]
        }
      ],
      editableTabsValue2: "",

      //Dialog属性
      expendProductsDialog: false,
      ProductsNameTableData: [],

      //commonDialog普通发票
      commonDialog: false,
      //VATDialog增值税发票
      VATDialog: false,

    };
  },
  created(){
      this.getOrderList()
  },
  components: {
      ShowFile
  },
  computed: {},
  methods:{
    //   获取订单详情
      getOrderList(){
          this.loading = true
          getOrderList({
              url:'/v1/inspection/'+ this.orderId
          }).then(response =>{
              if(response.data.code == 0){
                this.loading = false
                  let {number,marking,marking_name,created_at,products,supplier,reports,workload,fees_total,description,files,can,inspection,inspection_dates,inspection_first_date} = response.data.data
                  this.number = number
                  this.marking = marking
                  this.marking_name = marking_name
                  this.created_at = created_at
                  this.editableTabs2 = products
                  this.supplier = supplier
                  this.tableData = reports
                  this.workload = workload
                  this.CNYpay = fees_total.CNY
                  this.USDpay = fees_total.USD
                  this.description = description
                  this.files = files
                  this.can = can
                  this.inspection_dates = inspection_dates
                  this.inspection_first_date = inspection_first_date
                  this.inspection = inspection
                  console.log( this.editableTabs2)
              }
          })
      },

      //checkNameHandleClick列表包含产品名称展开
      checkNameHandleClick(row){
        this.expendProductsDialog = true
        this.ProductsNameTableData = row
      },

      //payImmediately立即付款
      payImmediately(row){
        console.log(row)
        this.$router.push({ path: 'pay', query:{ order: row } })
      },

      //查看发票详情
      checkInvoice(){
        // this.commonDialog = true
        this.VATDialog = true
      },

      //confirm返回上一界面
      confirm(){
        this.$router.go(-1)
      },

      //DetailPayment 待付款--付款
      DetailPayment(){
        this.$router.push({ path: 'pay',query:{ orderId:this.$route.query.orderId } })
      }

  },
  mounted() {

  }
};
</script>
<style rel="stylesheet/scss" lang="scss" >
.order-detail{
  .el-tabs__item.is-active {
    color: #ffa800;
    height: 40px;
    line-height: 40px;
    position: relative;
    background-image: none;
    background-color: #ffffff;
    top: 0;
    width: 100px;
    text-align: center;
  }
  .el-tabs__nav-wrap {
    margin-bottom: 0;
  }
  .el-tabs__item {
    margin-right: 10px;
    border: 1px solid #e6eaee;
    line-height: 35px;
    height: 35px;
    /* // background-color: #ffffff; */
    border-radius: 4px;
    position: relative;
    color: #768caa;
    top: 5px;
    background-image: linear-gradient(0deg, #f4f7fa 0%, #ffffff 100%);
  }
  .el-tabs__item:hover {
    color: #ffa800;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
    border-left: 1px solid #e6eaee;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 50px;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: none;
    margin: 0;
  }
  .el-form-item__label {
    font-size: 14px;
    color: #7c8fa6;
  }
  .el-form-item {
      margin-bottom: 15px;
  }

  //reportList
  .reportList{
    .el-table--border{
      width:1420px;
      background:rgba(255,255,255,1);
      border-radius:4px;
    }
    .el-table th{
      height:60px;
      background:rgba(125,200,85,1);
    }
    .el-table td{
      height:100px;
      background:rgba(255,255,255,1);
    }
    .el-table th>.cell{
      font-size:14px;
      color:rgba(255,255,255,1);
    }
    .el-table td div{
      font-size:14px;
      color:rgba(80,104,140,1);
    }
    .el-table td:nth-child(2){
      .el-button--text:nth-child(1){
        font-size:14px;
        color:rgba(80,104,140,1);
        width:68px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-button--text:nth-child(2){
        font-size:14px;
        color:rgba(118,140,170,1);
        margin-left:38px;
      }
    }
  }
  //nameExpend-Dialog
  .nameExpend-Dialog{
    //Dialog Table
    .el-dialog{
        width:387px;
        height:294px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 4px 0px rgba(118,140,170,1);
        border-radius:4px;
        .el-dialog__header{
            width:387px;
            height:41px;
            background:rgba(230,234,238,1);
            border-radius:3px 3px 0px 3px;
            text-align:center;
            line-height:41px;
            padding:0;
            position:relative;
            .el-dialog__headerbtn{
                width:12px;
                height:12px;
                line-height:12px;
                position:absolute;
                top:13px;
                right:13px;
                .el-icon-close:before{
                    color:rgba(22,64,97,1);
                    font-weight:600;
                }
            }
        }
        .el-dialog__body{
            width:387px;
            height:253px;
            padding:0;
            .el-table th{
                height:31px;
                padding:0;
            }
            .el-table td{
                height:36px;
                padding:0;
            }
            .el-table th:nth-child(1) > .cell{
                padding:0;
                width:108px;
            }
            .el-table .cell, .el-table th div{
                font-size:14px;
                color:rgba(124,140,165,1);
                text-align:center;
            }
            .el-table td:nth-child(1) div{
                padding:0;
                color:rgba(22,64,97,1);
                font-size:14px;
            }
            .el-table td:nth-child(2) div{
                color:rgba(22,64,97,1);
                font-size:14px;
            }
        }
    }
  }
  //InvoiceDetails-common
  .InvoiceDetails-common{
    .el-dialog{
      width:600px;
      height:300px;
      background:rgba(255,255,255,1);
      border-radius:8px;
      border:1px solid rgba(223,227,233,1);
      .el-dialog__header{
        padding:56px 0 0 0;
        .el-dialog__headerbtn .el-dialog__close{
          font-size:24px;
          color:rgba(144,147,153,1);
          font-weight: 600;
        }
      }
      .el-dialog__body{
        padding:0 0 0 120px;
        margin-bottom:45px;
        p:nth-child(1){
          height:33px;
          font-size:20px;
          font-weight:500;
          color:rgba(80,104,140,1);
          line-height:33px;
          margin-bottom:16px;
        }
        p:nth-child(2){
          height:24px;
          line-height: 24px;
          margin-bottom:17px;
          span:nth-child(1){
            font-size:16px;
            color:rgba(118,140,170,1);
            margin-right:32px;
          }
          span:nth-child(2){
            font-size:16px;
            color:rgba(80,104,140,1);
          }
        }
        p:nth-child(3){
          height:24px;
          line-height: 24px;
          span:nth-child(1){
            font-size:16px;
            color:rgba(118,140,170,1);
            margin-right:32px;
          }
          span:nth-child(2){
            font-size:16px;
            color:rgba(80,104,140,1);
          }
        }
      }
      .el-dialog__footer{
        padding:0;
        text-align: center;
        .el-button--primary{
          width:98px;
          height:40px;
          background:rgba(255,168,0,1);
          border-radius:4px;
          font-size:16px;
          color:rgba(255,255,255,1);
          border:none;
        }
      }
    }
  }
  //InvoiceDetails-VAT
  .InvoiceDetails-VAT{
    .el-dialog{
      width:600px;
      height:700px;
      background:rgba(255,255,255,1);
      border-radius:8px;
      border:1px solid rgba(223,227,233,1);
      .el-dialog__header{
        padding:56px 0 0 0;
        .el-dialog__headerbtn .el-dialog__close{
          font-size:24px;
          color:rgba(144,147,153,1);
          font-weight: 600;
        }
      }
      .el-dialog__body{
        padding:0 0 0 120px;
        margin-bottom: 41px;
        p{
          height:24px;
          line-height:24px;
          margin-bottom:17px;
          span:nth-child(1){
            font-size:16px;
            color:rgba(118,140,170,1);
            margin-right:68px;
          }
          span:nth-child(2){
            font-size:16px;
            color:rgba(80,104,140,1);
          }
        }
        p:nth-child(1){
          font-size:24px;
          font-weight:500;
          color:rgba(80,104,140,1);
        }
        p:nth-child(4){
          span:nth-child(1){
            margin-right:35px;
          }
        }
        p:nth-child(8){
          margin-bottom:25px;
        }
        p:nth-child(9){
          font-size:24px;
          font-weight:500;
          color:rgba(80,104,140,1);
        }
        p:nth-child(10){
          span:nth-child(1){
            margin-right:86px;
          }
        }
        p:nth-child(11),p:nth-child(12){
          span:nth-child(1){
            margin-right:54px;
          }
        }
        p:last-child{
          margin:0;
        }
      }
      .el-dialog__footer{
        padding:0;
        text-align: center;
        .el-button--primary{
          width:98px;
          height:40px;
          background:rgba(255,168,0,1);
          border-radius:4px;
          font-size:16px;
          color:rgba(255,255,255,1);
          border:none;
        }
      }
    }
  }
  //goback-button
  .goback-button{
    height:40px;
    margin-top:40px;
    text-align: center;
    .el-button--primary{
      width:200px;
      height:40px;
      background:rgba(255,168,0,1);
      border-radius:4px;
      border:none;
      font-size:18px;
      color:rgba(255,255,255,1);
    }
  }
}
</style>



<style rel="stylesheet/scss" lang="scss" scoped>
.order-detail {
  padding: 32px 0 124px 100px;
  .greencolor {
    color: #ffc500;
  }
  .order-number {
    width: 1000px;
    background-color: #ffffff;
    color: #50688c;
    padding: 18px 42px 32px;
    border-left: 2px solid #158be4;
    margin-bottom:32px;
    .orderstate {
      margin-right: 32px;
    }
    .closeIcon {
      width: 40px;
      text-align: center;
      display: inline-block;
      position: relative;
      top: 9px;
      margin-left: 32px;
      cursor: pointer;
      i {
        color: #7c8ca5;
      }
    }
  }
  .OrderClosed{
    margin-top:10px;
    p:nth-child(1){
      height:24px;
      font-size:16px;
      color:rgba(80,104,140,1);
      line-height:24px;
      margin-bottom:11px;
      span:nth-child(1){
        margin-right:16px;
      }
    }
    p:nth-child(2){
      height:24px;
      font-size:16px;
      color:rgba(80,104,140,1);
      line-height:24px;
      span:nth-child(1){
        margin-right:16px;
      }
    }
  }
  .supplierInformation {
    margin: 25px 0;
    font-size: 18px;
    color: #50688c;
    p:nth-child(1){
      height:29px;
      font-size:22px;
      font-family:MicrosoftYaHei;
      color:rgba(80,104,140,1);
      line-height:29px;
      margin-bottom:17px;
    }
    .manDay {
      margin: 0 30px;
    }
    .payNumber {
      color: #ef3535;
      font-weight: bold;
      font-size: 20px;
    }
    .btn {
      display: inline-block;
      background: #67c23a;
      width: 120px;
      text-align: center;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #ffffff;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 16px;
    }
  }
  .paymentInfoTitle{
    height:29px;
    font-size:22px;
    font-family:MicrosoftYaHei;
    color:rgba(80,104,140,1);
    line-height:29px;
    margin-bottom:17px;
  }
  .accountPaidInfo {
    width:1320px;
    // height:212px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(230,234,238,1);
    margin-bottom:32px;
    ul:nth-child(1){
      height:70px;
      line-height:70px;
      border-bottom:1px solid rgba(230,234,238,1);
      padding-left:40px;
      li{
        float:left;
      }
      li:nth-child(1){
        font-size:16px;
        font-weight:500;
        color:rgba(80,104,140,1);
        margin-right:16px;
      }
      li:nth-child(2){
        font-size:22px;
        color:rgba(239,53,53,1);
        margin-right:60px;
      }
      li:nth-child(3),li:nth-child(4){
        font-size:18px;
        font-weight:500;
        color:rgba(80,104,140,1);
      }
      li:nth-child(5){
        font-size:18px;
        font-weight:500;
        color:rgba(80,104,140,1);
        margin:0 0 0 50px;
      }
    }
    .middle-paiInfo{
      border-bottom:1px solid rgba(230,234,238,1);
      padding:25px 0;
      ul:nth-child(1){
        height:21px;
        line-height:21px;
        padding-left:40px;
        border:none;
        li{
          float:left;
        }
        li:nth-child(1){
          font-size:16px;
          color:rgba(124,143,166,1);
          margin-right:32px;
        }
        li:nth-child(2){
          font-size:16px;
          color:rgba(80,104,140,1);
          margin-right:51px;
        }
        li:nth-child(3){
          font-size:16px;
          color:rgba(124,143,166,1);
          margin-right:16px;
        }
        li:nth-child(4){
          font-size:16px;
          color:rgba(80,104,140,1);
          margin-right:33px;
        }
        li:nth-child(5){
          font-size:16px;
          color:rgba(124,143,166,1);
          margin-right:16px;
        }
        li:nth-child(6){
          font-size:16px;
          color:rgba(80,104,140,1);
          margin-right:32px;
        }
        li:nth-child(7){
          font-size:16px;
          color:rgba(124,143,166,1);
          margin-right:16px;
        }
        li:nth-child(8){
          font-size:16px;
          color:rgba(80,104,140,1);
        }
      }
      ul:nth-child(2){
        height:21px;
        line-height:21px;
        padding-left:136px;
        margin-top:17px;
        display:none;
        li{
          float:left;
        }
        li:nth-child(1){
          font-size:16px;
          color:rgba(80,104,140,1);
          margin-right:124px;
        }
        li:nth-child(2){
          font-size:16px;
          color:rgba(124,143,166,1);
          margin-right:14px;
        }
        li:nth-child(3){
          font-size:16px;
          color:rgba(80,104,140,1);
          margin-right:57px;
        }
        li:nth-child(4){
          font-size:16px;
          color:rgba(124,143,166,1);
          margin-left:14px;  
        }
        li:nth-child(5){
          font-size:16px;
          color:rgba(80,104,140,1);

        }
      }
    }
    ul:nth-child(3){
      height:70px;
      line-height:70px;
      padding-left:40px;
      li{
        float:left;
      }
      li:nth-child(1){
        font-size:16px;
        color:rgba(124,143,166,1);
        margin-right:32px;
      }
      li:nth-child(2){
        font-size:16px;
        color:rgba(80,104,140,1);
        margin-right:16px;
      }
      li:nth-child(3){
        font-size:16px;
        color:rgba(255,165,0,1);
        text-decoration: underline;
        cursor:pointer;
      }
    }
  }
  .productInformation {
    position: relative;
    width: 85%;
    .productInformation-title{
      height:31px;
      font-size:24px;
      color:rgba(80,104,140,1);
      line-height:31px;
      font-weight:100;
    }
    .addNewProducts {
      cursor: pointer;
      position: absolute;
      right: 0;
    }
    > p {
      font-size: 16px;
      font-weight: bold;
      color: #50688c;
      margin-bottom: 24px;
    }
    .addNewProduct {
      display: inline-block;
      position: absolute;
      cursor: pointer;
      right: 0;
      z-index: 5;
      top: 55px;
      background-image: linear-gradient(0deg, #f4f7fa 0%, #ffffff 100%);
    }
    .content {
      width: 100%;
      padding: 20px 30px 10px;
      background-color: #ffffff;
      border-top: 1px solid #e6eaee;
      color: #50688c;
      .left30 {
        margin-left: 30px;
      }
      .copy {
        display: inline-block;
        color: #7c8ca5;
        font-size: 10px;
        line-height: 36px;
        height: 36px;
        vertical-align: middle;
        margin-left: 30px;
        cursor: pointer;
        p {
          margin: 0;
          padding: 0;
          position: relative;
          top: -28px;
          text-align: center;
        }
        i {
          position: relative;
          display: inline-block;
          width: 24px;
          top: -10px;
          text-align: center;
        }
      }
    }
  }
  .supplierDetail{
      margin-top: 32px;
      >p:first-child{
          height:29px;
          font-size:22px;
          color:rgba(80,104,140,1);
          line-height:29px;

      }
      .supplierContent{
          width: 1000px;
          background-color: #ffffff;
          padding: 20px 40px 10px;
          margin-top:16px;
          color: #50688C;
          .left30 {
            margin-left: 30px;
        }
      }
  }
  .examineGoodsMessage{
      margin-top: 32px;
      >p:first-child{
        height:29px;
        font-size:22px;
        font-family:MicrosoftYaHei;
        color:rgba(80,104,140,1);
        line-height:29px;

      }
      .examineGoodContent{
          width: 1000px;
          background-color: #ffffff;
          padding: 20px 40px 10px;
          color: #50688C;
          margin-top:16px;
          .left30 {
            margin-left: 30px;
          }
          .el-form-item{
            span:nth-child(1){
              height:21px;
              font-size:15px;
              color:rgba(80,104,140,1);
              line-height:21px;
              margin-bottom:17px;
            }
          }
          .el-form-item:last-child{
            p:nth-child(1){
              height:36px;
              font-size:15px;
              color:rgba(80,104,140,1);
              line-height:36px;
              margin-bottom:10px;
            }
            p:nth-child(2){
              height:21px;
              line-height:21px;
              margin-bottom:17px;
              span:nth-child(1){
                font-size:15px;
                color:rgba(124,143,166,1);
                margin-right:50px;
              }
              span:nth-child(2){
                font-size:15px;
                color:rgba(80,104,140,1);
                margin:0;
              }
            }
            p:nth-child(3){
              height:21px;
              line-height:21px;
              margin-bottom:17px;
              span:nth-child(1){
                font-size:15px;
                color:rgba(124,143,166,1);
                margin-right:66px;
              }
              span:nth-child(2){
                font-size:15px;
                color:rgba(80,104,140,1);
                margin:0;
              }
            }
            p:last-child{
              height:21px;
              line-height:21px;
              span:nth-child(1){
                font-size:15px;
                color:rgba(124,143,166,1);
                margin-right:96px;
              }
              span:nth-child(2){
                font-size:15px;
                color:rgba(80,104,140,1);
                margin:0;
              }
            }
          }
      }
  }
  .reportList{
      margin-top:25px; 
  }
  .otherRequirements{
      margin-top: 32px;
      padding: 0;
       >p:first-child{
          font-size: 18px;
          height:29px;
          font-size:22px;
          color:rgba(80,104,140,1);
          line-height:29px;
      }
      .otherRequirementsContent{
          padding: 24px 0 24px 40px;
          margin-top:16px;
          width:1300px;
          background:rgba(255,255,255,1);
          border-radius:4px;
          border:1px solid rgba(230,234,238,1);
          .left30 {
            margin-left: 30px;
        }
        >div{
            margin-bottom: 24px;
            >span:first-child{
                height:21px;
                font-size:16px;
                color:rgba(124,143,166,1);
                line-height:21px;
                margin-right:65px;
            }
            // >span:last-child{
            //     color: #50688C;;
            // }
        }
      }
  }





}
</style>

