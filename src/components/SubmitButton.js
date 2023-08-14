import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {useTheme} from '../hooks';

const SubmitButton = ({onPress, title, width, height}) => {
  const {Fonts} = useTheme();
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
            !width ? {width: 370} : {width: width},
            !height ? {height: 48} : {height: height},
            styles.loginButtonText,
          ]}>
          <Text style={styles.submitBtnTitle}>{title}</Text>
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
    borderRadius: 12,
  },
  submitBtnTitle: {
    fontFamily: 'SpoqaHanSansNeo-Bold',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.6,
    color: '#FFFFFF',
  },
});

export default SubmitButton;
