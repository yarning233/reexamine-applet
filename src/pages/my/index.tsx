// @ts-ignore
import { defineComponent, ref, reactive, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { useAuth } from '../../hooks/useAuth'
import { AuthType } from '../../types/auth'
import useToast from "../../utils/useToast"

const My = defineComponent({
	setup() {
		const state = reactive<AuthType>({
			code: '',
			avatarUrl: Taro.getStorageSync('avatarUrl'),
			nickName: Taro.getStorageSync('nickName'),
			openId: Taro.getStorageSync('openId'),
			overlayShow: false,
			phone: Taro.getStorageSync('phone')
		})

		const {
			getUserProfile,
			getPhoneNumber,
			judgeUserInfo
		} = useAuth(state)

		const goContentPage = () => {
			const res = judgeUserInfo()
			if (res) {
				Taro.navigateTo({
					url: '/pages/myContent/index'
				})
			}
		}

		const tmplId = '70c8uXliww8ndB4b4Vx5VU6dUqJuPayhKGB3xpdxGo4'
		const subscribed = ref<boolean>(false)
		const goNotify = () => {
			const res = judgeUserInfo()
			if (res) {
				Taro.requestSubscribeMessage({
					tmplIds: [tmplId],
					success: function (res) {
						if (res.errMsg == 'requestSubscribeMessage:ok' && res[tmplId] == 'accept' ) {
							useToast('已开启订阅！')
						} else {
							useToast('您取消了订阅！')
						}
					}
				})
				subscribed.value && useToast('已开启订阅！')
			}
		}

		onMounted(() => {
			Taro.login({
				success: function (res) {
					if (res.code) {
						state.code = res.code
					} else {
						console.log('登录失败！' + res.errMsg)
					}
				}
			})

			Taro.getSetting({
				withSubscriptions:true,
				success: function (res) {
					if (res.subscriptionsSetting[tmplId]) {
						subscribed.value = true
					}
				}
			})
		})

		return () => (
			<view class={ styles.contentContain }>
				<view class={ styles.avatarContain }>
					<view class={ styles.avatar }>
						<nut-avatar
							size="large"
							icon={ state.avatarUrl }
						></nut-avatar>
						{
							!state.openId ?
								<view class={ styles.nickname }>考研复试调剂</view>
							:	<view class={ styles.nickname }>{state.nickName}</view>
						}
					</view>

					<nut-button type="primary" onClick={ getUserProfile }>授权获取个人信息</nut-button>

					<nut-overlay visible={state.overlayShow} zIndex={2000} closeOnClickOverlay={false}>
						<view class={ styles.wrapper }>
							<view class={ styles.wrapperContent }>
								<view>请允许小程序获取您的手机号码，以便为您提供更好的服务</view>
								<nut-button type="primary" openType="getPhoneNumber"
								            onGetphonenumber={ getPhoneNumber }>同意授权获取手机号
								</nut-button>
							</view>
						</view>
					</nut-overlay>
				</view>

				<view class={ styles.unlockContain }>
					无限次查询 + 无限制搜索、筛选
					<nut-button type="primary" onClick={ goContentPage }>立即解锁</nut-button>
				</view>

				<view class={styles.unlockContain}>
					开启订阅，实时了解审核状态！
					<nut-button type="primary" onClick={ goNotify }>立即订阅</nut-button>
				</view>
			</view>
		)
	}
})

export default My