<template>
  <div class="datasetting">
    <el-row>
      <el-col :span="24">
        <div class="datasetting-content">
          <!-- tabs -->
          <div class="tab-content">
            <ul class="tabs">
              <li :class="{active:item.isBool}" v-for="(item,index) in tablist" :key = index @click="tab(item,index)">{{item.content}}</li>
            </ul>
            <el-button class="add" @click="add()"><i class="iconfont icon-Fill2"></i><span>增加</span></el-button>
          </div>
          <!-- el-table 报告接收电子邮箱 -->
          <el-table
            v-loading="loading"
            class="receiveEmail"
            :data="tableData"
            style="width: 100%"
            v-show="num==0"
            >
            <el-table-column
              label="姓名"
              width="290"
            >
            <template slot-scope="scope">
              {{scope.row.first_name + scope.row.last_name}}
            </template>
            </el-table-column>
            <el-table-column
              prop="email"
              label="电子邮箱"
              width="250"
              >
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="添加时间"
              width="250"
              >
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作">
              <template slot-scope="scope">
                <el-button @click="setDefault(scope.row)" type="text" size="small" v-if="scope.row.default==0">设为默认</el-button>
                <el-button type="text" size="small" v-if="scope.row.default==1" :class="{changecolor:scope.row.default==1}">默认</el-button>
                <el-button type="text" size="small" @click="editEmail(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="removeEmail(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- el-table 供应商信息 -->
          <el-table
            v-loading="loading"
            :data="supplyTableData"
            style="width: 100%"
            v-show="num==1"
            >
            <el-table-column
              label="供应商名称"
              prop="supplier_name"
              width="270"
            >
            </el-table-column>
            <el-table-column
              label="联系人"
              width="202"
            >
              <template slot-scope="scope">
                {{scope.row.first_name + scope.row.last_name}}
              </template>
            </el-table-column>
            <el-table-column
              prop="telephone"
              label="联系人手机号码"
              width="323"
              >
            </el-table-column>
            <el-table-column
              prop="email"
              label="联系人电子邮箱"
              width="345"
              >
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button @click="setSupplyDefault(scope.row)" type="text" size="small" v-if="scope.row.is_default==0">设为默认</el-button>
                <el-button type="text" size="small" v-if="scope.row.is_default==1" :class="{changecolor:scope.row.is_default==1}">默认</el-button>
                <el-button type="text" size="small" @click="editSupply(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="removeSupply(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- el-table 发票信息 -->
          <el-table
            v-loading="loading"
            :data="invoiceTableData"
            style="width: 100%"
            v-if="num==2"
            >
            <el-table-column
              label="公司名称"
              prop="company_name"
              width="160"
            >
            </el-table-column>
            <el-table-column
              prop="tax_id_number"
              label="纳税人识别号"
              width="240"
              >
            </el-table-column>
            <el-table-column
              prop="bank"
              label="开户银行"
              width="160"
              >
            </el-table-column>
            <el-table-column
              prop="bank_account"
              label="开户账号"
              width="160"
              >
            </el-table-column>
            <el-table-column
              prop="telephone"
              label="手机号码"
              width="260"
              >
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button @click="setInvoiceDefault(scope.row)" type="text" size="small" v-if="scope.row.default==0">设为默认</el-button>
                <el-button type="text" size="small" v-if="scope.row.default==1" :class="{changecolor:scope.row.default==1}">默认</el-button>
                <el-button type="text" size="small" @click="editInvoice(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="removeInvoice(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- el-table 寄送地址 -->
          <el-table
            v-loading="loading"
            :data="addressTableData"
            style="width: 100%"
            v-show="num==3"
            >
            <el-table-column
              label="收件人姓名"
              width="290"
            >
              <template slot-scope="scope">
                {{ scope.row.first_name + scope.row.last_name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="detailed_address"
              label="收件地址"
              width="300"
              >
            </el-table-column>
            <el-table-column
              prop="telephone"
              label="手机号码"
              width="240"
              >
            </el-table-column>
            <el-table-column
              prop="fixed_telephone"  
              label="固定电话"
              width="310"
              >
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button @click="setaddressDefault(scope.row)" type="text" size="small" v-if="scope.row.default==0">设为默认</el-button>
                <el-button type="text" size="small" v-if="scope.row.default==1" :class="{changecolor:scope.row.default==1}">默认</el-button>
                <el-button type="text" size="small" @click="editaddress(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="removeaddress(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- el-dialog 新增报告接收电子邮箱 -->
        <el-dialog
          :title="emailTitle"
          :visible.sync="emailDialogVisible"
          width="500px"
          class="email-dialog"
          top="20vh"
          center>
          <el-form :model="form" :rules="rules" ref="form" :inline="true">
            <el-form-item label="姓:" style="margin-left:50px;" prop="first_name">
              <el-input style="width:120px;" placeholder="请输入姓" v-model="form.first_name"></el-input>
            </el-form-item>
            <el-form-item label="名:"  style="margin-left:32px;" prop="last_name">
              <el-input style="width:120px;" placeholder="请输入名" v-model="form.last_name"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="电子邮箱:" style="margin-left:8px;" prop="email">
              <el-input placeholder="请输入电子邮箱" style="width:326px;" v-model="form.email"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="emailDialogVisible = false" class="cancle">取 消</el-button>
            <el-button @click.native="emailsubmit" class="submit">确 定</el-button>
          </span>
        </el-dialog>
        <!-- el-dialog 新增供应商信息 -->
        <el-dialog
          :title="supplyTitle"
          :visible.sync="supplyDialogVisible"
          width="500px"
          class="supply-dialog"
          top="20vh"
          center>
          <el-form :model="supplyform" :rules="supplyrules" ref="supplyform" :inline="true" >
            <el-form-item label="供应商名称:" style="" prop="supplier_name" :label-width="labelwidth">
              <el-input placeholder="请输入供应商名称" style="width:326px;" v-model="supplyform.supplier_name"></el-input>
            </el-form-item>
            <el-form-item label="联系人姓:" style="" prop="first_name" :label-width="labelwidth">
              <el-input style="width:120px;" placeholder="请输入姓" v-model="supplyform.first_name"></el-input>
            </el-form-item>
            <el-form-item label="名:" prop="last_name" label-width="72px">
              <el-input style="width:120px;" placeholder="请输入名" v-model="supplyform.last_name"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="手机号码:" :label-width="labelwidth" prop="telephone">
              <el-input placeholder="请输入手机号码" v-model="supplyform.telephone" class="input-with-select" >
                  <el-select v-model="supplyform.telephone_code" slot="prepend" placeholder="请选择" style="width:150px;">
                    <el-option
                    v-for="item in phone_codeConfig"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                    >
                    <span style="float: left">{{ _.join( _.split(item.label,',',1) ) }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ _.get(_.split(item.label,',',2), '[1]')   }}</span>    
                    </el-option>
                  </el-select>
              </el-input> 
            </el-form-item>
            <el-form-item label="电子邮箱:" :label-width="labelwidth" prop="email">
              <el-input placeholder="请输入电子邮箱" style="width:326px;" v-model="supplyform.email"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="supplyDialogVisible = false" class="cancle">取 消</el-button>
            <el-button @click.native="supplysubmit" class="submit">确 定</el-button>
          </span>
        </el-dialog>
        <!-- el-dialog 新增发票信息 -->
        <el-dialog
          :title="invoiceTitle"
          :visible.sync="invoiceDialogVisible"
          width="600px"
          class="invoice-dialog"
          top="20vh"
          center>
          <el-form :model="invoiceform" :rules="invoicerules" ref="invoiceform" :label-width="formLabelWidth">
                    <el-form-item label="公司名称：" prop="company_name">
                        <el-input v-model="invoiceform.company_name"></el-input>
                    </el-form-item>
                    <el-form-item label="纳税人识别号：" prop="tax_id_number">
                        <el-input v-model="invoiceform.tax_id_number"></el-input>
                    </el-form-item>
                    <el-form-item label="开户银行：" prop="bank">
                        <el-input v-model="invoiceform.bank"></el-input>
                    </el-form-item>
                    <el-form-item label="银行账号：" prop="bank_account">
                        <el-input v-model="invoiceform.bank_account"></el-input>
                    </el-form-item>
                    <el-form-item label="单位电话：" prop="telephone">
                        <el-input placeholder="请输入单位电话" v-model="invoiceform.telephone" class="input-with-select">
                            <el-select v-model="invoiceform.telephone_code" slot="prepend" placeholder="请选择" style="width:150px;">
                              <el-option
                              v-for="item in phone_codeConfig"
                              :key="item.value"
                              :label="item.value"
                              :value="item.value"
                              >
                              <span style="float: left">{{ _.join( _.split(item.label,',',1) ) }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ _.get(_.split(item.label,',',2), '[1]')   }}</span>    
                              </el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="单位地址：" prop="address">
                        <el-cascader
                          expand-trigger="hover"
                          :options="optionsProvinces"
                          :props="{label:'chinese_name',value:'id',children:'children_simple'}"
                          v-model="invoiceform.address"
                          @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址：" prop="detailed_address">
                        <el-input type="textarea" v-model="invoiceform.detailed_address"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="invoiceDialogVisible = false" class="cancle">取 消</el-button>
                    <el-button type="primary" @click="invoicesubmit()" class="submit">确 定</el-button>
                </div>
        </el-dialog>
        <!-- el-dialog 新增寄送地址 -->
        <el-dialog
          :title="addressTitle"
          :visible.sync="addressDialogVisible"
          width="600px"
          class="address-dialog"
          top="20vh"
          center>
          <el-form :model="addressform" :rules="addressrules" ref="addressform" :label-width="invoiceLabelWidth" :inline="true">
                    <el-form-item label="收件人姓：" label-width="130px" prop="first_name">
                        <el-input v-model="addressform.first_name"  style="width:160px"></el-input>
                    </el-form-item>
                    <el-form-item label="名：" prop="last_name" label-width="40px">
                        <el-input v-model="addressform.last_name"  style="width:160px"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="收件地址：" prop="address">
                        <el-select v-model="addressform.targetCountry_id" style="width: 150px;" placeholder="请选择国家" @change="handleCountryChange">
                          <el-option
                            v-for="item in countryOptions"
                            :key="item.id"
                            :label="item.chinese_name"
                            :value="item.id"/>
                        </el-select>
                        <!-- <el-input v-model="addressform.address"   style="width:375px"></el-input> -->
                        <el-cascader
                          expand-trigger="hover"
                          :options="optionsProvinces"
                          :props="{label:'chinese_name',value:'id',children:'children_simple'}"
                          v-model="addressform.address"
                          @change="handleChange"
                          style="width:212px;"
                          >
                        </el-cascader>
                    </el-form-item>
                    <br>
                    <el-form-item label="详细地址：" prop="detailed_address">
                        <el-input type="textarea" style="width:375px" v-model="addressform.detailed_address" ></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="收件人手机号：" prop="telephone">
                        <el-input placeholder="请输入手机号" v-model="addressform.telephone" class="input-with-select" style="width:375px">
                            <el-select v-model="addressform.telephone_code" slot="prepend" placeholder="请选择" style="width:150px;">
                              <el-option
                              v-for="item in phone_codeConfig"
                              :key="item.value"
                              :label="item.value"
                              :value="item.value"
                              >
                              <span style="float: left">{{ _.join( _.split(item.label,',',1) ) }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ _.get(_.split(item.label,',',2), '[1]')   }}</span>
                              <!-- <span style="float: left">{{ item.label }}</span>     -->
                              </el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="收件人固定号：" prop="fixed_telephone">
                        <el-input placeholder="请输入固定号码" v-model="addressform.fixed_telephone" class="input-with-select" style="width:375px"> 
                            <el-select v-model="addressform.fixed_telephone_code" slot="prepend" placeholder="请选择" style="width:150px;">
                              <el-option
                              v-for="item in phone_codeConfig"
                              :key="item.value"
                              :label="item.value"
                              :value="item.value"
                              >
                              <span style="float: left">{{ _.join( _.split(item.label,',',1) ) }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ _.get(_.split(item.label,',',2), '[1]')   }}</span>    
                              </el-option>
                            </el-select>
                        </el-input>                     
                    </el-form-item>                                                     
                </el-form>                                                  
                <div slot="footer" class="dialog-footer">                   
                    <el-button @click="addressDialogVisible = false" class="cancle">取 消</el-button>
                    <el-button type="primary" @click="addresssubmit()" class="submit">确 定</el-button>
                </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getdata , addEmail , setDefault , editEmail , removeEmail , getSupplydata , addSupply , editSupply , setSupplyDefault , removeSupply ,addInvoice,getInvoiceList,setInvoiceDefault,removeInvoice,getAddressList,addAddress,setaddressDefault,removeaddress} from "@/api/accountManagement";
import { fetchCountryList,fetchCounty } from '@/api/fetch';
import { mapGetters } from 'vuex'
import store from '../../store/'
export default {
  name: "",
  components: {},
  data() {
    return {
      //loading 过渡动画
      loading:false,
      //phone_codeConfig
      phone_codeConfig:'',
      tablist: [
        {
          content: "报告接收电子邮箱",
          isBool: true
        },
        {
          content: "供应商信息",
          isBool: false
        },
        {
          content: "发票信息",
          isBool: false
        },
        {
          content: "寄送地址",
          isBool: false
        }
      ],
      options:[
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
        }],
      form:{
        first_name:'',
        last_name:'',
        email:''
      },
      supplyform:{
        first_name:'',
        last_name:'',
        email:'',
        supplier_name:'',
        telephone:'',
        telephone_code:''
      },
      editform:'',
      rules:{
        first_name: [
          { required: true, message: '请输入姓', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        last_name: [
          { required: true, message: '请输入名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮件', trigger: 'blur' }
        ],
      },
      supplyrules:{
        first_name: [
          { required: true, message: '请输入姓', trigger: 'blur' },
        ],
        last_name: [
          { required: true, message: '请输入名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮件', trigger: 'blur' }
        ],
        supplier_name:[{
          required: true, message: '请输入供应商信息', trigger: 'blur'
        }],
        telephone:[{
          required: true, message: '请输入手机号码', trigger: 'blur'
        }]
      },
      invoiceTableData:[],
      invoiceform:{
        company_name:'',
        tax_id_number:'',
        bank:'',
        bank_account:'',
        telephone:'',
        telephone_code:'',
        address:[],
        detailed_address:'',
      },
      targetCountry_id:'',
      countryOptions: [],
      optionsProvinces:[],
      invoicerules:{
        company_name:[{ required: true, message: '请输入公司名称', trigger: 'blur' }],    
        tax_id_number:[{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],  
        bank:[{ required: true, message: '请输入开户银行', trigger: 'blur' }],  
        bank_account:[{ required: true, message: '请输入银行账号', trigger: 'blur' }],  
        telephone:[{ required: true, message: '请输入单位电话', trigger: 'blur'}],
        address:[{ required: true, message: '请选择单位地址', trigger: 'blur'}],
        detailed_address:[{ required: true, message: '请输入详细地址', trigger: 'blur'}],
      },
      addressTableData:[],
      addressTitle:'新增寄送地址',
      addressform:{
        first_name : '',
        last_name : '',
        address : [],
        detailed_address : '',
        telephone : '',
        fixed_telephone : '',
        telephone_code : '',
        fixed_telephone_code : '',
        targetCountry_id: ''
      },
      addressrules:{
        last_name:[{required: true, message: '请输入收件人姓', trigger: 'blur'}],
        first_name:[{required: true, message: '请输入名', trigger: 'blur'}],
        address:[{ required: true, message: '请选择单位地址', trigger: 'blur'}],
        detailed_address:[{ required: true, message: '请输入详细地址', trigger: 'blur'}],
        telephone:[{ required: true, message: '请输入单位电话', trigger: 'blur'}],
        fixed_telephone:[{ required: false, message: '请输入收件人固定号码', trigger: 'blur'}],
      },
      tableData:[],
      supplyTableData:[],
      num:0,
      formLabelWidth:"140px",
      invoiceLabelWidth:'130px',
      emailDialogVisible:false,
      supplyDialogVisible:false,
      invoiceDialogVisible:false,
      addressDialogVisible:false,
      labelwidth:'100px',
      emailTitle:'新增报告接收电子邮箱',
      supplyTitle:'新增供应商信息',
      invoiceTitle:'新增发票信息'
    };
  },
  created(){
    this.getdata()
    this.routerIndex()
    this.ConfigUnit()
    this.getCountryOptions()    //获取所有的国家
    this.getFetchProvinces(this.targetCountry_id)  //获取中国省市区
  },
  methods: {
    // tab切换
    tab(item, index) {
      this.tablist.forEach((item, index) => {
        item.isBool = false;
      });
      this.num = index;
      item.isBool = true;
      if(index==0){
         this.$nextTick(() => {
            this.getdata()
        });
      }
      if(index==1){
        this.$nextTick(() => {
           this.getSupplydata()
        });    
      }
      if(index==2){
        this.$nextTick(() => {
           this.getinvoicedata()
        }); 
      }
      if(index==3){
        this.$nextTick(() => {
           this.getaddressdata()
        }); 
      }
    },
    // 获取电子邮箱表格数据
    getdata(){
      this.loading = true;
      getdata().then(response =>{
        if(response.data.code == 0){
          this.tableData = response.data.data.list
          this.loading = false;
          console.log(this.tableData)
        }
      })
    },
    // 获取供应商信息表格数据
    getSupplydata(){
      this.loading = true;
      getSupplydata().then(response =>{
        if(response.data.code == 0){
          this.supplyTableData = response.data.data.list
          this.loading = false
        }
      })
    },
    // 弹出dialog
    add(){
      if(this.num==0){
        this.emailDialogVisible = true
        this.emailTitle = '新增报告接收电子邮箱'
        this.form.first_name = ''
        this.form.last_name = ''
        this.form.email = ''
        this.$nextTick( ()=> {
          this.$refs.form.clearValidate()
        })
      }
      if(this.num==1){
        this.supplyDialogVisible = true
        this.supplyTitle = '新增供应商信息'
        this.supplyform.first_name = ''
        this.supplyform.last_name = ''
        this.supplyform.email = ''
        this.supplyform.supplier_name = ''
        this.supplyform.telephone = ''
        this.supplyform.telephone_code = ''
        this.$nextTick( ()=> {
          this.$refs.supplyform.clearValidate()
        })
      }
      if(this.num==2){
        this.invoiceDialogVisible = true
        this.invoiceTitle = '新增发票信息'
        this.invoiceform.company_name = ''
        this.invoiceform.tax_id_number = ''
        this.invoiceform.bank = ''
        this.invoiceform.bank_account = ''
        this.invoiceform.telephone = ''
        this.invoiceform.telephone_code = ''
        this.invoiceform.address = []
        this.invoiceform.detailed_address = ''
        this.$nextTick( ()=> {
          this.$refs.invoiceform.clearValidate()
        })
      }
      if(this.num==3){
        this.addressDialogVisible = true
        this.addressTitle = '新增寄送地址'
        this.addressform.first_name = ''
        this.addressform.last_name = ''
        this.addressform.address = []
        this.addressform.detailed_address = ''
        this.addressform.telephone = ''
        this.addressform.fixed_telephone = ''
        this.addressform.telephone_code = ''
        this.addressform.fixed_telephone_code = ''
        this.addressform.targetCountry_id = ''
        this.$nextTick( ()=> {
          this.$refs.addressform.clearValidate()
        })
      }
      
    },
    // 添加一条数据
    emailsubmit(){
      if(this.emailTitle != '编辑报告接收电子邮箱'){

          this.$refs['form'].validate((valid) => {
            if (valid) {
              addEmail({
                  ...this.form
                }).then(response =>{
                  if(response.data.code == 0){
                    this.emailDialogVisible = false
                    this.getdata()
                  }
                })
          }
        })
      }else{
        this.$refs['form'].validate((valid) => {
            if (valid) {
              editEmail({
                  ...this.form,
                  url: 'v1/email/update/'+this.form.id
                }).then(response =>{
                  if(response.data.code == 0){
                    this.emailDialogVisible = false
                    this.getdata()
                  }
                })
          }
        })
      }
        
    },
    // 设置默认电子邮箱
    setDefault(row){
      setDefault({
        url: 'v1/email/set/'+row.id
      }).then(response =>{
         if(response.data.code == 0){
            this.getdata()
          }
      })
    },
    // 编辑电子邮箱
    editEmail(row){
      this.emailTitle = '编辑报告接收电子邮箱'
      this.emailDialogVisible = true
      this.form = Object.assign({}, row)
      this.$nextTick( ()=> {
        this.$refs.form.clearValidate()
      })
    },
    // 删除电子邮箱
    removeEmail(row){
      this.$confirm('是否确认删除', {
          confirmButtonText: '是',
          cancelButtonText: '取消',
          // type: 'warning',
          center: true
        }).then(() => {
           removeEmail({
            url: 'v1/email/delete/'+row.id
          }).then(response =>{
            if(response.data.code == 0){
                this.getdata()
              }
          })
        })
     
    },
    // 增加一条供应商信息
    supplysubmit(){
      // this.supplyform.telephone_code = this.supplyform.telephone_code.toString();
      console.log(typeof(this.supplyform.telephone_code))
      if(this.supplyTitle != '编辑供应商信息'){
          this.$refs['supplyform'].validate((valid) => {
            if (valid) {
              addSupply({
                  ...this.supplyform
                }).then(response =>{
                  if(response.data.code == 0){
                    this.supplyDialogVisible = false
                    this.getSupplydata()
                  }
                })
          }
        })
      }else{
        console.log(this.supplyform)
        this.$refs['supplyform'].validate((valid) => {
            if (valid) {
              editSupply({
                  ...this.supplyform,
                  url: 'v1/supplier/update/'+this.supplyform.id
                }).then(response =>{
                  if(response.data.code == 0){
                    this.supplyDialogVisible = false
                    this.getSupplydata()
                  }
                })
          }
        })
      }
    },
    // 编辑供应商信息
    editSupply(row){
      this.supplyTitle = '编辑供应商信息'
      this.supplyDialogVisible = true
      this.supplyform = _.cloneDeep(row)
      this.supplyform.phone_codeConfig = this.configs.phone_number_codes
      // console.log(this.supplyform)
      this.$nextTick( ()=> {
        this.$refs.supplyform.clearValidate()
      })
    },
    // 设置默认供应商
    setSupplyDefault(row){
      console.log(row)
      setSupplyDefault({
        url: 'v1/supplier/set/'+row.id
      }).then(response =>{
         if(response.data.code == 0){
            this.getSupplydata()
          }
      })
    },
    // 删除电子邮箱
    removeSupply(row){
      this.$confirm('是否确认删除', {
          confirmButtonText: '是',
          cancelButtonText: '取消',
          // type: 'warning',
          center: true
        }).then(() => {
           removeSupply({
            url: 'v1/supplier/delete/'+row.id
          }).then(response =>{
            if(response.data.code == 0){
                this.getSupplydata()
              }
          })
        })
     
    },
    // 获取发票信息表格数据  
    getinvoicedata(){
      this.loading = true;
      getInvoiceList().then(response =>{
        if(response.data.code == 0){
          this.invoiceTableData = response.data.data.list
          this.loading = false;
        }
      })
    },
    // 获取发票信息默认 
    setInvoiceDefault(row){
      setInvoiceDefault({
        url: 'v1/receipt/set/'+row.id
      }).then(response =>{
         if(response.data.code == 0){
            this.getinvoicedata()
          }
      })
    },
    // 编辑发票信息
    editInvoice(row){
      this.invoiceTitle = '编辑发票信息'
      this.invoiceDialogVisible = true
      this.invoiceform = _.cloneDeep(row)
      this.invoiceform.phone_codeConfig = this.configs.phone_number_codes
      this.invoiceform.address = row.address.map(Number)
      console.log(this.invoiceform.address)
      this.$nextTick( ()=> {
        this.$refs.invoiceform.clearValidate()
      })
    },
    // 新增发票信息
    invoicesubmit(){
       if(this.invoiceTitle != '编辑发票信息'){
          this.$refs['invoiceform'].validate((valid) => {
            if (valid) {
              addInvoice({
                  ...this.invoiceform
                }).then(response =>{
                  if(response.data.code == 0){
                    this.invoiceDialogVisible = false
                    this.getinvoicedata()
                  }
                })
          }
        })
      }else{
        this.$refs['invoiceform'].validate((valid) => {
            if (valid) {
              editEmail({
                  ...this.invoiceform,
                  url: 'v1/receipt/update/'+this.invoiceform.id
                }).then(response =>{
                  if(response.data.code == 0){
                    this.invoiceDialogVisible = false
                    this.getinvoicedata()
                  }
                })
          }
        })
      }
    },
    // 删除发票信息
    removeInvoice(row){
      this.$confirm('是否确认删除', {
          confirmButtonText: '是',
          cancelButtonText: '取消',
          // type: 'warning',
          center: true
        }).then(() => {
           removeInvoice({
            url: 'v1/receipt/delete/'+row.id
          }).then(response =>{
            if(response.data.code == 0){
                this.getinvoicedata()
              }
          })
        })
    },


      // 获取寄送地址表格数据  
    getaddressdata(){
      this.loading = true;
      getAddressList().then(response =>{
        if(response.data.code == 0){
          this.addressTableData = response.data.data.list
          this.loading = false;
        }
      })
    },
    // 获取寄送地址默认 
    setaddressDefault(row){
      setaddressDefault({
        url: 'v1/sendaddress/set/'+row.id
      }).then(response =>{
         if(response.data.code == 0){
            this.getaddressdata()
          }
      })
    },
    // 编辑寄送地址
    editaddress(row){
      this.addressTitle = '编辑寄送地址'
      this.addressDialogVisible = true
      this.addressform = Object.assign({}, row)
      console.log(this.addressform)
      this.addressform.phone_codeConfig = this.configs.phone_number_codes
      this.addressform.address = row.address.map(Number)
      this.$nextTick( ()=> {
        this.$refs.addressform.clearValidate()
      })
    },
    // 新增寄送地址
    addresssubmit(){
       if(this.addressTitle != '编辑发票信息'){
          this.$refs['addressform'].validate((valid) => {
            if (valid) {
              addAddress({
                  ...this.addressform
                }).then(response =>{
                  if(response.data.code == 0){
                    this.addressDialogVisible = false
                    this.getaddressdata()
                  }
                })
          }
        })
      }else{
        this.$refs['addressform'].validate((valid) => {
            if (valid) {
              editEmail({
              ...this.addressform,
              url: 'v1/sendaddress/update/'+this.addressform.id
            }).then(response =>{
              if(response.data.code == 0){
                this.addressDialogVisible = false
                this.getaddressdata()
              }
            })
          }
        })
      }
    },
    // 删除寄送地址
    removeaddress(row){
      this.$confirm('是否确认删除', {
          confirmButtonText: '是',
          cancelButtonText: '取消',
          // type: 'warning',
          center: true
        }).then(() => {
           removeaddress({
            url: 'v1/sendaddress/delete/'+row.id
          }).then(response =>{
            if(response.data.code == 0){
                this.getaddressdata()
              }
          })
        })
    },
    //跳转进入
    routerIndex(){
      if(this.$route.query.tabsIndex){
        this.num = this.$route.query.tabsIndex
        console.log("进入的是"+this.num)
        this.tablist.forEach( (i,index) => {
          i.isBool = false
        })
        this.tablist[this.num].isBool = true
        if(this.num==0){
         this.$nextTick(() => {
            this.getdata()
          });
        }
        if(this.num==1){
          this.$nextTick(() => {
            this.getSupplydata()
          });    
        }
        if(this.num==2){
          this.$nextTick(() => {
            this.getinvoicedata()
          }); 
        }
        if(this.num==3){
          this.$nextTick(() => {
            this.getaddressdata()
          }); 
        }
      }
    },

    //配置文件加载
    ConfigUnit(){
      this.phone_codeConfig = this.configs.phone_number_codes
    },

    //fetchList获取所有的国家
    getFetchCounty(){
      fetchList().then( response => {
        if( response.data.code == 0){
          console.log(response.data.data)
        }
      })
    },

    // 查找国家
    getCountryOptions() {
      fetchCountryList().then(response => {
        if (response.data.code == 0) {
          this.$nextTick(function() {
            this.countryOptions = response.data.data
            console.log(this.countryOptions)
            // Code that will run only after the
            // entire view has been rendered
          })
        }
      })
    },

    //getFetchCounty获取省市区
    getFetchProvinces(val){
      console.log('进入')
      fetchCounty({ pid: val }).then( response => {
        this.$nextTick(function() {
          // this.locationOptions = response.data.data
          console.log(response.data.data)
          this.optionsProvinces = response.data.data
        })
      })
    },

    //handleChange
    handleChange(value){
      // console.log(value)
    },

    //handleCountryChange
    handleCountryChange(){

    }

  },
  watch: {
    'targetCountry_id' : {
      handler(val, oldVal) {
        this.getFetchProvinces(val);
      },
      deep: true
    }
  },
  computed:{
    ...mapGetters([
      'configs'
    ])
  },
  mounted() {
    // console.log(this.$route.fullPath)
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
.datasetting {
  .el-dialog__header {
    padding: 50px 20px 10px;
  }
  .el-dialog__title {
      color: #7F8FA4;
  }
  .el-form-item__label{
    color: #909399;
    font-weight: normal;
  }
  .el-table th{
      background:rgba(245,248,250,1);
      text-align: left;
      font-size: 14px;
      height:60px;
      padding:0;
      color:rgba(80,104,140,1);
  }
  .el-table th>.cell{
    padding:0;
  }
  .el-table th:nth-child(1)>.cell{
    padding-left:40px;
  }
  .el-table td {
    height:60px;
    text-align: left;
    font-size: 12px;
  }
  .el-table td div{
    padding:0;
    font-size:14px;
    color:rgba(80,104,140,1);
  }
  .el-table td:nth-child(1) div{
    padding-left:40px;
  }
  .el-button--text{
    color: #50688C;
  }
  .el-form-item__error{
    color: #ffa800;
  }
  .el-button--primary{
    background-color: #FFA800;
    border-color: #FFA800;
  }
  .el-message-box__btns button:nth-child(2) {
      background-color: #FFA800;
    border-color: #FFA800;
  }
  .special-input input{
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
  }
  

  //email-dialog
  .email-dialog{
    .el-input__inner:focus{
      border-color:rgba(245,166,35,1);
    }
  }

  //supply-dialog
  .supply-dialog{
    .el-input-group>.el-input__inner{
      width:175px;
    }
    .dialog-footer{
      .el-button:nth-child(2){
        background:rgba(255,168,0,1);
        color:rgba(255,255,255,1);
      }
    }
    .el-input__inner:focus{
      border-color:rgba(245,166,35,1);
    }
    .el-input-group__prepend .el-input__inner:focus{
      border-color:transparent;
    }
    
  }

  //invoice-dialog
  .invoice-dialog{
    .el-cascader .el-input, .el-cascader .el-input__inner{
      width:410px;
    }
    .el-input__inner:focus{
      border-color:rgba(245,166,35,1);
    }
    .el-textarea__inner:focus{
      border-color:rgba(245,166,35,1);
    }
    .el-input-group__prepend .el-input__inner:focus{
      border-color:transparent;
    }
  }
  
  //address-dialog
  .address-dialog{
    .el-form-item:nth-child(1){
      .el-input__inner{
        width:150px;
      }
    }
    .el-form-item:nth-child(2){
      .el-form-item__label{
        width:51px !important;
      }
      .el-input__inner{
        width:150px;
      }
    }
   .el-form-item:nth-child(3){
     .el-cascader__label{
        width:375px;
      }
   }
   .el-cascader .el-input, .el-cascader .el-input__inner{
      width:221px;
    }

    .el-input__inner:focus{
      border-color:rgba(245,166,35,1);
    }
    .el-textarea__inner:focus{
      border-color:rgba(245,166,35,1);
    }
    .el-input-group__prepend .el-input__inner:focus{
      border-color:transparent;
    }
  }
  
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.datasetting{
  padding:24px 40px 173px 40px; 
    .email-dialog{
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
  .changecolor{
    color: #67C23A;
  }
  .datasetting-content {
    height:731px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    opacity:0.9;
    border:1px solid rgba(230,234,238,1);
    .tab-content {
      // line-height: 200px;
      height: 73px;
      border-bottom: 1px solid #F5F8FA;
      background-color:#ffffff;
      .tabs {
        display: inline-block;
        width: 800px;
        overflow: hidden;
        list-style: none;
        margin: 0;
        padding:0;
        li {
          float: left;
          width: 25%;
          height: 73px;
          line-height: 73px;
          text-align: center;
          font-size: 16px;
          color: #50688c;
          cursor:pointer;
        }
        .active {
          border-bottom: 2px solid #ffa800;
          color: #ffa800;
        }
      }
      .add {
        // display: inline-block;
        float: right;
        margin-right: 40px;
        width: 130px;
        height: 40px;
        vertical-align: top;
        margin-top:5px;
        font-size: 16px;
        background: #67c23a;
        color: #ffffff;
        outline: none;
        i{
          margin-right:15px;
        }
        &:hover {
          color: #ffffff;
        }
        span {
          &::before {
            font-size: 16px;
            margin-right: 15px;
          }
        }
      }
    }
  }
}
</style>

