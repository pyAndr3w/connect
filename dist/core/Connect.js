import EventEmitter from 'events';
import { TonhubConnector } from 'ton-x';
import TonConnect from '@tonconnect/sdk';
import { Address } from 'ton';
class DeLabConnect {
    constructor(appUrl, appName, network = 'mainnet', manifestUrl = 'https://ipfs.filebase.io/ipfs/bafkreib7l74fuh7gmmmnwjoy3j4si74tdwgegw6gabuebfskolipuuia6i') {
        this._events = new EventEmitter();
        this._isOpenModal = false;
        this._appUrl = appUrl;
        this._appName = appName;
        this._network = network;
        // this._hostName = hostNameTonkeeper
        this._tonConnectWallets = [];
        this._connectorTonHub = new TonhubConnector({ network });
        this._connectorTonConnect = new TonConnect({ manifestUrl });
        this._connectorTonConnect.restoreConnection();
        this._connectorTonConnect.onStatusChange((walletInfo) => {
            console.log(walletInfo);
            if (this._connectorTonConnect.connected && walletInfo) {
                this._address = Address.parseRaw(walletInfo.account.address).toFriendly();
                this._typeConnect = 'tonkeeper';
                DeLabConnect.addStorageData('init', true);
                DeLabConnect.addStorageData('type-connect', this._typeConnect);
                DeLabConnect.addStorageData('address', this._address);
                DeLabConnect.addStorageData('network', this._network);
                this.sussesConnect();
                this.closeModal();
            }
        });
        this.loadWallet();
        console.log('v: 1.4.0');
    }
    loadWallet() {
        if (DeLabConnect.getStorageData('init')) {
            const typeConnect = DeLabConnect.getStorageData('type-connect');
            switch (typeConnect) {
                case 'tonhub':
                    this._sessionTonHub = DeLabConnect.getStorageData('session-tonhub');
                    this._address = DeLabConnect.getStorageData('address');
                    this._walletTonHub = DeLabConnect.getStorageData('wallet-tonhub');
                    this._network = DeLabConnect.getStorageData('network');
                    this._typeConnect = 'tonhub';
                    this.connectTonHub();
                    break;
                case 'toncoinwallet':
                    this._address = DeLabConnect.getStorageData('address');
                    this._typeConnect = 'toncoinwallet';
                    this.connectToncoinWallet();
                    break;
                case 'tonkeeper':
                    this._address = DeLabConnect.getStorageData('address');
                    this._typeConnect = 'tonkeeper';
                    this.sussesConnect();
                    break;
                default:
                    break;
            }
        }
    }
    newEvent(name, data) {
        this._events.emit(name, { data });
    }
    static addStorageData(key, value) {
        localStorage.setItem('delab-' + key, JSON.stringify(value));
    }
    static getStorageData(key) {
        try {
            return JSON.parse(localStorage.getItem('delab-' + key) ?? '');
        }
        catch (error) {
            return localStorage['delab-' + key];
        }
    }
    static delStorageData(key) {
        localStorage.removeItem('delab-' + key);
    }
    clearStorage() {
        switch (this._typeConnect) {
            case 'tonhub':
                DeLabConnect.delStorageData('init');
                DeLabConnect.delStorageData('type-connect');
                DeLabConnect.delStorageData('address');
                DeLabConnect.delStorageData('wallet-tonhub');
                DeLabConnect.delStorageData('session-tonhub');
                DeLabConnect.delStorageData('network');
                break;
            case 'toncoinwallet':
            case 'tonkeeper':
                DeLabConnect.delStorageData('init');
                DeLabConnect.delStorageData('type-connect');
                DeLabConnect.delStorageData('address');
                DeLabConnect.delStorageData('network');
                break;
            default:
                break;
        }
    }
    async createTonHub() {
        const sessionCreated = await this._connectorTonHub.createNewSession({
            name: this._appName,
            url: this._appUrl
        });
        this._sessionTonHub = sessionCreated;
        console.log(sessionCreated);
    }
    async createTonConnect() {
        const walletsList = await this._connectorTonConnect.getWallets();
        this._tonConnectWallets = walletsList;
        const tonkeeperKey = walletsList[0];
        if (tonkeeperKey.embedded) {
            console.log('embedded', tonkeeperKey.jsBridgeKey);
            this._connectorTonConnect.connect({ jsBridgeKey: tonkeeperKey.jsBridgeKey });
        }
        console.log(this._tonConnectWallets);
    }
    async sendTransactionTonHub(transaction) {
        if (this._sessionTonHub && this._walletTonHub) {
            const request = {
                seed: this._sessionTonHub.seed,
                appPublicKey: this._walletTonHub.appPublicKey,
                to: transaction.to,
                value: transaction.value,
                timeout: 5 * 60 * 1000,
                stateInit: transaction.stateInit,
                text: transaction.text,
                payload: transaction.payload
            };
            const response = await this
                ._connectorTonHub.requestTransaction(request);
            // console.log(response.type)
            if (response.type === 'rejected') {
                // Handle rejection
            }
            else if (response.type === 'expired') {
                // Handle expiration
                return false;
            }
            else if (response.type === 'invalid_session') {
                // Handle expired or invalid session
            }
            else if (response.type === 'success') {
                // Handle successful transaction
                const externalMessage = response.response; // Signed
                return { output: externalMessage };
            }
            else {
                throw new Error('Impossible');
            }
            this.newEvent('error-transaction', { error: response.type });
            return { error: 'transaction', data: response.type };
        }
        throw new Error('Error session or walletConfig tonhub');
    }
    static async sendTransactionToncoinWallet(transaction) {
        const sendData = {
            value: Number(transaction.value),
            to: transaction.to,
            dataType: 'boc',
            data: transaction.payload,
            stateInit: transaction.stateInit
        };
        const singTon = await window.ton.send('ton_sendTransaction', [sendData]);
        return singTon;
    }
    sussesConnect() {
        const sendData = {
            address: this._address,
            network: this._network,
            typeConnect: this._typeConnect,
            autosave: true
        };
        this.newEvent('connect', sendData);
    }
    async sendTransactionTonkeeper(transaction) {
        try {
            const transactionTon = {
                validUntil: Date.now() + 1000000,
                messages: [
                    {
                        address: Address.parseFriendly(transaction.to).address.toFriendly(),
                        amount: transaction.value,
                        stateInit: transaction.stateInit,
                        payload: transaction.payload,
                        text: transaction.text
                    }
                ]
            };
            const result = await this._connectorTonConnect.sendTransaction(transactionTon);
            return result;
        }
        catch (error) {
            console.error(error);
            this.newEvent('error-transaction', { error });
            return { error: 'transaction', data: error };
        }
    }
    async connectTonHub() {
        if (this._sessionTonHub) {
            this.newEvent('link', this._sessionTonHub.link.replace('ton://', 'https://tonhub.com/'));
            const session = await this._connectorTonHub
                .awaitSessionReady(this._sessionTonHub.id, 5 * 60 * 1000); // 5 min timeout
            if (session.state === 'revoked' || session.state === 'expired') {
                this.newEvent('error', session.state);
                // Handle revoked or expired session
            }
            else if (session.state === 'ready') {
                // console.log(session.wallet)
                this._walletTonHub = session.wallet;
                this._address = session.wallet.address;
                this._typeConnect = 'tonhub';
                this.sussesConnect();
                DeLabConnect.addStorageData('init', true);
                DeLabConnect.addStorageData('type-connect', this._typeConnect);
                DeLabConnect.addStorageData('address', this._address);
                DeLabConnect.addStorageData('wallet-tonhub', this._walletTonHub);
                DeLabConnect.addStorageData('session-tonhub', this._sessionTonHub);
                DeLabConnect.addStorageData('network', this._network);
                this.closeModal();
                // Handle session
                // ...
            }
            else {
                throw new Error('Impossible');
            }
            return this._address;
        }
        this.newEvent('error-tonhub', 'tonhub_session');
        return undefined;
        // throw new Error('Error created TonHub session')
    }
    async connectToncoinWallet() {
        if (window.ton) {
            if (window.ton.isTonWallet) {
                console.log(window.ton);
                const address = await window.ton.send('ton_requestAccounts');
                console.log(address);
                if (address) {
                    if (address.length > 0) {
                        if (address[0]) {
                            console.log(address[0]);
                            this._address = address[0];
                            this._typeConnect = 'toncoinwallet';
                            this.sussesConnect();
                            DeLabConnect.addStorageData('init', true);
                            DeLabConnect.addStorageData('type-connect', this._typeConnect);
                            DeLabConnect.addStorageData('address', this._address);
                            DeLabConnect.addStorageData('network', this._network);
                            this.closeModal();
                            return this._address;
                        }
                    }
                }
                this.newEvent('error-toncoinwallet', 'account_not_registered');
            }
            else {
                this.newEvent('error-toncoinwallet', 'error_isTonWallet');
            }
        }
        else {
            this.newEvent('error-toncoinwallet', 'toncoin_wallet_not_installed');
        }
        return undefined;
    }
    async connectTonkeeper(wallet) {
        let walletConnectionSource;
        if (wallet.universalLink) {
            walletConnectionSource = {
                universalLink: wallet.universalLink,
                bridgeUrl: wallet.bridgeUrl
            };
        }
        else {
            walletConnectionSource = { jsBridgeKey: wallet.name.toLocaleLowerCase() };
        }
        const universalLink = this._connectorTonConnect.connect(walletConnectionSource);
        // console.log(universalLink)
        this._tonConnectWallet = wallet;
        if (universalLink)
            this.newEvent('link', universalLink);
        return undefined;
    }
    on(event, listener) {
        this._events.on(event, listener);
    }
    async sendTransaction(transaction) {
        if (this._typeConnect) {
            switch (this._typeConnect) {
                case 'tonhub':
                    return this.sendTransactionTonHub(transaction);
                case 'toncoinwallet':
                    return DeLabConnect.sendTransactionToncoinWallet(transaction);
                case 'tonkeeper':
                    return this.sendTransactionTonkeeper(transaction);
                default:
                    throw new Error('Error typeConnect');
            }
        }
        else {
            // const errorText = 'notConnected'
            // console.log('eee')
            this.newEvent('error', this._typeConnect);
            // this.newEvent('disconnect', true)
        }
        return false;
    }
    disconnect() {
        this._sessionTonHub = undefined;
        this._walletTonHub = undefined;
        this._address = undefined;
        this._balance = undefined;
        this._connectorTonConnect.disconnect();
        this.clearStorage();
        this.newEvent('disconnect', true);
        return true;
    }
    closeModal() {
        this._isOpenModal = false;
        this.newEvent('modal', this._isOpenModal);
        return true;
    }
    async openModal() {
        this._isOpenModal = true;
        // this.newEvent('modal', this._isOpenModal)
        await this.createTonConnect();
        this.newEvent('modal', this._isOpenModal);
        await this.createTonHub();
        return true;
    }
    get isOpenModal() {
        return this._isOpenModal;
    }
    get typeConnect() {
        return this._typeConnect;
    }
    get appUrl() {
        return this._appUrl;
    }
    get appName() {
        return this._appName;
    }
    get address() {
        return this._address;
    }
    get network() {
        return this._network;
    }
    get connectorTonHub() {
        return this._connectorTonHub;
    }
    get sessionTonHub() {
        return this._sessionTonHub;
    }
    get walletTonHub() {
        return this._walletTonHub;
    }
    get tonConnectWallets() {
        return this._tonConnectWallets;
    }
    get connectorTonConnect() {
        return this._connectorTonConnect;
    }
    get tonConnectWallet() {
        return this._tonConnectWallet;
    }
}
export { DeLabConnect };
