import request from '@/utils/request'

// 获取个人信息
export function getpersonalInformation(data) {
  return request({
    url: '/v1/personal',
    method: 'get',
    params: data
  })
}
// 修改个人信息
export function savePersonalInformation(data) {
  return request({
    url: '/v1/personal',
    method: 'post',
    data
  })
}
// 获取电子邮箱列表
export function getdata(data) {
  return request({
    url: '/v1/email',
    method: 'get',
    params: data
    // data
  })
}
// 添加一条电子邮箱
export function addEmail(data) {
  return request({
    url: '/v1/email/save',
    method: 'post',
    data
  })
}
// 设置默认电子邮箱
export function setDefault(data) {
  return request({
    url: data.url,
    method: 'patch'
  })
}
// 编辑电子邮箱
export function editEmail(data) {
  return request({
    url: data.url,
    method: 'put',
    data
  })
}
//删除电子邮箱
export function removeEmail(data) {
  return request({
    url: data.url,
    method: 'DELETE',
  })
}
// 获取供应商列表
export function getSupplydata(data) {
  return request({
    url: '/v1/supplier',
    method: 'get',
    params: data
    // data
  })
}
// 添加一条供应商信息
export function addSupply(data) {
  return request({
    url: '/v1/supplier/save',
    method: 'post',
    data
  })
}
// 编辑供应商信息
export function editSupply(data) {
  return request({
    url: data.url,
    method: 'put',
    data
  })
}
// 设置默认供应商信息
export function setSupplyDefault(data) {
  return request({
    url: data.url,
    method: 'patch'
  })
}
//删除电子邮箱
export function removeSupply(data) {
  return request({
    url: data.url,
    method: 'DELETE'
  })
}
// 添加一条发票信息
export function addInvoice(data) {
  return request({
    url: '/v1/receipt/save',
    method: 'post',
    data
  })
}
// 添加一条寄送地址
export function addAddress(data) {
  return request({
    url: '/v1/sendaddress/save',
    method: 'post',
    data
  })
}


