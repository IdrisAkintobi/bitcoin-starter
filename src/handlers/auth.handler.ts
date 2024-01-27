import inquirer from 'inquirer';
import { User } from '../services/user';

export const handleAuth = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'Auth',
            message: 'Do you want to login or create an account?',
            choices: ['Login', 'Create Account', 'Quit'],
        },
    ]);

    if (answer.Auth === 'Login' || answer.Auth === 'Create Account') {
        const credentials = await inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'Enter your username:',
                validate: input => input.trim() !== '',
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter your password:',
                mask: '*',
                validate: input => input.trim() !== '',
            },
        ]);

        switch (answer.Auth) {
            case 'Login':
                return await User.login(credentials);
            default:
                return await User.create(credentials);
        }
    } else {
        console.log('Quitting the app.');
        process.exit(0);
    }
};
