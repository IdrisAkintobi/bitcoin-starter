import { Network, Transaction, crypto, payments, script } from 'bitcoinjs-lib';

export class TransactionService {
    public static decodeTransactionHex(hex: string) {
        const decodedTransaction = Transaction.fromHex(hex);

        // Extract the version and locktime
        const version = decodedTransaction.version;
        const locktime = decodedTransaction.locktime;

        // Map through the inputs and extract the txid, index, script, sequence, and witness
        const inputs = decodedTransaction.ins.map(input => {
            return {
                txid: input.hash?.reverse().toString('hex'),
                index: input.index,
                script: input.script?.toString('hex'),
                sequence: input.sequence,
                ...(input.witness && {
                    witness: JSON.stringify(input.witness.map(i => i.toString('hex'))),
                }),
            };
        });

        // Map through the outputs and extract the value and script
        const outputs = decodedTransaction.outs.map(output => {
            return {
                value: output.value,
                script: output.script.toString('hex'),
            };
        });

        return { version, locktime, inputs, outputs };
    }

    public static scriptHexToASM(hex: string) {
        // Convert hex script to Buffer
        const scriptBuffer = Buffer.from(hex, 'hex');

        // Compile the script
        const parsedScript = script.compile(scriptBuffer);

        // Convert the script to ASM
        return script.toASM(parsedScript);
    }

    public static createRedeemScript(preimage: string) {
        // Calculate SHA256 hash of the preimage
        const sha256Hash = crypto.sha256(Buffer.from(preimage, 'utf8')).toString('hex');

        // Create the redeem script for the given script  OP_SHA256 <lock_hex> OP_EQUAL
        const redeemScript = script.compile([
            script.OPS.OP_SHA256,
            Buffer.from(sha256Hash, 'hex'),
            script.OPS.OP_EQUAL,
        ]);

        // Convert redeem script to hex
        return redeemScript.toString('hex');
    }

    public static deriveP2WSHAddress(redeemScriptHex: string, appNetwork: Network): string {
        // Create a P2WSH (Pay-to-Witness-Script-Hash) address from the redeem script
        const scriptBuffer = Buffer.from(redeemScriptHex, 'hex');
        const p2wsh = payments.p2wsh({
            redeem: { output: scriptBuffer, network: appNetwork },
        });
        return p2wsh.address as string;
    }

    public static async getUnspentBitcoinOutputs(address: string) {
        // Use a blockchain explorer API to get unspent outputs (UTXOs) for the given address
        const url = `https://blockstream.info/api/address/${address}/utxo`;

        try {
            const response = await fetch(url);
            const utxos = await response.json();
            return utxos;
        } catch (error) {
            throw new Error(`Unable to get UTXOs for address: ${address}`);
        }
    }
}
