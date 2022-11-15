const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit } = require('../src/math')

test('Calculate total with tip', () => {
	const total = calculateTip(10, .3)
	expect(total).toBe(13)
})

/*
test('Calculate total wiht default tip', () => {
	const total = calculateTip(10)
	expect(total).toBe(12)
})

test('Should convert 32 F to 0 C', (done) => {
	fahrenheitToCelsius(32).then((temp) => {
		expect(temp).toBe(0)
		done()
	})
})

test('Should convert 0 C to 32 F', async () => {
	const temp = await celsiusToFahrenheit(0)
	expect(temp).toBe(32)
})

test('Async test demo', (done) => {
	setTimeout(() => {
		expect(1).toBe(2)
		done()
	}), 2000
})
*/