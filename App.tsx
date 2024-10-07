import 'react-native-gesture-handler';
import * as React from 'react';
import RootNavigator from './src/navigation/index';
import {LogBox} from 'react-native';
import {Provider} from 'react-redux';
import configureStore from './src/store/redux/store';
import FlashMessage from 'react-native-flash-message';
import InternetHandler from './src/utils/InternetHandler';
import LanguageModal from './src/components/molecules/LanguageModal';

LogBox.ignoreAllLogs(true);
const store = configureStore();

const App: () => React.ReactNode = () => {
  return (
    <Provider store={store}>
      <InternetHandler />
      <RootNavigator />
      <FlashMessage position="top" />
      <LanguageModal />
    </Provider>
  );
};

export default App;
