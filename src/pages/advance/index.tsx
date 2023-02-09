import Taro from '@tarojs/taro'
import { defineComponent, onMounted } from 'vue'

const Advance = defineComponent({
	setup() {
		Taro.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 10000
		})

		onMounted(() => {
			console.log(1)
			Taro.downloadFile({
				url: 'https://kaoyancun.oss-cn-hangzhou.aliyuncs.com/img/fsbd.pdf',
				success: function (res) {
					const filePath = res.tempFilePath
		
					Taro.openDocument({
						filePath,
						success(res) {
							console.log(res)
							Taro.navigateBack()
						}
					})
				}
			})
		})

		return () => (
			<div></div>
			// <web-view src="https://www.kaoyan1v1.com/fsbd"></web-view>
		)
	}
})

export default Advance