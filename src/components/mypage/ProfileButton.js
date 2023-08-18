import {Text, StyleSheet, Pressable} from 'react-native';
import {useTheme} from '../../hooks';
const ProfileButton = ({title, onPress}) => {
  const {Fonts} = useTheme();
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={Fonts.contentRegularBold}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 77,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#F2F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileButton;
