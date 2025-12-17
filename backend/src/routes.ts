import express from 'express';
import { Market, Session, MarketStatus, MarketMode } from './models';
import { initMarketOnChain, placeBetOnChain, getMarketAddress } from './services/aptos';

const router = express.Router();

// GET /markets
router.get('/markets', async (req, res) => {
    try {
        const markets = await Market.find().sort({ created_at: -1 });
        // TODO: Add aggregated counts if needed (e.g. number of players joined)
        res.json(markets);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch markets' });
    }
});

// GET /markets/:id
router.get('/markets/:id', async (req, res) => {
    try {
        const market = await Market.findOne({ id: req.params.id }); // Using 'id' field, not _id
        if (!market) {
            // Validation: Try _id?
            const mById = await Market.findById(req.params.id);
            if (!mById) return res.status(404).json({ error: 'Market not found' });
            // Use mById
            return res.json(mById);
        }

        // Get session info
        const session = await Session.findOne({ market_id: market._id });

        res.json({
            ...market.toJSON(),
            session: session ? session.toJSON() : null
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch market' });
    }
});

// POST /markets/:id/join-two-player
router.post('/markets/:id/join-two-player', async (req, res) => {
    const { walletAddress, side, amount } = req.body;
    if (!walletAddress || side === undefined || !amount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        let market = await Market.findOne({ id: req.params.id });
        if (!market) market = await Market.findById(req.params.id);
        if (!market) return res.status(404).json({ error: 'Market not found' });

        if (market.status !== MarketStatus.OPEN && market.status !== MarketStatus.WAITING_FOR_SECOND) {
            return res.status(400).json({ error: 'Market is not open for joining' });
        }

        let session = await Session.findOne({ market_id: market._id });

        // NOTE: For Alpha, we are initializing on-chain market ON FIRST JOIN if needed?
        // Or did we init all? 
        // "Ensure session state is consistent with on-chain state."
        // If session doesn't exist, create it.

        if (!session) {
            // First player

            // 1. Init on-chain if strictly needed now, OR do it at creation?
            // "Seed initial hardcoded controversies into markets on backend startup."
            // If we assume markets are pre-initialized on chain, we skip init.
            // But if we do lazy init:
            try {
                await initMarketOnChain(market.id);
            } catch (e: any) {
                // Ignore "already exists" error
                console.warn("Init market warning:", e);
            }

            // 2. Place Bet (Custodial/Orchestrated)
            const tx = await placeBetOnChain(market.id, side, amount);

            session = new Session({
                market_id: market._id,
                player1: walletAddress,
                bet1_side: side,
                bet1_amount: amount,
                tx_hash_place1: tx.hash
            });

            market.status = MarketStatus.WAITING_FOR_SECOND;
            await market.save();
            await session.save();

        } else {
            // Second player
            if (session.player2) return res.status(400).json({ error: 'Session full' });

            // 2. Place Bet
            const tx = await placeBetOnChain(market.id, side, amount);

            session.player2 = walletAddress;
            session.bet2_side = side;
            session.bet2_amount = amount;
            session.tx_hash_place2 = tx.hash;

            market.status = MarketStatus.LOCKED;
            await market.save();
            await session.save();
        }

        res.json({ success: true, session });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Failed to join market' });
    }
});

// GET /portfolio/:wallet
router.get('/portfolio/:wallet', async (req, res) => {
    const { wallet } = req.params;
    try {
        // Find sessions where player1 or player2 is wallet
        const sessions = await Session.find({
            $or: [{ player1: wallet }, { player2: wallet }]
        }).populate('market_id');

        const portfolio = sessions.map(session => {
            const market = session.market_id as any; // Type assertion since populated
            const isPlayer1 = session.player1 === wallet;
            const mySide = isPlayer1 ? session.bet1_side : session.bet2_side;
            const myStake = isPlayer1 ? session.bet1_amount : session.bet2_amount;

            let outcome = 'PENDING';
            if (session.resolved) {
                outcome = session.winner === wallet ? 'WIN' : 'LOSE';
            }

            return {
                marketId: market.id,
                title: market.title,
                side: mySide === 0 ? market.sideA : market.sideB, // assuming 0=A, 1=B
                stake: myStake,
                outcome,
                payout: outcome === 'WIN' ? session.winner_payout : 0,
                txHash: isPlayer1 ? session.tx_hash_place1 : session.tx_hash_place2
            };
        });

        res.json(portfolio);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
});

export default router;
