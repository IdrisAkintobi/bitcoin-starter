import { networks } from 'bitcoinjs-lib';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { BIP32AddressGenerator } from '../src/services/addressGenerator.service';
import { AddressType } from '../src/types/enum';

const seed = '305a2e5a1c156e566c67b0658340937ed233c357094711d705f6c66bdd0329e3';
const network = networks.testnet;

describe('BIP32AddressGenerator testnet tests', () => {
    const addressGenerator = new BIP32AddressGenerator(seed, network);

    it('should generate P2PK addresses', () => {
        const { address } = addressGenerator.generateAddress(AddressType.P2PK);
        assert.strictEqual(
            address,
            '03a7954c47a4015260f8ecb20209a83b302f12589920306d5d9203b7287763bf56',
        );
    });

    it('should generate P2PKH addresses', () => {
        const { address } = addressGenerator.generateAddress(AddressType.P2PKH);
        assert.strictEqual(address, 'mvaSaAZzv8u6aKuBzY9Rnjm37e89Ajycp1');
    });

    it('should generate P2SH addresses', () => {
        const { address } = addressGenerator.generateAddress(AddressType.P2SH);
        assert.strictEqual(address, '2ND8PB9RrfCaAcjfjP1Y6nAgFd9zWHYX4DN');
    });

    it('should generate P2WPKH addresses', () => {
        const { address } = addressGenerator.generateAddress(AddressType.P2WPKH);
        assert.strictEqual(address, 'tb1q55et6czlyl2828u52xhqpkg5kx6n2ytlt7ah6e');
    });
});
