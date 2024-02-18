import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useTheme} from '../../hooks';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {API_URL} from '../../utils/constants';
import FastImage from 'react-native-fast-image';
const UserCell = ({profileImage, name, closeAvailable, onPress, onClose}) => {
  const {Images, Fonts, Colors} = useTheme();

  const buttonColor = new Animated.Value(0);
  buttonColor.addListener(() => {
    return;
  });
  const handleButtonPressIn = () => {
    Animated.timing(buttonColor, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.timing(buttonColor, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const interpolateColor = buttonColor.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.contentBackground, Colors.contentBackground],
  });
  const animatedStyle = {
    backgroundColor: interpolateColor,
  };

  return (
    <Pressable onPress={onPress} style={[styles.container, animatedStyle]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <FastImage
          source={{
            uri: API_URL + `/user/profile/image?watch=${profileImage}`,
            priority: FastImage.priority.high,
          }}
          style={{
            width: responsiveWidth(35),
            height: responsiveWidth(35),
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
