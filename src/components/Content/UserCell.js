import {View, StyleSheet, Image, Text} from 'react-native';
import {useTheme} from '../../hooks';

const UserCell = ({profileImage, name, closeAvailable, onPress}) => {
  const {Images} = useTheme();

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            width: 35,
            height: 35,
            borderRadius: 12,
            backgroundColor: 'black',
          }}></View>
        <Text style={styles.nickname}>mars2727</Text>
      </View>
      {closeAvailable ? (
        <Image source={Images.close} style={{width: 15, height: 15}} />
      ) : (
        <Image source={Images.rightChevron} style={{width: 8.75, height: 15}} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 370,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nickname: {
    fontFamily: 'SpoqaHanSansNeo-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.6,
    marginLeft: 5,
  },
});
export default UserCell;
