import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useTheme } from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../utils/constants';
const Google = ({ googleSigin }) => {
  const { t } = useTranslation('login');
  const { Images } = useTheme();

  return (
    <Pressable style={styles.background} onPress={googleSigin}>
      <Image source={Images.googleLogo} style={styles.logo} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFFFF',
    width: 45,
    height: 45,
    borderRadius: 100,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },

  logo: {
    width: 30,
    height: 30,
  },
});

export default Google;
