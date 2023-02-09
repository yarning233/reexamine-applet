// @ts-ignore
import { defineComponent, ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

const Initiate = defineComponent({
	setup () {
		const second = ref<number>(5)

		const goIndex = () => {
			Taro.switchTab({
				url: '/pages/index/index'
			})
		}

		const goAdvancePage= () => {
			Taro.navigateTo({
				url: '/pages/advance/index'
			})
		}

		onMounted(() => {
			const timer = setInterval(() => {
				second.value -= 1
				if (second.value === 0) {
					clearInterval(timer)

					goIndex()
				}
			}, 1000)
		})

		return () => (
			<view class={ styles.contain } onClick={ goAdvancePage }>
				<view class={ styles.close } onClick={ goIndex }>
					{ second.value }S
					<nut-icon name="close" size={'12px'}></nut-icon>
				</view>
			</view>
		)
	}
})

export default Initiate