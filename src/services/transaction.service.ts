import { Transaction, script } from 'bitcoinjs-lib';

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
}
