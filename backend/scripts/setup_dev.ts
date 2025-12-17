import { Aptos, AptosConfig, Network, Account, Ed25519PublicKey } from "@aptos-labs/ts-sdk";
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const NETWORK = Network.TESTNET;
const config = new AptosConfig({ network: NETWORK });
const aptos = new Aptos(config);

async function main() {
    console.log("Setting up Dev Environment...");

    // 1. Generate Admin Account
    const admin = Account.generate();
    console.log(`Generated Admin Address: ${admin.accountAddress.toString()}`);

    // 2. Fund Account
    console.log("Funding Admin Account (this may take a moment)...");
    await aptos.fundAccount({
        accountAddress: admin.accountAddress,
        amount: 100_000_000,
    });
    console.log("Funded.");

    // 3. Compile & Publish Contract
    // We need to update Move.toml with the address
    const contractsDir = path.resolve(__dirname, '../../contracts');
    const moveTomlPath = path.join(contractsDir, 'Move.toml');

    let moveToml = fs.readFileSync(moveTomlPath, 'utf8');
    // Replace 'Klash = "_"' or existing assignment with 'Klash = "0xAddr"'
    // Regex for safety
    if (moveToml.includes('Klash = "_"')) {
        moveToml = moveToml.replace('Klash = "_"', `Klash = "${admin.accountAddress.toString()}"`);
    } else {
        // Fallback replace regex
        moveToml = moveToml.replace(/Klash = "0x[a-fA-F0-9]+"/, `Klash = "${admin.accountAddress.toString()}"`);
    }
    fs.writeFileSync(moveTomlPath, moveToml);

    console.log("Updated Move.toml with Admin Address.");

    // Publish using CLI because SDK publish of Move packages is complex (needs bytecodes)
    // We assume 'aptos' CLI is in path.
    console.log("Publishing Contract...");
    try {
        // We need the private key for CLI? CLI uses profiles.
        // We can pass private key via endpoint? No.
        // Option: Create a profile.
        // Better Option: Use the SDK to publish if we can compile first.

        // Let's use CLI but we need to init the profile.
        // `aptos init --private-key ...`

        // Workaround: We print the Private Key and ask user to run or we try to run it.
        // Integrating 'aptos init' in script is tricky with interactivity.
        // `aptos init --assume-yes --network testnet --private-key ...`

        const privatKeyStr = admin.privateKey.toString();
        // Setup a temp profile
        process.env.APTOS_DISABLE_TELEMETRY = "true";

        // Actually, we can just use the SDK to publish the PACKAGE.
        // But we need to compile first. `aptos move compile`.
        // Then read the metadata and bytecode.

        execSync(`aptos move compile --named-addresses Klash=${admin.accountAddress.toString()}`, { cwd: contractsDir, stdio: 'inherit' });

        // Read build/Klash/package-metadata.bcs and bytecodes
        // Actually CLI publish is easiest if we configure it.

        // Configuring local profile
        const cmdConfig = `aptos init --assume-yes --network testnet --private-key ${privatKeyStr} --profile klash-admin`;
        execSync(cmdConfig, { stdio: 'inherit' });

        const cmdPublish = `aptos move publish --profile klash-admin --named-addresses Klash=${admin.accountAddress.toString()} --assume-yes`;
        execSync(cmdPublish, { cwd: contractsDir, stdio: 'inherit' });

        console.log("Contract Published!");

        // 4. Initialize Config
        // We need to call init_config(admin, treasury, fee).
        // Using SDK now.
        const treasury = admin.accountAddress.toString(); // Self as treasury for now
        const initTx = await aptos.transaction.build.simple({
            sender: admin.accountAddress,
            data: {
                function: `${admin.accountAddress.toString()}::market::init_config`,
                functionArguments: [treasury, 200] // 2%
            }
        });
        const pending = await aptos.signAndSubmitTransaction({ signer: admin, transaction: initTx });
        await aptos.waitForTransaction({ transactionHash: pending.hash });
        console.log("Global Config Initialized.");

        // 5. Write .env
        const envContent = `
PORT=3001
MONGO_URI=mongodb://localhost:27017/klash
APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
APTOS_FAUCET_URL=https://faucet.testnet.aptoslabs.com
APTOS_ADMIN_PRIVATE_KEY=${privatKeyStr}
KLASH_TREASURY_ADDRESS=${treasury}
MARKET_MODULE_ADDRESS=${admin.accountAddress.toString()}
`;
        fs.writeFileSync(path.resolve(__dirname, '../.env'), envContent);
        console.log("Backend .env created.");

    } catch (e) {
        console.error("Setup failed:", e);
    }
}

main();
