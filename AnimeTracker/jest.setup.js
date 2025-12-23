import '@testing-library/jest-native/extend-expect';

// AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Icônes
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// MOCK NAVIGATION GLOBAL (Force les hooks à fonctionner partout)
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
      addListener: jest.fn(() => () => {}),
    }),
    useRoute: () => ({
      params: { anime: { id: 1, title: 'Cowboy Bebop' } },
    }),
    useIsFocused: () => true,
    NavigationContainer: ({ children }) => children,
  };
});

// Mock des Navigators (Stack & Tabs)
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Mocks additionnels (Charts / Swipe)
jest.mock('react-native-gifted-charts', () => ({
  BarChart: 'BarChart',
  PieChart: 'PieChart',
  LineChart: 'LineChart',
}));

jest.mock('react-native-swipe-list-view', () => ({
  SwipeListView: 'SwipeListView',
}));

// Polyfills pour React 19 / Expo
global.__ExpoImportMetaRegistry = {};
if (typeof global.structuredClone !== 'function') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Optionnel: Nettoyer la console des erreurs 'act'
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('act(...)')) return;
  originalConsoleError(...args);
};