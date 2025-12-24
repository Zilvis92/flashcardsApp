// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const deckRoutes = require('./routes/deckRoutes');
const cardRoutes = require('./routes/cardRoutes');

// 1. Inicializuojame dotenv
dotenv.config();

// 2. Inicializuojame Express
const app = express();

// 3. Middleware
app.use(express.json());

// Routes user
app.use('/api/users', userRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/cards', cardRoutes);


// Error handlers
app.use(notFound);
app.use(errorHandler);

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
