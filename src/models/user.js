const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true, unique: true,
		trim: true, lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) throw new Error('Email is invalid!')
		}
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if (value < 0) throw new Error('Age must be a positive number!')
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: [6, 'Password must be at least 6 characters long!'],
		validate(value) {
			if (value.toLowerCase().includes('password')) throw new Error('C\'MON! You password can\'t be "' + value + '"...')
		}
	},
	avatar: {
		type: Buffer
	},
	tokens: [{
		token: { type: String, required: true }
	}]
}, {
	timestamps: true
})

// Connect users and tasks
userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner'
})

// Only return public information
userSchema.methods.toJSON = function() {
	const user = this.toObject()

	delete user.password
	delete user.tokens
	delete user.avatar
	return user
}

// Generate jwt-Authentication Tokens
userSchema.methods.generateAuthToken = async function() {
	const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)
	this.tokens = this.tokens.concat({ token })
	await this.save()

	return token
}

// Method for finding user by matching username and password (for logins)
userSchema.statics.findByCredentials = async function(email, password) {
	const user = await User.findOne({ email })
	if (!user) throw new Error('Unable to login')

	const isMatch = await bcrypt.compare(password, user.password)
	if (!isMatch) throw new Error('Unable to login')
	return user
}

//// Middleware ////

// Hash plaintext password before saving
userSchema.pre('save', async function(next) {
	if(this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 8)
	}
	next()
})

// Delete a user's tasks when the user is removed
userSchema.pre('remove', async function(next) {
	await Task.deleteMany({ owner: this._id })
	next()
})


//// Wrapping up model and exporting ////
const User = mongoose.model('User', userSchema)

module.exports = User