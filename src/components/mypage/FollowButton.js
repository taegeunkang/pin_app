import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../hooks';
const FollowButton = ({title}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.tt}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 77,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#4880EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tt: {
    fontFamily: 'SpoqaHanSansNeo-Bold',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.6,
    color: '#ffffff',
  },
});

export default FollowButton;
