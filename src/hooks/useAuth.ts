import Taro from '@tarojs/taro'
import Toast from '../utils/useToast'
import { wxLogin, getPhone } from '../api/login'
import { AuthType } from '../types/auth'
import judge from "./useJudge"

export const useAuth = (state: AuthType) => {
	// 授权个人信息
	const getUserProfile = () => {
		Taro.getUserProfile({
			desc: '用于完善会员资料',
			success: async function (res) {
				const { avatarUrl, gender, nickName } = res.userInfo

				Taro.setStorageSync('avatarUrl', avatarUrl)
				Taro.setStorageSync('gender', gender)
				Taro.setStorageSync('nickName', nickName)

				// 发送请求，获取个人信息、openid等
				const res2 = await wxLogin({
					code: state.code,
					avatarUrl,
					gender,
					nickName
				})

				if (res2.code === 200) {
					const { id, openId } = res2.userInfo!

					Taro.setStorageSync('id', id)
					Taro.setStorageSync('openId', openId)
					state.openId = openId
					state.avatarUrl = avatarUrl
					state.nickName = nickName

					judge()

					// 将遮罩层状态取反
					state.dialogVisible = !state.dialogVisible
					state.overlayShow = !state.overlayShow
				}
			}
		})
	}

	// 授权手机号逻辑
	const getPhoneNumber = async (e) => {
		const res = await getPhone(e.detail.code, state.openId!)
		if (res.code === 200) {
			Taro.setStorageSync('phone', res.data.phone)
			Taro.setStorageSync('userId', res.data.userId)
			state.overlayShow = false
			state.phone = res.data.phone

			const examineType = Taro.getStorageSync('examineType')

			if (examineType === '') {
				Taro.navigateTo({
					url: '/pages/myContent/index'
				})
			}
		}
	}

	// 判断是否已授权个人信息
	const judgeUserInfo = () => {
		if (Taro.getStorageSync('openId') === '') {
			Toast('请先登录')
		} else if (Taro.getStorageSync('phone') === '') {
			// 弹出授权手机号弹窗
			state.overlayShow = true
		} else {
			return true
		}
	}

	return {
		getUserProfile,
		getPhoneNumber,
		judgeUserInfo
	}
}