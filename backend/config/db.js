// /backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🔗 Bandome prisijungti prie MongoDB...');
        
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI nerastas .env faile');
        }
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;