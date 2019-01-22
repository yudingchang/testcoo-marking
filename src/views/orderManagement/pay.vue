<template>
  <div class="pay">
      <el-row>
          <el-col :span="24">
              <p class="t1">注：如果您对我们的报价有疑惑，请联系测库工作人员</p>
                <el-table
                    :data="tableData"
                    style="width: 100%" class="tableData">
                    <el-table-column
                        prop="number"
                        label="订单号"
                        width="240">
                    </el-table-column>
                    <el-table-column
                        width="200"
                        label="产品名称">
                        <template slot-scope="scope">
                            <span v-if="scope.row.products.length==1">{{scope.row.products[0]}}</span>
                            <span v-else-if="scope.row.products.length>1"><span style="display:inline-block;width:150px;">{{scope.row.products[0]}}...</span><i style="margin-left:20px" class="iconfont icon-IconCopy" @click="getDetail(scope.row)"/></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="270"
                        label="供应商">
                        <template slot-scope="scope">
                            {{scope.row.supplier.name}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="270"
                        label="工作量">
                        <template slot-scope="scope">
                            {{scope.row.workload}}人天
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="订单金额">
                        <template slot-scope="scope">
                            <span>{{ calculateMoney(scope.row.fees)}}</span>
                            <span class="tc-separate" v-if="scope.row.fees.supplementary">
                                <span v-for="(item,index) in scope.row.fees.supplementary" :key = index>
                                    {{item.name}}¥{{item.currencies.CNY}}/${{item.currencies.CNY}}
                                </span>
                            </span> 
                        </template>
                    </el-table-column>
                </el-table>         
                <el-form class="form-content" label-width="100px">
                    <el-form-item label="付款币种"> 
                        <el-radio-group v-model="moneyType">
                            <el-radio :label="1" @change="CNY()">人民币</el-radio>                                                              
                            <el-radio :label="2" @change="USD()">美元</el-radio>                                                
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="发票类型"> 
                        <el-radio-group v-model="invoicetype">
                            <el-radio :label="0">不开发票</el-radio>
                            <el-radio :label="1">增值税发票</el-radio>
                            <el-radio :label="2">普通发票</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="开票公司" v-show="invoicetype!=0"> 
                        <el-select v-model="invoiceCompany" placeholder="请选择">
                            <el-option
                            v-for="item in invoiceList"
                            :key="item.company_name"
                            :label="item.company_name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                        <el-button type="success" icon="el-icon-plus" @click="addInvoiceCompany()">新增开票公司</el-button>
                    </el-form-item>
                    <el-form-item label="发票收件人" v-show="invoicetype!=0"> 
                        <el-select v-model="recipients" placeholder="请选择">
                            <el-option
                            v-for="item in addressee"
                            :key="(item.last_name+item.first_name)"
                            :label="(item.last_name+item.first_name)"
                            :value="item.id">
                            </el-option>
                        </el-select>
                        <el-button type="success" @click="addressPump()" icon="el-icon-plus">新增寄送地址</el-button>
                    </el-form-item>
                    <el-form-item label="应付金额"> 
                        <span class="money-text">{{shouldpay}}</span>
                    </el-form-item> 
                    <el-form-item label="付款方式"> 
                        <ul class="paystyle" v-if="CNYPayShow">
                            <li v-for="(item,index) in CNYPay" :key="index">
                                <span v-show="item.id==1"><el-radio v-model="paymentTypeId" :label="item.id"><img src="../../../static/image/payment.png" alt=""><span>{{item.trans_name}}</span></el-radio></span>
                                <span v-show="item.id==2"><el-radio v-model="paymentTypeId" :label="item.id"><span>{{item.trans_name}}</span><span>￥{{999}}</span><span @click="PayRechargeRmb">充值</span></el-radio></span>
                                <span v-show="item.id==3"><el-radio v-model="paymentTypeId" :label="item.id"><span>{{item.trans_name}}</span><span></span></el-radio></span>
                                <span v-show="item.id==4"><el-radio v-model="paymentTypeId" :label="item.id">{{item.trans_name}}</el-radio></span>
                                <span v-show="item.id==6"><el-radio v-model="paymentTypeId" :label="item.id"><span>{{item.trans_name}}</span><span>(你还有1份账单未结算)</span></el-radio></span>
                            </li>
                            <!-- <li><el-radio v-model="radio1" label="2">支付宝</el-radio></li> -->
                        </ul>
                        <ul class="paystyle" v-if="USDPayShow">
                            <li v-for="(item,index) in USDPay" :key="index">
                                <span v-if="item.id==5"><el-radio v-model="paymentTypeId" :label="item.id"><img src="../../../static/image/paypal.png" alt=""><span>{{item.trans_name}}</span></el-radio></span>
                                <span v-if="item.id==12"><el-radio v-model="paymentTypeId" :label="item.id"><span>{{item.trans_name}}</span><span>￥{{999}}</span><span @click="PayRechargeRmb">充值</span></el-radio></span>
                                <span v-if="item.id==9"><el-radio v-model="paymentTypeId" :label="item.id"><span>{{item.trans_name}}</span></el-radio></span>
                                <!-- <span v-if="item.id==9"><el-radio v-model="paymentTypeId" :label="item.id">{{item.trans_name}}</el-radio></span> -->
                            </li>
                            <!-- <li><el-radio v-model="radio1" label="2">支付宝</el-radio></li> -->
                        </ul>
                        <!-- <span class="money-text">{{shouldpay}}</span> -->
                    </el-form-item> 
                    <el-form-item label="支付密码" v-if="PayPassword"> 
                        <el-input placeholder="请输入密码" type="password" style="width:280px;" v-model="password"></el-input>
                        <span class="tip">忘记密码?</span>
                    </el-form-item>  
                    <el-form-item label=""> 
                        <el-button type="warning" class="confirmPay" :disabled="PayPassword == true && password == ''" @click="confirmPayButton()">确定付款</el-button>
                    </el-form-item>                                                            
                </el-form>
                <el-dialog title="新增发票信息" :visible.sync="dialogFormVisible" width="600px" center>
                    <el-form :model="form" :rules="rules" ref="form" :label-width="formLabelWidth">
                        <el-form-item label="公司名称：" prop="company_name">
                            <el-input v-model="form.company_name"></el-input>
                        </el-form-item>
                        <el-form-item label="纳税人识别号：" prop="tax_id_number">
                            <el-input v-model="form.tax_id_number"></el-input>
                        </el-form-item>
                        <el-form-item label="开户银行：" prop="bank">
                            <el-input v-model="form.bank"></el-input>
                        </el-form-item>
                        <el-form-item label="银行账号：" prop="bank_account">
                            <el-input v-model="form.bank_account"></el-input>
                        </el-form-item>
                        <el-form-item label="单位电话：" prop="telephone">
                            <el-input placeholder="请输入内容" v-model="form.telephone" class="input-with-select">
                                <el-select v-model="form.telephone_code" slot="prepend" placeholder="请选择" style="width:150px;">
                                <el-option label="86" value="1"></el-option>
                                <el-option label="86" value="2"></el-option>
                                <el-option label="86" value="3"></el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="单位地址：" prop="address">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>
                        <el-form-item label="详细地址：" prop="detailed_address">
                            <el-input type="textarea" v-model="form.detailed_address"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false" class="cancle">取 消</el-button>
                        <el-button type="primary" @click="submit()" class="submit">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog title="新增寄送地址" :visible.sync="addressdialogFormVisible" width="600px" center>
                    <el-form :model="addressform" :rules="addressrules" ref="addressform" :label-width="invoiceLabelWidth" :inline="true">
                        <el-form-item label="收件人姓：" label-width="130px" prop="company_name">
                            <el-input v-model="addressform.first_name"  style="width:160px"></el-input>
                        </el-form-item>
                        <el-form-item label="名：" prop="company_name" label-width="40px">
                            <el-input v-model="addressform.last_name"  style="width:160px"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="收件地址：" prop="address">
                            <el-input v-model="addressform.address"   style="width:375px"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="详细地址：" prop="detailed_address">
                            <el-input type="textarea" style="width:375px" v-model="addressform.detailed_address" ></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="收件人手机号：" prop="telephone">
                            <el-input placeholder="请输入内容" v-model="addressform.telephone" class="input-with-select" style="width:375px">
                                <el-select v-model="addressform.telephone_code" slot="prepend" placeholder="请选择" style="width:150px;">
                                <el-option label="86" value="1"></el-option>                                                                                                                                                            
                                <el-option label="86" value="2"></el-option>
                                <el-option label="86" value="3"></el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="收件人固定号：" prop="fixed_telephone">
                            <el-input placeholder="请输入内容" v-model="addressform.fixed_telephone" class="input-with-select" style="width:375px"> 
                                <el-select v-model="addressform.fixed_telephone_code" slot="prepend" placeholder="请选择" style="width:150px;">
                                <el-option label="86" value="1"></el-option>
                                <el-option label="86" value="2"></el-option>
                                <el-option label="86" value="3"></el-option>
                                </el-select>
                            </el-input>                     
                        </el-form-item>                                                     
                    </el-form>                                                  
                    <div slot="footer" class="dialog-footer">                   
                        <el-button @click="addressdialogFormVisible = false" class="cancle">取 消</el-button>
                        <el-button type="primary" @click="addresssubmit()" class="submit">确 定</el-button>
                    </div>
                </el-dialog>
                <!-- 钱包支付成功 -->
                <el-dialog
                    title=""
                    :visible.sync="successDialogVisible"
                    width="600px"
                    center
                    class="successDialog">
                        <div class="success-content">
                            <img src="/static/image/success.png" alt="">
                            <p>支付成功</p>
                            <el-button type="primary" class="comfirm" @click="successDialogVisible = false">确 定</el-button>
                        </div>
                </el-dialog>
                <!-- 钱包支付失败 -->
                <el-dialog
                    title=""
                    :visible.sync="failDialogVisible"
                    width="600px"
                    center
                    class="successDialog">
                        <div class="success-content">
                            <!-- <img src="/static/image/success.png" alt="">
                            -->
                            <i class="iconfont icon-Fill3"/>
                            <p>{{wrongMessage}}</p>
                            <el-button type="primary" class="comfirm" @click="failDialogVisible = false">确 定</el-button>
                        </div>
                </el-dialog>
                <!-- 确认付款弹框 -->
                <el-dialog title="已使用测库白条付款成功" :visible.sync="ConfirmPayDialog" class="ConfirmPayDialog">
                    <p>发票类型具体以还款选择类型为准</p>
                    <div class="payInfoDetail">
                        <table border="1" cellspacing="0" cellpadding="0"  height="100%">
                            <tr height="56px">
                                <td width="200px">工作量</td>
                                <td width="450px">1MD（¥799.00）</td>
                            </tr>
                            <tr v-if="true">
                                <td>其他费用</td>
                                <td>￥500.00 (车票￥50.00、住宿￥450.00）</td>
                            </tr>
                            <tr>
                                <td>订单金额</td>
                                <td>¥1499.00</td>
                            </tr>
                        </table>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="confirmPay()">确 定</el-button>
                    </div>
                </el-dialog>
                <!-- 产品名称 -->
                <el-dialog title="全部产品名称" :visible.sync="OrderNameDialog" class="OrderNameDialog">
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
          </el-col>
      </el-row>
  </div>
</template>

<script>


import {addInvoice,addAddress,getInvoiceList,getAddressList} from "@/api/accountManagement";
import {orderDetail,confirmPay,surePay} from "@/api/order";

let newTab;

export default {
  name: "",
  components: {},
  watch:{
      paymentTypeId(val) {
            // console.log(val)
            if(val == 1 || val == 5){
                this.PayPassword = false
            }else{
                this.PayPassword = true
            }
        },
    moneyType(val){
        console.log(val)
        if(val == 2){
            this.paymentTypeId = 5
        }else{
            this.paymentTypeId = 1
        }
    }
  },
  data() {
    return {
      successDialogVisible:false,
      failDialogVisible:false,
      wrongMessage:'',
      tableData: [],
      CNYPay:[],
      USDPay:[],
      CNYPayShow:true,
      USDPayShow:false,
      total: 0,
      shouldpay: "",
      password:'',
      moneyType:1,
      invoicetype:0,
      payurl:'',
      paymentTypeId:1,
      invoiceCompany:'',
      recipients:'',
      listLoading: true,
      dialogFormVisible:false,
      addressdialogFormVisible:false,
      value:'',
      radio1:'',
      order:this.$route.query.order,
      paymentOrder:'',
      form:{
          company_name: '',
          tax_id_number: '',
          bank: '',
          bank_account: '',
          telephone: '',
          telephone_code: '',
          address: '',
          detailed_address: ''
      },
      rules:{
            company_name:[{ required: true, message: '请输入公司名称', trigger: 'blur' }],    
            tax_id_number:[{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],  
            bank:[{ required: true, message: '请输入开户银行', trigger: 'blur' }],  
            bank_account:[{ required: true, message: '请输入银行账号', trigger: 'blur' }],  
            telephone:[{ required: true, message: '请输入单位电话', trigger: 'blur'}],
            address:[{ required: true, message: '请输入单位地址', trigger: 'blur'}],
            detailed_address:[{ required: true, message: '请输入详细地址', trigger: 'blur'}],
      },
      addressform:{
          first_name: '',
          last_name: '',
          address: '',
          detailed_address: '',
          telephone: '',
          telephone_code: '',
          fixed_telephone: '',
          fixed_telephone_code: ''
      },
      addressrules:{
        last_name:[{required: true, message: '请输入收件人姓', trigger: 'blur'}],
        first_name:[{required: true, message: '请输入名', trigger: 'blur'}],
        address:[{ required: true, message: '请输入单位地址', trigger: 'blur'}],
        detailed_address:[{ required: true, message: '请输入详细地址', trigger: 'blur'}],
        telephone:[{ required: true, message: '请输入单位电话', trigger: 'blur'}],
        fixed_telephone:[{ required: true, message: '请输入收件人固定号码', trigger: 'blur'}],
      },
      formLabelWidth:'140px',
      invoiceLabelWidth:'130px',
      invoiceList: [
        {
          company_name: "",
          id: ""
        }
      ],
      addressee: [
        {
            last_name:'',
           first_name: "",
           id: ""
        }
      ],
      listQuery: {
        page: 1,
        limit: 20
      },

        //ConfirmPayDialog
        ConfirmPayDialog: false,

        //OrderNameDialog
        OrderNameDialog: false,
      
        //ProductsNameTableData
        ProductsNameTableData: [],
        
        //PayPassword
        PayPassword:'',
    };
  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.fullPath
    // }
  },
  created(){
      this.orderDetail()
      this.getcompanyname()
      this.getaddress()
  },
  methods:{
      addInvoiceCompany(){
          this.dialogFormVisible = true
      },
      submit(){
          this.$refs['form'].validate((valid) => {
            if (valid) {
                addInvoice({
                    ...this.form,
                    address:[1,2,3]
                }).then(response => {
                    if(response.data.code == 0){

                        this.dialogFormVisible = false
                    }
                })
            }
          })
          
      },
      addressPump(){
          this.addressdialogFormVisible = true
      },
      addresssubmit(){
          this.$refs['addressform'].validate((valid) => {
            if (valid) {
                addAddress({
                    ...this.addressform
                }).then(response => {
                    if(response.data.code == 0){
                        this.addressdialogFormVisible = false
                    }
                })
            }
          })
      },
      getcompanyname(){
          getInvoiceList().then(response =>{
              if(response.data.code == 0){
                  this.invoiceList = response.data.data.list
              }
          })
      },
      getaddress(){
          getAddressList().then(response =>{
               if(response.data.code == 0){
                  this.addressee = response.data.data.list
              }
          })
      },
      orderDetail(){
          orderDetail({
              url:'/v1/order/'+ this.$route.query.order +'/pay'
          }).then(response =>{
              console.log(response)
              this.tableData = []
              this.tableData.push(response.data.data)
              this.CNYPay = response.data.data.select.CNY
              console.log(this.CNYPay)
              this.USDPay = response.data.data.select.USD
              console.log(this.USDPay)
              this.paymentOrder = response.data.data.payment.orderid
              this.CNYShouldPay = response.data.data.payment.price.CNY.fee
              this.USDShouldPay = response.data.data.payment.price.USD.fee
              this.shouldpay = "¥" + this.CNYShouldPay
              console.log(response.data.data.payment.price.CNY.fee) 
          })  
      },

      getDetail(row){
        this.OrderNameDialog = true
        this.ProductsNameTableData = row
      },
    //   计算工作量
    // calculateattch(value){
    //      _.each(value.main, fee => {
    //         CNYpay += Number(fee.currencies.CNY)
    //         USDpay += Number(fee.currencies.USD)
    //     })
    // },
    //   计算总金额
    calculateMoney(value){
        let CNYpay =  0
        let USDpay = 0
        let fees = ''
        _.each(value.main, fee => {
            CNYpay += Number(fee.currencies.CNY)
            USDpay += Number(fee.currencies.USD)
        })
        USDpay = USDpay==0 ? '' : '/$'+USDpay
        fees = "¥" + CNYpay + USDpay
        return fees;
    },
     //  人民币支付
    CNY(){
     this.CNYPayShow = true   
      this.USDPayShow = false 
      this.shouldpay = "¥" + this.CNYShouldPay 
    },
    //  美元支付
    USD(){
     this.USDPayShow = true 
     this.CNYPayShow = false 
     this.shouldpay = "$" + this.USDShouldPay  
    },
    //confirmPayButton确定付款，打开付款Dialog
    confirmPayButton(){
        this.ConfirmPayDialog = true
    },
    //  预付款
    confirmPay(){
        this.ConfirmPayDialog = false
        if(this.paymentTypeId ==1){
            newTab = window.open();
        } 
        confirmPay({
           url:'/v1/payment/pay/select/' + this.paymentOrder + '/' + this.paymentTypeId
        }).then(response =>{
            let responsed = response.data
            if(responsed.code ==0 ){
                this.payurl = responsed.data.url
                this.surePay()
            }
        })
    },
    //  付款
    surePay(){
        surePay({
            url: this.payurl,
            password:this.password
        }).then(response =>{
            let res = response.data
            if(this.paymentTypeId ==2 && res.code == 0){
                this.successDialogVisible = true
            }else if(this.paymentTypeId ==2 && res.code != 0){    
                this.wrongMessage = res.data.message
                this.failDialogVisible = true
            }else if(this.paymentTypeId ==1){
                const div = document.createElement('div');
                div.innerHTML = res; // html code
                newTab.document.body.appendChild(div);
                newTab.document.forms.alipaysubmit.submit()
            }
        })
    },

    // PayRecharge 支付页面充值
    PayRechargeRmb(){
        this.$router.push({ path: '' })
    }

  },
  mounted() {
    // console.log(this.$route.fullPath)
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.pay{
    .el-radio + .el-radio {
    margin-left: 115px;
    }
    .el-radio__input.is-checked .el-radio__inner {
    border-color: #ffa500;
    background: #ffa500;
    }
    .el-radio__input.is-checked + .el-radio__label {
    color: #ffa500;
    }
    .el-dialog__header {
        padding: 50px 20px 10px;
        text-align: center;
        color: #7C8FA6;
    }
    .el-dialog__title {
        font-size: 16px;
        color: #7C8FA6;
        font-weight: bold;
    }
    .el-table th{
        text-align: center;
    }
    .el-table td{
        text-align: center;
        font-size: 12px;
    }
    // ------------------------------------
    .el-table th{
        padding:0;
        height:60px;
        text-align: left;
    }
    .el-table th>.cell{
        padding:0;
        font-size:16px;
        color:rgba(124,140,165,1);
    }
    .el-table th:nth-child(1)>.cell{
        padding-left:38px;
    }
    .el-table td{
        padding:0;
        height:60px;
        text-align: left;
    }
    .el-table td div{
        padding:0;
        font-size:14px;
        color:rgba(80,104,140,1);
    }
    .el-table td:nth-child(1) div{
        padding-left:38px;
    }
    .form-content{
        .el-radio:nth-child(2){
            margin-left:32px;
        }
        .el-radio:nth-child(3){
            margin-left:32px;
        }
        .el-form-item__label{
            font-size:16px;
            color:rgba(127,143,164,1);
            margin-right:26px;
            text-align: left;
            padding:0;
            width:64px !important;
        }
        .el-form-item:nth-child(1),.el-form-item:nth-child(2){
            .el-form-item__content{
                .el-radio__inner{
                    width:16px;
                    height:16px;
                    border-color: rgba(151,151,151,1);
                    // background: #ffa500;
                    // border:1px solid rgba(151,151,151,1);
                }
                .el-radio__input.is-checked .el-radio__inner{
                    border-color:rgba(255,168,0,1);
                }
                .el-radio__inner:hover{
                    color:rgba(255,168,0,1);
                }
                .el-radio__label{
                    font-size:16px;
                    color:rgba(144,147,153,1);
                }
            }
        }
    }
    .el-form-item:nth-child(3){
        .el-form-item__label{
            width:80px !important;
        }
    }
    .el-form-item:nth-child(4){
        .el-form-item__label{
            width:80px !important;
        }
    }
    .el-form-item:nth-child(5){
        margin-bottom:32px;
    }
    .el-form-item:nth-child(6){
        .el-form-item__label{
            padding-top:25px;
        }
        li:nth-child(1){
            height:80px;
            padding:20px 0 0 0;
            .el-radio__input{
                margin-left:56px;
            }
            .el-radio__inner{
                width:24px;
                height:24px;
                border:1px solid rgba(151,151,151,1);
                margin-right:24px;
            }
            .el-radio__input.is-checked .el-radio__inner{
                border:1px solid rgba(245,166,35,1);
            }
            .el-radio__label{
                height:80px;
                display:inline-block;
                line-height: 80px;
                padding:0;
                position:relative;
                img{
                    width:140px;
                    height:40px;
                    position:absolute;
                    top:20px;
                    left:0;
                }
                span{
                    font-size:18px;
                    color:rgba(80,104,140,1);
                    margin-left:180px;
                }
            }
        }
        li:nth-child(2){
           .el-radio__input{
                margin-left:56px;
            }
            .el-radio__inner{
                width:24px;
                height:24px;
                border:1px solid rgba(151,151,151,1);
                margin-right:24px;
            }
            .el-radio__input.is-checked .el-radio__inner{
                border:1px solid rgba(245,166,35,1);
            }
            .el-radio__label{
                span:nth-child(1){
                    font-size:20px;
                    color:rgba(96,98,102,1);
                    margin-right:32px;
                }
                span:nth-child(2){
                    // display:inline-block;
                    font-size:18px;
                    color:rgba(21,139,228,1);
                    margin-right:218px;
                }
                span:nth-child(3){
                    width:100px;
                    height:32px;
                    background:rgba(103,194,58,1);
                    border-radius:4px;
                    display:inline-block;
                    text-align: center;
                    line-height: 32px;
                    font-size:14px;
                    color:rgba(255,255,255,1);
                }
            }
        }
        li:nth-child(3){
            height:80px;
            padding:20px 0 0 0;
            .el-radio__input{
                margin-left:56px;
            }
            .el-radio__inner{
                width:24px;
                height:24px;
                border:1px solid rgba(151,151,151,1);
                margin-right:24px;
            }
            .el-radio__input.is-checked .el-radio__inner{
                border:1px solid rgba(245,166,35,1);
            }
            .el-radio__label{
                span:nth-child(1){
                    font-size:18px;
                    color:rgba(96,98,102,1);
                }
                span:nth-child(2){
                    font-size:18px;
                    color:rgba(96,98,102,1);
                }
            }
        }
    }
    .ConfirmPayDialog{
        .el-dialog{
            width:900px;
            height:480px;
            background:rgba(255,255,255,1);
            border-radius:8px;
        }
        .el-dialog__header{
            padding:80px 0 0 0;
            .el-dialog__title{
                height:31px;
                font-size:24px;
                color:rgba(111,144,174,1);
                line-height:31px;
            }
            .el-icon-close:before{
                font-size:24px;
                color:rgba(144,147,153,1);
                font-weight:600;
            }
        }
        .el-dialog__body{
            padding:13px 0 0 0;
            p{
                height:21px;
                font-size:16px;
                font-family:MicrosoftYaHei;
                color:rgba(118,140,170,1);
                line-height:21px;
                padding-left:125px;
                margin-bottom:8px;
            }
            .payInfoDetail{
                width:650px;
                height:179px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(230,234,238,1);
                margin:0 auto;
                overflow: hidden;
                border-collapse: collapse;
                table{
                    tr{
                        border-bottom:1px solid rgba(230,234,238,1);
                        td{
                            border-right:1px solid rgba(230,234,238,1);
                            vertical-align: middle;
                            text-align: center;
                            font-size:18px;
                            color:rgba(80,104,140,1);
                        }
                        td:last-child{
                            border:none;
                        }
                        td:first-child{
                            background:rgba(127,143,164,1);
                            font-size:18px;
                            color:rgba(255,255,255,1);
                        }
                    }
                    tr:last-child{
                        border:none;
                        td:last-child{
                            color:rgba(239,53,53,1);
                        }
                    }
                }
            }
        }
        .el-dialog__footer{
            padding:40px 0 0 0;
            text-align: center;
            .el-button--primary{
                width:240px;
                height:50px;
                background:rgba(255,168,0,1);
                border-radius:4px;
                border:none;
                font-size:18px;
                color:rgba(255,255,255,1);
            }
        }
    }
    .OrderNameDialog{
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
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.tc-separate {
span + span {
&::before {
content: ' ，';
}
}
span:first-child{
    &::before {
content: ' (';
}
}
span:last-child{
    &::after {
content: ' ) ';
}
}
}
.dialog-footer{
  .cancle{
    color: #909399;
  }
  .submit{
    color: #ffffff;
    background:#FFA800;
    outline:none;
    border:1px solid #FFA800;
  }
}
.pay {
  margin: 22px 50px 0 100px;
  .t1 {
    font-size: 16px;
    color: #6f90ae;
  }
  .tableData {
    margin-top: 20px;
    border-left: 2px solid #158be4;
  }
  .form-content {
    margin-top: 20px;
    .money-text {
      font-size: 24px;
      font-weight: bold;
      color: #158be4;
    }
    .paystyle{
        width: 600px;
        li{
            border-bottom: 1px solid #C0C4CC;
            padding: 20px 0;
        }
        li:first-child{
            padding: 0 0 20px;
        }
    }
    .tip{
        margin-left: 16px;
        cursor: pointer;
        color: #158BE4;
    }
    .confirmPay{
        width: 250px;
        height: 40px;
        font-size: 16px;
        background: #FFA800;
        border: none;
    }
  }
}
.successDialog{
    .success-content{
        width: 240px;
        margin: 0 auto;
        i{
            width: 80px;
            font-size: 80px;
            color: #67C23A;
            display: block;
            margin: 0 auto;
        }
        img{
            display: block;
            margin: 0 auto;
        }
        p{
            width: 240px;
            margin: 14px 0 30px;
            text-align: center;
        }
        .comfirm{
            width: 240px;
            height: 40px;
            background-color:#FFA800;
            border: none;
        }
    }
}

</style>

