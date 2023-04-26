import React, { useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";

const Square = () => {
  const [pan, setPan] = useState(new Animated.ValueXY());

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: pan.x,
            dy: pan.y,
          },
        ],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: () => {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.square}>
        <Animated.Image
          style={[styles.image, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
          source={{ uri: "https://cdn.britannica.com/45/196945-050-CCF8BD72/Temple-of-Saturn-Arch-Septimius-Severus-Forum.jpg" }}
          {...panResponder.panHandlers}
        />
      </View>
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
    width: 300,
    height: 300,
    backgroundColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default Square;
