import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';
import { ThemeProvider } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';

const AllProviders = ({ children }) => (
    <ThemeProvider>
        <AuthProvider>
            {children}
        </AuthProvider>
    </ThemeProvider>
);

const mockRoute = { params: {} };
const mockNavigation = {
    replace: jest.fn(),
    navigate: jest.fn(),
};

describe('Écran de Connexion', () => {

    it('doit afficher les champs email et mot de passe', () => {
        const { getByPlaceholderText } = render(
            <AllProviders>
                <LoginScreen route={mockRoute} navigation={mockNavigation} />
            </AllProviders>
        );

        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    });

    it('doit permettre de saisir un email', () => {
        const { getByPlaceholderText } = render(
            <AllProviders>
                <LoginScreen route={mockRoute} navigation={mockNavigation} />
            </AllProviders>
        );

        const emailInput = getByPlaceholderText('Email');
        fireEvent.changeText(emailInput, 'test@email.com');

        expect(emailInput.props.value).toBe('test@email.com');
    });

    it('doit afficher un bouton de connexion', () => {
        const { getByText } = render(
            <AllProviders>
                <LoginScreen route={mockRoute} navigation={mockNavigation} />
            </AllProviders>
        );

        expect(getByText('Se connecter')).toBeTruthy();
    });

});
