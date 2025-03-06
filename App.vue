<script>
	export default {
		onLaunch: function() {
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
