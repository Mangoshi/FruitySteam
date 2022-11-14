const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

// Defining user schema
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        // Leading/trailing whitespace will be removed
        trim: true,
        required: [true, 'Username is required!']
    },
    email: {
        type: String,
        // Email has to be unique
        unique: true,
        // Email will be stored in lowercase
        lowercase: true,
        trim: true,
        required: [true, 'Email is required!']
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    role: {
        type: String,
        // Default role is basic (not admin)
        default: "basic",
        lowercase: true,
        required: [true, 'Role is required!']
    },
    wishlist: {
        // Array of Mongo ObjectIds, referencing Game Objects
        type: [{type: Schema.Types.ObjectId, ref: 'Game'}],
    }
}, {
    // Created/updated timestamps will be automatically made
    timestamps: true
})

// This is to be extra sure mongoose is aware of the unique fields
// A mongo shell command was required too: db.users.ensureIndex({username: 1, email: 1}, {unique: true, dropDups: true});
// Without this command, duplicates were still allowed as Mongo can't enforce it while duplicates remain in the DB
userSchema.index({ username: 1, email: 1 }, { unique: true});

// Custom methods for userSchema
userSchema.methods.comparePassword = function(password){
    // bcrypt function to compare password with this [current user's] password, then a run function, returning result
    return bcrypt.compareSync(password, this.password, function(result){
        return result
    })
}

// Export user schema
module.exports = model('User', userSchema)