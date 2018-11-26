<template>
  <div>
    <div class="datasetting-content">
      <div class="tab-content">
         <ul class="tabs">
          <li :class="{active:item.isBool}" v-for="(item,index) in tablist" :key = index @click="tab(item,index)">{{item.content}}</li>
        </ul>
        <el-button class="add" @click="add()"><span>增加</span></el-button>
      </div>
      <el-table
      :data="tableData"
      style="width: 100%"
      v-show="num==0"
      >
      <el-table-column
        label="姓名"
        width="200"
       >
        <template slot-scope="scope">
          {{scope.row.first_name + scope.row.last_name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="email"
        label="电子邮箱"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="添加时间"
        width="200"
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
    <el-table
      :data="supplyTableData"
      style="width: 100%"
      v-show="num==1"
      >
      <el-table-column
        label="供应商名称"
        prop="supplier_name"
        width="200"
       >
      </el-table-column>
      <el-table-column
        label="联系人"
        width="200"
       >
        <template slot-scope="scope">
          {{scope.row.first_name + scope.row.last_name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="联系人手机号码"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="email"
        label="联系人电子邮箱"
        width="200"
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
    <el-table
      :data="invoiceTableData"
      style="width: 100%"
      v-show="num==2"
      >
      <el-table-column
        label="公司名称"
        prop="company_name"
        width="200"
       >
      </el-table-column>
      <el-table-column
        prop="tax_id_number"
        label="纳税人识别号"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="email"
        label="开户银行"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="email"
        label="开户账号"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="email"
        label="手机号码"
        width="200"
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
    <el-table
      :data="addressTableData"
      style="width: 100%"
      v-show="num==3"
      >
      <el-table-column
        label="收件人姓名"
        prop="company_name"
        width="200"
       >
      </el-table-column>
      <el-table-column
        prop="tax_id_number"
        label="收件地址"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="email"
        label="手机号码"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="email"  
        label="固定电话"
        width="200"
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
    </div>
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
    <el-dialog
      :title="supplyTitle"
      :visible.sync="supplyDialogVisible"
      width="500px"
      class="email-dialog"
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
        <el-form-item label="手机号码:" :label-width="labelwidth">
          <el-select  placeholder="请选择" style="width:165px;" class="select-input">
              <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >    
              </el-option>
          </el-select>
          <el-form-item prop="telephone">
            <el-input class="special-input" style="width:165px;margin-left:-10px;" type="text" placeholder="请输入固定电话" v-model="supplyform.telephone"></el-input>
          </el-form-item> 
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
    <el-dialog
      :title="invoiceTitle"
      :visible.sync="invoiceDialogVisible"
      width="500px"
      class="email-dialog"
      top="20vh"
      center>
      <el-form :model="invoiceform" :rules="invoicerules" ref="invoiceform" :inline="true" >
        <el-form-item label="公司名称:" style="" prop="supplier_name" :label-width="labelwidth">
          <el-input placeholder="请输入公司名称" style="width:326px;" v-model="supplyform.supplier_name"></el-input>
        </el-form-item>
        <el-form-item label="纳税人识别号:" style="" prop="supplier_name" :label-width="labelwidth">
          <el-input placeholder="请输入纳税人识别号" style="width:326px;" v-model="supplyform.supplier_name"></el-input>
        </el-form-item>
        <el-form-item label="开户银行:" style="" prop="supplier_name" :label-width="labelwidth">
          <el-input placeholder="请输入开户银行" style="width:326px;" v-model="supplyform.supplier_name"></el-input>
        </el-form-item>
        <el-form-item label="银行账号:" style="" prop="supplier_name" :label-width="labelwidth">
          <el-input placeholder="请输入银行账号" style="width:326px;" v-model="supplyform.supplier_name"></el-input>
        </el-form-item>
        <el-form-item label="单位电话:" :label-width="labelwidth">
          <el-select  placeholder="请选择" style="width:165px;" class="select-input">
              <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >    
              </el-option>
          </el-select>
          <el-form-item prop="telephone">
            <el-input class="special-input" style="width:165px;margin-left:-10px;border-left:none" type="text" placeholder="请输入单位电话" v-model="supplyform.telephone"></el-input>
          </el-form-item> 
        </el-form-item>
        <br>
        <el-form-item label="手机号码:" :label-width="labelwidth">
          <el-select  placeholder="请选择" style="width:165px;" class="select-input">
              <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >    
              </el-option>
          </el-select>
          <el-form-item prop="telephone">
            <el-input class="special-input" style="width:165px;margin-left:-10px;" type="text" placeholder="请输入固定电话" v-model="supplyform.telephone"></el-input>
          </el-form-item> 
        </el-form-item>
        <el-form-item label="银行账号:" style="" prop="supplier_name" :label-width="labelwidth">
          <el-input placeholder="请输入银行账号" style="width:326px;" v-model="supplyform.supplier_name"></el-input>
        </el-form-item>
        <el-form-item label="详细地址:" :label-width="labelwidth" prop="email">
          <el-input type="textarea" placeholder="请输入详细地址" style="width:326px;" v-model="supplyform.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="invoiceDialogVisible = false" class="cancle">取 消</el-button>
        <el-button @click.native="invoicesubmit()" class="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="addressTitle"
      :visible.sync="addressDialogVisible"
      width="500px"
      class="email-dialog"
      top="20vh"
      center>
      <el-form :model="addressform" :rules="addressrules" ref="addressform" :inline="true" >
         <el-form-item label="收件人姓:" style="" prop="first_name" :label-width="labelwidth">
          <el-input style="width:120px;" placeholder="请输入姓" v-model="supplyform.first_name"></el-input>
        </el-form-item>
        <el-form-item label="名:" prop="last_name" label-width="72px">
          <el-input style="width:120px;" placeholder="请输入名" v-model="supplyform.last_name"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="收件地址:" style="" prop="supplier_name" :label-width="labelwidth">
          <el-input placeholder="请输入公司名称" style="width:326px;" v-model="supplyform.supplier_name"></el-input>
        </el-form-item>
        <el-form-item label="详细地址:" :label-width="labelwidth" prop="email">
          <el-input type="textarea" placeholder="请输入详细地址" style="width:326px;" v-model="supplyform.email"></el-input>
        </el-form-item>
        <el-form-item label="收件人手机号:" :label-width="labelwidth">
          <el-select  placeholder="请选择" style="width:165px;" class="select-input">
              <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >    
              </el-option>
          </el-select>
          <el-form-item prop="telephone">
            <el-input class="special-input" style="width:165px;margin-left:-10px;" type="text" placeholder="请输入手机号码" v-model="supplyform.telephone"></el-input>
          </el-form-item> 
        </el-form-item>
        <el-form-item label="收件人固定号:" :label-width="labelwidth">
          <el-select  placeholder="请选择" style="width:165px;" class="select-input">
              <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >    
              </el-option>
          </el-select>
          <el-form-item prop="telephone">
            <el-input class="special-input" style="width:165px;margin-left:-10px;" type="text" placeholder="请输入固定电话" v-model="supplyform.telephone"></el-input>
          </el-form-item> 
        </el-form-item>  
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="invoiceDialogVisible = false" class="cancle">取 消</el-button>
        <el-button @click.native="invoicesubmit()" class="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getdata , addEmail , setDefault , editEmail , removeEmail , getSupplydata , addSupply , editSupply , setSupplyDefault , removeSupply} from "@/api/accountManagement";
export default {
  name: "",
  components: {},
  data() {
    return {
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
        addresses:[]
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
      tableData:[],
      supplyTableData:[],
      num:0,
      emailDialogVisible:false,
      supplyDialogVisible:false,
      invoiceDialogVisible:false,
      addressDialogVisible:true,
      labelwidth:'100px',
      emailTitle:'新增报告接收电子邮箱',
      supplyTitle:'新增供应商信息',
      invoiceTitle:'新增发票信息'
    };
  },
  created(){
    this.getdata()
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
        // this.getSupplydata()
      }
    },
    // 获取电子邮箱表格数据
    getdata(){
      getdata().then(response =>{
        if(response.data.code == 0){
          this.tableData = response.data.data.list
        }
      })
    },
    // 获取供应商信息表格数据
    getSupplydata(){
      getSupplydata().then(response =>{
        if(response.data.code == 0){
          this.supplyTableData = response.data.data.list
        }
      })
    },
    // 弹出dialog
    add(){
      if(this.num==0){
        this.emailDialogVisible = true
        this.emailTitle == '新增报告接收电子邮箱'
      }
      if(this.num==1){
        this.supplyDialogVisible = true
        this.supplyTitle == '新增供应商信息'
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
        this.$refs['supplyform'].validate((valid) => {
            if (valid) {
              editEmail({
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
      this.supplyform = Object.assign({}, row)
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
    

  },
  mounted() {
    // console.log(this.$route.fullPath)
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

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
    background-color: #F5F8FA;
    text-align: center;
}
.el-table td {
    text-align: center;
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
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
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
  border: 1px solid #e6eaee;
  border-radius: 4px;
  margin: 24px 40px 0 20px;
  padding-bottom:100px;
  .tab-content {
    // line-height: 200px;
    height: 50px;
    border-bottom: 1px solid #F5F8FA;
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
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 16px;
        color: #50688c;
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

