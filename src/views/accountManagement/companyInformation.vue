<template>
  <div class="company-information">
    <!-- 编辑企业信息 -->
    <div v-if="company" :model="form">
      <div class="company-content clearfloat">
        <div class="left required">公司名称</div>
        <div class="right-fixed">
            <el-input style="width:380px;" type="text" placeholder="请输入公司名称" v-model="form.Companyname"></el-input>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">公司地址</div>
        <div class="right-fixed">
            <el-input style="width:380px;" type="text" placeholder="请输入公司地址" v-model="form.Companyaddress"></el-input>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">详细地址</div>
        <div class="right-fixed">
            <el-input
              style="width:380px;"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="form.Detailaddress">
            </el-input>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">公司规模</div>
        <div class="right-fixed">
            <el-select v-model="form.CompanyInsize" placeholder="请选择" style="width:380px;">
              <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
              >    
              </el-option>
          </el-select>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">营业执照注册号</div>
        <div class="right-fixed">
            <el-input style="width:380px;" type="text" placeholder="请输入营业执照注册号" v-model="form.Registration"></el-input>
        </div>
      </div>
      <button class="save" :disabled="form.Companyname == ''" @click="save()">保存</button>
    </div>
    <!-- 显示企业信息 -->
    <div v-else :model="form">
      <div class="company-content clearfloat">
        <div class="left required">公司名称</div>
        <div class="right-fixed">
            <span v-if="form.Companyname!=''">{{form.Companyname}}</span>
            <span class="empty" v-else>未设置</span>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">公司地址</div>
        <div class="right-fixed">
            <span v-if="form.Companyaddress!=''">{{form.Companyaddress}}</span>
            <span class="empty" v-else>未设置</span>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">详细地址</div>
        <div class="right-fixed">
            <span v-if="form.Detailaddress!=''">{{form.Detailaddress}}</span>
            <span class="empty" v-else>未设置</span>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">公司规模</div>
        <div class="right-fixed">
            <span v-if="form.CompanyInsize!=''">{{form.CompanyInsize}}</span>
            <span class="empty" v-else>未设置</span>
        </div>
      </div>
      <div class="company-content clearfloat">
        <div class="left">营业执照注册号</div>
        <div class="right-fixed">
            <span v-if="form.Registration!=''">{{form.Registration}}</span>
            <span class="empty" v-else>未设置</span>
        </div>
      </div>
      <div class="edit" @click="editPersonalMessage()">修改</div>
    </div>
  </div>
</template>

<script>
import {saveCompanyInformation,getCompanyInformation} from '@/api/accountManagement.js'
import { mapGetters } from 'vuex'
import store from '../../store/'
export default {
  name: '',
  components: {  },
  data(){
    return{
      editMessage:true,   //编辑信息

      normalStatu:false,   //正常状态显示

      form:{      //企业信息
        Companyname: '',
        Companyaddress: '',
        Detailaddress: '',
        CompanyInsize: '',
        Registration: '',  //营业执照注册号
      },

      options:[      //options公司规模选项
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
        },
      ],
    }
  },
  created(){
    this.getCompanyInfoData()
    console.log(this.$store.state.user.company+"666")
  },
  methods:{
    save(){                   //点击保存企业信息
        saveCompanyInformation(this.form).then(response =>{
          if(response.data.code == 0){
            console.log("success")
            this.$store.commit('SET_COMPANY', false)
            console.log(this.$store.state.user.company)
            this.getCompanyInfoData()
          }
        })
    },
    editPersonalMessage(){    //修改企业信息
        this.$store.commit('SET_COMPANY', true)
        console.log(this.$store.state.user.company)
        this.getCompanyInfoData()
    },

    getCompanyInfoData(){
      console.log("进入")
      getCompanyInformation().then(response =>{
        if(response.data.code == 0){
          this.from=response.data.data
          console.log(this.from)
        }
      })
    }
  },
  computed:{
    ...mapGetters([
      'company'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss"  scoped>
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.company-information{
    margin: 40px 0 0 100px;
    color: #164061;
    font-size: 14px;
    .edit{
    margin-left: 160px;
    width: 240px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #FFA800;
    border-radius: 4px;
    font-size: 16px;
    color: #FFA800;
    letter-spacing: 0.77px;
    text-align: center; 
    cursor: pointer;
  }
  .save {
    margin-left: 185px;
    width: 240px;
    height: 40px;
    line-height: 40px;
    background: #ffa800;
    border-radius: 4px;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0.77px;
    text-align: center;
    cursor: pointer;
  }
  .company-content{
    // overflow: hidden;
    height: 36px;
    line-height: 36px;
    margin-bottom: 35px;
    .left{
      float: left;
      width: 150px;
      font-size: 14px;
      color: #7f8fa4;
    }
    .required{
      &::after{
        content: '*';
        color: #FF0000;
        margin-left: 9px;
      }
    }
    
    .right-fixed{
      float: left;
      margin-left: 34px;
      .empty{
        color: #909399;
      }
      // input{
      //   border: 1px solid #dfe3e9;
      //   outline: none;
      //   -webkit-box-shadow: none;
      //   box-shadow: none;
      //   color: #164061;
      //   height: 30px;
      //   line-height: 30px;
      //   padding-left: 14px;
      //   border-radius: 4px;
      // }
      // input[type='textarea']{
      //   width: 38px;
      // }
    }
  }
} 
</style>

