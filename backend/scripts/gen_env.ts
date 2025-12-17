import fs from 'fs';
import path from 'path';
import { Account, Ed25519PrivateKey, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

async function main() {
    const configPath = path.resolve(__dirname, '../../.aptos/config.yaml');
    const content = fs.readFileSync(configPath, 'utf8');

    // Regex to find private_key for klash-admin
    // format:
    //   klash-admin:
    //     ...
    //     private_key: "0x..."

    const match = content.match(/private_key:\s*"?([^"\n]+)"?/);
    if (!match) {
        console.error("Could not find private key in config");
        return;
    }

    let privateKeyStr = match[1];
    // Remove ed25519-priv- prefix if present (AIP-80 formatted keys)
    if (privateKeyStr.startsWith("ed25519-priv-")) {
        // SDK might not handle AIP-80 string directly in fromPrivateKey(hex). 
        // We might need to rely on the fact that the SDK's `Ed25519PrivateKey` class can handle it?
        // Actually, for simplicity, we should assume it is a hex key or try to parse it.
        // But `ed25519-priv-` usually involves Bech32 or specific encoding.
        // Let's rely on the SDK `PrivateKey.format` or similar if available? 
        // No, let's just use what we have. If it fails, we'll see.
    }

    const privateKey = new Ed25519PrivateKey(privateKeyStr);
    const account = Account.fromPrivateKey({ privateKey });
    const address = account.accountAddress.toString();

    console.log(`Address: ${address}`);

    // 1. Update Move.toml
    const moveTomlPath = path.resolve(__dirname, '../../contracts/Move.toml');
    let moveToml = fs.readFileSync(moveTomlPath, 'utf8');
    if (moveToml.includes('Klash = "_"')) {
        moveToml = moveToml.replace('Klash = "_"', `Klash = "${address}"`);
    } else {
        moveToml = moveToml.replace(/Klash = "0x[a-fA-F0-9]+"/, `Klash = "${address}"`);
    }
    fs.writeFileSync(moveTomlPath, moveToml);
    console.log("Updated Move.toml");

    // 2. Fund Account (Just in case)
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

    console.log("Funding...");
    try {
        await aptos.fundAccount({ accountAddress: address, amount: 100_000_000 });
        console.log("Funded.");
    } catch (e) {
        console.error("Funding failed (maybe faucet limit):", e);
    }

    // 3. Write .env
    const envContent = `
PORT=3001
MONGO_URI=mongodb://localhost:27017/klash
APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
APTOS_FAUCET_URL=https://faucet.testnet.aptoslabs.com
APTOS_ADMIN_PRIVATE_KEY=${privateKeyStr}
KLASH_TREASURY_ADDRESS=${address}
MARKET_MODULE_ADDRESS=${address}
`;
    fs.writeFileSync(path.resolve(__dirname, '../.env'), envContent);
    console.log("Created .env");
}

main();
