import Taro from '@tarojs/taro'

const Toast = (msg: string) => {
	return Taro.showToast({
		title: msg,
		icon: 'none',
		duration: 2000,
		mask: true
	})
}

export default Toast