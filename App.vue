<script>
import {list} from './utils/cateogory.js'
	export default {
		onLaunch: function() {
			list().then((res)=>{
				uni.setStorageSync("categories",res.data)
			})
			const token = uni.getStorageSync('token');
			    if (!token) {
			      uni.reLaunch({
			        url: '/pages/login/login'
			      });
			    }
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
