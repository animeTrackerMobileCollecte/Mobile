import React from 'react';
import { render } from '@testing-library/react-native';
import AnimeCard from '../src/components/AnimeCard';
import { ThemeProvider } from '../src/context/ThemeContext';

const ThemeWrapper = ({ children }) => (
    <ThemeProvider>{children}</ThemeProvider>
);

const mockAnime = {
    malId: 1,
    title: 'Naruto',
    imageUrl: 'https://example.com/naruto.jpg',
    rating: '8.5',
    episodes: 220,
    status: null,
    isFavorite: false,
};

describe('Composant AnimeCard', () => {

    it('doit afficher le titre de l\'anime', () => {
        const { getByText } = render(
            <AnimeCard anime={mockAnime} />,
            { wrapper: ThemeWrapper }
        );

        expect(getByText('Naruto')).toBeTruthy();
    });

    it('doit se rendre sans erreur', () => {
        const renderResult = render(
            <AnimeCard anime={mockAnime} />,
            { wrapper: ThemeWrapper }
        );

        expect(renderResult).toBeDefined();
    });

    it('doit accepter une fonction onToggleFavorite', () => {
        const mockToggleFavorite = jest.fn();

        const { getByText } = render(
            <AnimeCard
                anime={mockAnime}
                onToggleFavorite={mockToggleFavorite}
            />,
            { wrapper: ThemeWrapper }
        );

        expect(getByText('Naruto')).toBeTruthy();
    });

});
