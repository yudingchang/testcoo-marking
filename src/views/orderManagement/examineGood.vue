<template>
  <div class="examine-good-title">
    <el-row>
      <el-col :span="24">
        <!-- 列表表头 -->
        <div class="examine-good">
          <div class="tab-content clear-fixed">
            <div class="top-form">
              <el-form :inline="true" :model="fitter">
                <el-select v-model="fitter.timeStyle" placeholder="请选择">
                  <el-option
                    v-for="item in timeStyleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-date-picker
                  v-model="fitter.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                  >
                </el-date-picker>
                <el-form-item label="订单号" label-width="80px">
                  <el-input v-model="fitter.number" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="产品名称" label-width="80px">
                  <el-input v-model="fitter.product_name" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-button type="success" @click="getList()">查询</el-button>
              </el-form>
            </div>
            <div class="tabs-top">
              <ul class="tabs">
                <li :class="{active:item.isBool}" v-for="(item,index) in tablist" :key = index @click="tab(item,index)">{{item.content}}</li>
              </ul>
            </div>
            <!-- <el-button class="add" @click="add()"><span>增加</span></el-button> -->
          </div>
        </div>
        <!-- 订单列表table -->
        <div class="examine-table" v-loading="loading">
          <el-table
            :data="AllOrderTableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            class="table-content"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column
            label="订单号"
            width="205">
            <template slot-scope="scope">
              <el-button type="text" @click="goOrderDetail(scope.row)">{{scope.row.number}}</el-button>
            </template>
            </el-table-column>
            <el-table-column
            prop="created_at"
            label="下单时间"
            width="171">
            </el-table-column>
            <el-table-column
            prop="estimated_dates"
            width="169"
            label="验货开始日期">
            </el-table-column>
            <el-table-column
            width="220px"
            label="产品名称">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row"><span style="display:inline-block;width:100px;">{{scope.row.created_at}}</span> </span> -->
              <!-- <span ><span style="display:inline-block;width:100px;">{{scope.row.created_at}}</span><i style="margin-left:20px" class="iconfont icon-IconCopy" @click="getDetail(scope.row)"/></span> -->
              <el-button type="text" size="small" v-if="true"><span v-for="(item,index) in scope.row.products" :key="index">{{ item.name }}</span></el-button>
              <el-button type="text" size="small" v-if="_.toString(_.map( scope.row.products, 'name' )).length > 10"><i class="iconfont icon-IconCopy" @click="getDetail(scope.row.products)"/></el-button>
            </template>
            </el-table-column>
            <el-table-column
            width="220"
            label="订单金额">
            <template slot-scope="scope">
              <!-- <div class="tc-separate "><span v-for="(item,index) in filterFees(scope.row.fees)" :key='index'>{{item}}</span></div>  -->
              <p><span v-if="scope.row.fees_total.CNY">￥{{ scope.row.fees_total.CNY }}</span><span v-if="scope.row.fees_total.CNY && scope.row.fees_total.USD">/</span><span v-if="scope.row.fees_total.USD">${{ scope.row.fees_total.USD }}</span></p>
            </template>
            </el-table-column>
            <el-table-column
            prop="marking_name"
            width="110"
            label="状态">
            </el-table-column>
            <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.can && scope.row.can.modify" @click="setDefault(scope.row)">修改</el-button>
              <el-button type="text" size="small" v-if="scope.row.can && scope.row.can.later_pay" @click="addPayment(scope.row)">追加付款</el-button>
              <el-tooltip placement="top">
                <div slot="content">{{ scope.row.number }}<br/>{{ scope.row.number }}</div>
                <el-button type="text" size="small" v-if="scope.row.marking != 'INIT'" class="phone"><i class="iconfont icon-hebingxingzhuang4"></i></el-button>
              </el-tooltip>
              <el-button type="text" size="small" v-if="scope.row.marking == 'INSPECTING'" class="video"><i class="iconfont icon-hebingxingzhuang3"></i></el-button>
              <el-button type="text" size="small" v-if="scope.row.can && scope.row.can.pay" @click="pay(scope.row)">付款</el-button>
              <el-button type="text" size="small" v-if="scope.row.can && scope.row.can.close" @click="CloseOrder(scope.row)">关闭</el-button>
              <el-button type="text" size="small" v-if="scope.row.can && scope.row.can.refund" @click="Refund(scope.row)">退单</el-button>
              <el-button type="text" size="small" v-if="scope.row.marking == 'WAIT_INSPECT'" @click="checkRefund()">查看退单</el-button>
              <el-button type="text" size="small" v-if="scope.row.marking == 'COMPLETED'" @click="checkRport(scope.row)">查看报告</el-button>
              <el-button type="text" size="small" v-if="true" @click="CopyOrder(scope.row)">复制订单</el-button>
              <el-button type="text" size="small" v-if="scope.row.can && scope.row.can.delete" @click="DeleteBtn(scope.row)">删除</el-button>
            </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页pagination -->
        <div class="examine-pagination">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 20, 40]" 
              :page-size="pagesize"         
              layout="total, sizes, prev, pager, next, jumper"
              :total="AllOrderTableData.length">    
          </el-pagination>
        </div>
        <!-- 待报价  关闭订单Dialog -->
        <el-dialog title="是否关闭订单" :visible.sync="closeForm.DialogForm" class="closeDialog">
          <el-form :model="closeForm">
            <el-form-item label="关闭原因:">
              <el-select v-model="closeForm.region" placeholder="请选择活动区域">
                <el-option label="不验货了不需要了" value="1"></el-option>
                <el-option label="产品信息修改/产品数量减少" value="2"></el-option>
                <el-option label="区域二" value="3"></el-option>
                <el-option label="区域二" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注信息:">
              <el-input type="textarea" v-model="closeForm.desc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeForm.DialogForm = false">取 消</el-button>
            <el-button type="primary" :disabled="closeForm.region == '' || closeForm.desc == ''" @click="ConfirmClose">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 待报价  产品名称Dialog -->
        <div class="Quoted-Dialog">
            <el-dialog title="全部产品名称" :visible.sync="QuotedName.Dialog">
                <el-table
                :data="QuotedName.TableData"
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
        <!-- 待验货  退单弹窗Dialog -->
        <el-dialog title="是否退单" :visible.sync="refundForm.DialogForm" class="refundDialog">
          <el-form :model="refundForm">
            <el-form-item label="关闭原因:">
              <el-select v-model="refundForm.desc" placeholder="请选择活动区域">
                <el-option label="不验货了不需要了" value="不验货了不需要了"></el-option>
                <el-option label="区域二" value="2"></el-option>
                <el-option label="区域二" value="3"></el-option>
                <el-option label="区域二" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注信息:">
              <el-input type="textarea" v-model="refundForm.desc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="refundForm.DialogForm = false">取 消</el-button>
            <el-button type="primary" @click="ConfirmRefund" :disabled=" refundForm.desc == '' ">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 已关闭  删除弹窗Dialog -->
        <div class="DeleteDialog">
          <el-dialog
            title="是否删除"
            :visible.sync="DeleteDialog"
            width="30%"
            center>
            <span slot="footer" class="dialog-footer">
              <el-button @click="DeleteDialog = false">取 消</el-button>
              <el-button type="primary" @click="ConfirmDelete">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getList,DeleteOrder,CloseOrder,RefundOrder } from "@/api/order";
export default {
  name: "",
  components: {},
  data() {
    return {
      loading:'',
      fitter: {
        timeStyle: 0,
        time: "",
        number: ""
      },
      timeStyleList: [
        {
          value: 0,
          label: "验货开始日期"
        },
        {
          value: 1,
          label: "下单时间"
        }
      ],
      // tableRowClassName:'',
      AllOrderTableData: [
        {
          fees_total:{
            CNY:'',
            USD:''
          },
        }
      ],
      gridData: [],
      input: "",
      // tabs标签列表
      tablist: [
        {
          content: "全部",
          isBool: true
        },
        {
          content: "待报价",
          isBool: false
        },
        {
          content: "待付款",
          isBool: false
        },
        {
          content: "待验货",
          isBool: false
        },
        {
          content: "验货中",
          isBool: false
        },
        {
          content: "已完成",
          isBool: false
        },
        {
          content: "已关闭",
          isBool: false
        }
      ],
      value: "",
      value6: "",
      options: [
        {
          value: "0~20",
          label: "0~20"
        },
        {
          value: "20~100",
          label: "20~100"
        },
        {
          value: "100~500",
          label: "100~500"
        }
      ],
      form: {
        first_name: "",
        last_name: "",
        email: ""
      },
      supplyform: {
        first_name: "",
        last_name: "",
        email: "",
        supplier_name: "",
        telephone: "",
        addresses: []
      },
      editform: "",
      rules: {
        first_name: [
          { required: true, message: "请输入姓", trigger: "blur" }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        last_name: [{ required: true, message: "请输入名", trigger: "blur" }],
        email: [{ required: true, message: "请输入电子邮件", trigger: "blur" }]
      },
      supplyrules: {
        first_name: [{ required: true, message: "请输入姓", trigger: "blur" }],
        last_name: [{ required: true, message: "请输入名", trigger: "blur" }],
        email: [{ required: true, message: "请输入电子邮件", trigger: "blur" }],
        supplier_name: [
          {
            required: true,
            message: "请输入供应商信息",
            trigger: "blur"
          }
        ],
        telephone: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur"
          }
        ]
      },
      tableData: [],
      supplyTableData: [],
      num: 0,
      emailDialogVisible: false,
      supplyDialogVisible: false,
      invoiceDialogVisible: false,
      addressDialogVisible: true,
      labelwidth: "100px",
      emailTitle: "新增报告接收电子邮箱",
      supplyTitle: "新增供应商信息",
      invoiceTitle: "新增发票信息",
      dialogTableVisible: false,

      //pagination分页列表
      currentPage:1,   //初始页
      pagesize:17,    //每页的数据

      //closeForm关闭弹框-待报价
      closeForm: {
        DialogForm: false,  //DialogForm关闭订单Dialong
        region: '',
        desc: '',
        scopeRowId: '',
      },

      //Quoted-Dialog产品名称展开-待报价
      QuotedName: {
        Dialog: false,    
        TableData: [],

      },

      //refundForm退单弹窗-待验货
      refundForm: {
        DialogForm: false,    //DialogForm退单的Dialong
        region: '',
        desc: '',
        scopeRowId:'',
      },

      //DeleteDialog删除弹窗
      DeleteDialog: false,

      DeleteDialogId:''

    };
  },
  created() {
    this.getList();
  },
  methods: {
    //filterFees
    filterFees(value) {
      let fees = {}
      _.each(value, fee => {
      _.each(fee.currencies, currency => {
        const value = parseFloat(currency.value)
        fees[currency.name] = fees[currency.name] ? (fees[currency.name] + value) : value
        })
      })
      console.log(fees+"zheshi filterFees")
    return fees;
    },
    getList(markingstyle) {
      this.loading = true
      getList({
        number: this.fitter.number,
        marking: markingstyle == '' ? '' : markingstyle,
        product_name: this.fitter.product_name,
        estimated_first_date:this.fitter.timeStyle== 0?this.fitter.time:'',
        created_at: this.fitter.timeStyle== 0?'':this.fitter.time,
      }).then(response => {
        console.log(response.data)
        if (response.data.code == 0) {
          this.loading = false
          this.AllOrderTableData = response.data.data;
          console.log(this.AllOrderTableData)
        }
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "warning-row";
      } else if (rowIndex === 2) {
        return "success-row";
      }
      return "";
    },
    // tab切换
    tab(item, index) {
      this.tablist.forEach((item, index) => {
        item.isBool = false;
      });
      this.num = index;
      item.isBool = true;
      switch (index) {
        case 0:
          this.getList();
          break;
        case 1:
          this.getList('WAIT_QUOTE');
          break;
        case 2:
          this.getList('WAIT_PAY');
          break;
        case 3:
          this.getList('WAIT_INSPECT');
          break;
        case 4:
          this.getList('INSPECTING');
          break;
        case 5:
          this.getList('COMPLETED');
          break;
        case 6:
          this.getList('CLOSED');
          break;
      }
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

    // 获取产品名称详情
    getDetail(row) {
      this.QuotedName.Dialog = true
      // console.log(row)
      var productsName = [];
      _.forEach(row, function(value){
        // console.log(value)
        productsName.push(value.name)
        return productsName;
      })
      this.QuotedName.TableData = productsName
      console.log(_.toString(_.map( row, 'name' )).length )
    },
    // 付款
    pay(row){
      console.log(row)
      this.$router.push({path: 'pay', query: {order:row.id}})
    },
    // 去订单详情
    goOrderDetail(row){
      this.$router.push({path: 'orderDetails', query: {orderId:row.id}})
    },

    //CloseOrder关闭订单
    CloseOrder(row){
      this.closeForm.DialogForm = true
      console.log(row.id)
      this.closeForm.scopeRowId = row.id
    },

    //setDefault修改订单
    setDefault(row){
      // console.log(row)
      this.$router.push({ path: '/index', query: { orderId: row.id ,orderSet:'set' }})
    },

    //Refund退单
    Refund(row){
      this.refundForm.DialogForm = true
      console.log(row.id)
      this.refundForm.scopeRowId = row.id
    },

    //ConfirmRefund确定退单
    ConfirmRefund(){
      this.refundForm.DialogForm = false
      RefundOrder({
        remark: this.refundForm.desc,
        orderId: this.refundForm.scopeRowId
      }).then(response => {
         if( response.data.code = 0 ){
          console.log("退单成功")
        }
      })
      this.refundForm.region = ''
      this.refundForm.desc = ''
    },

    //CopyOrder复制订单
    CopyOrder(row){
      this.$router.push({ path: '/index', query: { orderId: row.id }})
      console.log("复制订单")
      console.log(row)
    },

    //checkRefund查看退单详情
    checkRefund(row){
      this.$router.push({ path: 'orderRefundDetail', query:{orderId: row.id}  })
    },

    //ConfirmClose确定关闭订单
    ConfirmClose(){
      this.closeForm.DialogForm = false
      console.log(this.closeForm.desc)
      CloseOrder({ 
        message: this.closeForm.region,
        remark: this.closeForm.desc,
        orderId: this.closeForm.scopeRowId
       }).then(response => {
        if( response.data.code = 0 ){
          console.log("关闭成功")
          this.getList()
        }
      })
      this.closeForm.region = ''
      this.closeForm.desc = ''
    },

    //DeleteBtn删除订单
    DeleteBtn(row){
      this.DeleteDialog = true
      this.DeleteDialogId = row.id
    },
    //ConfirmDelete确定删除订单
    ConfirmDelete(){
      this.DeleteDialog = false;
       DeleteOrder({
        orderId:this.DeleteDialogId
      }).then(response => {
        if( response.data.code = 0 ){
          console.log("删除成功")
          this.getList()
        }
      });
    },
    //checkRport查看报告
    checkRport(row){
      this.$router.push({ path: '/reportManagement/inspectionReport', query:{ orderId: row.id}})
      // console.log(this.returnFloat(321.019))
    },

    //数据处理returnFloat
    returnFloat(value){
      var value=Math.round(parseFloat(value)*100)/100;
      var xsd=value.toString().split(".");
      if(xsd.length==1){
        value=value.toString()+".00";
        return value;
      }
      if(xsd.length>1){
        if(xsd[1].length<2){
        value=value.toString()+"0";
        }
      return value;
      }
    },

    //addPayment追加付款
    addPayment(row){
      console.log(row)
      this.$router.push({path: 'pay', query: {order:row.id}})
    },

  },
  mounted() {
    // console.log(this.$route.fullPath)
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.examine-good-title{
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

.el-dialog__header {
  padding: 50px 20px 10px;
}
.el-dialog__title {
  color: #7f8fa4;
}
.el-form-item__label {
  color: #909399;
  font-weight: normal;
}
.el-table th {
  background-color: #ffffff;
  text-align: center;
  font-size: 14px;
  color: #50688C;
}

.el-table td {                      
  text-align: center;
  font-size: 12px;
}
.el-button--text {
  color: #50688c;
}
.el-form-item__error {
  color: #ffa800;
}
.el-button--primary {
  background-color: #ffa800;
  border-color: #ffa800;
}
.el-message-box__btns button:nth-child(2) {
  background-color: #ffa800;
  border-color: #ffa800;
}
.special-input input {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
.el-range-editor--medium.el-input__inner {
  vertical-align: middle;
}
.el-table .warning-row {
  background: #f5f8fa;
}

.el-table .success-row {
  background: #f5f8fa;
}
.clear-fixed::after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0px;
}
.detail-dialog .el-dialog__header {
  text-align: center;
  background: #e6eaee;
  padding: 20px 20px 15px;
  font-size: 14px;
  color: #164061;
}
.tc-separate {
  span + span {
    &::before {
      content: '/ ';
    }
  }
}
  //examine-table全部订单列表
  .examine-table{
    // width:1540px;
    height:1140px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(230,234,238,1);
    //el-table
    .el-table th{
      padding:0;
      height:60px;
    }
    .el-table td{
      padding:0;
      height:60px;
      line-height: 60px;
    }
    .el-table th>.cell{
      padding:0 0 0 0;
      text-align: left;
      font-size:16px;
      color:rgba(80,104,140,1);
    }
    .el-table th:nth-child(1)>.cell{
      padding-left:25px;
    }
    .el-table td>.cell{
      padding:0;
    }
    .el-table td:nth-child(1)>.cell{
      padding-left:25px;
    }
    .el-table td div{
      padding:0 0 0 25px;
      text-align: left;
      font-size:14px;
      color:rgba(80,104,140,1);
    }
    .el-table td:nth-child(1) div .el-button--text{
      font-size:14px;
      color:rgba(21,139,228,1);
    }
    .el-table td:nth-child(4) div{
      padding:0;
    }
    .el-table td:nth-child(4) div .el-button--text{
      font-size:14px;
      color:rgba(80,104,140,1);
    }
    .el-table td:nth-child(4) div .el-button--text:nth-child(1){
      width:124px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right:32px;
      text-align: left;
    }
    .el-table td:nth-child(4) div .el-button--text:nth-child(2){
      margin:0;
    }
    .el-table td:nth-child(7) div .el-button--text{
      font-size:14px;
      color:rgba(255,168,0,1);
      padding:0;
      margin:0 24px 0 0;
    }
    .el-table td:nth-child(7) div .el-button--text i{
      font-size:22px;
      color:rgba(103,194,58,1);
    }
  }
  //closeDialog订单关闭Dialog
  .closeDialog{
    .el-dialog{
      width:600px;
      height:480px;
      background:rgba(255,255,255,1);
      border-radius:8px;
      .el-dialog__header{
        padding:60px 0 0 0;
        text-align: center;
        .el-dialog__title{
          height:33px;
          font-size:24px;
          font-weight:500;
          color:rgba(124,143,166,1);
          line-height:33px;
        }
        .el-dialog__headerbtn .el-dialog__close{
          font-size:24px;
          color:rgba(144,147,153,1);
          font-weight:600;
        }
      }
      .el-dialog__body{
        padding:40px 102px 0 84px;
        margin-bottom:32px;
        // text-align: center;
        .el-form-item:nth-child(1){
          margin-bottom:24px;
          .el-form-item__label{
            width:90px;
            height:40px;
            line-height: 40px;
            font-size:18px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
            // line-height:24px;
          }
          .el-input--medium .el-input__inner{
            width:316px;
            height:40px;
            border-radius:4px;
            border:1px solid rgba(192,196,204,1);
          }
        }
        .el-form-item:nth-child(2){
          margin:0;
          .el-form-item__label{
            width:90px;
            height:40px;
            line-height: 40px;
            font-size:18px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
            float:left;
          }
          .el-input--medium{
            width:316px;
            height:150px;
          }
          .el-textarea__inner{
            width:316px;
            height:150px;
            border-radius:3px;
            border:1px solid rgba(192,196,204,1);
            padding:9px 16px 0;
          }
        }
      }
      .el-dialog__footer{
        padding:0;
        text-align: center;
        .el-button--medium:nth-child(1){
          width:98px;
          height:50px;
          border-radius:4px;
          border:1px solid rgba(144,147,153,1);
          margin-right:40px;
        }
        .el-button--medium:nth-child(2){
          width:98px;
          height:50px;
          background:rgba(255,168,0,1);
          border-radius:4px;
        }
      }
    }
  }
  //Quoted-Dialog产品名称扩展
  .Quoted-Dialog{
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
  // refundDialog退单Dialog
  .refundDialog{
    .el-dialog{
      width:600px;
      height:480px;
      background:rgba(255,255,255,1);
      border-radius:8px;
      .el-dialog__header{
        padding:60px 0 0 0;
        text-align: center;
        .el-dialog__title{
          height:33px;
          font-size:24px;
          font-weight:500;
          color:rgba(124,143,166,1);
          line-height:33px;
        }
        .el-dialog__headerbtn .el-dialog__close{
          font-size:24px;
          color:rgba(144,147,153,1);
          font-weight:600;
        }
      }
      .el-dialog__body{
        padding:40px 102px 0 84px;
        margin-bottom:32px;
        // text-align: center;
        .el-form-item:nth-child(1){
          margin-bottom:24px;
          .el-form-item__label{
            width:90px;
            height:40px;
            line-height: 40px;
            font-size:18px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
            // line-height:24px;
          }
          .el-input--medium .el-input__inner{
            width:316px;
            height:40px;
            border-radius:4px;
            border:1px solid rgba(192,196,204,1);
          }
        }
        .el-form-item:nth-child(2){
          margin:0;
          .el-form-item__label{
            width:90px;
            height:40px;
            line-height: 40px;
            font-size:18px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
            float:left;
          }
          .el-input--medium{
            width:316px;
            height:150px;
          }
          .el-textarea__inner{
            width:316px;
            height:150px;
            border-radius:3px;
            border:1px solid rgba(192,196,204,1);
            padding:9px 16px 0;
          }
        }
      }
      .el-dialog__footer{
        padding:0;
        text-align: center;
        .el-button--medium:nth-child(1){
          width:98px;
          height:50px;
          border-radius:4px;
          border:1px solid rgba(144,147,153,1);
          margin-right:40px;
        }
        .el-button--medium:nth-child(2){
          width:98px;
          height:50px;
          background:rgba(255,168,0,1);
          border-radius:4px;
        }
      }
    }
  }
  //DeleteDialog删除Dialog
  .DeleteDialog{
    .el-dialog{
      width:480px;
      height:240px;
      background:rgba(255,255,255,1);
      border-radius:8px;
    }
    .el-dialog--center{
      width:480px !important;
      height:240px !important;
      background:rgba(255,255,255,1);
      border-radius:8px;
    }
    .el-dialog__header{
      padding:60px 0 45px 0;
      .el-dialog__title{
        font-size:24px;
        font-weight:500;
        color:rgba(124,143,166,1);
      }
      .el-dialog__headerbtn .el-dialog__close{
          font-size:24px;
          color:rgba(144,147,153,1);
          font-weight:600;
        }
    }
    .el-dialog__body{
      padding:0;
    }
    .el-dialog__footer{
      padding-top:0;
      .el-button--medium:nth-child(1){
        width:98px;
        height:50px;
        border-radius:4px;
        border:1px solid rgba(144,147,153,1);
      }
      .el-button--medium:nth-child(2){
        width:98px;
        height:50px;
        background:rgba(255,168,0,1);
        border-radius:4px;
        margin-left:40px;
      }
    }
  }

}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.examine-good-title{
  padding:24px 40px 65px;

}
.email-dialog {
  .cancle {
    color: #909399;
  }
  .submit {
    color: #ffffff;
    background: #ffa800;
    outline: none;
    border: 1px solid #ffa800;
  }
}
.changecolor {
  color: #67c23a;
}
.examine-good {
  border: 1px solid #e6eaee;
  border-radius: 4px;
  // margin: 24px 40px 0 20px;
  margin-bottom:24px;
  // padding-bottom: 80px;
  background-color: #ffffff;
  .tab-content {
    // line-height: 200px;
    background-color: #ffffff;
    // height: 50px;
    border-bottom: 1px solid #f5f8fa;
    .top-form {
      background-color: #ffffff;
      border-bottom: 1px solid #e6eaee;
      padding: 19px 0 0 32px;
      height:74px;
    }
    .tabs-top {
      background-color: #ffffff;
      height: 60px;
      line-height: 60px;
      .tabs {
        display: inline-block;
        // width: 800px;
        overflow: hidden;
        list-style: none;
        margin: 0;
        padding: 0;
        li {
          float: left;
          width: 180px;
          height: 61px;
          line-height: 61px;
          text-align: center;
          font-size: 14px;
          color: #50688c;
          cursor:pointer;
          font-size:16px;
          color:rgba(80,104,140,1);
          font-family:MicrosoftYaHei;
        }
        .active {
          border-bottom: 2px solid #ffa800;
          color: #ffa800;
        }
      }
    }

    .add {
      // display: inline-block;
      float: right;
      margin-right: 40px;
      width: 130px;
      height: 40px;
      vertical-align: top;
      margin-top: 5px;
      font-size: 16px;
      background: #67c23a;
      color: #ffffff;
      outline: none;
      &:hover {
        color: #ffffff;
      }
      span {
        &::before {
          content: "+";
          font-size: 16px;
          margin-right: 15px;
        }
      }
    }
  }
}
</style>

