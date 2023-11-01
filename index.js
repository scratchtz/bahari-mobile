import {registerRootComponent} from 'expo';
import 'text-encoding-polyfill';
import 'react-native-url-polyfill/auto';

import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/ja';
import 'intl/locale-data/jsonp/ko';
import 'intl/locale-data/jsonp/zh';
import 'intl/locale-data/jsonp/sw';
import 'intl-pluralrules';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
