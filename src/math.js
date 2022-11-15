const calculateTip = (total, tipPercent = .2) => total + (total * tipPercent)

const fahrenheitToCelsius = (temp) => {
	return new Promise((resolve, reject) => {
		setTimeout(() =>{
			if (temp < 0) {
				return reject('We want warmer weather')
			}
			resolve((temp - 32) / 1.8)
		}, 2000)
	})
}

const celsiusToFahrenheit = (temp) => {
    return new Promise((resolve, reject) => {
		setTimeout(() =>{
			if (temp < 0) {
				return reject('We want warmer weather')
			}
			resolve((temp * 1.8) + 32)
		}, 2000)
	})
}

module.exports = {
	calculateTip, fahrenheitToCelsius, celsiusToFahrenheit
}