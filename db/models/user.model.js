const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    mac: {
        type: String,
        required: true,
        unique: true,
    },
    facebook: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });

const User = model('User', userSchema);
module.exports = User;