import Taro from '@tarojs/taro'
import Toast from '../utils/useToast'

interface RequestType<T> {
	url: string,
	method: keyof Taro.request.Method,
	header: TaroGeneral.IAnyObject,
	data: T
}

interface ResponseType<T> {
	userInfo?: { id: string, openId: string },
	code: 200 | number,
	msg?: string,
	data: T
}

const baseURL: string = 'https://liebianapi.kaoyancun.com/'

const request = <T = any, U = any>(requestParams: RequestType<T>): Promise<ResponseType<U>> => {
	const { url, method, header, data } = requestParams

	return new Promise((resolve, reject) => {
		Taro.request({
			url: baseURL + url,
			method,
			header,
			data
		}).then(res => {
			switch (res.statusCode) {
				case 200:
					resolve(res.data)
					break
				case 204:
					resolve(res.data)
					break
				case 400:
					Toast('参数不正确')
					break
				case 404:
					Toast('请求地址不存在')
					break
				case 500:
					Toast('服务器内部错误')
					break
				default:
					Toast('程序出错')
			}
		}).catch(err => {
			Toast(err)
			reject(err)
		})
	})
}

export default request