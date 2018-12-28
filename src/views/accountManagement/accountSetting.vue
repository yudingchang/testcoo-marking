<template>
  <div class="accountSetting">
    <el-row>
      <el-col :span="24" class="accountSetting-info" v-if="this.$route.meta.keepAlive">
        <!-- 手机号码 -->
        <div class="Setting-info-Mobile">
          <p>手机号码</p>
          <p>
            <span>未绑定</span>
            <span @click="ImmediatelyBind" v-if="true">立即绑定</span>
            <span @click="reviseMobile" v-else>修改</span>
          </p>
        </div>
        <!-- 手机号码绑定 -->
        <div class="Setting-info-MobileBind">
          <el-dialog title="绑定手机号码" :visible.sync="dialogFormMobile">
            <div class="chooseOption">
              <el-select v-model="PhoneOptionValue" placeholder="+86">
                <el-option
                  v-for="item in areaPhoneOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input v-model="inputMobile" placeholder="请输入号码"></el-input>
              <!-- <el-form :model="MobileRuleForm" :rules="rules" ref="MobileRuleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="" prop="region">
                  <el-input placeholder="请输入内容" v-model="MobileRuleForm.telephone" class="input-with-select" style="width:360px"> 
                      <el-select v-model="MobileRuleForm.region" slot="prepend" placeholder="请选择" style="width:150px;">
                      <el-option label="86" value="1"></el-option>
                      <el-option label="86" value="2"></el-option>
                      <el-option label="86" value="3"></el-option>
                      </el-select>
                  </el-input>
                </el-form-item>
              </el-form> -->
            </div>
            <!-- <p class="existIf" v-show="existIf">请输入手机号码</p> -->
            <div class="inputAuthCode">
              <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="inputIdentify">
              </el-input>
              <span @click="getAuthCodeSend" class="getAuthCode" v-show="getAuthCode">获取验证码</span>
              <span class="inputAuthTime" v-show="CountDown">{{auth_time}}秒后重新获取</span>
            </div>
            <p v-show="authCodePromt">{{authCodePromtValue}}</p>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="MobileBindTrue">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <!-- 手机号码绑定成功 -->
        <div class="MobileBind-Success">
          <el-dialog
            title=""
            :visible.sync="dialogSuccess"
            width="30%"
            >
            <p><i class="icon icon-CloseButton"></i></p>
            <p>您的手机号码绑定成功</p>
            <p>下次请使用绑定后的手机号码登录</p>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogSuccess = false">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- 电子邮箱 -->
        <div class="Setting-info-mail">
          <p>电子邮箱</p>
          <p>
            <span>851643081@qq.com</span>
            <span @click="reviseMail">修改</span>
          </p>
        </div>
        <!-- 修改电子邮箱 -->
        <div class="reviseMailDialog">
          <el-dialog title="修改电子邮箱" :visible.sync="dialogFormMail">
            <div class="inputMailAddress">
              <el-input
                placeholder="请输入电子邮箱"
                prefix-icon="el-icon-message"
                v-model="inputMailInfo">
              </el-input>
            </div>
            <div class="mailValidate">
              <el-input
                placeholder="请输入验证码"
                prefix-icon="el-icon-message"
                v-model="inputMailValidate">
              </el-input>
              <span @click="getMailValidate" class="getMailValidate" v-show="getMailValidateVS">获取验证码</span>
              <span class="inputMailTime" v-show="inputMailTimeVS">{{auth_time_Validate}}秒后重新获取</span>
            </div>
            <p class="mailPromt" v-show="mailPromtVS">{{mailPromtValue}}</p>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="ConfirmRevise">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <!-- 电子邮箱修改成功 -->
         <div class="reviseMail-Success">
          <el-dialog
            title=""
            :visible.sync="reviseMailSuccess"
            width="30%"
            >
            <p><i class="icon icon-CloseButton"></i></p>
            <p>您的电子邮箱修改成功</p>
            <p>下次请使用修改后的电子邮箱登录</p>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="reviseMailSuccess = false">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- 密码登录 -->
        <div class="Setting-info-loginPassword">
          <p>登录密码</p>
          <p>
            <span>*********</span>
            <span @click="resetLoginpass">重置</span>
          </p>
        </div>
        <!-- 重置登录密码 -->
        <div class="ResetLoginPassword">
          <!-- 子组件位置 -->
        </div>
        <!-- 支付密码 -->
        <div class="Setting-info-payPassword">
          <p>支付密码</p>
          <p>
            <span>未设置</span>
            <span @click="clickSetting">点击设置</span>
          </p>
        </div>

      </el-col>
      <!-- 重置登录密码页面 -->
      <account-reset-login-password v-if="ResetLoginPassword"></account-reset-login-password>
    </el-row>
  </div>
</template>

<script>
import {getAccountInformation} from '@/api/accountManagement.js'
import accountResetLoginPassword from './accountResetLoginPassword.vue'
export default {
  name: 'accountSetting',
  components: {accountResetLoginPassword},
  data(){
    return{
      accountSettingVif: true,    //主页显示隐藏

      ResetLoginPassword: true,    //登录密码重置页面显示隐藏

      //---------------------------------------------    手机号码
      AccountSettingData: [],   //页面加载数据

      dialogFormMobile:false,    //绑定手机号码弹框

      PhoneOptionValue: '',     //地区号码开头选择结果

      areaPhoneOption:[],       //地区选择

      // MobilePhone: '',        //手机号码输入
      
      // existIf: false,        //手机号码是否输入

      inputMobile: '',        //地区号码输入 

      inputIdentify: '',      //输入验证码

      getAuthCode: true,        //获取验证码按钮点击之后隐藏 和 出现

      CountDown: false,       //倒计时按钮出现隐藏

      auth_time:'',         //多少秒之后重新获取验证码

      authCodePromt:false,    //验证码输入错误提示

      authCodePromtValue: '',   //输入错误提示内容

      dialogSuccess: false,    //显示隐藏绑定成功弹框

      //-------------------------------------------------    电子邮箱

      dialogFormMail: false,     //显示隐藏电子邮箱

      inputMailInfo: '' ,           //输入的邮箱

      inputMailValidate: '',        //输入电子邮箱验证码

      getMailValidateVS: true,       //点击获取按钮

      inputMailTimeVS: false,         //邮件 倒计时 重新获取按钮

      auth_time_Validate: '',         //邮件发送验证码 倒计时

      mailPromtVS: false,              //提示行 显示隐藏

      mailPromtValue: '',              //电子邮箱验证错误提示内容

      reviseMailSuccess: false,        //修改成功弹框

      //-------------------------------------------------
      loginPassword:'123456789',    // 登陆密码
    }
  },
  created(){
    // this.getAccountInfoData()
    // console.log(new Date)
  },
  methods:{
    //打开页面获取账户信息
    getAccountInfoData(){
      getAccountInformation().then(response =>{
        if(response.data.code == 0){
          this.AccountSettingData = response.data.data
        }
      })
    },


    //立即绑定手机号码
    ImmediatelyBind(){
     this.dialogFormMobile = true

    },

    //点击获取验证码，发送短信
    getAuthCodeSend(){
      //非空验证
      if(this.inputMobile ==''){
        this.authCodePromt = true
        this.authCodePromtValue = '*手机号码不能为空'
      }else if(!/^[0-9]*$/.test(this.inputMobile)){
        this.authCodePromt = true
        this.authCodePromtValue = '*手机号码输入格式错误'
      }else{
        //判断
        this.authCodePromt = false
        this.getAuthCode = false
        this.CountDown = true
        this.auth_time = 59
        let auth_timetimer =  setInterval(()=>{     //启动定时器,倒计时
          this.auth_time--;
              if(this.auth_time<=0){
              this.getAuthCode = true
              this.CountDown = false
              clearInterval(auth_timetimer)
            }
        }, 1000)
      }
    },
    //确定绑定成功的按钮
    MobileBindTrue(){
      this.dialogFormMobile = false
      this.dialogSuccess = true
    },

    //修改手机号码
    reviseMobile(){
      

    },

    //修改电子邮箱
    reviseMail(){
      this.dialogFormMail = true
    },

    getMailValidate(){      //点击 发送邮件地址到后台，发送验证码
      if(this.inputMailInfo == ''){
        this.mailPromtVS=true
        this.mailPromtValue='电子邮箱号码不能为空'
      }else if(!(/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g).test(this.inputMailInfo)){
        this.mailPromtVS=true
        this.mailPromtValue='电子邮箱号码输入格式错误'
      }else{
        this.mailPromtVS=false
        this.getMailValidateVS = false
        this.inputMailTimeVS = true
        this.auth_time_Validate = 59
        let auth_timetimer =  setInterval(()=>{     //启动定时器,倒计时
          this.auth_time_Validate--;
              if(this.auth_time_Validate<=0){
              this.getMailValidateVS = true
              this.inputMailTimeVS = false
              clearInterval(auth_timetimer)
            }
        }, 1000)
      }
    },

    ConfirmRevise(){      //修改弹框确认修改
        this.dialogFormMail = false
        this.reviseMailSuccess = true
    },

    //重置登录密码
    resetLoginpass(){
      // this.accountSettingVif = false
      this.$route.meta.keepAlive = false
      this.$router.push({name: 'accountResetLoginPassword',params: {reset: ''}})
      // this.ResetLoginPassword = true
    },

    //点击设置
    clickSetting(){

    },

  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
//普通样式
.accountSetting{
  padding:40px 0 0 150px;
  .accountSetting-info{
      .Setting-info-Mobile{
        height:24px;
        line-height: 24px;
        margin-bottom:45px;
        p{
          float:left;
          height:24px;
          line-height: 24px;
        }
        p:nth-child(1){
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:rgba(127,143,164,1);
          margin-right:51px;
        }
        p:nth-child(2){
          span{
            display:inline-block;
          }
          span:nth-child(1){
            width:214px;
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(80,104,140,1);
          }
          span:nth-child(2){
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,168,0,1);
            line-height:24px;
            cursor: pointer;
          }
        }
      }
      .Setting-info-MobileBind{
        // width:600px;
        // height:400px;
        // background:rgba(255,255,255,1);
        // border-radius:8px;
      }
      .Setting-info-mail{
        height:24px;
        line-height: 24px;
        margin-bottom:45px;
        p{
          float:left;
          height:24px;
          line-height: 24px;
        }
        p:nth-child(1){
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:rgba(127,143,164,1);
          margin-right:51px;
        }
        p:nth-child(2){
          span{
            display:inline-block;
          }
          span:nth-child(1){
            width:214px;
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(80,104,140,1);
          }
          span:nth-child(2){
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,168,0,1);
            line-height:24px;
            cursor: pointer;
          }
        }
      }
      .Setting-info-loginPassword{
        height:24px;
        line-height: 24px;
        margin-bottom:45px;
        p{
          float:left;
          height:24px;
          line-height: 24px;
        }
        p:nth-child(1){
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:rgba(127,143,164,1);
          margin-right:51px;
        }
        p:nth-child(2){
          span{
            display:inline-block;
          }
          span:nth-child(1){
            width:214px;
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            line-height: 24px;
            color:rgba(80,104,140,1);
          }
          span:nth-child(2){
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,168,0,1);
            line-height:24px;
            cursor: pointer;
          }
        }
      }
      .Setting-info-payPassword{
        height:24px;
        line-height: 24px;
        p{
          float:left;
          height:24px;
          line-height: 24px;
        }
        p:nth-child(1){
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:rgba(127,143,164,1);
          margin-right:51px;
        }
        p:nth-child(2){
          span{
            display:inline-block;
          }
          span:nth-child(1){
            width:214px;
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            line-height: 24px;
            color:rgba(80,104,140,1);
          }
          span:nth-child(2){
            height:24px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,168,0,1);
            line-height:24px;
            cursor: pointer;
          }
        }
      }
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" >
//element-ui样式
.accountSetting{
  .Setting-info-loginPassword{
    .el-input__inner{
      float:left;
    }
  }
  //绑定手机号码
  .Setting-info-MobileBind{
    .el-dialog{
        width:600px;
        height:400px;
        background:rgba(255,255,255,1);
        border-radius:8px;
        .el-dialog__header{
          padding:60px 0 0 0;
          height:93px;
          margin-bottom:50px;
          .el-dialog__title{
            margin-left:228px;
            font-size:24px;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(127,143,164,1);
          }
          .el-icon-close:before{
            font-size:24px;
            color:rgba(144,147,153,1);
            font-weight:600;
          }
        }
        .el-dialog__body{
          padding:0 0 31px 0;
          height:164px;
          .chooseOption{
            width:360px;
            height:40px;
            border-radius:4px;
            // border:1px solid rgba(192,196,204,1);
            line-height:40px;
            margin:0 auto;
            // overflow: hidden;
            .el-select{
              float:left;
              width:178px;
            }
            .el-input--medium{
              float:left;
              width:180px;
            }
            .el-select--medium .el-input__inner{
              border:none;
            }
            .el-input--medium .el-input__inner{
              width:178px;
              height:40px;
              float:left;
              // border-right:1px solid rgba(192,196,204,1);
              // border-radius:0;
            }
            .el-input--medium:nth-child(2) .el-input__inner{
              border:none;
              border-left:1px solid rgba(192,196,204,1);
              border-radius:0;
              border:1px solid rgba(192,196,204,1);
              border-top-right-radius:4px;
              border-bottom-right-radius:4px;
            }
            .el-input--medium:nth-child(1) .el-input__inner{
              font-size:14px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(255,165,0,1);
              border:1px solid rgba(192,196,204,1);
              border-right:none;
              border-top-right-radius:0;
              border-bottom-right-radius:0;
            }
            .el-input--medium:nth-child(1) .el-input__inner::-webkit-input-placeholder{
              font-size:14px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(255,165,0,1);
            }
            .el-input--medium:nth-child(2) .el-input__inner:focus{
              border:1px solid rgba(255,168,0,1);
            }
          }
          .chooseOption .el-input--medium:nth-child(2):focus{
            border:1px solid rgba(255,168,0,1);
          }
          .inputAuthCode{
            width:360px;
            height:40px;
            border-radius:4px;
            // border:1px solid rgba(192,196,204,1);
            line-height:40px;
            margin:24px auto 8px;
            overflow: hidden;
            .el-input--medium{
              height:40px;
              width:250px;
              float:left;
            }
            .el-input--medium .el-input__inner{
              border:none;
              height:40px;
              width:250px;
              border-radius:4px;
              border:1px solid rgba(192,196,204,1);
              border-top-right-radius:0;
              border-bottom-right-radius:0;
            }
            .el-input--medium .el-input__inner:focus{
              border:1px solid rgba(255,168,0,1);
            }
            span{
              float: left;
            }
            .getAuthCode{
              width:108px;
              height:40px;
              background:rgba(255,168,0,1);
              border-radius:4px;
              text-align:center;
              font-size:14px;
              font-family:MicrosoftYaHei;
              color:rgba(255,255,255,1);
              border-radius:0;
              border:none;
              cursor: pointer;
              border:1px solid rgba(192,196,204,1);
              border-left:none;
              border-top-right-radius:4px;
              border-bottom-right-radius:4px;
            }
            .getAuthCode:hover{
              opacity: 0.8;
            }
            .inputAuthTime{
              width:108px;
              height:40px;
              background:rgba(255,168,0,1);
              border-radius:4px;
              text-align:center;
              font-size:14px;
              font-family:MicrosoftYaHei;
              color:rgba(255,255,255,1);
              border-radius:0;
              border:none;
              // border:1px solid rgba(192,196,204,1);
              border-left:none;
              border-top-right-radius:4px;
              border-bottom-right-radius:4px;
            }
          }
          p{
            width:480px;
            height:21px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(239,53,53,1);
            line-height:21px;
            padding-left:256px;
            text-align:right;
          }
        }
        .el-dialog__footer{
          padding:0;
          text-align:center;
          .el-button--medium{
            width:140px;
            height:40px;
            background:rgba(255,168,0,1);
            border-radius:4px;
            border:none;
            span{
              font-size:18px;
              font-family:MicrosoftYaHei;
              color:rgba(255,255,255,1);
            }
          }
        }
    }
  }
  .MobileBind-Success{
    .el-dialog{
      width:600px;
      height:360px;
      background:rgba(255,255,255,1);
      border-radius:8px;
      .el-dialog__header{
          // padding:60px 0 0 0;
          padding:0;
          height:78px;
          // margin-bottom:50px;
          .el-icon-close:before{
            font-size:24px;
            color:rgba(144,147,153,1);
            font-weight:600;
          }
      }
      .el-dialog__body{
        padding:0;
        text-align:center;
        margin-bottom:41px;
        P:nth-child(1){
          width:80px;
          height:80px;
          border:5px solid rgba(103,194,58,1);
          margin:0 auto 16px;
          border-radius:50%;
          i{
            color:rgba(103,194,58,1);
            font-size:20px;
          }
        }
        p:nth-child(2){
          height:26px;
          font-size:20px;
          font-family:MicrosoftYaHei;
          color:rgba(51,51,51,1);
          line-height:26px;
          margin-bottom:10px;
        }
        p:nth-child(3){
          height:21px;
          font-size:16px;
          font-family:MicrosoftYaHei;
          color:rgba(153,153,153,1);
          line-height:21px;
        }
      }
      .el-dialog__footer{
        padding:0;
        text-align:center;
        .el-button--medium{
          width:140px;
          height:40px;
          background:rgba(255,168,0,1);
          border-radius:4px;
          border:none;
        }
        .el-button--primary{
          font-size:18px;
          font-family:MicrosoftYaHei;
          color:rgba(255,255,255,1);
        }
      }
    }
  }
  .reviseMailDialog{
    .el-dialog{
      width:600px;
      height:400px;
      background:rgba(255,255,255,1);
      border-radius:8px;
      .el-dialog__header{
        padding:60px 0 0 0;
        height:93px;
        margin-bottom:50px;
        .el-dialog__title{
          margin-left:228px;
          font-size:24px;
          font-family:PingFang-SC-Medium;
          font-weight:500;
          color:rgba(127,143,164,1);
          line-height:33px;
        }
        .el-icon-close:before{
          font-size:24px;
          color:rgba(144,147,153,1);
          font-weight:600;
        }
      }
      .el-dialog__body{
        padding:0;
        margin-bottom:40px;
        height:133px;
        .inputMailAddress{
          width:360px;
          height:40px;
          margin:0 auto 24px;
          .el-input--medium .el-input__inner{
            width:360px;
            height:40px;
            border-radius:4px;
            border:1px solid rgba(192,196,204,1);
          }
          .el-input--medium .el-input__inner::-webkit-input-placeholder{    //使用webkit内核的浏览器
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner:-moz-placeholder{      //Firefox版本4-18
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner::-moz-placeholder{       //Firefox版本19+
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner:-ms-input-placeholder{         //IE浏览器 
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner:focus{
            border:1px solid rgba(255,168,0,1);
          }
        }
        .mailValidate{
          width:360px;
          height:40px;
          border-radius:4px;
          margin:0 auto 8px;
          .el-input--medium{
            float:left;
            width:261px;
            height:40px;
          }
          .el-input__inner{
            width:261px;
            height:40px;
            border-radius:4px;
            border:1px solid rgba(192,196,204,1);
            border-top-right-radius:0;
            border-bottom-right-radius:0;
            border-right:none;
          }
          .el-input--medium .el-input__inner::-webkit-input-placeholder{    //使用webkit内核的浏览器
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner:-moz-placeholder{      //Firefox版本4-18
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner::-moz-placeholder{       //Firefox版本19+
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input--medium .el-input__inner:-ms-input-placeholder{         //IE浏览器 
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(144,147,153,1);
          }
          .el-input__inner:focus{
            border:1px solid rgba(255,168,0,1);
          }
          .getMailValidate{
            float:left;
            display:inline-block;
            width:99px;
            height:40px;
            background:rgba(255,168,0,1);
            border-radius:4px;
            line-height:40px;
            text-align:center;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,255,255,1);
            border-top-left-radius:0;
            border-bottom-left-radius:0;
            cursor:pointer;
          }
          .getMailValidate:hover{
            opacity: 0.8;
          }
          .inputMailTime{
            float:left;
            display:inline-block;
            width:99px;
            height:40px;
            background:rgba(255,168,0,1);
            border-radius:4px;
            line-height:40px;
            text-align:center;
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(255,255,255,1);
            border-top-left-radius:0;
            border-bottom-left-radius:0;
            cursor:pointer;
          }
        }
        p{
          width:480px;
          height:21px;
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:rgba(239,53,53,1);
          line-height:21px;
          padding-left:256px;
          text-align:right;
        }
      }
      .el-dialog__footer{
        padding:0;
        text-align:center;
        .el-button--primary{
          width:140px;
          height:40px;
          background:rgba(255,168,0,1);
          border-radius:4px;
          border:none;
          font-size:18px;
          font-family:MicrosoftYaHei;
          color:rgba(255,255,255,1);
        }
      }
    }
  }
  .reviseMail-Success{
    .el-dialog{
      width:600px;
      height:360px;
      background:rgba(255,255,255,1);
      border-radius:8px;
      .el-dialog__header{
          // padding:60px 0 0 0;
          padding:0;
          height:78px;
          // margin-bottom:50px;
          .el-icon-close:before{
            font-size:24px;
            color:rgba(144,147,153,1);
            font-weight:600;
          }
      }
      .el-dialog__body{
        padding:0;
        text-align:center;
        margin-bottom:41px;
        P:nth-child(1){
          width:80px;
          height:80px;
          border:5px solid rgba(103,194,58,1);
          margin:0 auto 16px;
          border-radius:50%;
          i{
            color:rgba(103,194,58,1);
            font-size:20px;
          }
        }
        p:nth-child(2){
          height:26px;
          font-size:20px;
          font-family:MicrosoftYaHei;
          color:rgba(51,51,51,1);
          line-height:26px;
          margin-bottom:10px;
        }
        p:nth-child(3){
          height:21px;
          font-size:16px;
          font-family:MicrosoftYaHei;
          color:rgba(153,153,153,1);
          line-height:21px;
        }
      }
      .el-dialog__footer{
        padding:0;
        text-align:center;
        .el-button--medium{
          width:140px;
          height:40px;
          background:rgba(255,168,0,1);
          border-radius:4px;
          border:none;
        }
        .el-button--primary{
          font-size:18px;
          font-family:MicrosoftYaHei;
          color:rgba(255,255,255,1);
        }
      }
    }
  }
}
</style>


