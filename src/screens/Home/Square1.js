import React, { useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, View } from "react-native";

const Square1 = ({ image, scale, setScale }) => {
  const [previousDistance, setPreviousDistance] = useState(null);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const animatedTranslationX = useRef(new Animated.Value(0)).current;
  const animatedTranslationY = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(null);
  const window = Dimensions.get("window");

  // issue
  // - 값에 대한 값의 적용이 이루어지지 않음
  // 확대 했을 때 확대한 만큼 이동 limitation에 대한 경계 값 설정

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;

        // Set maximum translation limits
        const screenWidth = window.width;
        const maxTranslationX = (scale == 1) ? screenWidth * scale - screenWidth / 2 : screenWidth;
        const maxTranslationY = screenWidth * scale - screenWidth / 2;

        // Limit movement to 50% of the screen
        let moveX = Math.abs(dx) > maxTranslationX / 3 ? maxTranslationX / 3 : dx;
        let moveY = Math.abs(dy) > maxTranslationY / 3 ? maxTranslationY / 3 : dy;

        if (dx < 0 && moveX > 0) moveX = -moveX;
        if (dy < 0 && moveY > 0) moveY = -moveY;
        
        // Update animated values with limited movement
        animatedTranslationX.setValue(moveX);
        animatedTranslationY.setValue(moveY);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const screenWidth = window.width;
        const maxTranslateX = (scale == 1) ? screenWidth * scale - screenWidth / 2 : screenWidth;
        const maxTranslateY = screenWidth * scale - screenWidth / 2;

        let moveX = (maxTranslateX < Math.abs(dx)) ? maxTranslateX : dx;
        let moveY = (maxTranslateY < Math.abs(dy)) ? maxTranslateY : dy;

        Animated.spring(animatedTranslationX, {
          toValue: Math.max(-maxTranslateX, Math.min(0, Math.abs(dx))),
          useNativeDriver: true,
        }).start();
        Animated.spring(animatedTranslationY, {
          toValue: Math.max(-maxTranslateY, Math.min(0, Math.abs(dy))),
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
    // console.log("tab");
    // console.log(scale);
  };


  return (
    <View style={styles.container}>
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
        <Pressable onPress={onDoubleTap} style={{ width: "100%", height: "100%" }}>
          <Animated.Image
            style={[styles.image]}
            source={{
              uri: image,
            }}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default Square1;
