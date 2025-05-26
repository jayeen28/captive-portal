const mongoose = require('mongoose');

module.exports = function initDB() {
    // Enable graceful stop
    process.once('SIGINT', mongoose.disconnect);
    process.once('SIGTERM', mongoose.disconnect);
    return mongoose.connect('mongodb://admin:secret@localhost:27017/captive-portal', { authSource: 'admin' });
}