// import ECPairFactory from 'ecpair';
import BIP32Factory from 'bip32';
import { opcodes, payments, script } from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { AddressType } from '../types/enum';

export class BIP32AddressGenerator {
    private rootKey: any;
    private keyPair: any;
    // create always true script
    private alwaysTrueScript = script.compile([opcodes.OP_TRUE]);
    constructor(
        private readonly seed: string,
        private readonly network: any,
    ) {
        const seedBuffer = Buffer.from(seed as string, 'hex');
        const bip32 = BIP32Factory(ecc);
        this.rootKey = bip32.fromSeed(seedBuffer, network);

        // const ecPair = ECPairFactory(ecc);
        // this.keyPair = ecPair.makeRandom({ network });
        // this.keyPair = ecPair.fromPrivateKey(this.rootKey.privateKey, { network });
    }

    generateAddress(addressType: string, index = 0) {
        this.keyPair = this.rootKey.derivePath(`m/44'/1'/0'/0/${index}`);

        switch (addressType) {
            case AddressType.P2PK:
                const obj = payments.p2pk({
                    pubkey: this.keyPair.publicKey,
                    network: this.network,
                });
                return { address: obj.pubkey?.toString('hex') };
            case AddressType.P2PKH:
                return payments.p2pkh({
                    pubkey: this.keyPair.publicKey,
                    network: this.network,
                });
            case AddressType.P2SH:
                return payments.p2sh({
                    redeem: {
                        output: this.alwaysTrueScript,
                        network: this.network,
                    },
                });
            case AddressType.P2WPKH:
                return payments.p2wpkh({
                    pubkey: this.keyPair.publicKey,
                    network: this.network,
                });
            case AddressType.P2WSH:
                return payments.p2wsh({
                    redeem: {
                        output: this.alwaysTrueScript,
                        network: this.network,
                    },
                });
            case AddressType.P2TR:
                return payments.p2tr({
                    pubkey: this.keyPair.publicKey,
                    network: this.network,
                });
            default:
                throw new Error('Invalid address type specified.');
        }
    }
}
