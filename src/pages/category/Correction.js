import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Correction() {
  const location = useLocation();
  const { transcription } = location.state || {};


  

  return (
    <div className="correction">
      <p>{transcription}</p>
    </div>
  );
}

export default Correction;
