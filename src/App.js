import React from 'react';
import Game from './components/Game';
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <div className="App">
      <Game />
      <Analytics />
    </div>
  );
}

export default App;
