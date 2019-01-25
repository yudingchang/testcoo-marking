<template>
    <div class="controlboardIndex">
        <el-row>
            <!-- 立即下单 -->
            <el-col :span="24" class="controlboardIndex-immediately">
                <ul>
                    <li></li>
                    <li>立即下单</li>
                </ul>
                <ul>
                    <li @click="OrderImmediateExamine">
                        <i class="iconfont icon-hebingxingzhuangcopy"></i>
                        <span>验货</span>
                        <i class="iconfont icon-hebingxingzhuangcopy"></i>
                    </li>
                    <li @click="OrderImmediateAufiting">
                        <i class="iconfont icon-hebingxingzhuang1"></i>
                        <span>审核</span>
                        <i class="iconfont icon-hebingxingzhuang1"></i>
                    </li>
                    <li @click="OrderImmediateSupervision">
                        <i class="iconfont icon-FillCopy"></i>
                        <span>监装</span>
                        <i class="iconfont icon-FillCopy"></i>
                    </li>
                    <li @click="OrderImmediateSample">
                        <i class="iconfont icon-hebingxingzhuang2"></i>
                        <span>取样</span>
                        <i class="iconfont icon-hebingxingzhuang2"></i>
                    </li>
                </ul>
            </el-col>
            <!-- 第二排Info -->
            <el-col :span="24" class="controlboardIndex-user">
                <!-- 完善信息 -->
                <el-col :span="12" class="controlboardIndex-EVPI">
                    <ul class="controlboardIndex-EVPI-ul">
                        <li></li>
                        <li>完善信息</li>
                    </ul>
                    <div>
                        <ul>
                            <li><span>供应商信息（1）</span><span @click="ViewVendorInfo">查看</span></li>
                            <li><span>个人信息</span><span @click="PerfectingPerInfo">去完善</span></li>
                        </ul>
                        <ul>
                            <li><span>开票信息（2）</span><span @click="ViewInvoiceInfo">查看</span></li>
                            <li><span>企业信息</span><span @click="PerfectingCompInfo">去完善</span></li>
                        </ul>
                        <ul>
                            <li><span>收件地址（2）</span><span @click="ViewDeliveryAddress">查看</span></li>
                            <li><span>支付密码设置</span><span @click="setPayPassword" v-if="!is_paypassword">去设置</span><span v-if="is_paypassword" @click="modifyPassword">修改</span></li>
                        </ul>
                        <ul>
                            <li><span>接受报告邮箱（0）</span><span @click="ViewReportBox">查看</span></li>
                            <li><span></span><span></span></li>
                        </ul>
                    </div>
                </el-col>
                <!-- 钱包余额 -->
                <el-col :span="12" class="controlboardIndex-WalletBalance">
                    <ul>
                        <li></li>
                        <li>钱包余额</li>
                        <li @click="WalletBalance">
                            <span>明细</span><i class="iconfont icon-hebingxingzhuang7"></i>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <p><span>人民币</span><span>￥{{ userAccountBalance[0].price }}</span></p>
                            <p @click="rechargeRmb">去充值</p>
                        </li>
                        <li></li>
                        <li>
                            <p><span>美元</span><span>${{ userAccountBalance[1].price }}</span></p>
                            <p @click="rechargeDollar">去充值</p>
                        </li>
                    </ul>
                </el-col>
            </el-col>
            <!-- 测库月结 -->
            <el-col :span="24" class="controlboardIndex-monthlyState">
                <ul class="controlboardIndex-monthlyState-ul">
                    <li></li>
                    <li>测库月结</li>
                </ul>
                <div class="controlboardIndex-monthlyState-div">
                    <div>
                        <ul>
                            <li>人民币</li>
                            <li>￥8989.89</li>
                            <li></li>
                            <li>美元</li>
                            <li>$8989.89</li>
                        </ul>
                        <p>累计已用总金额</p> 
                    </div>
                    <div>
                        <ul>
                            <li>人民币</li>
                            <li>￥8989.89</li>
                            <li></li>
                            <li>美元</li>
                            <li>$8989.89</li>
                        </ul>
                        <p>待还款</p> 
                    </div>
                    <div>
                        <p @click="ImmediatePay">立即还款</p>
                    </div>
                </div>
            </el-col>
            <!-- 订单信息 -->
            <el-col :span="24" class="controlboardIndex-orderInfo">
                <ul>
                    <li></li>
                    <li>订单信息</li>
                </ul>
                <ul>
                    <li>
                        <p>56</p>
                        <p>累计完成单量</p>
                    </li>
                    <li></li>
                    <li>
                        <p>￥18986.00</p>
                        <p>累计消费人民币</p>
                    </li>
                    <li></li>
                    <li>
                        <p>￥0.00</p>
                        <p>累计消费美元</p>
                    </li>
                    <li></li>
                    <li>
                        <p>56</p>
                        <p>累计完成报告</p>
                    </li>
                    <li></li>
                    <li>
                        <p>56</p>
                        <p>待出报告</p>
                    </li>
                </ul>
            </el-col>
            <!-- 待完成订单 -->
            <el-col :span="24" class="controlboardIndex-TBDorder">
                <ul>
                    <li></li>
                    <li>待完成订单</li>
                </ul>
                <ul>
                    <li>
                        <p>15</p>
                        <p @click="TBDquoted">待报价</p>
                    </li>
                    <li></li>
                    <li>
                        <p>15</p>
                        <p @click="TBDpayment">待付款</p>
                    </li>
                    <li></li>
                    <li>
                        <p>15</p>
                        <p @click="TBDexamine">待验货</p>
                    </li>
                    <li></li>
                    <li>
                        <p>15</p>
                        <p @click="examining">验货中</p>
                    </li>
                </ul>
            </el-col>
            <!-- 最新订单 -->
            <el-col :span="24" class="controlboardIndex-latestOrder">
                <ul class="latestOrder-ul">
                    <li></li>
                    <li>最新订单</li>
                    <li><span>更多</span><i class="iconfont icon-hebingxingzhuang7"></i></li>
                </ul>
                <div class="latestOrder-div">
                    <el-table
                        :data="latestOrderTableData"
                        stripe
                        style="width: 100%">
                        <el-table-column
                        label="订单号"
                        width="221">
                        <template slot-scope="scope">
                            <el-button @click="OrderNumberhandleClick(scope.row)" type="text" size="small">{{scope.row.order}}</el-button>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop=""
                        label="下单时间"
                        width="158">
                        </el-table-column>
                        <el-table-column
                        label="产品名称"
                        width="220">
                        <template slot-scope="scope">
                            <el-button type="text" size="small">{{scope.row.order}}</el-button>
                            <el-button v-if="scope.row.order.length > 11?true:false " @click="UnfoldTexthandleClick(scope.row.order)" type="text" size="small"><i class="iconfont icon-IconCopy"></i></el-button>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="city"
                        label="服务类型"
                        width="140">
                        </el-table-column>
                        <el-table-column
                        prop="address"
                        label="订单金额"
                        width="150">
                        </el-table-column>
                        <el-table-column
                        prop="zip"
                        label="状态"
                        width="150">
                        </el-table-column>
                        <el-table-column
                        prop="zip"
                        label="测库技术"
                        width="240">
                        </el-table-column>
                        <el-table-column
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-button @click="PayhandleClick(scope.row)" v-if="false" type="text" size="small">付款</el-button>
                            <el-button @click="ClosehandleClick(scope.row)" v-if="false" type="text" size="small">关闭</el-button>
                            <el-button @click="CopyhandleClick(scope.row)" v-if="false" type="text" size="small">复制</el-button>
                            <el-button @click="CheckhandleClick(scope.row)" v-if="false" type="text" size="small">查看原因</el-button>
                            <el-button @click="BackhandleClick(scope.row)" type="text" size="small">退单</el-button>
                            <el-button @click="VideohandleClick(scope.row)" type="text" size="small"><i class="iconfont icon-sanjiaoxing"></i>  视频</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <div class="latestOrder-div-div" v-show="false">
                        <p>暂无待完成订单</p>
                        <p>立即下单</p>
                    </div>
                </div>
                <el-dialog title="全部产品" :visible.sync="latestOrderDialog">
                <el-table
                    :data="OproductNameTableData"
                    height="250"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop=""
                    label="序号"
                    width="108">
                    <template slot-scope="scope">
                        {{ scope.$index+1 }}
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop=""
                    label="产品名称"
                    >
                    <template slot-scope="scope">
                        {{ scope.row }}
                    </template>
                    </el-table-column>
                </el-table>
                </el-dialog>
            </el-col>
            <!-- 最新报告 -->
            <el-col :span="24" class="controlboardIndex-latestRepot">
                <ul class="latestRepot-ul">
                    <li></li>
                    <li>最新报告</li>
                    <li><span>更多</span><i class="iconfont icon-hebingxingzhuang7"></i></li>
                </ul>
                <div class="latestRepot-div">
                    <el-table
                        :data="latestRepotTableData"
                        stripe
                        style="width: 100%">
                        <el-table-column
                        prop="order"
                        label="报告号"
                        width="241">
                        </el-table-column>
                        <el-table-column
                        label="订单号"
                        width="200">
                        <template slot-scope="scope">
                            <el-button @click="OrderNumberhandleClick(scope.row)" type="text" size="small">{{scope.row.order}}</el-button>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="city"
                        label="验货日期"
                        width="160">
                        </el-table-column>
                        <el-table-column
                        prop="address"
                        label="供应商名称"
                        width="206">
                        </el-table-column>
                        <el-table-column
                        label="产品货号"
                        width="220">
                        <template slot-scope="scope">
                            <el-button type="text" size="small">{{scope.row.order}}</el-button>
                            <el-button v-if="scope.row.order.length > 11?true:false " @click="latestRepotUnfoldArt(scope.row.order)" type="text" size="small"><i class="iconfont icon-IconCopy"></i></el-button>
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="产品名称"
                        width="252">
                        <template slot-scope="scope">
                            <el-button type="text" size="small">{{scope.row.order}}</el-button>
                            <el-button v-if="scope.row.order.length > 11?true:false " @click="latestRepotUnfoldName(scope.row.order)" type="text" size="small"><i class="iconfont icon-IconCopy"></i></el-button>
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="操作"
                        >
                        <template slot-scope="scope">
                            <el-button @click="WebRepothandleClick(scope.row)" type="text" size="small">网页报告</el-button>
                            <el-button @click="PDFreporthandleClick(scope.row)" type="text" size="small">下载PDF报告</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <div class="latestRepot-div-div" v-show="false">
                        最近没有报告
                    </div>
                </div>
                <el-dialog title="全部产品货号" :visible.sync="latestRepotDialog5">
                <el-table
                    :data="RproductOrderTableData"
                    height="250"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop=""
                    label="序号"
                    width="108">
                    </el-table-column>
                    <el-table-column
                    prop=""
                    label="款号/货号"
                    >
                    </el-table-column>
                </el-table>
                </el-dialog>
                <el-dialog title="全部产品" :visible.sync="latestRepotDialog6">
                <el-table
                    :data="RproductNameTableData"
                    height="250"
                    border
                    style="width: 100%">
                    <el-table-column
                    label="序号"
                    width="108">
                    <template slot-scope="scope">
                        {{ scope.$index+1 }}
                    </template>
                    </el-table-column>
                    <el-table-column
                    label="产品名称"
                    >
                    <template slot-scope="scope">
                        {{ scope.row }}
                    </template>
                    </el-table-column>
                </el-table>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {MoneyBlanace } from '@/api/walletDetail' //钱包余额请求数据
import { mapGetters } from 'vuex'
import store from '../../store'
export default {
    name: 'controlboardIndex',
    data(){
        return{
            //钱包余额
            userAccountBalance: [],     //用户钱包余额



            //最新订单
            latestOrderTableData:[         //最新订单latestOrderTableData数据
                {order:"123456789123456毛绒玩具1,毛绒玩具2,毛绒玩具3,毛绒玩具4"},
                {order:"12345678912"},
                {order:"12345678912"},
                {order:"123456789"},
                {order:"1"},
                {order:"12345"}
                ],
                latestOrderDialog:false,     //最新订单点击展开表格
                OproductNameTableData: [{a:"1"},{a:"2"},{a:"1"},{a:"1"},{a:"1"},{a:"1"},{a:"1"}],    //最新订单 产品名称展开弹框数据


            //最新报告
            latestRepotTableData:[       //最新报告latestRepotTableData数据
                {order:"123456789123456"},
                {order:"123456789123456"},
                {order:"123456789123456"},
                {order:"123456789123456"},
                {order:"123456789123456"},
                {order:"123456789123456"}
            ],
            latestRepotDialog5:false,     //最新报告latestRepotDialog5 产品货号
            latestRepotDialog6:false,     //最新报告latestRepotDialog6 产品名称
            RproductOrderTableData: [{a:"1"},{a:"2"},{a:"1"},{a:"1"},{a:"1"},{a:"1"},{a:"1"}],    //产品货号 展开列表
            RproductNameTableData: [{a:"1"},{a:"2"},{a:"1"},{a:"1"},{a:"1"},{a:"1"},{a:"1"}],     //产品名称  展开列表

           
        }
    },
    created(){
        this.getMoneyBlanaceData();
        console.log(this.is_paypassword)
    },
    methods:{

        //立即下单
        OrderImmediateExamine(){      //验货
            this.$router.push({name:"controlboard",params:{}}) //路由 跳转
        },
        OrderImmediateAufiting(){      //审核
            this.$message("线上暂时未开通此服务，如您需要请联系测库工作人员 联系电话: 18292669357")
        },
        OrderImmediateSupervision(){      //监装
            this.$message("线上暂时未开通此服务，如您需要请联系测库工作人员 联系电话: 18292669357")
        },
        OrderImmediateSample(){      //取样
            this.$message("线上暂时未开通此服务，如您需要请联系测库工作人员 联系电话: 18292669357")
        },


        // 完善信息
        ViewVendorInfo(){    //ViewVendorInfo查看供应商信息
            this.$router.push({ path:'/accountManagement/dataSetting', query:{ tabsIndex:1 } })
        },

        PerfectingPerInfo(){    //PerfectingPerInfo完善个人信息
            this.$router.push({ path: '/accountManagement/personalInformation' })
        },

        ViewInvoiceInfo(){    //ViewInvoiceInfo查看发票信息
            this.$router.push({ path:'/accountManagement/dataSetting', query:{ tabsIndex:2 } })
        },

        PerfectingCompInfo(){    //PerfectingCompInfo完善企业信息

        },

        ViewDeliveryAddress(){    //ViewDeliveryAddress查看收件地址
            this.$router.push({ path: '/accountManagement/dataSetting', query:{ tabsIndex:3 } })
        },

        setPayPassword(){    //setPayPassword设置支付密码
            this.$router.push({ path:'/accountManagement/accountSetting/accountSettingIndex' })
        },

        modifyPassword(){      //modifyPassword修改支付密码
            this.$router.push({ path: '/accountManagement/accountSetting/accountResetPayPassword' })
        },

        ViewReportBox(){    //ViewReportBox查看报告邮箱
            this.$router.push({ path:'/accountManagement/dataSetting', query:{ tabsIndex:0 } })
        },

        //钱包余额
        
        getMoneyBlanaceData(){      //获取用户账户人民币和美元余额
            MoneyBlanace().then( response => {
                if( response.data.code == 0 ){
                    this.userAccountBalance = response.data.data.list
                    console.log(this.userAccountBalance)
                }
            })
        },
        rechargeRmb(){     //rechargeRmb人民币充值入口
            this.$router.push({ path: '/fundManagement/wallet/walletRechargeRmb', query: {} })
        },

        rechargeDollar(){   //rechargeDollar美元充值入口
            this.$router.push({ path:'/fundManagement/wallet/walletRechargeDollar', query: {} })
        },
        WalletBalance(){     //查看钱包明细
            this.$router.push({ path: '/fundManagement/wallet/walletAccountIndex', query: {} })
        },

        //测库月结
        ImmediatePay(){    //ImmediatePay立即还款接口

        },


        //订单信息


        //待完成订单
        TBDquoted(){    //待报价

        },

        TBDpayment(){    //待付款

        },

        TBDexamine(){    //待验货

        },
        
        examining(){    //验货中ing

        },


        //最新订单

        UnfoldTexthandleClick(val){     //点击展开产品名称
            this.latestOrderDialog = true
            console.log(val)
            // this.productNameTableData = val
        },
        
        OrderNumberhandleClick(val){    //订单号链接至
            console.log(val.order.length)
            console.log(this.latestOrderTableData.length)
        },

        PayhandleClick(){    //付款

        },

        ClosehandleClick(){     //关闭

        },

        CopyhandleClick(){      //复制

        },

        CheckhandleClick(){       //查看原因

        },

        BackhandleClick(){      //退单

        },

        VideohandleClick(){     //视频

        },


        //最新报告
        latestRepotUnfoldArt(){     //最新报告 产品货号展开
            this.latestRepotDialog5 = true
        },

        latestRepotUnfoldName(){      //最新报告 产品名称展开
            this.latestRepotDialog6 = true
        },

        WebRepothandleClick(){      //网页报告

        },

        PDFreporthandleClick(){        //下载PDF版报告

        }
    },
    computed: {
        ...mapGetters([
            'is_paypassword',
        ])
    }
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
//普通样式
.controlboardIndex{
    padding:40px 23px 153px 40px;
    .controlboardIndex-immediately{
        margin-bottom:32px;
        ul:nth-child(1){
            height: 33px;
            line-height: 33px;
            margin-bottom:16px;
            li{
                float:left;
            }
            li:nth-child(1){
                width:3px;
                height:28px;
                background:rgba(103,194,58,1);
                margin:3px 16px 0 0;
            }
            li:nth-child(2){
                height:33px;
                font-size:20px;
                font-weight:400;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(80,104,140,1);
                line-height:33px;
            }
        }
        ul:nth-child(2){
            height:120px;
            width:1540px;
            line-height: 120px;
            li{
                float:left;
                cursor: pointer;
            }
            li:nth-child(1){
                width:370px;
                height:120px;
                background:linear-gradient(315deg,rgba(140,129,246,1) 0%,rgba(200,109,215,1) 100%);
                border-radius: 4px;
                margin-right: 20px;
                position: relative;
                overflow: hidden;
                i:nth-child(1){
                    font-size:30px;
                    color:rgba(255,255,255,1);
                    margin-left:26px;
                }
                span{
                    height:37px;
                    font-size:24px;
                    font-family:MicrosoftYaHei;
                    color:rgba(255,255,255,1);
                    line-height:37px;
                    margin-left:16px;
                }
                i:nth-child(3){
                    position:absolute;
                    top:30px;
                    right:15px;
                    font-size:142px;
                    color: rgba(255,255,255,1);
                    opacity: 0.2;
                }
            }
            li:nth-child(2){
                width:370px;
                height:120px;
                background:linear-gradient(131deg,rgba(234,124,97,1) 0%,rgba(254,113,151,1) 100%);
                border-radius:4px;
                margin-right:20px;
                position: relative;
                overflow: hidden;
                i:nth-child(1){
                    font-size:30px;
                    color:rgba(255,255,255,1);
                    margin-left:26px;
                }
                span{
                    height:37px;
                    font-size:24px;
                    font-family:MicrosoftYaHei;
                    color:rgba(255,255,255,1);
                    line-height:37px;
                    margin-left:16px;
                }
                i:nth-child(3){
                    position:absolute;
                    top:30px;
                    right:15px;
                    font-size:142px;
                    color: rgba(255,255,255,1);
                    opacity: 0.2;
                }
            }
            li:nth-child(3){
                width:370px;
                height:120px;
                background:linear-gradient(135deg,rgba(98,178,255,1) 0%,rgba(134,162,253,1) 100%);
                border-radius:4px;
                margin-right:20px;
                position: relative;
                overflow: hidden;
                i:nth-child(1){
                    font-size:30px;
                    color:rgba(255,255,255,1);
                    margin-left:26px;
                }
                span{
                    height:37px;
                    font-size:24px;
                    font-family:MicrosoftYaHei;
                    color:rgba(255,255,255,1);
                    line-height:37px;
                    margin-left:16px;
                }
                i:nth-child(3){
                    position:absolute;
                    top:30px;
                    right:15px;
                    font-size:142px;
                    color: rgba(255,255,255,1);
                    opacity: 0.2;
                }
            }
            li:nth-child(4){
                width:370px;
                height:120px;
                background:linear-gradient(136deg,rgba(54,200,196,1) 0%,rgba(22,161,207,1) 100%);
                border-radius:4px;
                position: relative;
                overflow: hidden;
                i:nth-child(1){
                    font-size:30px;
                    color:rgba(255,255,255,1);
                    margin-left:26px;
                }
                span{
                    height:37px;
                    font-size:24px;
                    font-family:MicrosoftYaHei;
                    color:rgba(255,255,255,1);
                    line-height:37px;
                    margin-left:16px;
                }
                i:nth-child(3){
                    position:absolute;
                    top:30px;
                    right:15px;
                    font-size:142px;
                    color: rgba(255,255,255,1);
                    opacity: 0.2;
                }
            }
        }
    }
    .controlboardIndex-user{
        width:1540px;
        .controlboardIndex-EVPI{
            width:720px;
            margin-right:50px;
            float:left;
            .controlboardIndex-EVPI-ul{
                height: 33px;
                line-height: 33px;
                margin-bottom:16px;
                li{
                    float:left;
                }
                li:nth-child(1){
                    width:3px;
                    height:28px;
                    background:rgba(103,194,58,1);
                    margin:3px 16px 0 0;
                }
                li:nth-child(2){
                    height:33px;
                    font-size:20px;
                    font-weight:400;
                    font-family:PingFang-SC-Medium;
                    font-weight:500;
                    color:rgba(80,104,140,1);
                    line-height:33px;
                }
            }
            div{
                width:720px;
                height:168px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(230,234,238,1);
                padding:16px 58px 17px 40px;
                ul{
                    height:24px;
                    line-height: 24px;
                    margin-bottom:13px;
                    li:nth-child(1){
                        float:left;
                        height:24px;
                        line-height: 24px;
                        width:224px;
                        span:nth-child(1){
                            float:left;
                            font-size:16px;
                            font-family:MicrosoftYaHei;
                            color:rgba(118,140,170,1);
                        }
                        span:nth-child(2){
                            float:right;
                            font-size:16px;
                            font-family:MicrosoftYaHei;
                            color:rgba(255,168,0,1);
                            cursor:pointer;
                        }
                    }
                    li:nth-child(2){
                        float:right;
                        height:24px;
                        line-height: 24px;
                        width:242px;
                        span:nth-child(1){
                            float:left;
                            font-size:16px;
                            font-family:MicrosoftYaHei;
                            color:rgba(118,140,170,1);
                        }
                        span:nth-child(2){
                            float:right;
                            font-size:16px;
                            font-family:MicrosoftYaHei;
                            color:rgba(255,168,0,1);
                            cursor: pointer;
                        }
                    }
                }
                ul:last-child{
                    margin-bottom:0;
                }
            }
        }
        .controlboardIndex-WalletBalance{
            width:770px;
            float:left;
            ul:nth-child(1){
                height: 33px;
                line-height: 33px;
                margin-bottom:16px;
                li:nth-child(1){
                    float:left;
                    width:3px;
                    height:28px;
                    background:rgba(103,194,58,1);
                    margin:3px 16px 0 0;
                }
                li:nth-child(2){
                    float:left;
                    height:33px;
                    font-size:20px;
                    font-weight:400;
                    font-family:PingFang-SC-Medium;
                    font-weight:500;
                    color:rgba(80,104,140,1);
                    line-height:33px;
                }
                li:nth-child(3){
                    float:right;
                    height:33px;
                    line-height: 33px;
                    cursor: pointer;
                    span{
                        font-size:16px;
                        font-family:PingFang-SC-Medium;
                        font-weight:500;
                        color:rgba(245,166,35,1);
                        margin-right:8px;
                    }
                    i{
                        font-size:14px;
                        color:rgba(245,166,35,1);
                    }
                }
            }
            ul:nth-child(2){
                height:168px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(230,234,238,1);
                line-height: 168px;
                li{
                    float:left;
                }
                li:nth-child(1),li:nth-child(3){
                    width:383px;
                    height:168px;
                    line-height: 168px;
                    text-align: center;
                    p:nth-child(1){
                        height:37px;
                        line-height: 37px;
                        margin:32px 0 23px 0;
                        span:nth-child(1){
                            font-size:24px;
                            color:rgba(80,104,140,1);
                            margin-right:32px;
                        }
                        span:nth-child(2){
                            font-size:26px;
                            color:rgba(21,139,228,1);
                        }
                    }
                    p:nth-child(2){
                        height:40px;
                        width:120px;
                        background:rgba(103,194,58,1);
                        border-radius:4px;
                        line-height: 40px;
                        font-size:16px;
                        color:rgba(255,255,255,1);
                        margin-left:132px;
                        cursor: pointer;
                    }
                }
                li:nth-child(2){
                    width:1px;
                    height:80px;
                    background:rgba(223,227,233,1);
                    margin-top:46px;
                }
            }
        }
    }
    .controlboardIndex-monthlyState{
        margin:32px 0;
        .controlboardIndex-monthlyState-ul{
            height: 33px;
            line-height: 33px;
            margin-bottom:16px;
            li{
                float:left;
            }
            li:nth-child(1){
                width:3px;
                height:28px;
                background:rgba(103,194,58,1);
                margin:3px 16px 0 0;
            }
            li:nth-child(2){
                height:33px;
                font-size:20px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(80,104,140,1);
                line-height:33px;
            }
        }
        .controlboardIndex-monthlyState-div{
            width:1540px;
            height:162px;
            background:rgba(255,255,255,1);
            border-radius:4px;
            border:1px solid rgba(230,234,238,1);
            div{
                float: left;
            }
            div:nth-child(1){
                width:667px;
                height:162px;
                line-height: 162px;
                border-right:1px solid rgba(223,227,233,1);
                padding-top:40px;
                ul{
                    height:50px;
                    line-height: 50px;
                    margin:0 0 16px 0;
                    li{
                        float:left;
                    }
                    li:nth-child(1),li:nth-child(4){
                        font-size:24px;
                        color:rgba(80,104,140,1);
                        margin-left:50px;
                    }
                    li:nth-child(2),li:nth-child(5){
                        font-size:28px;
                        color:rgba(21,139,228,1);
                        margin-left:24px;
                    }
                    li:nth-child(3){
                        width:1px;
                        height:50px;
                        background:rgba(223,227,233,1);
                        margin-left:50px;
                    }
                }
                p{
                    height:31px;
                    line-height: 31px;
                    text-align: center;
                    font-size:24px;
                    color:rgba(118,140,170,1);
                    margin-left:10px;
                }
            }
            div:nth-child(2){
                width:656px;
                height:162px;
                line-height: 162px;
                padding-top:40px;
                ul{
                    height:50px;
                    line-height: 50px;
                    margin:0 0 16px 0;
                    li{
                        float:left;
                    }
                    li:nth-child(1),li:nth-child(4){
                        font-size:24px;
                        color:rgba(80,104,140,1);
                        margin-left:50px;
                    }
                    li:nth-child(2),li:nth-child(5){
                        font-size:28px;
                        color:rgba(21,139,228,1);
                        margin-left:24px;
                    }
                    li:nth-child(3){
                        width:1px;
                        height:50px;
                        background:rgba(223,227,233,1);
                        margin-left:50px;
                    }
                }
                p{
                    height:31px;
                    line-height: 31px;
                    text-align: center;
                    margin-left:20px;
                    font-size:24px;
                    color:rgba(118,140,170,1);
                }
            }
            div:nth-child(3){
                line-height: 162px;
                height:162px;
                padding-top:64px;
                p{
                    width:130px;
                    height:40px;
                    background:rgba(103,194,58,1);
                    border-radius:4px;
                    color:rgba(255,255,255,1);
                    font-size:16px;
                    line-height: 40px;
                    text-align: center;
                    cursor: pointer;
                }
            }
        }
    }
    .controlboardIndex-orderInfo{
        width:1540px;
        margin-bottom:32px;
        ul:nth-child(1){
            height: 33px;
            line-height: 33px;
            margin-bottom:16px;
            li{
                float:left;
            }
            li:nth-child(1){
                width:3px;
                height:28px;
                background:rgba(103,194,58,1);
                margin:3px 16px 0 0;
            }
            li:nth-child(2){
                height:33px;
                font-size:20px;
                font-weight:400;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(80,104,140,1);
                line-height:33px;
            }
        }
        ul:nth-child(2){
            height:140px;
            background:rgba(255,255,255,1);
            border-radius:4px;
            border:1px solid rgba(230,234,238,1);
            line-height: 140px;
            li{
                float:left;
            }
            li:nth-child(1),li:nth-child(3),li:nth-child(5),li:nth-child(7){
                width: 308px;
                height: 140px;
                padding-top:36px;
                p:nth-child(1){
                    height:36px;
                    font-size:30px;
                    color:rgba(80,104,140,1);
                    line-height:36px;
                    text-align: center;
                    margin-bottom:14px;
                }
                p:nth-child(2){
                    height:22px;
                    font-size:16px;
                    font-weight:500;
                    color:rgba(118,140,170,1);
                    line-height:22px;
                    text-align: center;
                }
            }
            li:nth-child(9){
                width: 302px;
                height: 140px;
                padding-top:36px;
                p:nth-child(1){
                    height:36px;
                    font-size:30px;
                    color:rgba(80,104,140,1);
                    line-height:36px;
                    text-align: center;
                    margin-bottom:14px;
                }
                p:nth-child(2){
                    height:22px;
                    font-size:16px;
                    font-weight:500;
                    color:rgba(118,140,170,1);
                    line-height:22px;
                    text-align: center;
                } 
            }
            li:nth-child(2),li:nth-child(4),li:nth-child(6),li:nth-child(8){
                width:1px;
                height:50px;
                background:rgba(223,227,233,1);
                margin-top:45px;
            } 
        }
    }
    .controlboardIndex-TBDorder{
        width:1540px;
        margin-bottom:32px;
        ul:nth-child(1){
            height: 33px;
            line-height: 33px;
            margin-bottom:16px;
            li{
                float:left;
            }
            li:nth-child(1){
                width:3px;
                height:28px;
                background:rgba(103,194,58,1);
                margin:3px 16px 0 0;
            }
            li:nth-child(2){
                height:33px;
                font-size:20px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(80,104,140,1);
                line-height:33px;
            }
        }
        ul:nth-child(2){
            width:1540px;
            height:100px;
            background:rgba(255,255,255,1);
            border-radius:4px;
            border:1px solid rgba(230,234,238,1);
            line-height: 100px;
            li{
                float:left;
            }
            li:nth-child(1),li:nth-child(3),li:nth-child(5){
                width:385px;
                height:100px;
                p{
                    float:left;
                }
                p:nth-child(1){
                    width:45px;
                    height:45px;
                    background:rgba(255,84,84,1);
                    line-height: 45px;
                    text-align: center;
                    margin:28px 32px 0 116px;
                    font-size:18px;
                    color:rgba(255,255,255,1);
                    border-radius:50%;
                }
                p:nth-child(2){
                    font-size:20px;
                    font-weight:500;
                    color:rgba(255,168,0,1);
                    text-decoration: underline;
                }
            }
            li:nth-child(7){
                width:380px;
                height:100px;
                p{
                    float:left;
                }
                p:nth-child(1){
                    width:45px;
                    height:45px;
                    background:rgba(255,84,84,1);
                    line-height: 45px;
                    text-align: center;
                    margin:28px 32px 0 116px;
                    font-size:18px;
                    color:rgba(255,255,255,1);
                    border-radius:50%;
                }
                p:nth-child(2){
                    font-size:20px;
                    font-weight:500;
                    color:rgba(255,168,0,1);
                    text-decoration: underline;
                }
            }
            li:nth-child(2),li:nth-child(4),li:nth-child(6){
                width:1px;
                height:50px;
                background:rgba(223,227,233,1);
                margin:24px 0 0 0;
            }
        }
    }
    .controlboardIndex-latestOrder{
        margin-bottom:32px;
        width:1540px;
        .latestOrder-ul{
            height: 33px;
            line-height: 33px;
            margin-bottom:16px;
            li{
                float:left;
            }
            li:nth-child(1){
                width:3px;
                height:28px;
                background:rgba(103,194,58,1);
                margin:3px 16px 0 0;
            }
            li:nth-child(2){
                height:33px;
                font-size:20px;
                font-weight:400;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(80,104,140,1);
                line-height:33px;
            }
            li:nth-child(3){
                float:right;
                height:33px;
                line-height: 33px;
                span{
                    font-size:16px;
                    font-family:PingFang-SC-Medium;
                    font-weight:500;
                    color:rgba(245,166,35,1);
                    margin-right:8px;
                }
                i{
                    font-size:14px;
                    color:rgba(245,166,35,1);
                    // text-align: right; 
                }
            }
        }
        .latestOrder-div{
            width:1540px;
            // height:398px;
            background:rgba(255,255,255,1);
            border-radius:4px;
            opacity:0.9;
            border:1px solid rgba(230,234,238,1);
            .latestOrder-div-div{
                height:138px;
                text-align: center;
                padding-top:32px;
                p:nth-child(1){
                    height: 24px;
                    line-height: 24px;
                    font-size:18px;
                    font-family:MicrosoftYaHei;
                    color:rgba(127,143,164,1);
                    margin-bottom:13px;
                }
                p:nth-child(2){
                    width:120px;
                    height:32px;
                    background:rgba(103,194,58,1);
                    border-radius:4px;
                    line-height: 32px;
                    text-align: center;
                    margin-left:707px;
                    font-size:14px;
                    font-family:PingFang-SC-Medium;
                    font-weight:500;
                    color:rgba(255,255,255,1);
                    cursor:pointer;
                }
            }
        }
    }
    .controlboardIndex-latestRepot{
        width:1540px;
        .latestRepot-ul{
            height: 33px;
            line-height: 33px;
            margin-bottom:16px;
            li{
                float:left;
            }
            li:nth-child(1){
                width:3px;
                height:28px;
                background:rgba(103,194,58,1);
                margin:3px 16px 0 0;
            }
            li:nth-child(2){
                height:33px;
                font-size:20px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(80,104,140,1);
                line-height:33px;
            }
            li:nth-child(3){
                float:right;
                height:33px;
                line-height: 33px;
                span{
                    font-size:16px;
                    font-family:PingFang-SC-Medium;
                    font-weight:500;
                    color:rgba(245,166,35,1);
                    margin-right:8px;
                }
                i{
                    font-size:14px;
                    color:rgba(245,166,35,1);
                    // text-align: right; 
                }
            }
        }
        .latestRepot-div{
            width:1540px;
            // height:308px;
            background:rgba(255,255,255,1);
            border-radius:4px;
            opacity:0.9;
            border:1px solid rgba(230,234,238,1);
            .latestRepot-div-div{
                height:136px;
                line-height: 136px;
                text-align: center;
                font-size:18px;
                font-family:MicrosoftYaHei;
                color:rgba(127,143,164,1);
            }
        }
    }
}

</style>

<style rel="stylesheet/scss" lang="scss">
//element-ui样式
.controlboardIndex{
    .controlboardIndex-latestOrder{
         //el-table
        .el-table th{
            height:60px;
        }
        .el-table td{
            height:60px;
        }
        .el-table .cell{
            padding:0;
        }
        .el-table th div, .el-table th>.cell{
            padding:0;
            color:rgba(80,104,140,1);
            font-size:16px;
        }
        .el-table th:nth-child(1)>.cell{
            padding-left:40px;
        }
        .el-table td:nth-child(1) div{
            padding-left:40px;
        }
        .el-table th:nth-child(1)>.cell .el-button--text{
            color:rgba(21,139,228,1);
        }
        .el-table td:nth-child(1) div .el-button--text{
            color:rgba(21,139,228,1);
        }
        .el-button--text{
            color:rgba(255,168,0,1);
            // font-size:14px;
        }
        .el-table__empty-block{   //没有数据时列表显示
            display:none;
        }
        .el-table th:nth-child(3)>.cell .el-button--text:nth-child(1){     //产品名称第一个button
            width:96px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color:rgba(80,104,140,1);
            float:left;
        }
        .el-table td:nth-child(3) div .el-button--text:nth-child(1){       
            width:96px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color:rgba(80,104,140,1);
            float:left;
        }
        .el-table th:nth-child(3)>.cell .el-button--text:nth-child(2){     //产品名称第二个button
            width:24px;
            color:rgba(80,104,140,1);
            float:right;
            margin:0 60px 0 0;
        }
        .el-table td:nth-child(3) div .el-button--text:nth-child(2){       
            width:24px;
            color:rgba(80,104,140,1);
            float:right;
            margin:0 60px 0 0;
        }
        .el-table th:nth-child(8)>.cell .el-button--text:last-child span{    
            width:88px;
            height:32px;
            background:rgba(103,194,58,1);
            border-radius:4px;
            display:block;
        }
        .el-table td:nth-child(8) div .el-button--text:last-child span{       
            width:88px;
            height:32px;
            background:rgba(103,194,58,1);
            border-radius:4px;
            display:block;
            text-align:center;
            line-height:32px;
            font-size:14px;
            color:rgba(255,255,255,1);
        }
        .el-table td:nth-child(8) div .el-button--text:last-child span i{
            margin-right:12px;
            font-size:12px;
            color:rgba(255,255,255,1);
        }

        //Dialog Table
        .el-dialog{
            width:387px;
            height:294px;
            background:rgba(255,255,255,1);
            box-shadow:0px 2px 4px 0px rgba(118,140,170,1);
            border-radius:4px;
            .el-dialog__header{
                width:387px;
                height:41px;
                background:rgba(230,234,238,1);
                border-radius:3px 3px 0px 3px;
                text-align:center;
                line-height:41px;
                padding:0;
                position:relative;
                .el-dialog__headerbtn{
                    width:12px;
                    height:12px;
                    line-height:12px;
                    position:absolute;
                    top:13px;
                    right:13px;
                    .el-icon-close:before{
                        color:rgba(22,64,97,1);
                        font-weight:600;
                    }
                }
            }
            .el-dialog__body{
                width:387px;
                height:253px;
                padding:0;
                .el-table th{
                    height:31px;
                    padding:0;
                }
                .el-table td{
                    height:36px;
                }
                .el-table th:nth-child(1) > .cell{
                    padding:0;
                }
                .el-table .cell, .el-table th div{
                    font-size:14px;
                    color:rgba(124,140,165,1);
                    text-align:center;
                }
                .el-table td:nth-child(1) div{
                    padding:0;
                    color:rgba(22,64,97,1);
                    font-size:14px;
                }
                .el-table td:nth-child(2) div{
                    color:rgba(22,64,97,1);
                    font-size:14px;
                }
            }
        }


    }
    .controlboardIndex-latestRepot{
         //el-table
        .el-table th{
            height:60px;
        }
        .el-table td{
            height:60px;
        }
        .el-table .cell{
            padding:0;
        }
        .el-table th div, .el-table th>.cell{
            padding:0;
            color:rgba(80,104,140,1);
            font-size:16px;
        }
        .el-table th:nth-child(1)>.cell{
            padding-left:40px;
        }
        .el-table td:nth-child(1) div{
            padding-left:40px;
        }
        .el-table th:nth-child(2)>.cell .el-button--text{
            color:rgba(21,139,228,1);
        }
        .el-table td:nth-child(2) div .el-button--text{
            color:rgba(21,139,228,1);
        }
        .el-button--text{
            color:rgba(255,168,0,1);
            // font-size:14px;
        }
        .el-table__empty-block{   //没有数据时列表显示
            display:none;
        }

        .el-table th:nth-child(5)>.cell .el-button--text:nth-child(1){     //产品名称第一个button
            width:108px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color:rgba(80,104,140,1);
            float:left;
        }
        .el-table td:nth-child(5) div .el-button--text:nth-child(1){       
            width:108px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color:rgba(80,104,140,1);
            float:left;
        }
        .el-table th:nth-child(5)>.cell .el-button--text:nth-child(2){     //产品名称第二个button
            width:24px;
            color:rgba(80,104,140,1);
            float:right;
            margin:0 60px 0 0;
        }
        .el-table td:nth-child(5) div .el-button--text:nth-child(2){       
            width:24px;
            color:rgba(80,104,140,1);
            float:right;
            margin:0 60px 0 0;
        }
        .el-table th:nth-child(6)>.cell .el-button--text:nth-child(1){     //产品名称第一个button
            width:96px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color:rgba(80,104,140,1);
            float:left;
        }
        .el-table td:nth-child(6) div .el-button--text:nth-child(1){       
            width:96px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color:rgba(80,104,140,1);
            float:left;
        }
        .el-table th:nth-child(6)>.cell .el-button--text:nth-child(2){     //产品名称第二个button
            width:24px;
            color:rgba(80,104,140,1);
            float:right;
            margin:0 60px 0 0;
        }
        .el-table td:nth-child(6) div .el-button--text:nth-child(2){       
            width:24px;
            color:rgba(80,104,140,1);
            float:right;
            margin:0 60px 0 0;
        }



        //Dialog Table
        .el-dialog{
            width:387px;
            height:294px;
            background:rgba(255,255,255,1);
            box-shadow:0px 2px 4px 0px rgba(118,140,170,1);
            border-radius:4px;
            .el-dialog__header{
                width:387px;
                height:41px;
                background:rgba(230,234,238,1);
                border-radius:3px 3px 0px 3px;
                text-align:center;
                line-height:41px;
                padding:0;
                position:relative;
                .el-dialog__headerbtn{
                    width:12px;
                    height:12px;
                    line-height:12px;
                    position:absolute;
                    top:13px;
                    right:13px;
                    .el-icon-close:before{
                        color:rgba(22,64,97,1);
                        font-weight:600;
                    }
                }
            }
            .el-dialog__body{
                width:387px;
                height:253px;
                padding:0;
                .el-table th{
                    height:31px;
                    padding:0;
                }
                .el-table td{
                    height:36px;
                }
                .el-table th:nth-child(1) > .cell{
                    padding:0;
                }
                .el-table .cell, .el-table th div{
                    font-size:14px;
                    color:rgba(124,140,165,1);
                    text-align:center;
                }
                .el-table td:nth-child(1) div{
                    padding:0;
                    color:rgba(22,64,97,1);
                    font-size:14px;
                }
                .el-table td:nth-child(2) div{
                    color:rgba(22,64,97,1);
                    font-size:14px;
                }
            }
        }
    }
}

</style>


