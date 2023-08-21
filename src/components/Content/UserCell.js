import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../hooks';
import {responsiveHeight, responsiveWidth} from '../Scale';
const UserCell = ({profileImage, name, closeAvailable, onPress, onClose}) => {
  const {Images} = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            width: responsiveWidth(35),
            height: responsiveHeight(35),
            borderRadius: responsiveWidth(12),
            backgroundColor: 'black',
          }}></View>
        <Text style={styles.nickname}>{name}</Text>
      </View>
      {closeAvailable ? (
        <TouchableOpacity onPress={onClose}>
          <Image
            source={Images.close}
            style={{width: responsiveWidth(15), height: responsiveHeight(15)}}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity>
          <Image
            source={Images.rightChevron}
            style={{width: responsiveWidth(8.75), height: responsiveHeight(15)}}
          />
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(370),
    height: responsiveHeight(45),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nickname: {
    fontFamily: 'SpoqaHanSansNeo-Medium',
    fontSize: responsiveWidth(14),
    lineHeight: responsiveHeight(20),
    letterSpacing: responsiveWidth(-0.6),
    marginLeft: responsiveWidth(5),
  },
});
export default UserCell;
