import axios, { AxiosResponse, isAxiosError } from 'axios';
import inquirer from 'inquirer';
import { BlockchainInfoResponse } from '../types/interface';

export const handleCheckBalance = async (): Promise<void> => {
    try {
        const { wantToCheckBalance } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'wantToCheckBalance',
                message: 'Do you want to check balance?',
                default: true,
            },
        ]);

        if (!wantToCheckBalance) {
            return;
        }

        const { address } = await inquirer.prompt([
            {
                type: 'input',
                name: 'address',
                message: 'Enter the Bitcoin address you want to check:',
                validate: (input: string) => {
                    if (input.trim() === '' || !/^[a-zA-Z0-9]+$/.test(input.trim())) {
                        return 'Please enter a valid alphanumeric address.';
                    }
                    return true;
                },
            },
        ]);

        const response: AxiosResponse<BlockchainInfoResponse> = await axios.get(
            `https://api.blockcypher.com/v1/btc/test3/addrs/${address}`,
        );

        const { total_received, total_sent, final_balance } = response.data;

        console.log(
            `Balance for address ${address}:\n ${JSON.stringify({
                total_received,
                total_sent,
                final_balance,
            })}`,
        );
    } catch (error) {
        if (isAxiosError(error)) {
            console.error('Error checking balance:', error.response?.data);
            return;
        }
        console.error('Error checking balance:');
    }
};
