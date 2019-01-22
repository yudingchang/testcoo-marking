<template>
    <div class="walletAccountIndex">
        <el-row>
            <el-col :span="24">
                <div class="wallet-index" v-loading="loading">
                    <!-- 钱包账户充值 -->
                    <div class="walletAccount-Ac">
                        <p class="walletAccount-Ac-name">钱包账户</p>
                        <div class="walletAccount-Ac-recharge">
                        <div class="walletAccount-Ac-recharge-rmb">
                            <p>
                            <span>人民币</span>
                            <span>￥{{userAccountBalance[0].price}}</span>
                            </p>
                            <p @click="jumpPayRmb">去充值</p>
                        </div>
                        <div class="walletAccount-Ac-recharge-line"/>
                        <div class="walletAccount-Ac-recharge-dollar">
                            <p>
                            <span>美元</span>
                            <span>$ {{userAccountBalance[1].price}}</span>
                            </p>
                            <p @click="jumpDollar">去充值</p>
                        </div>
                        </div>
                    </div>
                    <!-- 钱包明细页面 -->
                    <div class="walletAccount-detail">
                        <p class="walletAccount-detail-name">钱包明细</p>
                        <div class="walletAccount-detail-list">
                            <ul class="wallet-detail-list-ul">
                                <li>创建时间</li>
                                <li>
                                <div class="block">
                                    <el-date-picker
                                    value-format="yyyy-MM-dd"
                                    v-model="created_at[0]"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy 年 MM 月 dd 日"/>
                                </div>
                                </li>
                                <li/>
                                <li>
                                <div class="block">
                                    <el-date-picker
                                    value-format="yyyy-MM-dd"
                                    v-model="created_at[1]"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy 年 MM 月 dd 日"/>
                                </div>
                                </li>
                                <li>交易类型</li>
                                <li>
                                <el-select v-model="transactionTypevalue" placeholder="请选择">
                                    <el-option
                                    v-for="item in transactionType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"/>
                                </el-select>
                                </li>
                                <li>状态</li>
                                <li>
                                <el-select v-model="transactionStatevalue" placeholder="请选择">
                                    <el-option
                                    v-for="item in transactionState"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"/>
                                </el-select>
                                </li>
                                <li @click="queryListData">查询</li>
                            </ul>
                            <ul class="wallet-tableDate-ul">
                            <el-table
                                    :header-cell-style="{background:'#F5F8FA'}"
                                    :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                                    style="width: 100%">
                                    <el-table-column
                                    fixed
                                    align="left"
                                    prop="money_id"
                                    label="流水号"
                                    width="237">
                                    </el-table-column>
                                    <el-table-column
                                    align="left"
                                    prop="created_at"
                                    label="创建时间"
                                    width="200">
                                    </el-table-column>
                                    <el-table-column
                                    align="left"
                                    prop="price"
                                    label="金额"
                                    width="200">
                                    <template slot-scope="scope">
                                    <!-- <span>{{scope.row.id}}</span> -->
                                    <span>{{scope.row.plus_minus ? "+" : "-"}}</span>
                                    <span>￥{{scope.row.price}}</span>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                    align="left"
                                    prop="type"
                                    label="交易类型"
                                    width="200">
                                    </el-table-column>
                                    <el-table-column
                                    align="left"
                                    prop="status"
                                    label="状态"
                                    width="200">
                                    <template slot-scope="scope">
                                        <el-button type="text" size="small">{{ scope.row.status }}</el-button>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                    align="left"
                                    fixed="right"
                                    label="操作"
                                    width="381">
                                    <template slot-scope="scope">
                                        <el-button @click="handleClickDetail(scope.row, scope.$index)" type="text" size="small">详情</el-button>
                                        <el-button @click="handleClickPay(scope.row, scope.$index)" type="text" size="small" v-if="scope.row.status == '待付款'">付款</el-button>
                                        <el-button @click="handleClickShut(scope.row, scope.$index)" type="text" size="small" v-if="scope.row.status == '已关闭'">关闭</el-button>
                                    </template>
                                    </el-table-column>
                                </el-table>
                            </ul>
                        </div>
                        <ul class="wallet-pagination-ul">
                            <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            background
                            :current-page="currentPage"
                            :page-sizes="[9]" 
                            :page-size="pagesize"         
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableData.length">    
                            </el-pagination>
                        </ul>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { tableDate,queryList,MoneyBlanace } from '@/api/walletDetail'//列表请求数据 
export default {
    name: 'walletAccountIndex',
    data(){
        return {
            loading:'',
            created_at:[],
            // transactionType交易类型
            transactionType: [{
                value: '1',
                label: '订单付款'
            }, {
                value: '3',
                label: '月结还款'
            }, {
                value: '0',
                label: '充值'
            }, {
                value: '2',
                label: '订单退款'
            }],

            // transactionTypevalue是交易类型数据
            transactionTypevalue: '',

            // transactionState状态
            transactionState: [{
                value: '0',
                label: '待付款'
            },{
                value: '2',
                label: '成功'
            },{
                value: '1',
                label: '付款中'
            }, {
                value: '-1',
                label: '已关闭'
            }],

            // transactionStatevalue是状态类型数据
            transactionStatevalue: '',

            // 钱包明细表格数据tableData
            tableData: [],

            //用户账户余额
            userAccountBalance: [],

            currentPage: 1, // 初始页
            pagesize:9, // 每页的数据

        }
    },
    created(){
        this.getTableData()
        this.getMoneyBlanaceData()
    },
    methods: {
        //获取用户账户人民币和美元余额
        getMoneyBlanaceData(){
            MoneyBlanace().then( response => {
                if( response.data.code == 0 ){
                    this.userAccountBalance = response.data.data.list
                    console.log(this.userAccountBalance)
                }
            })
        },

        //跳转人民币充值
        jumpPayRmb(){
            this.$router.push({ path: 'walletRechargeRmb', query: {} })
        },
        //跳转美元充值页面
        jumpDollar(){
            this.$router.push({ path:'walletRechargeDollar', query: {} })
        },

        //点击查询数据
        queryListData(){
            this.getTableData({
                created_at:this.created_at,
                type:this.transactionTypevalue,
                status:this.transactionStatevalue
            })
        },

        // 初始页currentPage、初始每页数据数pagesize和数据data
        handleSizeChange: function(size) {
        this.pagesize = size
        console.log(this.pagesize) // 每页下拉显示数据
        },
        handleCurrentChange: function(currentPage) {
        this.currentPage = currentPage
        console.log(this.currentPage) // 点击第几页
        },
        //获取列表数据
        getTableData(val){
            this.loading = true
            tableDate(val).then(response => {
                if (response.data.code == 0) {
                    this.tableData = response.data.data.list
                    for(let i=0;i<this.tableData.length;i++){
                        // console.log(response.data.data.list[i].price)
                        //判断拿回来的数据进行列表交易类型判断
                        if(this.tableData[i].type=="0"){
                        this.tableData[i].type="充值"
                        }else if(this.tableData[i].type=="1"){
                        this.tableData[i].type="订单付款"
                        }else if(this.tableData[i].type=="2"){
                        this.tableData[i].type="订单退款"
                        }else if(this.tableData[i].type=="3"){
                        this.tableData[i].type="月结还款"
                        }
                        //判断拿回来的数据进行列表状态判断
                        if(this.tableData[i].status=="0"){
                        this.tableData[i].status="待付款"
                        }else if(this.tableData[i].status=="1"){
                        this.tableData[i].status="付款中"
                        }else if(this.tableData[i].status=="2"){
                        this.tableData[i].status="已完成"
                        }else if(this.tableData[i].status=="-1"){
                        this.tableData[i].status="已关闭"
                        }
                    }
                    this.loading = false
                }
            })
        },

        //点击详情页跳转，
        handleClickDetail(row,index){
            this.$router.push( { path: 'walletDetail', query: { OrderId: row.id } } )
        },

        //点击付款进入付款页面
        handleClickPay(row,index){
            this.$router.push( { path: '/orderManagement/pay', query: { OrderId: row.id }})
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scope>
//普通样式
.walletAccountIndex{
    padding:32px 0 60px 100px;
    .wallet-index{
        .walletAccount-Ac{
            margin-bottom:32px;
            .walletAccount-Ac-name{
                height:33px;
                line-height:33px;
                font-size:16px;
                font-weight:100;
                color:#50688C;
                margin:0 0 24px;
            }
            .walletAccount-Ac-recharge{
                width:770px;
                height:168px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(230,234,238,1);
                .walletAccount-Ac-recharge-rmb{
                    width:383.5px;
                    height:168px;
                    float:left;
                    p:nth-child(1){
                        height:35px;
                        margin:32px 0 22px;
                        line-height: 35px;
                        text-align: center;
                        vertical-align: middle;
                        span:nth-child(1){
                            color:#50688C;
                            font-size:24px;
                        }
                        span:nth-child(2){
                            color:#158BE4;
                            font-size:26px;
                            margin-left:32px;
                            height:35px;
                            line-height: 35px;
                        }
                    }
                    p:nth-child(2){
                        height:40px;
                        width:120px;
                        background:#67C23A;
                        text-align:center;
                        line-height:40px;
                        border-radius:4px;
                        color:#fff;
                        font-size:16px;
                        margin-left:132px;
                        cursor:pointer;
                    }
                }
                .walletAccount-Ac-recharge-line{
                    width:1px;
                    height:80px;
                    margin-top:46px;
                    float:left;
                    background:#DFE3E9;
                }
                .walletAccount-Ac-recharge-dollar{
                    width:383.5px;
                    height:168px;
                    float:left;
                    p:nth-child(1){
                        height:35px;
                        margin:32px 0 22px;
                        line-height: 35px;
                        text-align: center;
                        vertical-align: middle;
                        span:nth-child(1){
                            color:#50688C;
                            font-size:24px;
                        }
                        span:nth-child(2){
                            color:#158BE4;
                            font-size:26px;
                            margin-left:32px;
                            height:35px;
                            line-height: 35px;
                        }
                    }
                p:nth-child(2){
                    height:40px;
                    width:120px;
                    background:#67C23A;
                    text-align:center;
                    line-height:40px;
                    border-radius:4px;
                    color:#fff;
                    font-size:16px;
                    margin-left:132px;
                    cursor:pointer;
                }
                }
            }
        }
        .walletAccount-detail{
            width:1420px;
            .walletAccount-detail-name{
                height:33px;
                line-height: 33px;
                font-size:16px;
                color:#50688C;
                margin:24px 0;
            }
            .walletAccount-detail-list{
                width:100%;
                height:680px;
                border-radius:4px;
                padding-top:19px;
                height:674px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                opacity:0.9;
                border:1px solid rgba(230,234,238,1);
                overflow: hidden;
                ul:nth-child(1){
                    height:36px;
                    line-height:36px;
                    padding-left:40px;
                    li{
                        list-style:none;
                        float:left;

                    }
                    li:nth-child(1){
                        margin-right:16px;
                        font-size:16px;
                        color:#50688C;
                        width:72px;
                    }
                    li:nth-child(3){
                        margin:18px 10px 0;
                        width:12px;
                        height:1px;
                        background:#C5D0DE;
                    }
                    li:nth-child(5){
                        margin-left:32px;
                        font-size:16px;
                        color:#50688C;
                        width:72px;
                    }
                    li:nth-child(6){
                        margin-left:16px;
                    }
                    li:nth-child(7){
                        margin-left:32px;
                        font-size:16px;
                        color:#50688C;
                        margin-right:16px;
                    }
                    li:nth-child(9){
                        margin-left:32px;
                        width:100px;
                        height:36px;
                        border-radius:4px;
                        background:#67C23A;
                        text-align: center;
                        line-height:36px;
                        color:#fff;
                        font-size:16px;
                        cursor:pointer;
                    }
                }
                ul:nth-child(2){
                    margin:18px 0 0 0;
                    width:100%;
                    background:#F5F8FA;
                }
            }
            .wallet-pagination-ul{
                // margin-left:314px;
            }
        }
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" >
//element-ui样式
.walletAccountIndex{
    .wallet-detail-list-ul{
        .el-date-editor.el-input{
            width:200px;
        }
        .el-select .el-input__inner{
            width:140px;
            height:36px !important;
        }
    }
    .wallet-tableDate-ul{
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
            color:#50688C;
            font-size:14px;
        }
        .el-table td>.cell{
            color:rgba(80,104,140,1);
        }
        .el-table th:nth-child(1)>.cell{
            padding-left:40px;
        }
        .el-table td:nth-child(1) div{
            padding-left:40px;
        }
        .el-table td:last-child>.cell .el-button--text{
            font-size:14px;
            color:rgba(255,168,0,1);
            border:none;
        }
        .el-table td:last-child>.cell .el-button--text:nth-child(2){
            margin-left:32px;
        }
        .el-table td:last-child>.cell .el-button--text:nth-child(3){
            margin-left:32px;
        }
        .el-table td:nth-child(5)>.cell .el-button--text{
            color:rgba(80,104,140,1);
        }
    }
    .wallet-pagination-ul{
        //pagination
        .el-pagination{
            margin-top:24px;
        }
        .el-pagination__total{
            width:88px;
            height:36px;
            border:1px solid #CED0DA;
            border-radius:4px;
            text-align:center;
            line-height:36px;
            color:#7F8FA4;
            font-size:14px;
            margin-left:314px;
        }
        .el-pagination .el-select .el-input .el-input__inner{
            height:36px;
            background:#F3F6F9;
        }
        .el-pagination .btn-prev{
            width:36px;
            height:36px;
            border:1px solid #CED0DA;
            border-radius:4px;
            padding:0;
            margin-right:15px;
            background:#F3F6F9; 
        }
        .el-pagination .btn-next{
            width:36px;
            height:36px;
            border:1px solid #CED0DA;
            border-radius:4px;
            padding:0;
            margin-left:15px;
            background:#F3F6F9;
        }
        .el-pager li{
            width:36px;
            height:36px;
            border:1px solid #CED0DA;
            border-radius:4px;
            padding:0;
            line-height:36px;
            text-align:center;
            margin-right:10px;
            color:#7F8FA4;
            background:#F3F6F9;
        }
        .el-pager li:last-child{
            margin-right:0;
        }
        .el-pager li.active{
            background:#158BE4;
            color:#fff;
            border:none;
        }
        .el-pagination__jump{
            width:110px;
            height:36px;
            border:1px solid #CED0DA;
            line-height:36px;
            padding-left:14px;
            background:#CED0DA;
            border-radius:2px;
            color:#fff;
            margin-left:15px;
        }
        .el-pagination__editor.el-input{
            float:right;
            height:36px;
            margin:0;
            padding:0;
            background:#F3F6F9;
        }
        .el-pagination__editor.el-input .el-input__inner{
            border:none;
            height:35px;
            line-height:35px;
            text-align:center;
            border-radius:0;
            padding:0;
            background:#F3F6F9;
            border-bottom:1px solid #CED0DA;
        }
        .el-pagination__jump:focus{
            background:#158BE4;
            border:1px solid #158BE4;
            color:#fff;
        }
    }
}
</style>