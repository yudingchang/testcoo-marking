<template>
  <div class="upload-container">
    <div v-for="(file,index) in files" :key="file.id"  :class="{'successBorder':isSuccess,'image-preview':true,'shadow-sm':true}">
      <div class="image-preview-wrapper">
        <div class="image-preview-wrapperCh">
          <img :src="file.url" alt="" v-if="file.extension == 'jpg'" class="imageShow">
          <svg-icon :icon-class="getFileExtensions(file.url)" v-if="file.extension != 'jpg'" class-name="file-icon"/>
        </div>
        <div class="image-name">{{ file.name }}</div>
        <div class="image-preview-action">
          <i class="el-icon-zoom-in" v-if="file.extension == 'jpg'" @click="handlePictureCardPreview(file)"/>
          <i class="el-icon-download" v-if="file.extension != 'jpg'"/>
          <i class="el-icon-delete" @click="handleRemove(file,index)"/>
        </div>
      </div>
    </div>
    <div v-for="(uploadingFile, index) in uploadingFiles" :key="index" class="image-preview shadow-sm">
      <div class="image-preview-wrapper">
        <svg-icon :icon-class="getFileExtensions(uploadingFile.name)" class-name="file-icon"/>
        <div class="image-uploading-action">
          <el-progress :percentage="uploadingFile.percent" :width="88" type="circle" class="tc-progress"/>
        </div>
      </div>
    </div>
    <el-upload
      v-if="action"
      :on-remove="handleRemove"
      :on-progress="uploadOnProgress"
      :on-success="handleSuccess"
      :before-upload="handleBeforeUpload"
      :on-preview="handlePictureCardPreview"
      :show-file-list="false"
      :action="uploadUrl"
      :headers="uploadHeaders"
      drag
      multiple
      class="image-preview shadow-sm"
      list-type="picture-card">
      <i class="el-icon-plus"/>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import prettyFileIcons from 'pretty-file-icons'
import { getToken } from '@/utils/auth'

export default {
  name: 'Upload',
  props: {
    files: {
      type: Array,
      default: () => {
        return []
      }
    },
    action: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      uploadingFiles: [],
      isSuccess:true,
      ImageUrl:'',
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    uploadUrl() {
      return process.env.BASE_API + 'v1/upload'
    },
    uploadHeaders() {
      return { Authorization: 'Bearer ' + getToken() }
    }
  },
  created() {

  },
  methods: {
    getFileExtensions(url) {
      console.log(url)
      return prettyFileIcons.getIcon(url)
    },
    handleBeforeUpload(file) {
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const extension3 = file.name.split('.')[1] === 'doc'
      const extension4 = file.name.split('.')[1] === 'docx'
      const extension5 = file.name.split('.')[1] === 'ppt'
      const extension6 = file.name.split('.')[1] === 'pptx'
      const extension7 = file.name.split('.')[1] === 'jpg'
      const extension8 = file.name.split('.')[1] === 'jpeg'
      const extension9 = file.name.split('.')[1] === 'pdf'
      const isLt2M = file.size / 1024 / 1024 < 30
      if (!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7 && !extension8 && !extension9) {
        this.$message('上传附件只能是 xls、xlsx、doc、docx 、ppt、pptx、jpg、jpeg、pdf格式!')
        return false;
      }
      if (!isLt2M) {
       this.$message('上传单个附件大小不能超过 30MB!')
       return false;
      }
      
      file.percent = 0
      this.uploadingFiles.push(file)
      // console.log(this.files)
      return extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8 || extension9 && isLt2M
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // handleRemove(index, file, fileList) {
    //   // console.log(index)
    //   this.uploadingFiles[index].image = [];
    //   //   console.log(file, fileList);
    // },
    handleRemove(file, index) {
      // console.log(file)
      if (file.detach === false) {
        // console.log(this.uploadingFiles)
        // this.uploadingFiles[index].image = [];
        this.files.splice(index ,1)
        // console.log(this.files)
      }
    },
    uploadOnProgress(e, file) {
      //  console.log( this.uploadingFiles)
      const index = this.uploadingFiles.findIndex(uploadingFile => uploadingFile.uid === file.uid)
      this.uploadingFiles[index].percent = Math.round(e.percent)
      // console.log(this.uploadingFiles)
      this.$set(this.uploadingFiles, index, file)
    },
    handleSuccess(response, file, fileList) {
      // console.log(response)
      const index = this.uploadingFiles.findIndex(uploadingFile => uploadingFile.uid === file.uid)
      this.uploadingFiles.splice(index, 1)
      // console.log(response.code)
      if (response.code === 0) {
        this.files.push(response.data)
        // console.log(this.files)
        this.isSuccess = true
        // console.log(response.data)
        this.ImageUrl = response.data.url
        // console.log(this.ImageUrl)
      }
    }
  }
}
</script>
<style>
  .el-upload-dragger{
    border: none;
  }
  .el-upload--picture-card{
    border: none;
  }
  .successBorder{
    border: 1px solid #CFCFCF !important;
  }
   .el-progress-circle{
     position: absolute;
     left: 50%;
     top: 50%;
     margin-top: -44px;
     margin-left: -44px;
  }
  .el-progress--circle .el-progress__text{
    position: absolute;
     left: 50%;
     top: 50%;
     margin-left: -10px;
     /* margin-top: -44px;
     /* margin-left: -44px; */ 
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  margin-top: .8em;
  @include clearfix;
  .file-icon {
    font-size: 105px;
  }
  .image-uploader {
      width: 60%;
      float: left;
  }
 
  .image-preview {
    position: relative;
    border: 2px dashed #e1e1e1;
    border-radius: 7px;
    float: left;
    width: 120px;
    height: 145px;
    margin-left: 10px;
    margin-bottom: 15px;
    text-align: center;
    overflow: hidden;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      .image-preview-wrapperCh{
        width:118px;
        height:115px;
      }
      img {
        width: 100%;
        height: 100%;
      }
      .imageShow{
        width:118px;
        height:115px;
      }
    }
    .image-name {
      padding-top: 5px;
      line-height: 1.3em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-top:1px solid #CFCFCF;
      // margin-top: 10px;
    }
    
    .image-uploading-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, .7);
      text-align: center;
      line-height: 140px;
    }
    .image-preview-action {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        background-color: rgba(0, 0, 0, .7);
        transition: opacity .2s;
        font-size: 28px;
        text-align: center;
        line-height: 150px;
        i {
          cursor: pointer;
          &:hover {
            color: #409EFF;
          }
        }
    }
    &:hover {
      .image-preview-action {
          opacity: 1;
      }
    }
  }
}
</style>

