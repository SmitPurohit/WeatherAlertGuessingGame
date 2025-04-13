// src/components/MapComponent.js
import React, { useState } from 'react';
import { Map, Marker } from 'pigeon-maps';

const MapComponent = ({ target, onGuessChange, guessDone }) => {
  const [guess, setGuess] = useState(null);

  const handleMapClick = (event) => {
    if (guessDone) return; // Do nothing after guess is submitted.
    // Pigeon Maps provides click events with an object that contains latLng: [lat, lng].
    const [lat, lng] = event.latLng;
    const newGuess = { lat, lng };
    setGuess(newGuess);
    if (typeof onGuessChange === 'function') {
      onGuessChange(newGuess);
    }
  };

  return (
    // Wrap the map in a fixed-size container for a consistent “viewing box” size.
    <div style={{ width: '800px', height: '400px', border: '1px solid #ccc' }}>
      <Map
        height={400}
        defaultCenter={[39.5, -98.35]}
        defaultZoom={4}
        onClick={handleMapClick}
      >
        {/* Render the guess marker if available */}
        {guess && <Marker anchor={[guess.lat, guess.lng]} color="red" />}
        {/* Render the target marker (blue) if the guess is submitted */}
        {guessDone && target && <Marker anchor={[target.lat, target.lon]} color="blue" />}
      </Map>
    </div>
  );
};

export default MapComponent;
