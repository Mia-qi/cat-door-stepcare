/**
 * 网络请求封装
 */

const baseURL = 'https://api.example.com' // 替换为实际API地址

export function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * GET 请求
 */
export function get(url, data) {
  return request({
    url,
    method: 'GET',
    data
  })
}

/**
 * POST 请求
 */
export function post(url, data) {
  return request({
    url,
    method: 'POST',
    data
  })
}
