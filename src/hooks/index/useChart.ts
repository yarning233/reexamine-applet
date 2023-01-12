// @ts-ignore
import { ref } from 'vue'

const chartRef = ref()
const majorChartRef = ref()
const scoreChartRef = ref()

const collegeCount = ref<number>(0)
const collegeData = ref<{
	name: string,
	value: number
}[]>()
const collegeOption = ref()

const majorDataCount = ref<number>(0)
const majorData = ref<{
	name: string,
	value: number
}[]>([])
const majorOption = ref()

const scoreLineYearData = ref([])
const scoreLineValueData = ref([])
const scoreOption = ref()

export {
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
}