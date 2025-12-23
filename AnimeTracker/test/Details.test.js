import React from 'react';
import { render } from '@testing-library/react-native';
import AnimeDetailsScreen from '../src/screens/AnimeDetailsScreen';
import { ThemeProvider } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { AnimeProvider } from '../src/context/AnimeContext';

const mockRoute = {
  params: {
    anime: {
      malId: 1,
      title: 'One Piece',
      synopsis: 'Luffy devient le roi des pirates',
      rating: '9.1',
      imageUrl: 'https://example.com/onepiece.jpg',
      image: 'https://example.com/onepiece.jpg',
      episodes: 1000,
      status: 'Ongoing',
      isFavorite: false,
      year: 1999,
      studio: 'Toei Animation',
    }
  }
};

const AllProviders = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <AnimeProvider>
        {children}
      </AnimeProvider>
    </AuthProvider>
  </ThemeProvider>
);

describe('Écran Détails', () => {

  it('doit afficher le titre de l\'animé passé en paramètres', () => {
    const { getByText } = render(
      <AllProviders>
        <AnimeDetailsScreen route={mockRoute} navigation={{ goBack: jest.fn() }} />
      </AllProviders>
    );

    expect(getByText('One Piece')).toBeTruthy();
  });

  it('doit afficher le bouton Add to List', () => {
    const { getByText } = render(
      <AllProviders>
        <AnimeDetailsScreen route={mockRoute} navigation={{ goBack: jest.fn() }} />
      </AllProviders>
    );

    expect(getByText('Add to List')).toBeTruthy();
  });

  it('doit se rendre sans erreur', () => {
    const renderResult = render(
      <AllProviders>
        <AnimeDetailsScreen route={mockRoute} navigation={{ goBack: jest.fn() }} />
      </AllProviders>
    );

    expect(renderResult).toBeDefined();
  });

});