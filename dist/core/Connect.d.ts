import { TonhubConnector, TonhubCreatedSession, TonhubWalletConfig } from 'ton-x';
import TonConnect, { WalletInfo, WalletInfoRemote } from '@tonconnect/sdk';
import { DeLabNetwork, DeLabAddress, DeLabTransaction } from './types';
declare global {
    interface Window {
        ton: any;
    }
}
declare class DeLabConnect {
    private _appUrl;
    private _appName;
    private _events;
    private _network;
    private _connectorTonHub;
    private _connectorTonConnect;
    private _tonConnectWallets;
    private _tonConnectWallet;
    private _sessionTonHub;
    private _walletTonHub;
    private _address;
    private _balance;
    private _typeConnect;
    private _isOpenModal;
    constructor(appUrl: string, appName: string, network?: DeLabNetwork, manifestUrl?: string);
    loadWallet(): void;
    private newEvent;
    private static addStorageData;
    private static getStorageData;
    private static delStorageData;
    private clearStorage;
    private createTonHub;
    createTonConnect(): Promise<void>;
    private sendTransactionTonHub;
    private static sendTransactionToncoinWallet;
    private sussesConnect;
    private sendTransactionTonkeeper;
    connectTonHub(): Promise<DeLabAddress>;
    connectToncoinWallet(): Promise<DeLabAddress>;
    connectTonkeeper(wallet: WalletInfoRemote): Promise<DeLabAddress>;
    on(event: string, listener: EventListener): void;
    sendTransaction(transaction: DeLabTransaction): Promise<any | boolean>;
    disconnect(): boolean;
    closeModal(): boolean;
    openModal(): Promise<boolean>;
    get isOpenModal(): boolean;
    get typeConnect(): string | undefined;
    get appUrl(): string;
    get appName(): string;
    get address(): string | undefined;
    get network(): DeLabNetwork;
    get connectorTonHub(): TonhubConnector;
    get sessionTonHub(): TonhubCreatedSession | undefined;
    get walletTonHub(): TonhubWalletConfig | undefined;
    get tonConnectWallets(): Array<WalletInfo> | undefined;
    get connectorTonConnect(): TonConnect | undefined;
    get tonConnectWallet(): WalletInfo | undefined;
}
export { DeLabConnect };
