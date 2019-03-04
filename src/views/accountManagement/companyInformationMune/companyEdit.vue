<template>
    <div class="companyEdit" v-loading="loading">
        <el-row>
            <el-col :span="12">
                <div :model="form">
                    <div class="company-content clearfloat">
                        <div class="left required">公司名称</div>
                        <div class="right-fixed">
                            <el-input style="width:380px;" type="text" maxlength="50" placeholder="请输入公司名称" v-model="form.company_name"></el-input>
                        </div>
                    </div>
                    <div class="company-content clearfloat optionsProvinces">
                        <div class="left">公司地址</div>
                        <div class="right-fixed">
                            <!-- <el-input style="width:380px;" type="text" placeholder="请输入公司地址" v-model="form.Companyaddress"></el-input> -->
                            <el-cascader
                            expand-trigger="hover"
                            :options="optionsProvinces"
                            :props="{label:'chinese_name',value:'id',children:'children_simple'}"
                            v-model="form.address"
                            @change="handleChange">
                            </el-cascader>
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
                            v-model="form.address_detail">
                            </el-input>
                        </div>
                    </div>
                    <div class="company-content clearfloat">
                        <div class="left">公司规模</div>
                        <div class="right-fixed">
                            <el-select v-model="form.company_size" placeholder="请选择" style="width:380px;">
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
                            <el-input style="width:380px;" type="text" placeholder="请输入营业执照注册号" v-model="form.license_number"></el-input>
                        </div>
                    </div>
                    <button class="save" :disabled="form.company_name == null" @click="saveCompanyInformationData()">保存</button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {saveCompanyInformation,getCompanyInformation} from '@/api/accountManagement.js'
import { fetchList,fetchCounty } from '@/api/fetch';
import { mapGetters } from 'vuex'
import store from '../../../store/'
export default {
    name: 'companyEdit',
    data(){
        return{
            form:{      //企业信息
                company_name: '',
                address: [],
                address_arr:'',
                address_detail: '',
                company_size: '',
                license_number: '',  //营业执照注册号
            },

            optionsProvinces:[],  

            options:[  ],    //options公司规模选项

            loading:false,
            
        }
    },
    methods:{
        getCompanyInfoData(){
            this.loading = true
            getCompanyInformation().then(response =>{
                if(response.data.code == 0){
                    this.form = response.data.data
                    if(this.form.company_size == 0){
                        this.form.company_size = ''
                    }
                    console.log(this.form)
                    this.loading = false
                }
            })
        },

        saveCompanyInformationData(){
            console.log(this.form.company_size)
            saveCompanyInformation(this.form).then(response =>{
            if(response.data.code == 0){
                store.dispatch('GetUserInfo')
                this.$message({
                    message: '企业信息保存成功',
                    type: 'success'
                })
                this.$router.push({ path: 'companyInformationIndex' })
                }
            })
        },

        //getFetchCounty获取省市区
        getFetchProvinces(val){
        fetchCounty({ pid: val }).then( response => {
            this.$nextTick(function() {
            // this.locationOptions = response.data.data
            // console.log(response.data.data)
            this.optionsProvinces = response.data.data
            })
        })
        },

        //handleChange
        handleChange(){

        },

        //配置文件加载
        ConfigUnit(){
            this.options = this.configs.company_size;
            // console.log( this.options )
        },

    },
    created(){
        this.getCompanyInfoData()
        this.getFetchProvinces(7)
        this.ConfigUnit()
    },
    computed:{
        ...mapGetters([
            'configs'
        ])
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
//普通DOM样式
.companyEdit{
    padding:34px 0 0 100px;
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
    }
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
}
</style>

<style rel="stylesheet/scss" lang="scss" >
//element样式
.companyEdit{
    .el-input__inner:focus{
        border:1px solid rgba(255,168,0,1);
    }
    .el-textarea__inner:focus{
        border:1px solid rgba(255,168,0,1);
    }
    .optionsProvinces{
        .el-cascader .el-input, .el-cascader .el-input__inner{
        width:380px;
        }
    }
}
</style>



