import request from "../config/request"
import {ChartQueryType, UploadType} from '../types/adjust'
import { PageData, Pagination } from "../types/request"
import { ResultType, FirstLevelType, CategoryType, ShopType } from '../types/adjust'

// 根据年份、院校/专业获取图表信息
export const queryAdjustList = (params: ChartQueryType) => {
	return request({
		url: 'api/adjustChart/queryList',
		method: 'POST',
		header: {
			'Content-type': 'application/json'
		},
		data: params
	})
}

// 根据年份获取历年复试分数线
export const scoreOverTheYears = () => {
	return request({
		url: 'api/scoreOver/scoreOverTheYears',
		method: 'POST',
		header: {
			'Content-type': 'application/json'
		},
		data: null
	})
}

// 根据年份、搜索内容、门类、一级学科/院校属性、省份 获取调剂列表
export const queryCollegeList = (params: Pagination) => {
	return request<Pagination, PageData<ResultType>>({
		url: '/api/retestadmission/multipleChoiceList',
		method: 'POST',
		header: {
			'Content-type': 'application/json'
		},
		data: params
	})
}

// 根据门类列表获取一级学科列表
export const searchDiscipline = (params: CategoryType[]) => {
	return request<CategoryType[], FirstLevelType[]>({
		url: 'api/retestadmission/discipline',
		method: 'POST',
		header: {
			'Content-type': 'application/json'
		},
		data: params
	})
}

// 获取商品列表
export const getCommodityList = (params: Pagination) => {
	return request<Pagination, PageData<ShopType>>({
		url: 'api/commodity/getList',
		method: 'POST',
		header: {
			'Content-type': 'application/json'
		},
		data: params
	})
}

export const getCommodityInfo = (commodityId: number) => {
	return request({
		url: `api/commodity/getInfo?commodityId=${commodityId}`,
		method: 'GET',
		header: {
			'Content-type': 'application/json'
		},
		data: null
	})
}

// 获取上传阿里云OSS签名信息
export const getOssSign = (fileName: string) => {
	return request({
		url: 'api/personalStudentInformation/getOssSign',
		method: 'POST',
		header: {
			'Content-type': 'application/json'
		},
		data: {
			name: fileName
		}
	})
}

// 根据openId返回图片
export const backPicture = (openId: string) => {
	return request({
		url: 'api/personalStudentInformation/backPicture',
		method: 'POST',
		header: {
			'Content-type': 'application/json'
		},
		data: {
			openId
		}
	})
}

// 提交审核
export const insterAdd = (params: UploadType) => {
	return request({
		url: 'api/personalStudentInformation/insterAdd',
		method: 'POST',
		header: {
			'Content-type': 'application/json'
		},
		data: params
	})
}

// 判断上传的图片的审核状态
export const judgeUpload = (openId?: any) => {
	return request({
		url: 'api/personalStudentInformation/judgeWhetherNull',
		method: 'POST',
		header: {
			'Content-type': 'application/json'
		},
		data: {
			openId
		}
	})
}