import request from '@/utils/request'
import qs from 'qs'

export function order(data) {
  return request({
    url: '/v1/inspection',
    method: 'post',
    data: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: true })
    }
  })
}
// 根据供应商名字查找其他信息
export function getOtherMessage(data) {
  return request({
    url: data.url,
    method: 'get',
    params: data
  })
}
export function getList(data) {
    return request({
      url: '/v1/inspection',
      method: 'get',
      params: {
          searches:data
    } ,
      paramsSerializer: function(params) {
        return qs.stringify(params, { indices: true })
      }
    })
  }
