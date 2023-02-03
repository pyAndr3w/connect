import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import './static/modal.css';
import './static/style.css';
const white = 'https://ipfs.filebase.io/ipfs/bafkreigpmboyvo43fa4ybalflby3pb3eg2emgzn7axkgd7rmvrgdpx4oja';
const black = 'https://ipfs.filebase.io/ipfs/bafkreibbn3nq6avodph3lcg6qlak6tbjha7levxzwgyk7nyrwot3ajvuwq';
export const DeLabButton = React.memo((props) => (_jsxs("div", { onClick: () => props.DeLabConnectObject.openModal(), className: "delab-button", children: [_jsx("img", { src: props.scheme === 'light' ? white : black, className: "delab-logo" }), _jsx("span", { children: "DeLab Connect" })] })));
