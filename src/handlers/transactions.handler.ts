import inquirer from 'inquirer';
import { TransactionService } from '../services/transaction.service';

export const handleTransactions = async () => {
    const { convertTransactionData } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'convertTransactionData',
            message: 'Do you want to convert transaction data?',
            default: true,
        },
    ]);

    if (convertTransactionData) {
        const { conversionMethod } = await inquirer.prompt([
            {
                type: 'list',
                name: 'conversionMethod',
                message: 'Select the conversion method:',
                choices: ['fromHex', 'scriptHexToASM'],
            },
        ]);

        if (conversionMethod) {
            const { dataToConvert } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'dataToConvert',
                    message: 'Enter the transaction data you want to convert:',
                    validate: (input: string) => {
                        if (input.trim() === '' || !/^[a-zA-Z0-9]+$/.test(input.trim())) {
                            return 'Please enter a valid alphanumeric data.';
                        }
                        return true;
                    },
                },
            ]);

            switch (conversionMethod) {
                case 'fromHex':
                    const converted = TransactionService.decodeTransactionHex(dataToConvert);
                    console.log('Transaction converted from hex is:', converted);
                    break;

                case 'scriptHexToASM':
                    const asm = TransactionService.scriptHexToASM(dataToConvert);
                    console.log('Script converted to ASM is:', asm);
                    break;
            }
        }
    }
    return;
};
