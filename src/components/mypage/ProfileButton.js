import {Text, StyleSheet, TouchableOpacity} from 'react-native';
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
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text
        style={[Fonts.contentRegularBold, {color: Colors.buttonThirdContent}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ProfileButton;
