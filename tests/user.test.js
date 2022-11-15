const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
	_id: userOneId,
	name: 'Mike',
	email: 'mike@example.com',
	password: 'test1111',
	tokens: [{
		token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
	}]
}

beforeEach(async () => {
	await User.deleteMany()
	await new User(userOne).save()
})

test('Sign up new user', async () => {
	const response = await supertest(app).post('/users').send({
		name: 'Andrew',
		email: 'andrew@example.com',
		password: 'MyPass777!'
	}).expect(201)

	// Assert that database was changed correctly
	const user = await User.findById(response.body.user._id)
	expect(user).not.toBeNull()

	// Assertions about the response
	expect(response.body).toMatchObject({
		user: {
			name: 'Andrew',
			email: 'andrew@example.com'
		},
		token: user.tokens[0].token
	})
	expect(user.password).not.toBe('MyPass777!')
})

test('Login existing user', async () => {
	const response = await supertest(app).post('/users/login').send({
		email: userOne.email,
		password: userOne.password
	}).expect(200)

	// Fetch user from database
	const user = await User.findById(response.body.user._id)
	expect(user).not.toBeNull()

	// Assert that the token in response matches user's second token
	expect(response.body.token).toEqual(user.tokens[1].token)
	expect(response.body).toMatchObject({
		token: user.tokens[1].token
	})
})

test('Fail login for nonexistant user', async () => {
	await supertest(app).post('/users/login').send({
		email: 'fakeaccount@fakeemail.fake',
		password: 'Fake0000'
	}).expect(400)
})

test('Get profile for user', async () => {
	await supertest(app)
		.get('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
})

test('Fail to get profile for unauthenticated user', async () => {
	await supertest(app)
		.get('/users/me')
		.send()
		.expect(401)
})

test('Delete account for user', async () => {
	const response = await supertest(app)
		.delete('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(200)
	
	// Attempt to fetch the user from database
	const user = await User.findById(userOneId)

	// Assert null-response
	expect(user).toBeNull()
})

test('Fail to delete account for unauthenticated user', async () => {
	await supertest(app)
		.delete('/users/me')
		.expect(401)
})

test('Upload avatar image', async () => {
	await supertest(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.attach('avatar', 'tests/fixtures/image.png')
		.expect(200)

	const user = await User.findById(userOneId)
	expect().toEqual()
})