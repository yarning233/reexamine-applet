import { authState, getUserProfile, getPhoneNumber } from "../../hooks/index/useState"
import Taro from '@tarojs/taro'
import { defineComponent, onMounted } from "vue"
import styles from './index.module.scss'

const AuthPopup = defineComponent({
  setup() {
    onMounted(() => {
      const openId = Taro.getStorageSync('openId')
			const phone = Taro.getStorageSync('phone')

      if (!openId || !phone) {
				authState.dialogVisible = true
			}
    }) 

    return () => (
      <>
        <nut-overlay v-model={[authState.dialogVisible, 'visible']} zIndex={2000} closeOnClickOverlay={false}>
					<view class={ styles.wrapper }>
						<view class={ styles.wrapperContent }>
							<view>您尚未授权个人信息，请授权后再使用</view>
							<nut-button type="primary" onClick={ getUserProfile }>同意授权个人信息
							</nut-button>
						</view>
					</view>
				</nut-overlay>

				<nut-overlay visible={authState.overlayShow} zIndex={2000} closeOnClickOverlay={false}>
					<view class={ styles.wrapper }>
						<view class={ styles.wrapperContent }>
							<view>系统内涵盖近六年超100W条调剂数据，授权手机号第一时间看最新调剂资讯</view>
							<nut-button type="primary" openType="getPhoneNumber"
													onGetphonenumber={ getPhoneNumber }>同意授权获取手机号
							</nut-button>
						</view>
					</view>
				</nut-overlay>
      </>
    )
  }
})

export default AuthPopup