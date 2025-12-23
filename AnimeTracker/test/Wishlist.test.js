import React from 'react';
import { render } from '@testing-library/react-native';
import WishlistScreen from '../src/screens/WishlistScreen';
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

describe('Écran Wishlist', () => {

    it('doit s\'afficher sans crash', () => {
        const renderResult = render(<WishlistScreen />, { wrapper: AllProviders });

        expect(renderResult).toBeDefined();
    });

    it('doit rendre le composant correctement', () => {
        const { toJSON } = render(<WishlistScreen />, { wrapper: AllProviders });

        expect(toJSON()).not.toBeNull();
    });

});
