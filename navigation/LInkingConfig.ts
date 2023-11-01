import {LinkingOptions} from '@react-navigation/native';
import * as Linking from 'expo-linking';
import {RootStackParamList} from './types';

//TODO
const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [Linking.createURL('/')],
    config: {
        screens: {
            Root: {
                screens: {},
            },
        },
    },
};

export default linking;
