import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Login: undefined;
  Registration: undefined;
  CreateGroup: undefined;
  GroupHomePage: { code?: string } | undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export interface AuthProps {
  userToken: string | null;
  refreshToken: () => void;
}

export type Props = ScreenProps<'Home'> & AuthProps;