// 缓存函数，设置或获取缓存值，带有过期时间戳
function cache(key, value, seconds) {
	// key: 缓存的键名，必填
	// value: 缓存的值，选填，如果为空则表示获取缓存，如果不为空则表示设置缓存
	// seconds: 缓存的过期时间，单位为秒，选填，默认为28天
	// 获取当前时间戳，单位为秒
	const timestamp = Date.parse(new Date()) / 1000;
	// console.log(`${timestamp}===${key}`);
	// 如果key为空，直接返回
	if (!key) {
		// console.log("key不能空");
		return;
	}
	// 如果value为空，表示获取缓存
	if (value === null) {
		// 获取缓存值，并按照"|"分割成数组
		const val = uni.getStorageSync(key);
		const tmp = val.split("|");
		// 如果数组的第二个元素不存在或者小于等于当前时间戳，表示缓存已过期，删除缓存并返回空字符串
		if (!tmp[1] || timestamp >= tmp[1]) {
			uni.removeStorageSync(key);
			return "";
		}
		// 否则表示缓存未过期，返回数组的第一个元素，即缓存值
		else {
			// console.log("key未失效");
			return tmp[0];
		}
	}
	// 如果value不为空，表示设置缓存
	else {
		// 如果seconds为空，则使用默认值28天，否则使用传入的值
		const expire = seconds ? timestamp + seconds : timestamp + 3600 * 24 * 28;
		// 将缓存值和过期时间戳用"|"连接成一个字符串，并存入缓存 无拼接过期时间
		value = `${value}`;
		uni.setStorageSync(key, value);
	}
}
export default cache