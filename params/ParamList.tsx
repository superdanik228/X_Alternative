import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    Welcome: undefined;
    Home: undefined;
    Login: undefined;
    Registration: undefined;
};

export type Props = NativeStackScreenProps<RootStackParamList>;