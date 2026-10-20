// index.js
// This is the entry point of the React app.
// ReactDOM.createRoot() mounts our App component
// into the <div id="root"> in public/index.html

import React from 'react';
import ReactDOM from 'react-dom/client';
import './FLORA_style_2_clean.css'; // Import our existing CSS — no changes needed
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
