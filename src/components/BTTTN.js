import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Animated} from 'react-native';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const BTTTN = () => {
  const [isPressed, setIsPressed] = useState(false);
  const buttonColor = new Animated.Value(0);

  const handleButtonPressIn = () => {
    Animated.timing(buttonColor, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsPressed(true);
  };

  const handleButtonPressOut = () => {
    Animated.timing(buttonColor, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsPressed(false);
  };

  const interpolateColor = buttonColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#f9f9f9'],
  });

  const animatedStyle = {
    backgroundColor: interpolateColor,
  };

  return (
    <View style={styles.container}>
      <AnimatedTouchableOpacity
        style={[styles.button, animatedStyle]}
        onPressIn={handleButtonPressIn}
        onPressOut={handleButtonPressOut}>
        <Text style={styles.buttonText}>버튼</Text>
      </AnimatedTouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BTTTN;
