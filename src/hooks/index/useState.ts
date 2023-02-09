// @ts-ignore
import { reactive } from 'vue'
import { AuthType } from '../../types/auth'
import Taro from '@tarojs/taro'
import {useAuth} from "../useAuth";

const state = reactive<{
	tab11value: string,
	currentYear: string,
	pieChartType: string
}>({
	tab11value: '2',
	currentYear: '2021',
	pieChartType: '1'
})

const authState = reactive<AuthType>({
	code: '',
	avatarUrl: Taro.getStorageSync('avatarUrl'),
	nickName: Taro.getStorageSync('nickName'),
	openId: Taro.getStorageSync('openId'),
	phone: Taro.getStorageSync('phone'),
	overlayShow: false,
	dialogVisible: false
})

const {
	getUserProfile,
	getPhoneNumber,
	judgeUserInfo
} = useAuth(authState)

export { state, authState, getUserProfile, getPhoneNumber, judgeUserInfo }