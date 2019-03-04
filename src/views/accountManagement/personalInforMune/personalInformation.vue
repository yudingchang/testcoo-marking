<template>
  <div class="personalInformation">
      <!-- 信息显示界面  -->
      <div v-if="!personal" v-loading="loading">
          <div class="content">
                <div class="left">
                    <span class="gender">
                        <!-- <span :class="{male:male,female:female,neuter:neuter}"></span> -->
                        <img :src="fitter.avatar" alt="">
                    </span>
                </div>
                <div class="right">
                    <div class="right-content">
                        <div class="left-fixed">姓名</div>
                        <div class="right-fixed">
                            <span v-if="fitter.name!=''">{{fitter.name}}</span>
                            <span class="empty" v-else>未设置</span>
                        </div>
                    </div>
                    <div class="right-content">
                        <div class="left-fixed">性别</div>
                        <div class="right-fixed">
                            <span v-if="fitter.gender != null">{{fitter.gender == 'male'?'男':'女'}}</span>
                            <span class="empty" v-else>未设置</span>
                        </div>
                    </div>
                    <div class="right-content">
                        <div class="left-fixed">部门</div>
                        <div class="right-fixed">
                            <span v-if="fitter.department != null">{{fitter.department}}</span>
                            <span class="empty" v-else>未设置</span>
                        </div>
                    </div>
                    <div class="right-content">
                        <div class="left-fixed">职位</div>   
                        <div class="right-fixed">
                            <span v-if="fitter.position != null">{{fitter.position}}</span>
                            <span class="empty" v-else>未设置</span>
                        </div>
                    </div>                                                                
                    <div class="right-content">
                        <div class="left-fixed">固定电话</div>
                        <div class="right-fixed">
                            <span v-if="fitter.telephone != null">{{fitter.telephone}}</span>
                            <span class="empty" v-else>未设置</span>
                        </div>
                    </div>  
                    <div class="right-content">
                        <div class="left-fixed">Skype</div>
                        <div class="right-fixed">
                            <span v-if="fitter.skype != null">{{fitter.skype}}</span>
                            <span class="empty" v-else>未设置</span>
                        </div>
                    </div>  
                    <div class="right-content">
                        <div class="left-fixed">QQ</div>
                        <div class="right-fixed">
                            <span v-if="fitter.qq != null">{{fitter.qq}}</span>
                            <span class="empty" v-else>未设置</span>
                        </div>
                    </div>   
                    <div class="right-content">
                        <div class="left-fixed">微信</div>
                        <div class="right-fixed">
                            <span v-if="fitter.wechat != null">{{fitter.wechat}}</span>
                            <span class="empty" v-else>未设置</span>
                        </div>
                    </div>                                                                                                   
                </div>   
            </div>
            <div class="edit" @click="editPersonalMessage()">修改</div>
      </div>
  </div>
</template>

<script>
import {getpersonalInformation , savePersonalInformation} from "@/api/accountManagement";
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import store from '../../../store/'
export default {
  name: "personalInformation",
  components: {},
  data() {
    return {
        // loading  过渡动画
        loading:false,
        // imageUrl: '',
        // userInfo: {
        //     avatar: 'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=62d46c39067b020818c437b303b099b6/d4628535e5dde7119c3d076aabefce1b9c1661ba.jpg'
        // },
        // action: {
        //     type: Boolean,
        //     default: true
        // },
        // uploadingFiles: [],
        // phone_codeConfig:'',
        // options: [
        //     {
        //     value: "86",
        //     label: "86"
        //     },
            // {
            //   value: "中国大陆 +86",
            //   label: "中国大陆 +86"
            // },
            // {
            //   value: "中国大陆 +86",
            //   label: "中国大陆 +86"
            // },
            // {
            //   value: "中国大陆 +86",
            //   label: "中国大陆 +86"
            // }
        // ],
        // value: "",
        male: true,
        female:false,
        neuter:false,
        radio2: 1,
        id:3,
        editMessage: false,
        normalStatu:true,
        uploadUrl: process.env.BASE_API +'v1/upload',
        fitter:{
            name:'',
            first_name:'',
            last_name:'',
            gender:'',
            department:'',
            position:'',
            telephone:'',
            telephone_code:'',
            skype:'',
            qq:'',
            wechat:'',
            avatar:''
        },
        // personal:false
        show:this.$store.state.user.personal
        
    };
  },
  created() {
      this.getpersonalInformation();
    //   this.uploadUrl = process.env.BASE_API + 'v1/inspectioninfo/'+this.id+'/upload'
    //   this.uploadHeaders = { Authorization: 'Bearer ' + getToken() }
    //   console.log( { Authorization: 'Bearer ' + getToken() })
    console.log(this.$store.state.user.personal)
    this.ConfigUnit();
    
  },
  computed: {
    // uploadUrl() {
    //   return process.env.BASE_API + 'v1/inspectioninfo/'+this.id+'/upload'
    // },
    uploadHeaders() {
      return { Authorization: 'Bearer ' + getToken() }
    }
  },
  methods:{
    //   图片上传相关
     handleBeforeUpload(file) {
      file.percent = 0
      this.uploadingFiles.push(file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    uploadOnProgress(e, file) {
      const index = this.uploadingFiles.findIndex(uploadingFile => uploadingFile.uid === file.uid)
      this.uploadingFiles[index].percent = Math.round(e.percent)
      this.$set(this.uploadingFiles, index, file)
    },
    handleSuccess(response, file, fileList) {
      const index = this.uploadingFiles.findIndex(uploadingFile => uploadingFile.uid === file.uid)
      this.uploadingFiles.splice(index, 1)
      if (response.code === 0) {
        this.files.push(response.data)
      }
    },
    //   获取个人信息
    getpersonalInformation(){
        console.log("进入请求")
        this.loading = true;
        getpersonalInformation().then(response =>{
            if(response.data.code == 0){
                this.fitter = response.data.data
                this.fitter.name = this.fitter.first_name + this.fitter.last_name
                if( response.data.data.avatar == null){
                  this.fitter.avatar = 'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=62d46c39067b020818c437b303b099b6/d4628535e5dde7119c3d076aabefce1b9c1661ba.jpg';
                }
                this.loading = false
                console.log(this.fitter)
            }
        })
    },
    //editPersonalMessage修改
    editPersonalMessage(){  
        this.$router.push({ path: 'personalInforEdit'})
    },
    // 将头像显示
    handleFile: function (e) {
      let $target = e.target || e.srcElement
      let file = $target.files[0]
      var reader = new FileReader()
      reader.onload = (data) => {
        let res = data.target || data.srcElement
        // this.fitter.avatar = res.result
      }
      reader.readAsDataURL(file)
    },
    // 保存个人信息
    save(){
        savePersonalInformation(this.fitter).then(response =>{
            if(response.data.code == 0){
                console.log("保存成功")
                // this.personal = true
                // store.dispatch('GetUserInfo')
                this.$store.commit('SET_PERSONAL', false)
                console.log(this.$store.state.user.personal)
                this.getpersonalInformation()
            }
        })
    },

    //handleAvatarSuccess
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        console.log(file)
        this.fitter.avatar = file.response.data
    },

    //beforeAvatarUpload
    beforeAvatarUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
    }
    if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
    }
    return isJPG && isLt2M;
    },
    //配置文件加载
    ConfigUnit(){
      this.phone_codeConfig = this.configs.phone_number_codes
    },
    

  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.fullPath
    // }
    ...mapGetters([
        'personal',
        'configs'
    ])
  },
  mounted() {
    // console.log(this.$route.fullPath)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" >
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
.el-select .el-input.is-focus .el-input__inner {
  border-color: #dfe3e9;
}
.el-select-dropdown__item.selected {
  color: #164061;
  font-weight: 700;
}
.special-input input{
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
}
// .el-radio__label {
//     font-size: 14px !important;
//     padding-left: 10px;
// }

.male {
  background: url("/static/image/male.png") no-repeat;
  vertical-align: middle;
  background-size: 100% 100%;
  width: 120px;
  height: 120px;
  display: inline-block;
}
.female {
  background: url("/static/image/female.png") no-repeat;
  vertical-align: middle;
  background-size: 100% 100%;
  width: 120px;
  height: 120px;
  display: inline-block;
}
.gender{
    width:120px;
    height: 120px;
}
.gender img{
  width:120px;
  height:120px;
  border-radius:60px
}
.neuter {
  background: url("/static/image/neuter.png") no-repeat;
  vertical-align: middle;
  background-size: 100% 100%;
  width: 120px;
  height: 120px;
  display: inline-block;
}
.personalInformation {
  margin: 40px 0 0 100px;
  color: #164061;
  font-size: 14px;
  .content {
    overflow: hidden;
    // input {
    //   border: 1px solid #dfe3e9;
    //   outline: none;
    //   box-shadow: none;
    //   color: #164061;
    //   height: 30px;
    //   line-height: 30px;
    //   padding-left: 14px;
    //   border-radius: 4px;
    // }
    input::-webkit-input-placeholder {
      color: #909399;
    }
    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #909399;
    }
    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #909399;
    }
    input:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #909399;
    }
    .left {
      float: left;
      .hiddenInput{
        opacity: 0;
        } 
    .inputFill{
       width: 120px;
       margin: 0 auto; 
       position: relative;
       p{
            text-align: center;
            font-size: 16px;
            color: #7C8FA6;
       }
       .hiddenInput{
           position: absolute;
           top: 0;
           width: 120px;
           left: 0;
           opacity: 0;
       }
    } 
        // p{
        //     width: 120px;
        //     text-align: center;
        //     font-size: 16px;
        //     color: #7C8FA6;
        // }
        .avatar-uploader{
            img{
                width:120px;
                height:120px;
                border-radius:50%;
            }
        }
    }
    .right {
      float: left;
      margin-left: 70px;
      color: #7F8FA4;
      .right-content {
        overflow: hidden;
        height: 36px;
        line-height: 36px;
        margin-bottom: 30px;
        .left-fixed {
          float: left;
          width: 80px;
          font-size: 14px;
          color: #7f8fa4;
        }
        .right-fixed {
          float: left;
          margin-left: 34px;
          .empty{
            color: #909399;
          }
          .select-input {
            input {
              color: #ffa500;
            }
          }
        }
      }
    }
  }
  .save {
    margin-left: 305px;
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
  .edit{
    margin-left: 190px;
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
  /*84 = navbar + tags-view = 50 +34 */
  /* min-height: calc(100vh - 84px);
  width: 100%;
  position: relative;
  overflow: hidden; */
}
</style>

