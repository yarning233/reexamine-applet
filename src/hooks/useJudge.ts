import useToast from "../utils/useToast"
import Taro from '@tarojs/taro'
import {judgeUpload} from "../api/adjust"

const judge = async () => {
	const openId = Taro.getStorageSync('openId')
	if (!openId) {
		useToast('您尚未授权个人信息')
	} else {
		const res = await judgeUpload(openId)

		if (res.code === 200) {
			Taro.setStorageSync('examineType', res.data[0]?.examineType)
		}
	}
}

export default judge