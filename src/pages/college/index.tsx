// @ts-ignore
import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
// @ts-ignore
import type { Ref } from 'vue'
import styles from '../result/index.module.scss'
import { ResultType } from "../../types/adjust"
import ResultList from "../../components/result-list"
import { queryCollegeList } from "../../api/adjust"
import { years } from '../../hooks/useYears'

const College = defineComponent({
	components: { ResultList },
	setup() {
		const state = reactive<{
			tab11value: string
		}>({
			tab11value: '0'
		})

		const keyWord = ref<string>('')

		const customList = ref<ResultType[]>([])

// const collegeAttrGroup = ref(null) as Ref
		const collegeAttrCheckboxGroup = ref<string[]>([])
		const collegeProvinceCheckboxGroup = ref<string[]>([])
		const provinces = ref<string[]>([
			'北京','天津','上海','重庆','新疆','西藏','青海','四川','贵州','云南',
			'广西','广东','福建','江西','浙江','湖南','江苏','安徽','湖北','陕西',
			'河南','山西','山东','河北','吉林','辽宁','海南','甘肃','宁夏','内蒙古','黑龙江'
		])
		const collegeAttrRef = ref(null) as Ref
		const collegeProvinceRef = ref(null) as Ref

		const isCheckAllAttr = ref<boolean>(false)
		const isCheckAllProvince = ref<boolean>(false)

		const changeCollegeAttr = () => {
			if (isCheckAllAttr.value) {
				collegeAttrRef.value.toggleAll(true)
			} else {
				collegeAttrRef.value.toggleAll(false)
			}

			autoQuery()
		}

		const changeCollegeProvince = () => {
			if (isCheckAllProvince.value) {
				collegeProvinceRef.value.toggleAll(true)
			} else {
				collegeProvinceRef.value.toggleAll(false)
			}

			autoQuery()
		}

		const currentPage = ref<number>(0)
		const pageSize = ref<number>(10)
		const customHasMore = ref<boolean>(true)

		const resetChange = () => {
			autoQuery()
		}

		const search = () => {
			autoQuery()
		}

		const autoQuery = () => {
			currentPage.value = 0
			customList.value = []
			customHasMore.value = true
			customLoadMore()
		}

		const customLoadMore = async (done?: Function) => {
			const res = await queryCollegeList({
				year: years.value[state.tab11value],
				keywords: keyWord.value,
				pageNum: ++(currentPage.value) as number,
				pageSize: pageSize.value,
				province: collegeProvinceCheckboxGroup.value,
				nineHundred: collegeAttrCheckboxGroup.value.includes('985') ? '985' : undefined,
				twoEleven: collegeAttrCheckboxGroup.value.includes('211') ? '211' : undefined,
				selfLineation: collegeAttrCheckboxGroup.value.includes('自划线') ? '自划线' : undefined,
				initiative: collegeAttrCheckboxGroup.value.includes('双一流') ? '双一流' : undefined,
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

		onMounted(() => {
			autoQuery()
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

				{/* 院校多选框 */}
				<view class={ styles.collegeCheckContain }>
					<view class={ styles.collegeAttrCheckBar }>
						<view>院校属性：</view>
						<view class={styles.checkboxGroupContent}>
							<nut-checkbox label="全选" onChange={ changeCollegeAttr } v-model={ isCheckAllAttr.value }>全选</nut-checkbox>
							<nut-checkboxgroup v-model={ collegeAttrCheckboxGroup.value } ref={ collegeAttrRef }
							                   class={ styles.checkboxGroup } onClick={ resetChange }>
								<nut-checkbox label="985">985</nut-checkbox>
								<nut-checkbox label="211">211</nut-checkbox>
								<nut-checkbox label="自划线">自划线</nut-checkbox>
								<nut-checkbox label="双一流">双一流</nut-checkbox>
							</nut-checkboxgroup>
						</view>
					</view>

					<view class={styles.collegeAttrCheckBar}>
						<view>归属：</view>
						<view class={ styles.checkboxGroupContent }>
							<nut-checkbox label="全选" onChange={changeCollegeProvince} v-model={ isCheckAllProvince.value }>全选</nut-checkbox>
							<nut-checkboxgroup v-model={collegeProvinceCheckboxGroup.value} ref={collegeProvinceRef}
							                   class={styles.checkboxGroup} onClick={ resetChange }>
								{
									provinces.value.map(pro => {
										return <nut-checkbox label={pro} class={ styles.checkbox }>{pro}</nut-checkbox>
									})
								}
							</nut-checkboxgroup>
						</view>
					</view>
				</view>

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
			</view>
		)
	}
})
export default College