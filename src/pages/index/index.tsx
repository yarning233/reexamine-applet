// @ts-ignore
import { reactive, ref, watch, onMounted } from "vue"
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import DataChart from "../../components/data-chart"
import ECanvas from '../../components/ec-canvas/index'
import { state, authState } from '../../hooks/index/useState'
import { years } from '../../hooks/useYears'
import {
	goCollegePage,
	goCategoryPage,
	goAdvancePage
} from '../../hooks/index/useNavigate'
import {
	chartRef,
	majorChartRef,
	scoreChartRef,
	collegeOption,
	majorOption,
	scoreOption,
	queryAdjustChartData,
	queryScoreLine
} from '../../hooks/index/useChart'

export default {
	name: 'Index',
	components: { DataChart, ECanvas },
	setup() {
		watch(() => state.tab11value, () => {
			state.currentYear = years.value[state.tab11value]
			queryAdjustChartData()
		})

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
			])
		})

		return () => (
			<view class={styles.container}>
				<view class={styles.header}>
					<span class={styles.headerLogo}>NEWS</span> 2023 考研复试系统正式开启!
				</view>

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