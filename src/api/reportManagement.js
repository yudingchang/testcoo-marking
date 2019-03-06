import request from '@/utils/request'

// 获取报告管理列表信息
export function getReportManagement(data) {
  return request({
    url: '/v1/report',
    method: 'get',
    params: data
  })
}

//报告详情页面
export function getReportSelf(url) {
  return request({
    url: '/v1/inspector/report/'+url,
    method: 'get',
    // params: data
  })
}

// 报告提交
export function reportsubmit(id, data) {
  return request({
    url: '/v1/inspector/report/' + id + '/submit',
    method: 'put',
    data: data,
    paramsSerializer: function(params) {
    return qs.stringify(params, { indices: true })
    }
  })
}

