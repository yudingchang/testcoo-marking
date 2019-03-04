<template>
    <div class="personalInforEdit" v-loading="loading">
        <el-row>
            <el-col :span="12">
                <!-- 信息编辑界面                                      -->
                <div :model="fitter">
                        <div class="content">
                            <!-- {{ fitter }} -->
                            <!-- <el-form ref="form" :model="fitter" label-width="80px"> -->
                            <div class="left">                                                                          
                                <!-- <div class="gender">                                 
                                    <img :src="fitter.avatar"/>
                                    <span :class="{male:male,female:female,neuter:neuter}"></span>
                                </div> -->
                                <!-- <el-upload
                                    v-if="action"
                                    :on-remove="handleRemove"
                                    :on-progress="uploadOnProgress"
                                    :on-success="handleSuccess"
                                    :before-upload="handleBeforeUpload"
                                    :show-file-list="false"
                                    :action="uploadUrl"
                                    :headers="uploadHeaders"
                                    drag
                                    multiple
                                    class="image-preview shadow-sm"
                                    list-type="picture-card">
                                    <i class="el-icon-plus"/>
                                </el-upload> -->
                                <!-- <div class="inputFill">
                                    <p>上传头像</p>
                                    <input type="file" accept="image/*" @change="handleFile" class="hiddenInput"/>
                                </div>       -->
                                <el-upload
                                class="avatar-uploader"
                                :action='uploadUrl'
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                                <div v-else >
                                    <img src="/static/image/male.png" style="width:120px;height:120px;">
                                    <p style="color:#7C8FA6;font-size:14px">上传头像</p>
                                </div>
                                </el-upload>
                            </div>
                            <div class="right">
                                <div class="right-content">
                                    <div class="left-fixed">姓</div>
                                    <div class="right-fixed">
                                        <el-input style="width:159px;" type="text" placeholder="请输入姓" v-model="fitter.first_name"></el-input>
                                        <span style="margin-left:25px;">名：</span>
                                        <el-input style="width:159px;" type="text" placeholder="请输入名" v-model="fitter.last_name"></el-input>
                                    </div>
                                </div>
                                <div class="right-content">
                                    <div class="left-fixed">性别</div>
                                    <div class="right-fixed">
                                        <el-radio-group v-model="fitter.gender">
                                            <el-radio label="male">男</el-radio>
                                            <el-radio label="female">女</el-radio>
                                        </el-radio-group>
                                    </div>
                                </div>
                                <div class="right-content">
                                    <div class="left-fixed">部门</div>
                                    <div class="right-fixed">
                                        <el-input style="width:380px;" maxlength="50" type="text" placeholder="请输入部门" v-model="fitter.department"></el-input>
                                    </div>
                                </div>
                                <div class="right-content">
                                    <div class="left-fixed">职位</div>
                                    <div class="right-fixed">
                                        <el-input style="width:380px;" type="text" placeholder="请输入职位" v-model="fitter.position"></el-input>
                                    </div>
                                </div>                                                                
                                <div class="right-content">
                                    <div class="left-fixed">固定电话</div>
                                    <div class="right-fixed">
                                    <el-input placeholder="请输入手机号" v-model="fitter.telephone" class="input-with-select" style="width:380px">
                                        <el-select v-model="fitter.telephone_code" slot="prepend" placeholder="请选择" style="width:150px;">
                                        <el-option
                                        v-for="item in phone_codeConfig"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        >
                                        <!-- <span style="float: left">{{ item.label }}</span>     -->
                                        </el-option>
                                        </el-select>
                                    </el-input>
                                    </div>
                                </div>  
                                <div class="right-content">
                                    <div class="left-fixed">Skype</div>
                                    <div class="right-fixed">
                                        <el-input style="width:380px;" type="text" placeholder="请输入Skype" v-model="fitter.skype"></el-input>
                                    </div>
                                </div>  
                                <div class="right-content">
                                    <div class="left-fixed">QQ</div>
                                    <div class="right-fixed">
                                        <el-input style="width:380px;" type="text" placeholder="请输入QQ" v-model="fitter.qq"></el-input>
                                    </div>
                                </div>   
                                <div class="right-content">
                                    <div class="left-fixed">微信</div>
                                    <div class="right-fixed">
                                        <el-input style="width:380px;" type="text" placeholder="请输入微信" v-model="fitter.wechat"></el-input>
                                    </div>
                                </div>                                                                                                   
                            </div>   
                            <!-- </el-form> -->
                        </div>
                        <div class="save" :disabled="((fitter.first_name == ''))" @click="save()">保存</div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {getpersonalInformation , savePersonalInformation} from "@/api/accountManagement";
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import store from '../../../store/'
export default {
    name: 'personalInforEdit',
    watch:{
        // radio(val){
        //     console.log(val)
        // }
    },
    data(){
        return {
            loading:false,
            imageUrl:'',
            uploadingFiles: [],
            uploadUrl: process.env.BASE_API +'v1/upload',
            radio:'',
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
            phone_codeConfig:'',

        }
    },
    computed:{
        ...mapGetters([
            'configs',
            'name',
            'avatar'
        ]),
        uploadHeaders() {
            return { Authorization: 'Bearer ' + getToken() }
        },
        


    },
    created(){
        this.getpersonalInformationData();
        this.ConfigUnit();
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
        //handleAvatarSuccess
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            console.log(file)
            this.fitter.avatar = file.response.data
            store.dispatch('GetUserInfo')
        },


        //   获取个人信息
        getpersonalInformationData(){
            this.loading = true;
            getpersonalInformation().then(response =>{
                if(response.data.code == 0){
                    this.fitter = response.data.data
                    this.fitter.name = this.fitter.first_name + this.fitter.last_name
                    if( this.fitter.avatar != null){
                        this.imageUrl = this.fitter.avatar
                    }else if(this.fitter.gender == 'male'){
                        this.imageUrl = 'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=62d46c39067b020818c437b303b099b6/d4628535e5dde7119c3d076aabefce1b9c1661ba.jpg'
                    }else if(this.fitter.gender == 'female'){
                        this.imageUrl = 'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=62d46c39067b020818c437b303b099b6/d4628535e5dde7119c3d076aabefce1b9c1661ba.jpg'
                    }
                    delete this.fitter.avatar
                    this.loading = false
                    console.log(this.fitter)
                    this.loading = false;
                }
            })
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

        // 保存个人信息
        save(){
            savePersonalInformation(this.fitter).then(response =>{
                if(response.data.code == 0){
                    console.log("保存成功")
                    // this.name = this.fitter.name
                    // this.avatar = this.imageUrl
                    // store.dispatch('GetUserInfo')
                    // store.dispatch('SET_NAME',this.fitter.name)
                    // store.dispatch('SET_AVATAR',this.imageUrl)
                    store.dispatch('GetUserInfo')
                    console.log('GetUserInfo')
                    console.log(this.avatar)
                    this.$message({
                        message: '个人信息修改保存成功',
                        type: 'success'
                    })
                    this.$router.push({ path: 'personalInformation'})
                }
            })
        },

        //配置文件加载
        ConfigUnit(){
            this.phone_codeConfig = this.configs.phone_number_codes
        },
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
//普通DOM样式
.personalInforEdit{
    padding:40px 0 0 100px;
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
}

</style>

<style rel="stylesheet/scss" lang="scss">
//element样式
.personalInforEdit{
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
    .el-input__inner:focus{
        border:1px solid rgba(255,168,0,1);
    }
}
</style>



