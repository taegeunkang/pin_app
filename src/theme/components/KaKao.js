import { Pressable, StyleSheet, Text, Image } from 'react-native';
import { useTheme } from '../../hooks';
import { Colors } from '../Variables';
const Kakao = ({ kakaoSignin }) => {
  const { Images } = useTheme();
  return (
    <Pressable style={styles.background} onPress={kakaoSignin}>
      <Image source={Images.kakaoLogo} style={[styles.logo]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  background: {
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
    width: 45,
    height: 45,
  },
});

export default Kakao;
