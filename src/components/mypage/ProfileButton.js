import {Text, StyleSheet, Pressable} from 'react-native';
import {useTheme} from '../../hooks';
const ProfileButton = ({title, onPress}) => {
  const {Fonts, Colors} = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: 77,
      height: 23,
      borderRadius: 12,
      backgroundColor: Colors.buttonThirdBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text
        style={[Fonts.contentRegularBold, {color: Colors.buttonThirdContent}]}>
        {title}
      </Text>
    </Pressable>
  );
};

export default ProfileButton;
