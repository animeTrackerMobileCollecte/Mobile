import React from 'react';
import { render } from '@testing-library/react-native';
import AnimeDetailsScreen from '../src/screens/AnimeDetailsScreen';
import { ThemeProvider } from '../src/context/ThemeContext';
import { AnimeProvider } from '../src/context/AnimeContext';
import { AuthProvider } from '../src/context/AuthContext'; // Ajoute cet import

const mockRoute = {
  params: {
    anime: {
      title: 'One Piece',
      synopsis: 'Luffy devient le roi des pirates',
      rating: '9.1'
    }
  }
};

describe('Écran Détails', () => {
  it('doit afficher le titre de l’animé passé en paramètres', () => {
    const { getByText } = render(
      <ThemeProvider>
        <AuthProvider> 
          <AnimeProvider>
            <AnimeDetailsScreen route={mockRoute} navigation={{ goBack: jest.fn() }} />
          </AnimeProvider>
        </AuthProvider>
      </ThemeProvider>
    );

    expect(getByText('One Piece')).toBeTruthy();
  });
});