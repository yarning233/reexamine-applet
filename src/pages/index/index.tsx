// @ts-ignore
import { reactive, ref, watch, onMounted } from "vue"
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import DataChart from "../../components/data-chart"
import { ChartQueryType } from '../../types/adjust/index'
import {queryAdjustList, scoreOverTheYears} from '../../api/adjust'
import ECanvas from '../../components/ec-canvas/index'
import { useAuth } from '../../hooks/useAuth'
import { AuthType } from '../../types/auth'
import useToast from '../../utils/useToast'
import judge from './../../hooks/useJudge'

export default {
	name: 'Index',
	components: { DataChart, ECanvas },
	setup() {
		const state = reactive<{
			tab11value: string,
			currentYear: string,
			pieChartType: string
		}>({
			tab11value: '1',
			currentYear: '2022',
			pieChartType: '0'
		})

		const authState = reactive<AuthType>({
			code: '',
			avatarUrl: Taro.getStorageSync('avatarUrl'),
			nickName: Taro.getStorageSync('nickName'),
			openId: Taro.getStorageSync('openId'),
			phone: Taro.getStorageSync('phone'),
			overlayShow: false
		})

		const {
			getUserProfile,
			getPhoneNumber,
			judgeUserInfo
		} = useAuth(authState)

		const years = ref<string[]>(['2023', '2022', '2021', '2020', '2019', '2018'])

		const goCollegePage = () => {
			const examineType = Taro.getStorageSync('examineType')
			
			if (examineType === '0' || examineType === '2' || !examineType) {
				useToast('您尚未解锁全站会员')
			} else {
				Taro.navigateTo({
					url: '/pages/college/index'
				})
			}
		}

		const goCategoryPage = () => {
			const examineType = Taro.getStorageSync('examineType')

			if (examineType === '0' || examineType === '2' || !examineType) {
				useToast('您尚未解锁全站会员')
			} else {
				Taro.navigateTo({
					url: '/pages/category/index'
				})
			}
		}

		const goSearchResultPage = () => {
			const examineType = Taro.getStorageSync('examineType')

			if (examineType === '0' || examineType === '2' || !examineType) {
				useToast('您尚未解锁全站会员')
			} else {
				Taro.switchTab({
					url: '/pages/result/index'
				})
			}
		}

		const goMyContentPage = () => {
			const res = judgeUserInfo()
			if (res) {
				Taro.navigateTo({
					url: '/pages/myContent/index'
				})
			}
		}

		watch(() => state.tab11value, () => {
			state.currentYear = years.value[state.tab11value]
			queryAdjustChartData()
		})

		// const collegeChartTotal = ref<number>(0)
		// let collegeChartData = [] as ({name: string, value: number}[])
		const chartRef = ref()
		const majorChartRef = ref()
		const scoreChartRef = ref()

		const collegeOption = ref()

		const majorOption = ref()

		let scoreLineYearData = [] as string[]
		let scoreLineValueData = [] as number[]

		const scoreOption = ref()

		const queryAdjustChartData = async () => {
			const res = await queryAdjustList({
				year: years.value[state.tab11value],
				category: parseInt(state.pieChartType) as (0 | 1)
			} as ChartQueryType)

			if (res.code === 200) {
				if (state.pieChartType === '0') {
					if (res.data.length !== 0) {
						const { count, nineHundred, twoEleven, initiative, selfLineation } = res.data[0]

						collegeOption.value = {
							title: {
								text: `全国一共有 ${ count ? count : 0 } + 所院校参与调剂`,
								left: 'center'
							},
							tooltip: {
								trigger: 'item'
							},
							color: [
								"#5470c6",
								"#91cc75",
								"#fac858",
								"#ee6666"
							],
							series: [
								{
									name: '院校图表',
									type: 'pie',
									radius: '50%',
									data: [
										{
											name: '985',
											value: parseInt(nineHundred)
										},
										{
											name: '211',
											value: parseInt(twoEleven)
										},
										{
											name: '双一流',
											value: parseInt(initiative)
										},
										{
											name: '自划线',
											value: parseInt(selfLineation)
										}
									],
									emphasis: {
										itemStyle: {
											shadowBlur: 10,
											shadowOffsetX: 0,
											shadowColor: 'rgba(0, 0, 0, 0.5)'
										}
									}
								}
							]
						}

						chartRef.value.init(collegeOption.value)
					}
				} else {
					const majorData =  res.data.map(item => {
						return {name: item.categoryName, value: item.majorcount}
					})

					let majorDataCount = 0
					res.data.map((item) => {
						majorDataCount += item.majorcount
					})

					majorOption.value = {
						title: {
							text: `全国一共有 ${ majorDataCount ? majorDataCount : 0  } + 专业参与调剂`,
							left: 'center'
						},
						tooltip: {
							trigger: 'item'
						},
						color: [
							'#5470c6',
							'#91cc75',
							'#fac858',
							'#ee6666',
							'#73c0de',
							'#3ba272',
							'#fc8452',
							'#9a60b4',
							'#ea7ccc'
						],
						series: [
							{
								name: '专业图表',
								type: 'pie',
								radius: '50%',
								data: majorData,
								emphasis: {
									itemStyle: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 0, 0, 0.5)'
									}
								}
							}
						]
					}

					majorChartRef.value.init(majorOption.value)
				}
			}
		}

		const queryScoreLine = async () => {
			const res = await scoreOverTheYears()

			if (res.code === 200) {
				scoreLineYearData = res.data.map(item => item.particularYear)
				scoreLineValueData = res.data.map(item => item.fractionalLine)

				scoreOption.value = {
					xAxis: {
						type: 'category',
							data: scoreLineYearData
					},
					yAxis: {
						type: 'value'
					},
					color: 'orange',
					series: [
						{
							data: scoreLineValueData,
							type: 'line',
							backgroundStyle: {
								color: 'rgba(180, 180, 180, 0.2)'
							}
						}
					]
				}

				scoreChartRef.value.init(scoreOption.value)
			}
		}

		const goAdvancePage = () => {
			Taro.navigateTo({
				url: '/pages/advance/index'
			})
		}

		onMounted(() => {
			Taro.login({
				success: function (res) {
					if (res.code) {
						authState.code = res.code
					} else {
						console.log('登录失败！' + res.errMsg)
					}
				}
			})
			queryAdjustChartData()
			queryScoreLine()
			judge()
		})

		return () => (
			<view class={styles.container}>
				<view class={styles.header}>
					<span class={styles.headerLogo}>NEWS</span> 2023 考研调剂系统正式开启!
				</view>

				<view class={styles.vipBox}>
					<view>一站通 会员</view>
					{
						!authState.openId ?
							<nut-button type="primary" onClick={ getUserProfile }>授权个人信息免费解锁</nut-button> :
						!authState.phone ?
							<nut-button type="primary" openType="getPhoneNumber" onGetphonenumber={ getPhoneNumber }>授权手机号免费解锁</nut-button> :
						Taro.getStorageSync('examineType') !== '1' ?
							<nut-button type="primary" onClick={ goMyContentPage }>免费解锁</nut-button> :
							<nut-button type="primary">您已解锁</nut-button>
					}
				</view>

				<view class={styles.searchBar} onClick={ goSearchResultPage }>输入院校名称、专业名称等关键字搜索</view>

				<view class={styles.tabBar}>
					<view class={styles.tabContent}>
						<nut-tabs v-model={ state.tab11value } type="smile" style={ "backgroundColor: '#fff'" }>
							{
								years.value.map((year:string) => {
									return <nut-tabpane key={ year } title={ year }></nut-tabpane>
								})
							}
						</nut-tabs>
					</view>
				</view>

				{/*	饼图-院校专业切换 */}
				<view class={styles.pieContain}>
					<nut-tabs v-model={ state.pieChartType } onChange={ queryAdjustChartData }>
						<nut-tabpane title="院校" style={"backgroundColor: none"}>
							<view class={ styles.pieChartContain }>
								<view class={ styles.pieChartContent }>
									<data-chart ref={ chartRef } option={ collegeOption } />
								</view>
								<nut-button type="primary" block onClick={ goCollegePage }>立即查看</nut-button>
							</view>
						</nut-tabpane>
						<nut-tabpane title="专业" style={"backgroundColor: none"}>
							<view class={styles.pieChartContain}>
								<view class={styles.pieChartContent}>
									<data-chart ref={ majorChartRef } option={ majorOption } />
								</view>
								<nut-button type="primary" block onClick={ goCategoryPage }>立即查看</nut-button>
							</view>
						</nut-tabpane>
					</nut-tabs>
				</view>

				{/*	广告 */}
				<view class={ styles.advance } onClick={ goAdvancePage }>
					<image mode="widthFix" src={ 'https://kaoyancun.oss-cn-hangzhou.aliyuncs.com/tiaoji/fushi-advance.png' }  class={ styles.advanceImg }/>
				</view>

				{/* 历年分数线 */}
				<view class={ styles.fractionContain }>
					<view class={ styles.fractionTitle }>教育学近五年国家分数线</view>
					<view class={ styles.fractionContent }>
						<data-chart ref={ scoreChartRef } option={ scoreOption } />
					</view>
				</view>
			</view>
		)
	}
}