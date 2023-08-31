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
import {API_URL} from '../../utils/constants';
import FastImage from 'react-native-fast-image';
const UserCell = ({profileImage, name, closeAvailable, onPress, onClose}) => {
  const {Images, Fonts, Colors} = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <FastImage
          source={{
            uri: API_URL + `/user/profile/image?watch=${profileImage}`,
            priority: FastImage.priority.high,
          }}
          style={{
            width: responsiveWidth(35),
            height: responsiveHeight(35),
            borderRadius: responsiveWidth(12),
          }}
        />
        <Text
          style={[
            Fonts.contentMediumMedium,
            {color: Colors.textNormal, marginLeft: responsiveWidth(5)},
          ]}>
          {name}
        </Text>
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
});
export default UserCell;
