import request from '@/utils/request'
import qs from 'qs'

export function fetchList(url, query) {
    return request({
      url: 'v1/location/list/all_country',
      method: 'get',
      params: query,
      paramsSerializer: function(params) {
        return qs.stringify(params, { indices: true })
      }
    })
  }