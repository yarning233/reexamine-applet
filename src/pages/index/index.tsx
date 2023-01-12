// @ts-ignore
import { reactive, ref, watch, onMounted } from "vue"
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import DataChart from "../../components/data-chart"
import { ChartQueryType } from '../../types/adjust/index'
import {queryAdjustList, scoreOverTheYears} from '../../api/adjust'
import ECanvas from '../../components/ec-canvas/index'
import judge from './../../hooks/useJudge'
import { state, authState, getUserProfile, getPhoneNumber } from '../../hooks/index/useState'
import { years } from '../../hooks/useYears'
import {
	goCollegePage,
	goCategoryPage,
	goSearchResultPage,
	goMyContentPage,
	goAdvancePage
} from '../../hooks/index/useNavigate'
import {
	chartRef,
	majorChartRef,
	scoreChartRef,
	collegeOption,
	collegeCount,
	collegeData,
	majorOption,
	majorDataCount,
	majorData,
	scoreOption,
	scoreLineYearData,
	scoreLineValueData
} from '../../hooks/index/useChart'

export default {
	name: 'Index',
	components: { DataChart, ECanvas },
	setup() {
		watch(() => state.tab11value, () => {
			state.currentYear = years.value[state.tab11value]
			queryAdjustChartData()
		})

		const queryAdjustChartData = async () => {
			const res = await queryAdjustList({
				year: years.value[state.tab11value],
				category: parseInt(state.pieChartType) as (0 | 1)
			} as ChartQueryType)

			if (res.code === 200) {
				if (state.pieChartType === '0') {
					if (res.data.length !== 0) {
						const { count, nineHundred, twoEleven, initiative, selfLineation } = res.data[0]

						collegeCount.value = count
						collegeData.value = [
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
						]

						collegeOption.value = {
							title: {
								text: `全国一共有 ${ collegeCount.value ? collegeCount.value : 0 } + 所院校参与复试`,
								left: 'center'
							},
							tooltip: {
								trigger: 'item'
							},
							color: [
								'#158AD2',
								'#69BFFF',
								'#50ADA3',
								'#00DEAE'
							],
							series: [
								{
									name: '院校图表',
									type: 'pie',
									radius: '50%',
									data: collegeData.value,
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
					majorData.value =  res.data.map(item => {
						return {name: item.categoryName, value: item.majorcount}
					})
					res.data.map((item) => {
						majorDataCount.value += item.majorcount
					})

					majorOption.value = {
						title: {
							text: `全国一共有 ${ majorDataCount ? majorDataCount : 0  } + 专业参与复试`,
							left: 'center'
						},
						tooltip: {
							trigger: 'item'
						},
						color: [
							'#158AD2',
							'#E34890',
							'#37C190',
							'#00D9DB',
							'#158AD2',
							'#A94BA0',
							'#C8628C',
							'#00DEAE'
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
				scoreLineYearData.value = res.data.map(item => item.particularYear)
				scoreLineValueData.value = res.data.map(item => item.fractionalLine)

				scoreOption.value = {
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: scoreLineYearData
					},
					yAxis: {
						type: 'value'
					},
					color: 'darkcyan',
					series: [
						{
							data: scoreLineValueData,
							type: 'line'
						}
					]
				}

				scoreChartRef.value.init(scoreOption.value)
			}
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
			Promise.all([
				queryAdjustChartData(),
				queryScoreLine(),
				judge()
			])
		})

		return () => (
			<view class={styles.container}>
				<view class={styles.header}>
					<span class={styles.headerLogo}>NEWS</span> 2023 考研复试系统正式开启!
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