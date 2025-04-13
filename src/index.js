// Replace the entire content of index.js with the code below
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';

const container = document.getElementById('root');
// Use createRoot to render your app
const root = createRoot(container);
root.render(<App />);