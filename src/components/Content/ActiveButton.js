import {useState} from 'react';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {useTheme} from '../../hooks';
const ActiveButton = ({img, title, onPress}) => {
  const scaleValue = useState(new Animated.Value(1))[0];
  const {Fonts, Colors} = useTheme();

  const onButtonPressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true, // 원활한 성능을 위해 네이티브 드라이버 사용
    }).start();
  };

  const onButtonPressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true, // 원활한 성능을 위해 네이티브 드라이버 사용
    }).start();
  };

  return (
    <View>
      <Animated.View style={{transform: [{scale: scaleValue}]}}>
        <TouchableOpacity
          onPressIn={onButtonPressIn}
          onPressOut={onButtonPressOut}
          onPress={onPress}
          activeOpacity={1}
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.buttonFirstBackground,
              borderRadius: responsiveWidth(12),
              flexDirection: 'row',
              position: 'relative',
              width: responsiveWidth(370),
              height: responsiveHeight(48),
            },
            ,
          ]}>
          <Text
            style={[
              Fonts.contentMediumBold,
              {
                color: Colors.buttonFirstContent,
              },
            ]}>
            {title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ActiveButton;
