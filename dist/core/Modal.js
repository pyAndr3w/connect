import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Icon24Dismiss, Icon28ChevronLeftOutline } from '@vkontakte/icons';
import QRCodeStyling from 'qr-code-styling';
import * as QRoptions from './qr.json';
import './static/modal.css';
import './static/style.css';
const white = 'https://ipfs.filebase.io/ipfs/bafkreigpmboyvo43fa4ybalflby3pb3eg2emgzn7axkgd7rmvrgdpx4oja';
const black = 'https://ipfs.filebase.io/ipfs/bafkreibbn3nq6avodph3lcg6qlak6tbjha7levxzwgyk7nyrwot3ajvuwq';
const tonhubLogo = 'https://ipfs.filebase.io/ipfs/bafkreidr3kjxine5hgjxq45ybgqep5vr7lh5kldhyjbzvhh2hd2ukyuae4';
const tonkeeperLogo = 'https://ipfs.filebase.io/ipfs/bafkreia4powgq5jmqpgffbvxqlwjfecnafx2qx4lfpywsloz3ikffnnmya';
const toncoinwalletLogo = 'https://ipfs.filebase.io/ipfs/bafkreidzi6kpvacf67lb5n45gjhrx2jhv3fjmr4kl5zmeqw7ks3wemfuqe';
const options = QRoptions;
const qrCode = new QRCodeStyling(options);
const DeLabModal = (props) => {
    const [firstRender, setFirstRender] = useState(false);
    const [type, setType] = useState(0);
    const [link, setLink] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [tonConnectWallets, setTonConnectWallets] = useState([]);
    const isDesktop = window.innerWidth >= 1000;
    const ref = useRef(null);
    function openLink(url) {
        const link2 = document.createElement('a');
        link2.href = url;
        link2.target = '_blank';
        link2.click();
    }
    function registerListen() {
        props.DeLabConnectObject.on('modal', (data) => {
            setIsOpenModal(data.data ?? false);
            if (!data.data) {
                setType(0);
                setLink('');
            }
        });
        props.DeLabConnectObject.on('link', (data) => {
            setLink(data.data ?? '');
            setType(1);
            console.log('link', data.data);
            const typeWallet = data.data.indexOf('tonhub') > -1;
            if (!isDesktop)
                openLink(data.data);
            // const tonconnectImg = props.DeLabConnectObject.tonConnectWallet?.imageUrl
            qrCode.update({
                data: data.data,
                image: typeWallet ? tonhubLogo : tonkeeperLogo
            });
        });
        props.DeLabConnectObject.on('connected', () => {
            setIsOpenModal(false);
            setType(0);
            setLink('');
        });
    }
    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true);
            registerListen();
            document.body.setAttribute('scheme', props.scheme === 'dark' ? 'space_gray' : 'bright_light');
        }
    }, []);
    useEffect(() => {
        qrCode.append(ref.current ?? undefined);
    }, [type]);
    useEffect(() => {
        setTonConnectWallets(props.DeLabConnectObject.tonConnectWallets ?? []);
    }, [props.DeLabConnectObject.tonConnectWallets]);
    return (_jsx("div", { className: 'delab-modal-root ' + (isOpenModal ? 'delab-modal-root-active' : ''), children: _jsxs("div", { className: 'delab-modal-block', children: [_jsxs("div", { className: "delab-modal-header", children: [_jsx("div", { className: 'delab-modal-header-left' + (type === 0 ? ' delab-disable' : ''), onClick: () => {
                                setType(0);
                                setLink('');
                            }, children: _jsx(Icon28ChevronLeftOutline, { width: 24, height: 24 }) }), _jsxs("div", { className: "delab-modal-header-center", children: [_jsx("img", { src: props.scheme === 'dark' ? white : black, className: "delab-logo delab-logo2" }), _jsxs("a", { target: "_blank", href: "https://delab.team", children: ["  ", _jsx("span", { children: "DeLab Connect" })] })] }), _jsx("div", { className: "delab-modal-header-right", onClick: () => props.DeLabConnectObject.closeModal(), children: _jsx(Icon24Dismiss, {}) })] }), type === 0
                    ? _jsx("div", { className: "delab-modal-content", children: _jsxs("div", { className: "delab-modal-horizontal", children: [_jsxs("div", { className: "delab-modal-horizontal-block", onClick: () => props.DeLabConnectObject.connectTonHub(), children: [_jsx("div", { className: "delab-icon", children: _jsx("img", { src: tonhubLogo }) }), _jsx("span", { children: "Tonhub" })] }), _jsxs("div", { className: "delab-modal-horizontal-block", onClick: () => setType(2), children: [_jsx("div", { className: "delab-icon", children: _jsx("img", { src: tonkeeperLogo }) }), _jsx("span", { children: "Ton Connect 2.0" })] }), _jsxs("div", { className: "delab-modal-horizontal-block", onClick: () => props.DeLabConnectObject.connectToncoinWallet(), children: [_jsx("div", { className: "delab-icon", children: _jsx("img", { src: toncoinwalletLogo }) }), _jsx("span", { children: "Web Ton Wallets" })] })] }) })
                    : null, type === 2
                    ? _jsxs("div", { className: "delab-modal-content", children: [_jsx("div", { className: "delab-modal-text-icon delab_text", children: "Ton Connect 2.0" }), tonConnectWallets.map((wallet, key) => (_jsxs("div", { className: "delab-modal-horizontal-block", onClick: () => props.DeLabConnectObject.connectTonkeeper(wallet), children: [_jsx("div", { className: "delab-icon", children: _jsx("img", { src: wallet.imageUrl }) }), _jsx("span", { children: wallet.name })] }, key)))] })
                    : null, type === 1 ? _jsx("div", { className: "delab-modal-content", children: _jsx("div", { className: "delab-center-block2", children: isDesktop ? _jsx("a", { target: "_blank", href: link, children: _jsx("div", { className: "qr-delab", children: _jsx("div", { ref: ref }) }) })
                            : _jsx("a", { className: 'delab-button delab-button-large', target: "_blank", href: link, children: "Open Wallet" }) }) })
                    : null] }) }));
};
export { DeLabModal };
