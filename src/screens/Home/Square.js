import React, { useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet, TouchableOpacity, View } from "react-native";

const Square = () => {
  const [scale, setScale] = useState(1);
  const [previousDistance, setPreviousDistance] = useState(null);
  const animatedTranslationX = useRef(new Animated.Value(0)).current;
  const animatedTranslationY = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(null);
  const window = Dimensions.get("window");

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        animatedTranslationX.setValue(dx);
        animatedTranslationY.setValue(dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const screenWidth = window.width;
        const maxTranslateX = (screenWidth / 2) * scale - screenWidth / 2;
        const maxTranslateY = (screenWidth / 2) * scale - screenWidth / 2;
        Animated.spring(animatedTranslationX, {
          toValue: Math.max(-maxTranslateX, Math.min(0, dx)),
          useNativeDriver: true,
        }).start();
        Animated.spring(animatedTranslationY, {
          toValue: Math.max(-maxTranslateY, Math.min(0, dy)),
          useNativeDriver: true,
        }).start();
      },
      onPanResponderGrant: () => {
        // Prevent parent views from handling this event
        return false;
      },
      onPanResponderTerminate: () => {
        // If another view takes over the responder, terminate this gesture
        return true;
      },
    }),
  ).current;

  const onDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      // Double tap detected
      setScale(scale === 1 ? 2 : 1); // Toggle between 1x and 2x scale
    } else {
      // Single tap detected
      setScale(1);
    }
    lastTap.current = now;
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchable}
                        onPress={onDoubleTap}
                        activeOpacity={1}>
        <Animated.View
          style={[
            styles.square,
            {
              transform: [
                { translateX: animatedTranslationX },
                { translateY: animatedTranslationY },
                { scale: scale },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Animated.Image
            style={[styles.image]}
            source={{
              uri: "https://cdn.britannica.com/45/196945-050-CCF8BD72/Temple-of-Saturn-Arch-Septimius-Severus-Forum.jpg",
            }}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: "100%",
    height: "100%",
    backgroundColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  touchable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Square;
