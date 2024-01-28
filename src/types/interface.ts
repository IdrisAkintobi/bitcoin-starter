export interface UserInterface {
    username: string;
    password: string;
    seed?: string;
}

export interface BlockchainInfoResponse {
    address: string;
    n_tx: number;
    unconfirmed_balance: number;
    total_received: number;
    total_sent: number;
    final_balance: number;
    txrefs: Array<Record<string, string | number>>;
}
