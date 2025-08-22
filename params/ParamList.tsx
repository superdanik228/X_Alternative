import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Login: undefined;
  Registration: undefined;
  CreateGroup: undefined;
};

type NativeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export type Props = NativeProps & {
  userToken: string | null;
  refreshToken: () => void;
};
