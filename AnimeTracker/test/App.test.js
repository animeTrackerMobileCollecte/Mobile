import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('Test de démarrage de l’application', () => {
  it('doit s’afficher sans crash', () => {
    const renderResult = render(<App />);
    
  });
});