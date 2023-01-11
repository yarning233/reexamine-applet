import request from '../config/request'

interface ParamsType {
	code: string,
	nickName: string,
	avatarUrl: string,
	gender?: number,
}

export const wxLogin = (params: ParamsType) => {
	return request<ParamsType>({
		url: `wx/wxuser/login`,
		method: 'POST',
		header: {
			'Content-type': 'application/json'
		},
		data: params
	})
}

export const getPhone = (code: string, openId: string) => {
	return request({
		url: `api/personal/getPhone?code=${code}&openId=${openId}`,
		method: 'GET',
		header: {
			'Content-type': 'application/json'
		},
		data: null
	})
}