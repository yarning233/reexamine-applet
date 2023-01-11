// @ts-ignore
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import { getCommodityInfo } from "../../api/adjust"

const FindContent = defineComponent({
	setup() {
		const router = useRouter()

		const imagesData = ref<string[]>([])

		const qrCode = ref<string>('')

		const shopOriginalPrice = ref<string>('')
		const shopPostCouponPrice = ref<string>('')

		const getInfo = async () => {
			const res = await getCommodityInfo(router.params.id! as unknown as number)

			if (res.code === 200) {
				const { detailsUrl, originalPrice, postCouponPrice, purchasePicUrl } = res.data.list[0]!

				imagesData.value = detailsUrl
				qrCode.value = purchasePicUrl[0]!
				shopOriginalPrice.value = originalPrice
				shopPostCouponPrice.value = postCouponPrice
			}
		}

		onMounted(() => {
			getInfo()
		})

		return () => (
			<view class={ styles.contentContain }>
				{
					imagesData.value.map(img => {
						return <image src={ img } mode="widthFix" class={ styles.contentImage } showMenuByLongpress={ true }/>
					})
				}
				<view class={ styles.fixBox }>
					<view class={ styles.fixLeft }>
						<view class={ styles.fixPrice }>
							￥<b class={ styles.originalPrice }>{ shopOriginalPrice.value }</b>
							<nut-tag type="danger">
								券后￥
								<b class={ styles.tagPrice }>{ shopPostCouponPrice.value }</b>
							</nut-tag>
						</view>
						<view class={ styles.remark }>
							长按识别二维码打开“小鹅通”<b class={ styles.pon }>领券</b>购买
						</view>
					</view>
					<view class={ styles.fixRight }>
						<image class={ styles.qrCode } src={ qrCode.value } mode="widthFix" showMenuByLongpress={ true }></image>
					</view>
				</view>
			</view>
		)
	}
})

export default FindContent