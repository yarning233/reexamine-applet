import useToast from "../../utils/useToast"
import Taro from '@tarojs/taro'
import { judgeUserInfo } from './useState'

const goCollegePage = () => {
	const examineType = Taro.getStorageSync('examineType')

	if (examineType === '0' || examineType === '2' || !examineType) {
		useToast('您尚未解锁全站会员')
	} else {
		Taro.navigateTo({
			url: '/pages/college/index'
		})
	}
}

const goCategoryPage = () => {
	const examineType = Taro.getStorageSync('examineType')

	if (examineType === '0' || examineType === '2' || !examineType) {
		useToast('您尚未解锁全站会员')
	} else {
		Taro.navigateTo({
			url: '/pages/category/index'
		})
	}
}

const goSearchResultPage = () => {
	const examineType = Taro.getStorageSync('examineType')

	if (examineType === '0' || examineType === '2' || !examineType) {
		useToast('您尚未解锁全站会员')
	} else {
		Taro.switchTab({
			url: '/pages/result/index'
		})
	}
}

const goMyContentPage = () => {
	const res = judgeUserInfo()
	if (res) {
		Taro.navigateTo({
			url: '/pages/myContent/index'
		})
	}
}

const goAdvancePage = () => {
	Taro.navigateTo({
		url: '/pages/advance/index'
	})
}

export {
	goCollegePage,
	goCategoryPage,
	goSearchResultPage,
	goMyContentPage,
	goAdvancePage
}