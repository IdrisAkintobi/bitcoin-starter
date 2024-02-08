import { program } from 'commander';

import { handleAuth } from './handlers/auth.handler';
import { handleCheckBalance } from './handlers/check.balance.handler';
import { handleGenerateAddress } from './handlers/gen.address.handler';
import { networkSelectorHandler } from './handlers/network.selector.handler';
import { handleTransactions } from './handlers/transactions.handler';

import { TransactionService } from './services/transaction.service';

// Define CLI commands
program
    .command('start')
    .description('Start the interactive terminal')
    .action(async () => {
        const user = await handleAuth();
        const { appNetwork } = await networkSelectorHandler();

        /**
         * Below is an example of how to use the TransactionService to create a signed transaction
         * you can use the credentials test:test123456789012 to run this example
         */
        const addressWithBalance = '2MwrinsNPrqwqup5G5DQ5BG2XnxjLs8y28z';
        const redeemScriptHex = TransactionService.createRedeemScript('Btrust Builders');
        const p2wshAddress = TransactionService.deriveP2WSHAddress(redeemScriptHex, appNetwork);
        console.log(`P2WSH Address: ${p2wshAddress}`);
        const transaction = await TransactionService.createSignedTransaction(
            addressWithBalance,
            p2wshAddress,
            user.seed as string,
            appNetwork,
            redeemScriptHex,
            82312,
        );
        console.log(transaction);

        await handleCheckBalance();
        await handleTransactions();
        await handleGenerateAddress(user, appNetwork);
    });

// Parse the command line arguments
program.parse(process.argv);
