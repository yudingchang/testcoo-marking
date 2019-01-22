<template>
  <div class="controlboard">
    <el-row>
      <el-col :span="24">
         <div class="product-information">
          <!-- {{editableTabs2}} -->
          <p>产品信息</p>
          
          <div>
            <el-button
              size="small"
              class="addNewProduct"
              @click="addTab(editableTabsValue2)">
              增加新产品
            </el-button>
            <el-tabs v-model="editableTabsValue2" type="card" closable @tab-remove="removeTab">
              <el-tab-pane
                v-for="(item, index) in editableTabs2"
                :key="index"
                :label="'产品' + (index + 1)"
                :name="'tab' + (index + 1)">
                <div class="content">
                  <el-form ref="item" :model="item" :rules="productrules" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="产品名称" prop="name">
                      <el-input v-model="item.name" placeholder="请输入产品名称" style="width:500px;"/>
                      <div class="delete" @click="removeTabIcon(index)" v-if="editableTabs2.length == 1?false:editableTabs2.length == index+1">
                        <i class="iconfont icon-shanchu_"></i>
                        <p>删除</p>
                      </div>
                      <div class="copy" @click="copy(item,index)">
                        <i class="iconfont icon-fuzhi_"/>
                        <p>复制</p>
                      </div>
                    </el-form-item>
                    <el-form-item label="产品货号">
                      <el-input v-model="item.number" placeholder="请输入产品货号" style="width:500px;"/>
                    </el-form-item>
                    <el-form-item v-for="(val,i) in item.PO" :key="i" label="P.O号">
                      <el-input v-model="val.number" placeholder="请输入P.O号" style="width:155px;"/>
                      <el-input v-model="val.quantity" placeholder="请输入数量" class="input-with-select" style="width:240px;">
                        <el-select slot="append" v-model="val.unit" style="width:100px" placeholder="请选择">
                          <el-option label="件" value="1"/>
                          <el-option label="个" value="2"/>
                          <el-option label="条" value="3"/>
                        </el-select>
                      </el-input>
                      <el-button type="success" icon="el-icon-plus" @click="addPO(val,index)"> P.O 号</el-button>
                      <el-button v-if="i>0" type="danger" icon="el-icon-minus" @click="removePO(val,index,i)"> P.O 号</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <!-- {{item.content}} -->
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="supplier-information">
          <p>供应商信息</p>
          <el-form ref="supplyform" :inline="true" :model="supplyform" :rules="supplyrules" label-width="120px" class="demo-ruleForm">
            <el-form-item label="供应商名称" prop="name">
              <el-select
                v-model="supplyform.name"
                filterable
                allow-create
                default-first-option
                placeholder="请选择供应商名称"
                style="width:565px;" @change="getOtherMessage()">
                <el-option
                  v-for="item in supplyNameList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
            <br>
            <el-form-item label="联系人姓" prop="last_name">
              <el-input v-model="supplyform.last_name" placeholder="请输入联系人姓" style="width:250px;"/>
            </el-form-item>
            <el-form-item label="名" prop="first_name" label-width="50px">
              <el-input v-model="supplyform.first_name" placeholder="请输入联系人名" style="width:250px;"/>
            </el-form-item>
            <br>
            <el-form-item label="手机号码" prop="phone_number">
              <el-input v-model="supplyform.phone_number" placeholder="请输入手机号码" class="input-with-select" style="width:565px;">
                <el-select slot="prepend" v-model="supplyform.phone_code" placeholder="请选择" style="width:150px;">
                  <el-option label="餐厅名" value="1"/>
                  <el-option label="订单号" value="2"/>
                  <el-option label="用户电话" value="3"/>
                </el-select>
              </el-input>
            </el-form-item>
            <br>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="supplyform.email" placeholder="请输入电子邮箱" style="width:565px;"/>
            </el-form-item>
            <br>
            <!-- <el-form-item label="验货地址">
              <el-select v-model="supplyform.addresses" placeholder="请选择" style="width:565px;">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item> -->
            <!-- <br> -->
            <el-form-item label="详细地址" prop="addresses">
              <el-input v-model="supplyform.addresses" type="textarea" placeholder="请输入详细地址" style="width:565px;"/>
            </el-form-item>
          </el-form>
        </div>
        <div class="inspection-information">
          <p>验货基本信息</p>
          <el-form ref="examineform" :model="examineform" :rules="examinerules" label-width="120px" class="demo-ruleForm">
            <el-form-item label="报告语言" prop="report_locale">
              <!-- <el-input style="width:565px;" placeholder="请输入供应商名称"></el-input> -->
              <el-radio-group v-model="examineform.report_locale">
                <el-radio label="en">英文</el-radio>
                <el-radio label="zh_CN">中文</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="报告份数" prop="reports_number">
              <el-input-number v-model="examineform.reports_number" :min="1" />
              <el-tooltip class="item" effect="dark" placement="right">
                <!-- <el-button>右边</el-button> -->
                <div slot="content"><span style="margin-bottom:10px;">1份报告以上（不含1份</span><br><span>可根据指定款号、P.O号出多份不同报告</span></div>
                <i class="el-icon-question icon-answer"/>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="验货类型" prop="inspection_type">
              <el-radio-group v-model="examineform.inspection_type">
                <el-radio label="3">尾期验货<el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content" style="width:400px;"><span style="margin-bottom:10px;">尾期验货</span><br><span>尾期验货在产品100%生产完成 (所有的生产过程都完成,包括生产，组装，独立包装和工厂质量检查), 至少80%装进纸箱, 其余产品正在包装时进行。所有不同工厂的配件都需要集中到验货地点。其目的是通过出货前检验来判断货物是否符合出运要求，适合所有产品。</span></div>
                  <i class="el-icon-question icon-answer"/>
                </el-tooltip></el-radio>
                <el-radio label="2">中期验货
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content" style="width:400px;"><span style="margin-bottom:10px;">中期验货</span><br><span>中期验货在30%-50%产品已经完成，其余产品在生成过程中时进行。其目的是通过中期验货了解在初期验货中发现的问题的改进情况，生产每批次的质量差异及生产流程的改进，适用于需制程管控的产品和在初期验货中发现问题较多的产品。</span></div>
                    <i class="el-icon-question icon-answer"/>
                  </el-tooltip>
                </el-radio>
                <el-radio label="1">初期验货
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content" style="width:400px;"><span style="margin-bottom:10px;">初期验货</span><br><span>初期验货在10%产品已经完成，最少要求完成50个产品时进行，其目的是通过初期验货了解产品设计，性能及工厂的生产工序上是否存在问题，适用于新产品或高风险产品。</span></div>
                    <i class="el-icon-question icon-answer"/>
                  </el-tooltip>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否提供样品" prop="sample_type">
              <el-radio-group v-model="examineform.sample_type">
                <el-radio label="0">不提供样品</el-radio>
                <el-radio label="1">送往或已在供应商<el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content" style="width:200px;"><span style="margin-bottom:10px;">送往或已在供应商</span><br><span>参考样品寄送给供应商或已提供给供应商以备验货时参照</span></div>
                  <i class="el-icon-question icon-answer"/>
                </el-tooltip></el-radio>
                <el-radio label="2">送往测库<el-tooltip class="item" effect="dark" placement="right">
                  <div slot="content" style="width:200px;"><span style="margin-bottom:10px;">送往测库</span><br><span>测库验货员将带到工厂作为验货参照</span></div>
                  <i class="el-icon-question icon-answer"/>
                </el-tooltip></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="examineform.sample_type==2" label="" label-width="120px">
              <el-form style="width:600px;padding:16px 20px;background-color:#ffffff;">
                <el-form-item label="测库收件人:" label-width="100px">
                  <span>小李子</span>
                </el-form-item>
                <el-form-item label="联系电话:" label-width="100px">
                  <span>小李子</span>
                </el-form-item>
                <el-form-item label="地址:" label-width="100px">
                  <span>小李子</span>
                </el-form-item>
              </el-form>

            </el-form-item>
            <el-form-item label="报告接收邮箱" prop="accept_report_emails">
              <el-select v-model="examineform.accept_report_emails" multiple  placeholder="请选择">
                <el-option
                  v-for="item in emailList"
                  :key="item.id"
                  :label="item.email"
                  :value="item.email"/>
              </el-select>
              <el-button type="success" icon="el-icon-plus" @click="emailDialogVisible=true">添加</el-button>
            </el-form-item>
            <el-form-item label="预计验货时间" prop="estimated_dates">
              <el-date-picker
                v-model="examineform.estimated_dates"
                type="dates"
                value-format="yyyy-MM-dd"
                placeholder="选择一个或多个日期"/>
            </el-form-item>
          </el-form>
        </div>
        <div class="other-requirement" >
          <p>其他要求</p>
          <el-form label-width="100px">
            <el-form-item label="要求内容" prop="name">
              <el-input type="textarea" style="width:565px;" placeholder="请输入与验货相关的要求" v-model="requirementText"  maxlength="200"/>
              <span class="countLimmit">{{requirementText.length}}/200</span>
            </el-form-item>
            <el-form-item label="上传附件" prop="name">
              <upLoad :files="data.files"/>
              <!-- <el-upload
              ref="upload"
              :action="UploadUrl()"
              :beforeUpload="beforeAvatarUpload"
              :on-success="handleSuccess"
              :onError="uploadError"
              multiple
              list-type="picture-card"
              method:="post"
              :file-list="fileList">
              <i class="el-icon-upload"></i>
              </el-upload> -->
            </el-form-item>
          </el-form>
          <!-- <div class="requirement-upload clearfix">
            <p>上传附件</p>
            <p class="content">
              
            </p>
          </div> -->
          <!-- <el-form-item prop="name">
              <p class="t1">只支持上传PDF、PPT、Word、Excel、Jpg、jpeg格式,单个附件小于30M</p>
              <p class="tip"><el-checkbox v-model="checked"/><span class="agreement">我已阅读并同意<a href="">《用户协议》</a></span></p>
              <el-button class="btn" @click="order()">
                下单
              </el-button>
          </el-form-item> -->
        </div>
        <div class="uploadLimit"><p>只支持上传PDF、Word、Excel、Jpg、jpeg格式,单个附件小于30M</p></div>
        <!-- 下单 -->
        <div class="orderPlace" v-if="!this.$route.query.orderSet">
          <p><el-checkbox v-model="proptocolAgree">我已阅读并同意</el-checkbox><span class="place">《验货协议》</span></p>
          <el-button type="primary" :disabled="!proptocolAgree" @click="order()">下单</el-button>
        </div>
        <!-- 保存修改订单 -->
        <div class="confirmOrder" v-if="this.$route.query.orderSet">
          <el-button type="primary" @click="keepData">保存</el-button>
          <el-button class="goBack" @click="goBack">返回</el-button>
        </div>
        <!-- 新增报告接收电子邮箱 -->
        <el-dialog
          :visible.sync="emailDialogVisible"
          title="新增报告接收电子邮箱"
          width="500px"
          class="email-dialog"
          top="20vh"
          center>
          <el-form ref="emailform" :model="emailform" :rules="emailrules" :inline="true" >
            <el-form-item :label-width="labelwidth" label="电子邮箱:" style="" prop="email">
              <el-input v-model="emailform.email" style="width:325px;" placeholder="请输入电子邮箱"/>
            </el-form-item>
            <br>
            <el-form-item :label-width="labelwidth" label="姓:" prop="last_name">
              <el-input v-model="emailform.last_name" style="width:120px;" placeholder="请输入姓"/>
            </el-form-item>
            <el-form-item label="名:" prop="first_name" label-width="72px">
              <el-input v-model="emailform.first_name" style="width:120px;" placeholder="请输入名"/>
            </el-form-item>
            <br>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button class="cancle" @click="emailDialogVisible = false">取 消</el-button>
            <el-button class="submit" @click.native="emailsubmit()">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addEmail, getdata } from '@/api/accountManagement'
import {order , getOtherMessage, orderId, orderRevise} from '@/api/order'
import upLoad from '@/components/Upload'
export default {
  name: 'controlboard',
  components: {
    upLoad
  },
  data() {
    return {
      editableTabsValue2: 'tab1',
      labelwidth: '100px',
      checked: '',
      data: {
        id: null,
        target: {},
        inspection_target: {},
        reports: [],
        files: []
      },
      emailList: [],
      supplyNameList: [{
        value: '1',
        label: '支付宝'
      }],
      value10: [],
      editableTabs2: [
        {
          number: '',
          name: '',
          title: '',
          PO: [
            {
              number: '',
              quantity: '',
              unit: ''
            }
          ]
        }
      ],
      productrules: {
        name: [{
          required: true, message: '请输入产品名称', trigger: 'blur'
        }]
      },
      supplyrules: {
        name: [{
          required: true, message: '请输入供应商名称', trigger: 'blur'
        }],
        first_name: [{
          required: true, message: '请输入联系人名', trigger: 'blur'
        }],
        last_name: [{
          required: true, message: '请输入联系人姓', trigger: 'blur'
        }],
        phone_number: [{
          required: true, message: '请输入联系人手机号', trigger: 'blur'
        }],
        email: [{
          required: true, message: '请输入电子邮箱', trigger: 'blur'
        }]
      },
      examinerules: {
        report_locale: [{
          required: true, message: '请输入报告语言', trigger: 'blur'
        }],
        reports_number: [{
          required: true, message: '请输入报告份数', trigger: 'blur'
        }],
        inspection_type: [{
          required: true, message: '请输入验货类型', trigger: 'blur'
        }],
        sample_type: [{
          required: true, message: '请选择样品类型', trigger: 'blur'
        }]
      },
      emailrules: {
        email: [{
          required: true, message: '请输入电子邮箱', trigger: 'blur'
        }],
        first_name: [{
          required: true, message: '请输入名', trigger: 'blur'
        }],
        last_name: [{
          required: true, message: '请输入姓', trigger: 'blur'
        }]
      },
      supplyform: {
        name:'',
        first_name:'',
        last_name:'',
        phone_number:'',
        email:''
      },
      examineform: {
        report_locale: 'en',
        reports_number: '',
        inspection_type: '3',
        sample_type: '0'
      },
      tabIndex: 1,
      gender: '',
      radio2: '',
      emailDialogVisible: false,
      value14: '',
      ruleForm: {

      },

      emailform: {
        email: '',
        first_name: '',
        last_name: ''
      },


      //uploadForm
      uploadForm: [],

      //上传实例fileList
      fileList: [],

      //proptocolAgree下单
      proptocolAgree: false,

      //requirementText要求内容
      requirementText: '',

    }
  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.fullPath
    // }
  },
  watch: {
    data: {
      // handler: function(newData, oldData) {
      //   this.$store.commit('setOrderData', newData)
      // },
      // deep: true
    }
  },
  created() {
    this.getEmailList()
    this.getOrderIdData('/'+this.$route.query.orderId)
  },
  mounted() {
    // console.log(this.$route.fullPath)
  },
  methods: {
    copy(item, index) {
      const newTabName = 'tab' + ++this.tabIndex + ''
      console.log(newTabName)
      this.editableTabs2.push(item)
      this.editableTabsValue2 = newTabName
    },
    addTab(targetName) {
      const newTabName = 'tab' + ++this.tabIndex + ''
      console.log(newTabName)
      this.editableTabs2.push(
        {
          number: '',
          name: '',
          title: '产品' + this.tabIndex,
          PO: [
            {
              number: '',
              quantity: '',
              unit: ''
            }
          ]
        },
      )
      this.$nextTick(() => {
        this.editableTabsValue2 = 'tab' + (this.editableTabs2.length)
      })
    },
    //removeTab通过tabs的删除tabs产品
    removeTab(index) {
      console.log(index)
      this.editableTabs2.splice((index.replace('tab', '') - 1), 1)
      this.editableTabsValue2 = 'tab' + --this.tabIndex
    },
    //removeTabIcon通过Iconfont删除tabs产品
    removeTabIcon(index) {
      console.log(index)
      this.editableTabs2.splice( index, 1 )
      this.editableTabsValue2 = 'tab' + --this.tabIndex
    },
    addPO(val, index) {
      this.editableTabs2[index].PO.push({
        number: '',
        quantity: '',
        unit: ''
      })
    },
    removePO(val, index, i) {
      this.editableTabs2[index].PO.splice(
        i, 1
      )
    },
    emailsubmit() {
      this.$refs['emailform'].validate((valid) => {
        if (valid) {
          addEmail({
            ...this.emailform
          }).then(response => {
            if (response.data.code == 0) {
              this.emailDialogVisible = false
              this.getEmailList()
            }
          })
        }
      })
    },
    // 获取电子邮箱列表
    getEmailList() {
      getdata().then(response => {
        if (response.data.code == 0) {
          this.emailList = response.data.data.list
          console.log(this.emailList)
        }
      })
    },
    // 根据供应商名称获取其他信息
    getOtherMessage() {
      getOtherMessage({
        "url": "/v1/supplier/name/" + this.supplyform.name,
      }).then(response => {
        if (response.data.code == 0) {
          this.supplyform = response.data.data.list
        }else{
          // this.supplyform = {}
        }
      })
    },
    //下单
    order(){
      var _this =this
      var p1=new Promise(function(resolve, reject) {
        
        _this.$refs['supplyform'].validate((valid) => {
            if(valid){
              resolve();
            }
          })
        });
        
        var p2=new Promise(function(resolve, reject) {
             _this.$refs['examineform'].validate((valid) => {
              if(valid){
                resolve();
              }
            })
        });
        
        // var p3=new Promise(function(resolve, reject){
        //     _this.$refs['editableTabs2'].validate((valid) => {
        //       if (valid) {
        //         resolve();
        //       } 
        //     })
        // });

        Promise.all([p2,p1]).then(function(){
          order({
            ..._this.examineform,
            products:_this.editableTabs2,
            supplier:_this.supplyform,
            factories:_this.factories,
            files:_this.fileList
          }).then(response =>{
            if(response.data.code == 0){
              _this.$router.push({path: 'checkoutSuccess', query: {created_at:response.data.data.created_at}})
            }
          })
        });

    },

    //amputate删除
    // amputate(item,index){
    //   this.editableTabs2.splice( index, 1 )
    // },
    //删除
    // removeTabNew(targetName) {
    //   console.log("jinru")
    //     let tabs = this.editableTabs2;
    //     let activeName = this.editableTabsValue2;
    //     if (activeName === targetName) {
    //       tabs.forEach((tab, index) => {
    //         if (tab.name === targetName) {
    //           let nextTab = tabs[index + 1] || tabs[index - 1];
    //           if (nextTab) {
    //             activeName = nextTab.name;
    //           }
    //         }
    //       });
    //     }
    //     this.editableTabsValue2 = activeName;
    //     this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
    //   },


    //判断this.$route.query.orderId是否存在
    getOrderIdData(idValue){
      if( this.$route.query.orderId ){
        orderId(idValue).then(response => {
          console.log("进入请求ID")
          console.log(response)
           if( response.data.code == 0 ){
             console.log("通过ID拿到了之前所有的数据")
             console.log(response.data.data)
             this.supplyform = response.data.data.supplier
             this.editableTabs2 = response.data.data.products
             this.examineform.report_locale = response.data.data.report_locale
             this.examineform.reports_number = response.data.data.reports_number
             this.examineform.inspection_type = response.data.data.inspection.inspection_type
             this.examineform.sample_type = response.data.data.inspection.sample_type
             
             console.log(this.examineform.report_locale)
           }
        })
      }else{
        console.log("这次请求没有接受到ID")
      }
    },

    //uploadUrlUpload上传路径
    // UploadUrl(){
    //   return process.env.BASE_API + 'v1/upload'
    // },

    //handleAvatarSuccess上传成功要处理的
    // handleSuccess(response, file, fileList){
    //   console.log(fileList)
      
    // },

    //uploadError上传失败了
    // uploadError(response, file, fileList){
    //   console.log("失败了++++++")
    // },

    //beforeAvatarUpload上传前文件验证
    // beforeAvatarUpload(file){
    //   const extension = file.name.split('.')[1] === 'xls'
    //   const extension2 = file.name.split('.')[1] === 'xlsx'
    //   const extension3 = file.name.split('.')[1] === 'doc'
    //   const extension4 = file.name.split('.')[1] === 'docx'
    //   const extension5 = file.name.split('.')[1] === 'ppt'
    //   const extension6 = file.name.split('.')[1] === 'pptx'
    //   const extension7 = file.name.split('.')[1] === 'jpg'
    //   const extension8 = file.name.split('.')[1] === 'jpeg'
    //   const extension9 = file.name.split('.')[1] === 'pdf'
    //   const isLt2M = file.size / 1024 / 1024 < 30
    //   if (!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7 && !extension8 && !extension9) {
    //     this.$message('上传附件只能是 xls、xlsx、doc、docx 、ppt、pptx、jpg、jpeg、pdf格式!')
    //   }
    //   if (!isLt2M) {
    //    this.$message('上传单个附件大小不能超过 30MB!')
    //   }
    //   return extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8 || extension9 && isLt2M
    // },

    //keepData修改保存数据
    keepData(){
      console.log("修改保存数据")
      var _this =this
      var p1=new Promise(function(resolve, reject) {
        
        _this.$refs['supplyform'].validate((valid) => {
            if(valid){
              resolve();
            }
          })
        });
        
        var p2=new Promise(function(resolve, reject) {
             _this.$refs['examineform'].validate((valid) => {
              if(valid){
                resolve();
              }
            })
        });      
        Promise.all([p2,p1]).then(function(){
          orderRevise({
            ..._this.examineform,
            products:_this.editableTabs2,
            supplier:_this.supplyform,
            factories:_this.factories,
            files:_this.fileList,
            orderId:_this.$route.query.orderId
          }).then(response =>{
            
            if(response.data.code == 0){
              console.log("返回数据")
              _this.$router.push({ path: '/orderManagement/examineGood' })
            }
          })
        });
    },

    //goBack返回上一级路由
    goBack(){
      this.$router.go(-1)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.controlboard{
  .el-radio + .el-radio {
    margin-left: 40px;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #ffa500;
    background: #ffa500;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #ffa500;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #c0c4cc;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #ffa800;
    border-color: #ffa800;
  }
  .el-tabs__item.is-active {
    color: #ffa800;
    height: 40px;
    line-height: 40px;
    position: relative;
    background-image: none;
    background-color: #ffffff;
    top: 0;
    width: 100px;
    text-align: center;
  }
  .el-tabs__nav-wrap {
    margin-bottom: 0;
  }
  .el-tabs__item {
    margin-right: 10px;
    border: 1px solid #e6eaee;
    line-height: 35px;
    height: 35px;
    // background-color: #ffffff;
    border-radius: 4px;
    position: relative;
    color: #768caa;
    top: 5px;
    background-image: linear-gradient(0deg, #f4f7fa 0%, #ffffff 100%);
  }
  .el-tabs__item:hover {
    color: #ffa800;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
    border-left: 1px solid #e6eaee;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 50px;
  }
  .el-tabs__header {
    margin: 0;
    // width: 83%;
  }
  .el-form-item__label{
      font-weight: normal;
      color: #7C8FA6;
  }
  .el-input--medium {
      vertical-align: middle;
  }
  .el-tabs--card>.el-tabs__header {
      border-bottom: none;
      width: 76%;
  }
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
  .el-tooltip__popper {
      line-height: 1.5;
  }
  .popper__arrow {
      border-right-color: rgba(144,147,153,0.90) !important;
  }
  .el-button--medium{
    vertical-align: middle;
  }
  .el-select {
    vertical-align: middle;
  }

  //orderPlace
  .orderPlace{
    .el-checkbox{
    .el-checkbox__label{
      color:rgba(102,102,102,1);
    }
    }
    .place{
      color:rgba(255,168,0,1);
      text-decoration: underline;
      cursor: pointer;
    }
    .el-button--primary{
      width:200px;
      height:40px;
      background:rgba(255,168,0,1);
      border-radius:4px;
      border:none;
    }
  }

  //confirmOrder
  .confirmOrder{
    padding-left:140px;
    .goBack {
      width:200px;
      height:40px;
      border-radius:4px;
      border:1px solid rgba(151,151,151,1);
    }
    .goBack:hover{
      color:rgba(255,168,0,1);
    }
    .el-button--primary{
      width:200px;
      height:40px;
      background:rgba(255,168,0,1);
      border-radius:4px;
      border:none;
    }
  }

  //other-requirement
  .other-requirement{
    .el-form-item:nth-child(1){
      .el-form-item__label{
        font-size:14px;
        color:rgba(124,143,166,1);
        margin-right:50px;
        padding:0;
        text-align: right;
        width:88px !important;
      }
      .el-form-item__content{
        position:relative;
        .el-textarea__inner{
          width:700px;
          height:200px;
          border-radius:3px;
          border:1px solid rgba(192,196,204,1);
          padding:10px 16px;
          background:rgba(243,246,249,1);
        }
        .countLimmit{
          position:absolute;
          bottom:10px;
          left:666px;
          font-size:16px;
          color:rgba(144,147,153,1);
          display:inline-block;
          width:70px;
          height:21px;
          line-height: 21px;
          text-align: center;
        }
      }
    }
    .el-form-item:nth-child(2){
      .el-form-item__label{
        font-size:14px;
        color:rgba(124,143,166,1);
        margin-right:50px;
        padding:0;
        text-align: right;
        width:88px !important;
        padding-top:20px;
      }
      .upload-container{
        padding:20px;
        background:rgba(255,255,255,1);
        border-radius:4px;
        border:1px solid rgba(223,227,233,1);
        margin-left:38px;
        max-width:1200px;
        .image-preview{
          margin:0;
        }
        .successBorder{
          margin-right:20px;
          margin-bottom:20px;
        } 
      }
    }
  }
}
</style>


<style rel="stylesheet/scss" lang="scss" scoped>
.controlboard {
  padding:32px 0 92px 100px;
  .icon-answer{
    color:#7F8FA4;
    font-size:16px;
    margin-left:8px;
  }
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
  .product-information {
    position: relative;
    width: 85%;
    .addNewProducts{
      cursor: pointer;
      position: absolute;
      right: 0;
    }
    > p {
      font-size: 16px;
      font-weight: bold;
      color: #50688c;
      margin-bottom:24px;
    }
    .addNewProduct{
      display:inline-block;position:absolute;cursor:pointer;right: 0;z-index:5;top:55px;background-image: linear-gradient(0deg, #f4f7fa 0%, #ffffff 100%)
    }
    .content {
      width: 100%;
      padding: 30px 40px;
      background-color: #ffffff;
      border-top:1px solid #E6EAEE;
      .delete{
        display: inline-block;
        font-size:10px;
        line-height:36px;
        height: 36px;
        vertical-align:middle;
        cursor: pointer;
        color:rgba(103,194,58,1);
        margin-left:47px;
        p{
              margin:0;
              padding:0;
              position: relative;
              top:-28px;
              text-align:center;
          }
          i{
              position: relative;
              display: inline-block;
              width: 24px;
              top:-10px;
              text-align:center;
          }
      }
      .copy{
          display: inline-block;
          color:#7C8CA5;
          font-size:10px;
          line-height:36px;
          height: 36px;
          vertical-align:middle;
          margin-left:40px;
          cursor: pointer;
          p{
              margin:0;
              padding:0;
              position: relative;
              top:-28px;
              text-align:center;
          }
          i{
              position: relative;
              display: inline-block;
              width: 24px;
              top:-10px;
              text-align:center;
          }
      }
    }
  }
  .supplier-information{
    margin: 32px 0 0 0;
    >p{
      font-size: 16px;
      font-weight: bold;
      color: #50688c;
      margin-bottom:24px;
    }
  }
  .inspection-information{
    margin: 32px 0 0 0;
    >p{
      font-size: 16px;
      font-weight: bold;
      color: #50688c;
      margin-bottom:24px;
    }
  }
  .other-requirement{
     margin: 32px 0 0 0;
    >p{
      height:29px;
      font-size:22px;
      color:rgba(80,104,140,1);
      line-height:29px;
      margin-bottom:25px;
    }

    .t1{
      color: #909399;
      text-align: left;
    }
    .tip{
      color:#666666;
        .agreement{
          margin-left:12px;
        }
      }
    .btn{
      width: 200px;
      height: 40px;
      background-color:#FFA800;
      color:#FFFFFF;
    }

    //requirement-upload
    .requirement-upload{
      padding-left:26px;
      height:166px;
      p{
        float:left;
      }
      p:nth-child(1){
        padding-top:20px;
        height:21px;
        font-size:14px;
        color:rgba(124,143,166,1);
        line-height:21px;
        margin-right:50px;
      }
      p:nth-child(2){
        padding:26px 78px 20px 20px;
        border-radius:3px;
        max-width:1200px;
        border:1px solid rgba(192,196,204,1);
        word-wrap: break-word;
        word-break: normal;
        background:rgba(255,255,255,1);
      }
      .el-upload--picture-card{
        
      }
      .el-upload--picture-card i{
        font-size:46px;
        color:rgba(255,168,0,1);
      }
      .el-upload__text{
        width:76px;
        margin-left:27px;
        height:28px;
        font-size:10px; 
        font-weight:500;
        color:rgba(127,143,164,1);
        line-height:14px;
      
      }
    }
  }

  //uploadLimit
  .uploadLimit{
    height:21px;
    font-size:14px;
    color:rgba(144,147,153,1);
    line-height:21px;
    padding-left:140px;
    margin-bottom:25px;
  }

  //orderPlace
  .orderPlace{
    padding-left:140px;
    p:nth-child(1){
      margin-bottom:8px;
    }
  }
}
</style>

