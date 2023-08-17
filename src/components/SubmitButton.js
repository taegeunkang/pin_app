import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../hooks';
import {responsiveHeight, responsiveWidth} from './Scale';
const SubmitButton = ({onPress, title, width, height, loading}) => {
  const {Fonts, Gutters} = useTheme();
  const scaleValue = useState(new Animated.Value(1))[0];

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
            !width
              ? {width: responsiveWidth(370)}
              : {width: responsiveWidth(width)},
            !height
              ? {height: responsiveHeight(48)}
              : {height: responsiveHeight(height)},
            styles.loginButtonText,
          ]}>
          <Text style={styles.submitBtnTitle}>{title}</Text>
          {loading && (
            <ActivityIndicator
              size={'small'}
              style={[
                Gutters.largeVMargin,
                {
                  width: responsiveWidth(25),
                  height: responsiveHeight(25),
                  marginLeft: responsiveWidth(5),
                  position: 'absolute',
                  right: responsiveWidth(10),
                },
              ]}
              color={'#FFFFFF'}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginButtonText: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4880EE',
    borderRadius: responsiveWidth(12),
  },
  submitBtnTitle: {
    fontFamily: 'SpoqaHanSansNeo-Bold',
    fontSize: responsiveWidth(14),
    lineHeight: responsiveHeight(24),
    letterSpacing: responsiveWidth(-0.6),
    color: '#FFFFFF',
  },
});

export default SubmitButton;
