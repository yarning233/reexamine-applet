// @ts-ignore
import { defineComponent, ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { ShopType } from '../../types/adjust'
import { getCommodityList } from '../../api/adjust'

const Find = defineComponent({
	setup() {
		const leftData = ref<ShopType[]>([])

		const rightData = ref<ShopType[]>([])

		const goContentPage = (id: number): void => {
			Taro.navigateTo({
				url: `/pages/findContent/index?id=${id}`
			})
		}

		const getList = async () => {
			const res = await getCommodityList({
				pageNum: 1,
				pageSize: 1000
			})

			if (res.code === 200) {
				res.data.list.map((item: ShopType, index: number) => {
					if ((index + 1) % 2 === 0) {
						rightData.value.push(item)
					} else {
						leftData.value.push(item)
					}
				})
			}
		}

		onMounted(() => {
			getList()
		})

		return () => (
			<view class={ styles.contentContain }>
				<view class={ styles.findContain }>
					<ul class={ styles.findLeft }>
						{
							leftData.value.map(item => {
								return <li key={ item.id } class={ styles.coverLi } onClick={ () => goContentPage(item.id) }>
									<view class={ styles.coverContain }>
										<image src={ item.coverUrl[0] } mode="widthFix" class={ styles.cover }/>
									</view>
									<view class={ styles.shopName }>
										{ item.tradeName }
									</view>
									<view class={ styles.priceContain }>
										<b class={ styles.originalPrice }>￥{ item.originalPrice }</b>
										<nut-tag type="danger">
											券后￥
											<b class={ styles.tagPrice }>{ item.postCouponPrice }</b>
										</nut-tag>
									</view>
								</li>
							})
						}
					</ul>
					<ul class={ styles.findRight }>
						{
							rightData.value.map(item => {
								return <li key={ item.id } class={ styles.coverLi } onClick={ () => goContentPage(item.id) }>
									<view class={ styles.coverContain }>
										<image src={ item.coverUrl[0] } mode="widthFix" class={ styles.cover }/>
									</view>
									<view class={ styles.shopName }>
										{ item.tradeName }
									</view>
									<view class={ styles.priceContain }>
										<b class={ styles.originalPrice }>￥{ item.originalPrice }</b>
										<nut-tag type="danger">
											券后￥
											<b class={ styles.tagPrice }>{ item.postCouponPrice }</b>
										</nut-tag>
									</view>
								</li>
							})
						}
					</ul>
				</view>
			</view>
		)
	}
})

export default Find