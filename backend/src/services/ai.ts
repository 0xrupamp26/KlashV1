import { Market, Session, MarketStatus } from '../models';
import { resolveMarketOnChain } from './aptos';

export class AIService {
    // Simple heuristic or random resolver
    static async decideWinner(marketTitle: string, sideA: string, sideB: string): Promise<number> {
        console.log(`AI deciding winner for: ${marketTitle}`);
        // For Alpha: Random 0 or 1
        return Math.random() < 0.5 ? 0 : 1;
    }

    static async resolvePendingMarkets() {
        const lockedSessions = await Session.find({ resolved: false });
        // Join with Market to check status? 
        // Actually Session has `resolved` flag. We should also check Market status is LOCKED.

        // Better query: Find Markets that are LOCKED. Then find their session.
        const lockedMarkets = await Market.find({ status: MarketStatus.LOCKED });

        for (const market of lockedMarkets) {
            try {
                const session = await Session.findOne({ market_id: market.id, resolved: false });
                if (!session) continue;

                const winningSide = await this.decideWinner(market.title, market.sideA, market.sideB);

                console.log(`Resolving market ${market.id} with side ${winningSide}`);

                // On-chain resolution
                // Note: 'market.on_chain_market_id' might be needed if not assuming mapping logic
                // logic in services/aptos.ts uses marketId string to derive address.
                // pass market.id (the string UUID/ID)

                const tx = await resolveMarketOnChain(market.id, winningSide);

                session.resolved = true;
                session.winner = winningSide === session.bet1_side ? session.player1 : session.player2; // Simplify
                session.tx_hash_resolve = tx.hash;
                await session.save();

                market.status = MarketStatus.RESOLVED;
                await market.save();

            } catch (err) {
                console.error(`Failed to resolve market ${market.id}:`, err);
            }
        }
    }

    static startScheduler(intervalMs: number = 60000) {
        setInterval(() => {
            this.resolvePendingMarkets();
        }, intervalMs);
    }
}
