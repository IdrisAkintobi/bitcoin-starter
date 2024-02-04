import { Network } from 'bitcoinjs-lib';
import inquirer from 'inquirer';
import { BIP32AddressGenerator } from '../services/addressGenerator.service';
import { AddressType } from '../types/enum';
import { UserInterface } from '../types/interface';

export const handleGenerateAddress = async (user: UserInterface, appNetwork: Network) => {
    const { generateAddress } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'generateAddress',
            message: 'Do you want to generate an address?',
            default: true,
        },
    ]);

    if (generateAddress) {
        const addressGenerator = new BIP32AddressGenerator(user.seed!, appNetwork);

        const addressTypeAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'addressType',
                message: 'Select the address type:',
                choices: Object.values(AddressType),
            },
        ]);

        const { address } = addressGenerator.generateAddress(addressTypeAnswer.addressType);
        console.log(`Generated ${addressTypeAnswer.addressType} Address: ${address}`);
    } else {
        console.log('Quitting the app.');
        process.exit(0);
    }
};
