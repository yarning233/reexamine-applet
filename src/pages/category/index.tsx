// @ts-ignore
import { defineComponent, reactive, ref, onMounted } from 'vue'
import styles from '../result/index.module.scss'

// @ts-ignore
import type { Ref } from 'vue'
import { ResultType } from "../../types/adjust"
import ResultList from "../../components/result-list"
import {queryCollegeList, searchDiscipline} from "../../api/adjust"
import { FirstLevelType } from '../../types/adjust'

const Category = defineComponent({
	components: { ResultList },
	setup() {
		const state = reactive<{
			tab11value: string
		}>({
			tab11value: '0'
		})
		const keyWord = ref<string>('')
		const years = ref<string[]>(['2023','2022', '2021', '2020', '2019', '2018'])

		const customList = ref<ResultType[]>([])

		const collegeCategoryCheckboxGroup = ref<string[]>([])
		const collegeProvinceCheckboxGroup = ref<string[]>([])

		const firstLevels = ref<FirstLevelType[]>([])
		const categories = ref<{categoryCode: string, categoryName: string}[]>([
			{
				categoryCode: '01',
				categoryName: '哲学'
			},
			{
				categoryCode: '02',
				categoryName: '经济学'
			},
			{
				categoryCode: '03',
				categoryName: '法学'
			},
			{
				categoryCode: '04',
				categoryName: '教育学'
			},
			{
				categoryCode: '05',
				categoryName: '文学'
			},
			{
				categoryCode: '06',
				categoryName: '历史学'
			},
			{
				categoryCode: '07',
				categoryName: '理学'
			},
			{
				categoryCode: '08',
				categoryName: '工学'
			},
			{
				categoryCode: '09',
				categoryName: '农学'
			},
			{
				categoryCode: '10',
				categoryName: '医学'
			},
			{
				categoryCode: '11',
				categoryName: '军事学'
			},
			{
				categoryCode: '12',
				categoryName: '管理学'
			},
			{
				categoryCode: '13',
				categoryName: '艺术学'
			},
			{
				categoryCode: '14',
				categoryName: '交叉学科'
			}
		])

		const collegeProvinceRef = ref(null) as Ref
		const collegeCategoryRef = ref(null) as Ref

		const isCheckAllProvince = ref<boolean>(false)
		const isCheckAllCategory = ref<boolean>(false)

		const getFirstLevelDisciplineList = async () => {
			const categories = collegeCategoryCheckboxGroup.value.map(category => {
				return { category }
			})

			if (categories.length !== 0) {
				const res = await searchDiscipline(categories)

				if (res.code === 200) {
					firstLevels.value = res.data.map( item => {
						return {
							firstLevelDiscipline: item.firstLevelDiscipline,
							firstLevelName: item.firstLevelName
						}
					})
				}
			}
			resetChange()
		}

		const changeCollegeCategory = () => {
			if (isCheckAllCategory.value) {
				collegeCategoryRef.value.toggleAll(true)
			} else {
				collegeCategoryRef.value.toggleAll(false)
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
			currentPage.value = 0
			customList.value = []
			autoQuery()
		}

		const search = () => {
			currentPage.value = 0
			customList.value = []
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
				category: collegeCategoryCheckboxGroup.value,
				firstLevelDiscipline: collegeProvinceCheckboxGroup.value
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
			<view class={styles.contain}>
				<nut-sticky top="0" class={styles.stickyContain}>
					<nut-searchbar v-model={keyWord.value} onSearch={search} placeholder="请输入关键字进行搜索"></nut-searchbar>
					<nut-tabs v-model={state.tab11value} type="smile" onChange={ resetChange }>
						{
							years.value.map(year => {
								return <nut-tabpane title={year}></nut-tabpane>
							})
						}
					</nut-tabs>
				</nut-sticky>

				{/* 院校多选框 */}
				<view class={styles.collegeCheckContain}>
					<view class={styles.collegeAttrCheckBar}>
						学科门类：
						<view class={styles.checkboxGroupContent}>
							<nut-checkbox label="全选" onChange={changeCollegeCategory} v-model={isCheckAllCategory.value}>全选
							</nut-checkbox>
							<nut-checkboxgroup v-model={collegeCategoryCheckboxGroup.value} ref={collegeCategoryRef}
							                   class={styles.checkboxGroup} onChange={ getFirstLevelDisciplineList }>
								{
									categories.value.map(pro => {
										return <nut-checkbox label={pro.categoryCode} class={styles.checkbox}>{pro.categoryName}</nut-checkbox>
									})
								}
							</nut-checkboxgroup>
						</view>
					</view>

					<view class={styles.collegeAttrCheckBar}>
						<view>一级学科：</view>
						<view class={styles.checkboxGroupContent}>
							<nut-checkbox label="全选" onChange={changeCollegeProvince} v-model={isCheckAllProvince.value}>全选
							</nut-checkbox>
							<nut-checkboxgroup v-model={collegeProvinceCheckboxGroup.value} ref={collegeProvinceRef}
							                   class={styles.checkboxGroup} onChange={ resetChange }>
								{
									firstLevels.value.map(pro => {
										return <nut-checkbox label={pro.firstLevelDiscipline} class={styles.checkbox}>{pro.firstLevelName}</nut-checkbox>
									})
								}
							</nut-checkboxgroup>
						</view>
					</view>
				</view>

				<view class={styles.contentList}>
					<view class={styles.contentContain}>
						<ul class={ styles.infiniteUl } id="customScroll">
							<nut-infiniteloading
								load-txt="加载中"
								load-more-txt="没有啦～"
								container-id="customScroll"
								useWindow={false}
								hasMore={customHasMore.value}
								onLoadMore={customLoadMore}
							>
								<result-list customList={customList.value}/>
							</nut-infiniteloading>
						</ul>
					</view>
				</view>
			</view>
		)
	}
})

export default Category