<template>
  <div class="pay">
        <p class="t1">注：如果您对我们的报价有疑惑，请联系测库工作人员</p>
        <el-table
            :data="tableData"
            style="width: 100%" class="tableData">
            <el-table-column
                prop="date"
                label="订单号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="产品名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="验货地区">
            </el-table-column>
            <el-table-column
                prop="address"
                label="工作量">
            </el-table-column>
            <el-table-column
                prop="address"
                label="订单金额">
            </el-table-column>
        </el-table>         
        <el-form class="form-content" label-width="100px">
            <el-form-item label="付款币种"> 
                <el-radio-group v-model="radio">
                    <el-radio :label="3">人民币</el-radio>                                                              
                    <el-radio :label="6">美元</el-radio>                                                
                </el-radio-group>
            </el-form-item>
            <el-form-item label="发票类型"> 
                <el-radio-group v-model="radio">
                    <el-radio :label="3">不开发票</el-radio>
                    <el-radio :label="6">增值税发票</el-radio>
                    <el-radio :label="9">普通发票</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="开票公司"> 
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="item in invoiceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="success" icon="el-icon-plus" @click="addInvoiceCompany()">新增开票公司</el-button>
            </el-form-item>
            <el-form-item label="发票收件人"> 
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="item in addressee"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="success" icon="el-icon-plus">新增寄送地址</el-button>
            </el-form-item>
            <el-form-item label="应付金额"> 
                <span class="money-text">{{shouldpay}}</span>
            </el-form-item> 
        </el-form>
        <el-dialog title="新增发票信息" :visible.sync="dialogFormVisible" width="600px" center>
            <el-form :model="form" :rules="rules" ref="form" :label-width="formLabelWidth">
                <el-form-item label="公司名称：" prop="company_name">
                    <el-input v-model="form.company_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号：" prop="tax_id_number">
                    <el-input v-model="form.tax_id_number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开户银行：" prop="bank">
                    <el-input v-model="form.bank" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="银行账号：" prop="bank_account">
                    <el-input v-model="form.bank_account" autocomplete="off"></el-input>
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
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="详细地址：" prop="detailed_address">
                    <el-input type="textarea" v-model="form.detailed_address" autocomplete="off"></el-input>
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
                    <el-input v-model="addressform.last_name"  style="width:160px"></el-input>
                </el-form-item>
                <el-form-item label="名：" prop="company_name" label-width="40px">
                    <el-input v-model="addressform.first_name"  style="width:160px"></el-input>
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
  </div>
</template>

<script>
import {addInvoice,addAddress} from "@/api/accountManagement";
export default {
  name: "",
  components: {},
  data() {
    return {
      tableData: [],
      total: 0,
      shouldpay: "¥799.00",
      radio: "",
      listLoading: true,
      dialogFormVisible:false,
      addressdialogFormVisible:true,
      value:'',
      form:{},
      rules:{
            company_name:[{ required: true, message: '请输入公司名称', trigger: 'blur' }],    
            tax_id_number:[{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],  
            bank:[{ required: true, message: '请输入开户银行', trigger: 'blur' }],  
            bank_account:[{ required: true, message: '请输入银行账号', trigger: 'blur' }],  
            telephone:[{ required: true, message: '请输入单位电话', trigger: 'blur'}],
            address:[{ required: true, message: '请输入单位地址', trigger: 'blur'}],
            detailed_address:[{ required: true, message: '请输入详细地址', trigger: 'blur'}],
      },
      addressform:{},
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
          vulue: "",
          label: ""
        }
      ],
      addressee: [
        {
          vulue: "",
          label: ""
        }
      ],
      listQuery: {
        page: 1,
        limit: 20
      }
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
  methods:{
      addInvoiceCompany(){
          this.dialogFormVisible = true
      },
      submit(){
          this.$refs['form'].validate((valid) => {
            if (valid) {
                addInvoice({
                    ...this.form
                }).then(response => {
                    if(response.data.code == 0){
                        this.dialogFormVisible = false
                    }
                })
            }
          })
          
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
      }
  },
  mounted() {
    // console.log(this.$route.fullPath)
  }
};
</script>
<style>
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
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
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
  }
}
</style>

