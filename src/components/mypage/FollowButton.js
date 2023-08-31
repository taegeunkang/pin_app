import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useTheme} from '../../hooks';
const FollowButton = ({title, onPress}) => {
  const {Fonts, Colors} = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: 77,
      height: 23,
      borderRadius: 12,
      backgroundColor: Colors.buttonFirstBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text
        style={[Fonts.contentRegularBold, {color: Colors.buttonFirstContent}]}>
        {title}
      </Text>
    </Pressable>
  );
};

export default FollowButton;
