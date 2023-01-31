import Taro from '@tarojs/taro'
import { judgeUserInfo } from './useState'

const judgeOpenIdAndPhone = (dir: string) => {
	Taro.navigateTo({
		url: `/pages/${dir}/index`
	})
}

const goCollegePage = () => {
	judgeOpenIdAndPhone('college')
}

const goCategoryPage = () => {
	judgeOpenIdAndPhone('category')
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
	goMyContentPage,
	goAdvancePage
}