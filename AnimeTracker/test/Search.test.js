import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { ThemeProvider } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { AnimeProvider } from '../src/context/AnimeContext';

const AllProviders = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <AnimeProvider>{children}</AnimeProvider>
    </AuthProvider>
  </ThemeProvider>
);

describe('Composant HomeScreen', () => {
  it('doit mettre à jour la valeur de recherche quand l’utilisateur tape', () => {
    const { getByPlaceholderText } = render(<HomeScreen />, { wrapper: AllProviders });
    const input = getByPlaceholderText('Chercher dans tout le catalogue...');

    fireEvent.changeText(input, 'Naruto');
    expect(input.props.value).toBe('Naruto');
  });
});