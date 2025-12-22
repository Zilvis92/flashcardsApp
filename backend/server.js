// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1. Inicializuojame dotenv (nuskaitome .env kintamuosius)
dotenv.config();

// Inicializuojame Express programą
const app = express();

// Middleware (reikės vėliau duomenų priėmimui)
app.use(express.json());

// Pradinis maršrutas testavimui
app.get('/', (req, res) => {
  res.send('Flashcard App Backend veikia!');
});

// 3. Sukuriame serverio paleidimo funkciją
const startServer = async () => {
    try {
        console.log('🔗 Bandome prisijungti prie duomenų bazės...');
        await connectDB();
        console.log('✅ Duomenų bazė sėkmingai prisijungta');
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Backend API serveris veikia http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Nepavyko paleisti serverio:', error);
        process.exit(1);
    }
};

// 4. paleidžiame serverį
startServer();
