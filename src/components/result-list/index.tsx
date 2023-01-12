// @ts-ignore
import { defineComponent, ref, PropType } from 'vue'
import styles from '../../pages/result/index.module.scss'
import { ResultType } from "../../types/adjust"

const ResultList = defineComponent({
	props: {
		customList: {
			type: Array as PropType<ResultType>
		}
	},
	setup(props) {
		return () => (
			<>
				{
					props.customList.length >0 ? props.customList.map(result  => {
						return <li class={styles.infiniteLi}>
							<view class={styles.infiniteLiTitle}>
								<view class={styles.infiniteLiTitleContent}>
									<view class={styles.collegeName}>{result.collegeName}</view>
								</view>
								<view class={styles.province}>{result.province}</view>
							</view>
							<view class={ styles.infiniteLiAttr }>
								{ result.nineHundred ? <view class={styles.collegeAttr}>{result.nineHundred}</view> : '' }
								{ result.twoEleven ? <view class={styles.collegeAttr}>{result.twoEleven}</view> : '' }
								{ result.selfLineation ? <view class={styles.collegeAttr}>{result.selfLineation}</view> : '' }
								{ result.initiative ? <view class={styles.collegeAttr}>{result.initiative}</view> : '' }
							</view>
							<view class={styles.infiniteLiContent}>
								<view class={styles.infiniteLiContentLeft}>
									<view class={styles.infiniteLiContentText}>{'院系所：' + result.departmentName}</view>
									<view class={styles.infiniteLiContentText}>{'专业：' + result.majorName}</view>
									<view
										class={styles.infiniteLiContentText}>{'研究方向：(' + result.directionCode + ')' + result.directionName}</view>
									<view class={styles.infiniteLiContentText}>{'学习方式：' + result.learningStyle}</view>
									<view class={styles.infiniteLiContentText}>{'录取最高分：' + result.admissionHighestScore}</view>
									<view class={styles.infiniteLiContentText}>{'录取最低分：' + result.admissionMinimumScore}</view>
									<view class={styles.infiniteLiContentText}>{'建议分数：' + result.admissionRecommendedScore}</view>
								</view>
								<view class={styles.infiniteLiContentRight}>
									<view>录取人数</view>
									<view>{result.admissionsNumberPeople}</view>
								</view>
							</view>
							<view class={styles.infiniteLiBottom}>
								{/*<view class={styles.yearRange}>*/}
								{/*	{result.yearsRange[result.yearsRange.length - 1] + '年 - ' + result.yearsRange[0] + '年'}*/}
								{/*</view>*/}
								<view class={styles.currentYear}>{result.year + '年'}</view>
							</view>
						</li>
					}) : <nut-empty image="empty" description="无内容"></nut-empty>
				}
			</>
		)
	}
})

export default ResultList