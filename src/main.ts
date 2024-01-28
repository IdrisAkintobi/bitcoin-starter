import { networks } from 'bitcoinjs-lib';
import { program } from 'commander';

import { handleAuth } from './handlers/auth.handler';
import { handleCheckBalance } from './handlers/check.balance.handler';
import { handleGenerateAddress } from './handlers/gen.address.handler';

// Define the Bitcoin network
export const bitcoinNetwork = networks.testnet;

// Define CLI commands
program
    .command('start')
    .description('Start the interactive terminal')
    .action(async () => {
        const user = await handleAuth();
        await handleCheckBalance();
        await handleGenerateAddress(user);
    });

// Parse the command line arguments
program.parse(process.argv);
