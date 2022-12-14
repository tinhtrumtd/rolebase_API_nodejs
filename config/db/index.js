const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/antoanphanmem');
        console.log('kết nối database thành công');
    } catch (error) {
        console.log('kết nối database thất bại');
    }
}
module.exports = { connect };