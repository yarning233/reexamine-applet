import useToast from "../../utils/useToast"
import Taro from '@tarojs/taro'
import { judgeUserInfo } from './useState'

const judgeOpenIdAndPhone = (dir: string) => {
	const openId = Taro.getStorageSync('openId')
	const phone = Taro.getStorageSync('phone')

	if (openId && phone) {
		Taro.navigateTo({
			url: `/pages/${dir}/index`
		})
	} else {
		useToast('您尚未授权个人信息')
	}
}

const goCollegePage = () => {
	// const examineType = Taro.getStorageSync('examineType')

	// if (examineType === '0' || examineType === '2' || !examineType) {
	// 	useToast('您尚未解锁全站会员')
	// } else {
	// 	Taro.navigateTo({
	// 		url: '/pages/college/index'
	// 	})
	// }
	judgeOpenIdAndPhone('college')
}

const goCategoryPage = () => {
	// const examineType = Taro.getStorageSync('examineType')

	// if (examineType === '0' || examineType === '2' || !examineType) {
	// 	useToast('您尚未解锁全站会员')
	// } else {
	// 	Taro.navigateTo({
	// 		url: '/pages/category/index'
	// 	})
	// }
	judgeOpenIdAndPhone('category')
}

const goSearchResultPage = () => {
	// const examineType = Taro.getStorageSync('examineType')

	// if (examineType === '0' || examineType === '2' || !examineType) {
	// 	useToast('您尚未解锁全站会员')
	// } else {
	// 	Taro.switchTab({
	// 		url: '/pages/result/index'
	// 	})
	// }
	judgeOpenIdAndPhone('result')
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