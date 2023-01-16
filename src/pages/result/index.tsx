// @ts-ignore
import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
// @ts-ignore
import type { Ref } from 'vue'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { ResultType } from "../../types/adjust"
import ResultList from "../../components/result-list"
import { queryCollegeList } from '../../api/adjust'
import useToast from "../../utils/useToast"
// import judge from "../../hooks/useJudge"
import { years } from '../../hooks/useYears'

const Result = defineComponent({
	components: { ResultList },
	setup() {
		const state = reactive<{
			tab11value: string
		}>({
			tab11value: '0'
		})

		const keyWord = ref<string>('')
		const currentPage = ref<number>(0)
		const pageSize = ref<number>(10)

		const customList = ref<ResultType[]>([])

		const search = () => {
			currentPage.value = 0
			customList.value = []
			customHasMore.value = true
			customLoadMore()
		}

		const resetChange = () => {
			currentPage.value = 0
			customList.value = []
			customHasMore.value = true
			customLoadMore()
		}

		const customHasMore = ref<boolean>(true)

		const dialogVisible = ref<boolean>(false)

		const dialogOk = () => {
			Taro.switchTab({
				url: '/pages/index/index'
			})
		}

		const customLoadMore = async (done?: Function) => {
			const res = await queryCollegeList({
				year: years.value[state.tab11value],
				keywords: keyWord.value,
				pageNum: ++(currentPage.value) as number,
				pageSize: pageSize.value
			})

			if (res.code === 200) {
				res.data.list.map(item => {
					customList.value.push(item)
				})

				if (currentPage.value === res.data.totalPage) {
					customHasMore.value = false
				}

				done && done()
			}
		}

		onMounted(async () => {
			// await judge()
			// const examineType = Taro.getStorageSync('examineType')

			// if (examineType === '0' || examineType === '2' || examineType === '') {
			// 	useToast('您尚未解锁全站会员')

			// 	dialogVisible.value = true
			// } else {
			// 	customLoadMore()
			// }

			const openId = Taro.getStorageSync('openId')
			const phone = Taro.getStorageSync('phone')

			if (openId  && phone) {
				await customLoadMore()
			} else {
				useToast('您尚未授权个人信息')

				dialogVisible.value = true
			}
		})

		return () => (
			<view class={ styles.contain }>
				<nut-sticky top="0" class={ styles.stickyContain }>
					<nut-searchbar v-model={ keyWord.value } onSearch={ search } placeholder="请输入关键字进行搜索"></nut-searchbar>
					<nut-tabs v-model={ state.tab11value } type="smile" onChange={ resetChange }>
						{
							years.value.map(year => {
								return <nut-tabpane title={ year }></nut-tabpane>
							})
						}
					</nut-tabs>
				</nut-sticky>

				<view class={ styles.contentList }>
					<view class={ styles.contentContain }>
						<ul class={ styles.infiniteUl } id="customScroll">
							<nut-infiniteloading
								load-txt="加载中"
								load-more-txt="没有啦～"
								container-id="customScroll"
								useWindow={false}
								hasMore={customHasMore.value}
								onLoadMore={customLoadMore}
							>
								<result-list customList={ customList.value } />
							</nut-infiniteloading>
						</ul>
					</view>
				</view>

				<nut-dialog
					teleport="#app"
					title="提示"
					// content="您尚未解锁全站会员，请解锁后再进行使用"
					content="您尚未授权个人信息，请授权后再进行使用"
					visible={ dialogVisible.value }
					noCancelBtn={ true }
					onOk={ dialogOk }
				>
				</nut-dialog>
			</view>
		)
	}
})
export default Result