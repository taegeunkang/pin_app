import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../hooks';
const ProfileButton = ({title}) => {
  const {Fonts} = useTheme();
  return (
    <View style={styles.container}>
      <Text style={Fonts.contentRegularBold}>{title}</Text>
    </View>
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
