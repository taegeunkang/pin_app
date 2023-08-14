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

const SubmitButton2 = ({onPress, title, width, height, loading}) => {
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
            !width ? {width: 370} : {width: width},
            !height ? {height: 48} : {height: height},
            styles.btn,
          ]}>
          <Text style={styles.submitBtnTitleReverse}>{title}</Text>
          {loading && (
            <ActivityIndicator
              size={'small'}
              style={[
                Gutters.largeVMargin,
                {
                  width: 25,
                  height: 25,
                  marginLeft: 5,
                },
              ]}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAF3FE',
    borderRadius: 12,
    flexDirection: 'row',
  },
  submitBtnTitleReverse: {
    fontFamily: 'SpoqaHanSansNeo-Bold',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.6,
    color: '#4880EE',
  },
});

export default SubmitButton2;
