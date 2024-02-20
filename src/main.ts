import { program } from 'commander';

import { handleAuth } from './handlers/auth.handler';
import { handleCheckBalance } from './handlers/check.balance.handler';
import { handleGenerateAddress } from './handlers/gen.address.handler';
import { networkSelectorHandler } from './handlers/network.selector.handler';

// Define CLI commands
program
    .command('start')
    .description('Start the interactive terminal')
    .action(async () => {
        const user = await handleAuth();
        const { appNetwork } = await networkSelectorHandler();
        await handleCheckBalance();
        await handleGenerateAddress(user, appNetwork);
    });

// Parse the command line arguments
program.parse(process.argv);
