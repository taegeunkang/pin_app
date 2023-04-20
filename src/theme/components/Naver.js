import { Pressable, StyleSheet, Text, Image } from 'react-native';
import { useTheme } from '../../hooks';
const Naver = () => {
  const { Images } = useTheme();

  return (
    <Pressable style={styles.background}>
      <Image source={Images.naverLogo} style={styles.logo} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#03C75A',
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

export default Naver;
