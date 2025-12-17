import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey, AccountAddress, createResourceAddress } from "@aptos-labs/ts-sdk";
import dotenv from "dotenv";

dotenv.config();

const NETWORK = Network.TESTNET;
const config = new AptosConfig({ network: NETWORK });
export const aptos = new Aptos(config);

const ADMIN_PRIVATE_KEY = process.env.APTOS_ADMIN_PRIVATE_KEY!;
const privateKey = new Ed25519PrivateKey(ADMIN_PRIVATE_KEY);
export const adminAccount = Account.fromPrivateKey({ privateKey });

export const KLASH_MODULE_ADDRESS = process.env.MARKET_MODULE_ADDRESS || adminAccount.accountAddress.toString();
export const MODULE_NAME = "market";

export const getMarketAddress = (marketId: string) => {
    // Logic to derive resource account address from admin + seed (marketId as seed?)
    // Uses createResourceAddress from SDK
    const seed = new TextEncoder().encode(marketId);
    return createResourceAddress(adminAccount.accountAddress, seed);
};



export async function initMarketOnChain(marketId: string) {
    // Call init_market(admin, seed)
    const transaction = await aptos.transaction.build.simple({
        sender: adminAccount.accountAddress,
        data: {
            function: `${KLASH_MODULE_ADDRESS}::${MODULE_NAME}::init_market`,
            functionArguments: [new TextEncoder().encode(marketId)]
        }
    });

    const pendingTxn = await aptos.signAndSubmitTransaction({ signer: adminAccount, transaction });
    const response = await aptos.waitForTransaction({ transactionHash: pendingTxn.hash });
    return response;
}

export async function placeBetOnChain(marketId: string, side: number, amount: number) {
    // In this "Custodial / Backend-Orchestrated" model:
    // The ADMIN (or a system hot wallet) places the bet. 
    // This assumes the admin has funds.

    // Note: We are using market_id (resource address) as the target.
    const marketAddr = getMarketAddress(marketId);

    const transaction = await aptos.transaction.build.simple({
        sender: adminAccount.accountAddress,
        data: {
            function: `${KLASH_MODULE_ADDRESS}::${MODULE_NAME}::place_bet_two_player`,
            functionArguments: [marketAddr, side, amount]
        }
    });

    const pendingTxn = await aptos.signAndSubmitTransaction({ signer: adminAccount, transaction });
    return await aptos.waitForTransaction({ transactionHash: pendingTxn.hash });
}

export async function resolveMarketOnChain(marketId: string, winningSide: number) {
    const marketAddr = getMarketAddress(marketId);

    const transaction = await aptos.transaction.build.simple({
        sender: adminAccount.accountAddress,
        data: {
            function: `${KLASH_MODULE_ADDRESS}::${MODULE_NAME}::resolve_two_player`,
            functionArguments: [marketAddr, winningSide]
        }
    });

    const pendingTxn = await aptos.signAndSubmitTransaction({ signer: adminAccount, transaction });
    return await aptos.waitForTransaction({ transactionHash: pendingTxn.hash });
}
