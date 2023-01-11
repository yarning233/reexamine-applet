// @ts-ignore
import { ref, onMounted, defineComponent, PropType, toRefs } from 'vue'
import * as echarts from "../ec-canvas/echarts"
import ECanvas from '../ec-canvas/index'

interface OptionType {
	title?: object,
	tooltip?: {
		trigger: string
	},
	color?: string | string[],
	series?: any[],
	xAxis?: object,
	yAxis?: object
}

const DataChart = defineComponent({
	components: { ECanvas },
	props : {
		option: {
			type: Object as PropType<OptionType>
		}
	},
	setup(props, { expose }) {
		let chart
		let { option } = props

		const ecCanvasRef = ref()
		// const initChart = (canvas, width, height, dpr) => {
		// 	chart = echarts.init(canvas, null, {
		// 		width,
		// 		height,
		// 		devicePixelRatio: dpr,
		// 	})
		// 	canvas.setChart(chart)
		// 	refresh()
		// 	return chart
		// }

		const init = (opt?: Object) => {
			ecCanvasRef.value.init((canvas, width, height, dpr) => {
				chart = echarts.init(canvas, null, {
					width,
					height,
					devicePixelRatio: dpr,
				})
				canvas.setChart(chart)
				refresh(opt)
				return chart
			})
		}

		const ec: {
			lazyLoad?: boolean,
			onInit: (canvas, width, height, dpr) => void,
		} = {
			// lazyLoad: true,
			onInit: init,
		}

		const refresh = (opt?: OptionType) => {
			if ((opt?.series) !== undefined) {
				option = opt
			}
			chart?.setOption(option)
		}

		expose({ init })

		onMounted(() => {
			setTimeout(() => {
				ec.lazyLoad && init()
			}, 3000)
		})

		return () => (
			<e-canvas ref={ ecCanvasRef } canvas-id="pieCanvas" ec={ ec } force-use-old-canvas={ true }></e-canvas>
		)
	}
})

export default DataChart