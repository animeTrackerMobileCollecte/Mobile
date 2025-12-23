import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../src/screens/SettingScreen';
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

describe('Logique du Mode Sombre', () => {
  it('doit basculer le thème quand on clique sur le switch', () => {
    const { getByRole } = render(<SettingsScreen />, { wrapper: AllProviders });
    const themeSwitch = getByRole('switch');

    // Vérifie l'état initial (False = Light mode par défaut souvent)
    expect(themeSwitch.props.value).toBe(false);

    // Simule le clic
    fireEvent(themeSwitch, 'onValueChange', true);

    // Vérifie que la valeur a changé
    expect(themeSwitch.props.value).toBe(true);
  });
});