<template>
  <div>
    <div class="examine-good">
      <div class="tab-content">
         <ul class="tabs">
          <li :class="{active:item.isBool}" v-for="(item,index) in tablist" :key = index @click="tab(item,index)">{{item.content}}</li>
        </ul>
        <el-button class="add" @click="add()"><span>增加</span></el-button>
      </div>
    </div>
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
.examine-good {
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
        width: 14.2%;
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

