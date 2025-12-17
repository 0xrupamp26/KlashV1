import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { Market, MarketStatus, MarketMode } from './models';
import { AIService } from './services/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/klash';

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
    res.json({ ok: true });
});

// Seed Markets
const seedMarkets = async () => {
    const count = await Market.countDocuments();
    if (count > 0) return;

    console.log('Seeding initial markets...');
    const seeds = [
        {
            id: "1",
            title: "Will Bitcoin hit $200K by end of 2025?",
            description: "A high-stakes prediction on Bitcoin's meteoric rise.",
            sideA: "Yes, $200K+",
            sideB: "No way",
            category: "Crypto"
        },
        {
            id: "2",
            title: "Elon Musk vs Mark Zuckerberg cage match",
            description: "The tech billionaire showdown.",
            sideA: "Fight happens in 2025",
            sideB: "Never happening",
            category: "Entertainment"
        },
        {
            id: "3",
            title: "GPT-5 releases before July 2025",
            description: "OpenAI's next frontier model.",
            sideA: "Released before July",
            sideB: "Delayed past July",
            category: "Tech"
        },
        {
            id: "4",
            title: "Lakers win 2025 NBA Championship",
            description: "Can LeBron secure another ring?",
            sideA: "Lakers win it all",
            sideB: "Someone else takes it",
            category: "Sports"
        },
        {
            id: "5",
            title: "Tesla Robotaxi launches commercially in 2025",
            description: "Is 2025 finally the year?",
            sideA: "Launches in 2025",
            sideB: "Another delay",
            category: "Tech"
        },
        {
            id: "6",
            title: "Will there be a US recession in 2025?",
            description: "Economic indicators are mixed.",
            sideA: "Recession hits",
            sideB: "Economy stays strong",
            category: "Finance"
        },
    ];

    for (const s of seeds) {
        await Market.create({
            ...s,
            mode: MarketMode.TWO_PLAYER,
            status: MarketStatus.OPEN
        });
    }
    console.log('Seeding complete.');
};

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await seedMarkets();

        // Start AI Scheduler
        AIService.startScheduler(30000); // Check every 30s

        app.listen(PORT, () => {
            console.log(`Backend running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
