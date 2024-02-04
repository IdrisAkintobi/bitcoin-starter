import { networks } from 'bitcoinjs-lib';
import inquirer from 'inquirer';

export const networkSelectorHandler = async () => {
    const { selectedNetwork } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedNetwork',
            message: 'Select the address type:',
            choices: ['TestNet', 'RegTest', 'MainNet'],
        },
    ]);

    switch (selectedNetwork) {
        case 'MainNet':
            return Object.freeze({ appNetwork: networks.bitcoin });
        case 'TestNet':
            return Object.freeze({ appNetwork: networks.testnet });
        default:
            return Object.freeze({ appNetwork: networks.regtest });
    }
};
