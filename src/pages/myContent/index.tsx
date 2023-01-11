// @ts-ignore
import { defineComponent, ref, onMounted, reactive } from 'vue'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import {backPicture, getOssSign, insterAdd} from '../../api/adjust'
import useToast from "../../utils/useToast"
import judge from '../../hooks/useJudge'

const MyContent = defineComponent({
	setup() {
		const gif = 'https://kaoyancun.oss-cn-hangzhou.aliyuncs.com/tiaoji/chuo.gif'

		const fileList = ref<string[]>([])
		const fileUploadList = ref<string[]>([])
		const uploadList = ref<string[]>(['1','2'])
		const ossSign = reactive({
			OSSAccessKeyId: '',
			policy: '',
			Signature: '',
			dir: '',
			host: '',
			expire: '',
		})

		// @ts-ignore
		const onShareAppMessage = (res => {
			if (res.from === 'button') {
				// 来自页面内转发按钮
				console.log(res.target)
			}
			return {
				title: '考研复试调剂查询利器',
				path: '/pages/index/index'
			}
		})

		const getSign = async (fileName: string) => {
			const res = await getOssSign(fileName)

			if (res.code === 200) {
				Object.assign(ossSign, res.data)

				fileUploadList.value.push(fileName)
			}
		}

		const preview = (e) => {
			Taro.previewImage({
				current: e, // 当前显示图片的http链接
				urls: fileList.value // 需要预览的图片http链接列表
			})
		}

		const insterAddHandle = async () => {
			const res = await insterAdd({
				phone: Taro.getStorageSync('phone'),
				openId: Taro.getStorageSync('openId'),
				picture: fileUploadList.value
			})

			if (res.code === 200) {
				useToast('上传成功')
			}
		}

		const unlock = () => {
			const examineType = Taro.getStorageSync('examineType')

			if (examineType === '') {
				if (fileUploadList.value.length !== 2) {
					useToast('必须上传两张图片')
				} else {
					insterAddHandle()
					getImg()

					Taro.navigateBack({
						delta: 1
					})
				}
			} else {
				useToast('您已上传成功，请等待审核消息')
			}
		}

		onMounted(() => {
			judge()
		})

		const chooseImage = async () => {
			Taro.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album'],
				async success(res) {
					const tempFilePaths = res.tempFilePaths
					const tempFilePathsSplit = tempFilePaths[0].split('/')
					const fileName = 'tiaoji/' + tempFilePathsSplit[tempFilePathsSplit.length - 1]

					await getSign(fileName)

					const { OSSAccessKeyId, policy, Signature, dir } = ossSign

					Taro.uploadFile({
						url: 'https://tiaoji-system.oss-cn-hangzhou.aliyuncs.com',
						filePath: tempFilePaths[0],
						name: 'file',
						formData: {
							key: dir,
							policy,
							OSSAccessKeyId,
							signature: Signature,
							success_action_status: '200'
						},
						success(res) {
							if (res.statusCode === 200) {
								fileList.value.push(tempFilePaths[0])
								switch (fileList.value.length) {
									case 0:
										uploadList.value = ['1', '2']
										break
									case 1:
										uploadList.value = ['1']
										break
									case 2:
										uploadList.value = []
										break
									default:
										break
								}
							}
						}
					})
				}
			})
		}

		const getImg = async () => {
			const res = await backPicture(Taro.getStorageSync('openId'))

			if (res.code === 200) {
				res.data[0].imageUrls?.map(img => {
					fileList.value.push(img)

					switch (fileList.value.length) {
						case 0:
							uploadList.value = ['1', '2']
							break
						case 1:
							uploadList.value = ['1']
							break
						case 2:
							uploadList.value = []
							break
						default:
							break
					}
				})
			}
		}

		onMounted(() => {
			getImg()
		})

		return () => (
			<view class={ styles.contentContain }>
				<view class={ styles.noShare }>
					不想分享？购买一站通会员
					<img src={ gif } alt="gif" class={ styles.gif }/>
				</view>

				<view class={ styles.unlock }>
					<view class={ styles.unlockTitle }>
						- 3分钟免费解锁 -
					</view>
					<view class={ styles.unlockText }>
						<view class={ styles.shareTitle }>分享</view>
						<view class={ styles.unlockRemarks }>
							<nut-button type="primary" class={ styles.shareBtn } openType="share">
								<nut-icon name="share" size="12" class={ styles.shareIcon }></nut-icon>
								分享
							</nut-button>
							小程序到<view class={ styles.highText }>考研群</view>（群人数<view class={ styles.highText }>100人以上</view>）分享成功<view class={ styles.highText }>3分钟后</view>截图;<view class={ styles.bgText }>1个群</view>解锁
							<view class={ styles.bgText }>1个周，</view>
							<view class={ styles.bgText }>2个群，</view>解锁<view class={ styles.bgText }>全程。</view>
						</view>
						<nut-noticebar
							text="人工审核，不按要求分享会被拉入黑名单哦~"
							scrollable={ false }
							background={`rgba(251, 248, 220, 1)`}
							color={"#D9500B"}
							left-icon={'close'}
						></nut-noticebar>

						<view class={ styles.uploaderContain }>
							<view class={ styles.uploaderTitle }>
								上传截图
							</view>
							<view class={styles.uploader}>
								{
									fileList.value.map(file => {
										return <view class={styles.uploadBox}>
											<img src={file} class={ styles.uploadImg } alt="上传图片" onClick={ () => preview(file) }></img>
										</view>
									})
								}
								{
									uploadList.value.map(() => {
										return <view class={styles.uploadBox} onClick={ chooseImage }>
											<nut-icon name="uploader" size="20px"></nut-icon>
										</view>
									})
								}
							</view>
						</view>

						<nut-button type="primary" block onClick={ unlock }>立即解锁</nut-button>
					</view>
				</view>
			</view>
		)
	}
})

export default MyContent