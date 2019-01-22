import request from '@/utils/request'

export function tableDate(query) {  //列表数据请求
  return request({
    url: '/v1/payment/money/list',
    method: 'get',
    params: query
  })
}


export function MoneyBlanace(query) {
  return request({
    url: '/v1/payment/money',
    method: 'get',
    params: query
  })
}

//充值界面获取充值订单ID
export function recharge(query,num) {
  return request({
    url: '/v1/payment/money/recharge'+'',
    method: 'get',
    params: query
  })
}

//充值传递参数
export function rechargeProps(RechargeID,query) {
  return request({
    url: '/v1/payment/pay/select'+RechargeID,
    method: 'get',
    params: query
  })
}

//请求成功
export function rechargeSuccess(url) {
  return request({
    url: url,
    method: 'get',
  })
}

//跳转订单详情
export function OrderDetail(id) {
  console.log('/v1/payment/money/info/'+id)
  return request({
    url: '/v1/payment/money/info/'+id,
    method: 'get',
  })
  
}