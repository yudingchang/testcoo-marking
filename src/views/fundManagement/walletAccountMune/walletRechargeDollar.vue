<template>
    <div class="walletRechargeDollar">
        <el-row>
            <el-col :span="24">
                <div class="wallet-pay-Dollar"> 
                    <p>美元充值</p>
                    <ul class="wallet-pay-Rmb-ul">
                        <li>充值金额</li>
                        <li @click="addBgcolor(item)" :class="{BgColor:item.show}" v-for="(item,index) in  RechargeDollar" :key="index">{{item.count}}美元</li>
                    </ul>
                    <el-form  :model="numberValidateForm" status-icon :rules="Accountrule" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item prop="AccountInput">
                            <el-input placeholder="输入" v-model="numberValidateForm.AccountInput" auto-complete="off">
                            </el-input>
                            <span>美元</span>
                        </el-form-item>
                    </el-form>
                    <div class="payment">
                        <p>付款方式</p>
                        <div class="paymentAll">
                        <!-- 引入组件USA -->
                        <pay-ment-usa @receiveDateUsa="paymentWayUsa"></pay-ment-usa>
                        </div>
                    </div>
                    <!-- 点击提交 -->
                    <div class="pay-rmb-submit">
                        <el-button type="text" @click="confirmSubmit('numberValidateForm')">确定付款</el-button>
                        <el-dialog
                        :visible.sync="centerDialogVisible"
                        width="30%"
                        center>
                        <p class="su-payment" v-on:receiveDateUsa="paymentWayUsa($event)">你正在使用{{ detailPayWayInMessageUsa }}充值</p>
                        <p class="su-payaccount">充值金额${{ numberValidateForm.AccountInput == ''?ConfirmCount :  numberValidateForm.AccountInput}}</p>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="finalConfirmCount">确定</el-button>
                            <el-button @click="centerDialogVisible = false">切换付款方式</el-button>
                        </span>
                        </el-dialog>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import payMentUsa from '../../common/paymentUSA.vue'
import { recharge,rechargeProps,rechargeSuccess } from '@/api/walletDetail'
import { orderDetail,confirmPay,surePay } from "@/api/order";
let newTab;
export default {
    name: 'walletRechargeDollar',
    components: { payMentUsa },
    data(){
        //自定义规则验证输入金额
            var checkAccount = (rule, value, callback) => {
                // console.log(value)
                let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;  //正则验证为纯数字，且保留两位小数
                setTimeout(() => {
                if (!reg.test(value)) {
                    callback(new Error('充值金额的输入格式不正确，请确认'));
                } else {
                    if (value.length > 10 || value <= 0) {
                    callback(new Error('请充值有效的金额'));
                    } else {
                    callback();
                    }
                }
                }, 100);
                
            };
        return {
            radio: '1',

            //美元充值金额
            RechargeDollar: [
                {
                    count: 119,
                    show: true
                },
                {
                    count: 500,
                    show: false
                },
                {
                    count: 1000,
                    show: false  
                },
                {
                    count: 2000,
                    show: false  
                }
            ],
            
            //自定义验证规则
            Accountrule: { AccountInput: { validator: checkAccount, trigger: 'blur' } },

            //输入金额框
            numberValidateForm: {
                AccountInput: ''
            },

            //input框的value
            // AccountInput: '',

            //弹框Dialog
            centerDialogVisible: false,

            //弹框接收支付方式
            detailPayWayInMessageUsa: '',

            //弹框接收具体金额( 1MD 金额)
            ConfirmCount: 119,

            //页面进入收取数据
            RechargeData: [],

            //选择支付方式
            paymentTypeId: '',

            //payurl
            payurl:'',
        }
    },
    created(){
        this.getRechargeData({
            currency: 'USD'
        })
    },
    methods: {
        //点击添加样式
        addBgcolor(item) {
            for(let i=0;i<this.RechargeDollar.length;i++){
                this.RechargeDollar[i].show=false
            }
            item.show=!item.show
            this.ConfirmCount = item.count
        },

        //提交传递数据USA
        paymentWayUsa(evl){
        if(evl=="1"){
            this.detailPayWayInMessageUsa="贝宝";
        }else if(evl=="2"){
            this.detailPayWayInMessageUsa="维萨";
        }else if(evl=="3"){
            this.detailPayWayInMessageUsa="万事达信用卡";
        }else if(evl=="4"){
            this.detailPayWayInMessageUsa="钱包";
        }else if(evl=="5"){
            this.detailPayWayInMessageUsa="测库月结";
        }
        this.paymentTypeId = evl
        // console.log(evl)
        },

        //点击确定付款
        confirmSubmit(formName){
             if( this.numberValidateForm.AccountInput == '' ){  //判断有没有选择输入 金额
                    this.centerDialogVisible = true
                    console.log( this.numberValidateForm.AccountInput )
                }else {
                    console.log( '11111111111111' )
                     this.$refs[formName].validate((valid) => {
                        if ( valid ) {
                            console.log(" 格式验证通过，可以进入确认弹框 ")
                            this.centerDialogVisible = true  //
                        } else {
                            console.log('error submit!! ');
                            return false;
                        }
                    });
                }
        },

        //弹框最终确认信息
        finalConfirmCount(){
            this.RechargeParams('/'+this.RechargeData.payment_id+'/11',{
                price: this.numberValidateForm.AccountInput == ''?this.ConfirmCount : this.numberValidateForm.AccountInput
                
            })
        },

        //获取数据,传递参数（充值金额，付款方式）
        getRechargeData(val){
            console.log(" 创建函数success ")
            recharge(val).then( response => {
                if( response.data.code == 0 ){
                    console.log(" 充值界面进入success ")
                    this.RechargeData = response.data.data
                    console.log(this.RechargeData.payment_id)
                }else{
                    console.log("充值界面进入fail")
                }
            })
        },

        //充值金额，付款方式参数值
        RechargeParams(val1,val2){
            rechargeProps(val1,val2).then( response => {
                if( response.data.code == 0 ){
                    //进入这个判断说明支付成功，请求url地址
                    this.RwchargeSuccessRes(response.data.data.url)
                    console.log('参数传递成功')
                    this.centerDialogVisible = false
                }
            } )
        },

        //请求url地址
        RwchargeSuccessRes(val){
            rechargeSuccess(val).then( response => {
                if( response.data.code == 0 ){
                    console.log("支付成功")
                    this.$router.push({ path: 'walletAccountIndex' })
                }
            })
        },

        //  预付款
        finalConfirmCount(){
            if(this.paymentTypeId ==1){
                newTab = window.open();
            } 
            confirmPay({
                url:'/v1/payment/pay/select/' + this.RechargeData.payment_id + '/11?price='+this.numberValidateForm.AccountInput
            }).then(response =>{
                let responsed = response.data
                console.log("进入调用surePay")
                if(responsed.code ==0 ){
                    this.payurl = responsed.data.url
                    this.surePay()
                    console.log(this.payurl)
                }
            })
        },
        
        //  付款
        surePay(){
            surePay({
                url: this.payurl,
                password:this.password
            }).then(response =>{
                this.centerDialogVisible = false
                console.log("进入付款")
                let res = response.data
                if(this.paymentTypeId ==2 && res.code == 0){
                    // this.successDialogVisible = true
                }else if(this.paymentTypeId ==2 && res.code != 0){    
                    this.wrongMessage = res.data.message
                    // this.failDialogVisible = true
                }else if(this.paymentTypeId ==1){
                    const div = document.createElement('div');
                    div.innerHTML = res; // html code
                    newTab.document.body.appendChild(div);
                    console.log(res)
                    newTab.document.forms.alipaysubmit.submit()
                    
                }
            })
        },
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scope>
//普通样式
.walletRechargeDollar{
     // wallet-pay
    .wallet-pay-Dollar{
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
                text-align: left;
                color:#7F8FA4;
            }
            div{
              .el-radio-group{
                .el-radio-button__inner{
                  width:140px !important;
                }
              }
            }
            .class-G{
                background:#67C23A;
                color:#fff;
            }
        }
        p:nth-child(3){
            height:40px;
            margin-left:90px;
            position:relative;
            width:300px;
            // margin-bottom:24px;
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
            height:400px;
            margin-bottom:24px;
            margin-top:40px;
            p{
                height:80px;
                color:#7F8FA4;
                font-size:14px;
                float:left;
                line-height:80px;
                margin-right:34px;

            }
            .paymentAll{
                float:left;
                height:400px;
                width:660px;
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
        //pay-rmb-submit
        .pay-rmb-submit{
          p{
            height:28px;
            text-align: center;
            font-size:20px;
            color:#6F90AE;
          }
          .su-payment{
            margin-bottom:0;
          }
        }
    }
     //common
    .BgColor{
        background:#67C23A;
        color:#fff !important;
        border:none !important;
    }
}

</style>

<style rel="stylesheet/scss" lang="scss">
//element样式
.walletRechargeDollar{
    //输入金额框
    .demo-ruleForm{
        .el-form-item{
            margin-bottom:0;
        }
        .el-form-item__content{
            margin-left:90px !important;
            position:relative;
        }
        .el-input--medium .el-input__inner{
            width:300px;
            height:40px;
            border-radius:4px;
            border:1px solid rgba(192,196,204,1);
            padding-right:40px;
        }
        .el-input__suffix{
            width:28px;
            margin-left:42px;
        }
        span{
            font-size:14px;
            color:rgba(144,147,153,1);
            position:absolute;
            left:258px;
            // top:10;
            top:0;
            height:40px;
            line-height:40px;
            display:block;
        }
    }
    //弹出框样式调整
  .pay-rmb-submit{
    //点击按钮
    .el-button--medium{
      margin-left:146px;
      width:250px;
      height:50px;
      border-radius:4px;
      background:#FFA800;
      border:none;
      span{
        color:#fff;
        font-size:18px;
      }
    }
        //弹出框界面
    .el-dialog__wrapper{
      .el-dialog--center{
        width:600px !important;
        height:360px !important;
        border-radius:8px;
        border:none;
        //弹出框header
        .el-dialog__header{
          height:48px;
          margin-bottom:49px;
          .el-dialog__headerbtn{
            i{
              font-size:32px;
              color:#909399;
              font-weight:600;
            }
          }
        }
        //弹出框body
        .el-dialog__body{
          padding:0;
          margin-bottom:27px;
        }
        //弹出框footer
        .el-dialog__footer{
          padding:0;
          button{
            margin-left:210px !important;
            width:180px !important;
            height:40px !important;
            border:none;
            padding: 0;
            display:block;
          }
          button:nth-child(1){
            margin-bottom:16px;
            span{
              font-size:14px !important;
              color:#fff;
            }
          }
          button:nth-child(2){
            background:#fff;
            border:1px solid #909399;
            span{
              color:#909399;
              font-size:14px !important;
            }
          }
        }
      } 
    }
  }
}

</style>

