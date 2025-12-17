import mongoose, { Schema, Document } from 'mongoose';

export enum MarketStatus {
    OPEN = 'OPEN',
    WAITING_FOR_SECOND = 'WAITING_FOR_SECOND',
    LOCKED = 'LOCKED',
    RESOLVED = 'RESOLVED'
}

export enum MarketMode {
    TWO_PLAYER = 'TWO_PLAYER',
    MULTI_PLAYER = 'MULTI_PLAYER'
}

export interface IMarket extends Document {
    id: string; // Internal UUID or mapped ID
    on_chain_market_id?: string; // Address
    title: string;
    description: string;
    sideA: string;
    sideB: string;
    mode: MarketMode;
    status: MarketStatus;
    category: string;
    created_at: Date;
    updated_at: Date;
}

const MarketSchema: Schema = new Schema({
    on_chain_market_id: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    sideA: { type: String, required: true },
    sideB: { type: String, required: true },
    mode: { type: String, enum: Object.values(MarketMode), default: MarketMode.TWO_PLAYER },
    status: { type: String, enum: Object.values(MarketStatus), default: MarketStatus.OPEN },
    category: { type: String, default: 'General' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Needed to expose 'id' virtually if we rely on it, otherwise _id works.
MarketSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

export interface ISession extends Document {
    market_id: mongoose.Types.ObjectId | string;
    player1: string;
    player2?: string;
    bet1_side: number;
    bet1_amount: number;
    bet2_side?: number;
    bet2_amount?: number;
    resolved: boolean;
    winner?: string;
    total_pool?: number;
    fee_amount?: number;
    winner_payout?: number;
    tx_hash_place1?: string;
    tx_hash_place2?: string;
    tx_hash_resolve?: string;
}

const SessionSchema: Schema = new Schema({
    market_id: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    player1: { type: String, required: true },
    player2: { type: String },
    bet1_side: { type: Number, required: true },
    bet1_amount: { type: Number, required: true },
    bet2_side: { type: Number },
    bet2_amount: { type: Number },
    resolved: { type: Boolean, default: false },
    winner: { type: String },
    total_pool: { type: Number },
    fee_amount: { type: Number },
    winner_payout: { type: Number },
    tx_hash_place1: { type: String },
    tx_hash_place2: { type: String },
    tx_hash_resolve: { type: String },
});

export const Market = mongoose.model<IMarket>('Market', MarketSchema);
export const Session = mongoose.model<ISession>('Session', SessionSchema);
