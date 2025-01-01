'use client';

import { useState } from 'react';
import { NarrationForm } from './NarrationForm';

export const NarrationArea = () => {
  const [narrationScript, setNarrationScript] = useState('');

  const handleFormSubmit = (value: string) => {
    setNarrationScript(value);
  };

  return (
    <div>
      <NarrationForm onFormSubmit={handleFormSubmit} />
      {narrationScript}
    </div>
  );
};
