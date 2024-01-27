import inquirer from 'inquirer';
import { bitcoinNetwork } from '../main';
import { BIP32AddressGenerator } from '../services/addressGenerator';
import { AddressType } from '../types/enum';
import { UserInterface } from '../types/interface';

export const handleGenerateAddress = async (user: UserInterface) => {
    const answer = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'generateAddress',
            message: 'Do you want to generate an address?',
            default: true,
        },
    ]);

    if (answer.generateAddress) {
        const addressGenerator = new BIP32AddressGenerator(user.seed!, bitcoinNetwork);
        // const address = addressGenerator.generateAddress('P2PKH', 0);

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
