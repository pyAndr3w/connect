declare type DeLabEvent = {
    data?: any;
} & Event;
declare type DeLabNetwork = 'mainnet' | 'testnet';
declare type DeLabTypeConnect = 'tonhub' | 'toncoinwallet' | 'tonkeeper' | undefined;
declare type DeLabAddress = string | undefined;
interface DeLabError {
    error: string;
    data?: any;
}
interface DeLabConnecting {
    address: DeLabAddress;
    network: DeLabNetwork;
    typeConnect: DeLabTypeConnect;
    autosave: boolean;
}
interface DeLabTransaction {
    to: string;
    value: string;
    stateInit?: string;
    text?: string;
    payload?: string;
}
export type { DeLabEvent, DeLabNetwork, DeLabTypeConnect, DeLabAddress, DeLabError, DeLabConnecting, DeLabTransaction };
