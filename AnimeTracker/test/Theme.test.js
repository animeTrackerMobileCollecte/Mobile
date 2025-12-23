import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Switch, Text } from 'react-native';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

function TestComponent() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <View>
      <Text testID="theme-label">{isDarkMode ? 'dark' : 'light'}</Text>
      <Switch
        testID="theme-switch"
        value={isDarkMode}
        onValueChange={toggleTheme}
      />
    </View>
  );
}

describe('Logique du Mode Sombre', () => {

  it('doit avoir le mode clair par défaut', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const label = getByTestId('theme-label');
    expect(label.props.children).toBe('light');
  });

  it('doit basculer le thème quand on change le switch', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeSwitch = getByTestId('theme-switch');

    expect(themeSwitch.props.value).toBe(false);

    fireEvent(themeSwitch, 'onValueChange', true);

    expect(themeSwitch.props.value).toBe(true);
  });

  it('doit rendre le ThemeProvider sans erreur', () => {
    const renderResult = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(renderResult).toBeDefined();
  });

});