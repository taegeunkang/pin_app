import { View, Text, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useState, useEffect } from 'react';

const Upload = ({ navigation, route }) => {
  // const openLibrary = async () => {
  //   let result = await launchImageLibrary({
  //     mediaType: 'mixed',
  //     quality: 1,
  //     includeBase64: true,
  //   });
  //   setImage('data:image/png;base64,' + result.assets[0].base64);
  // };

  // const openCamera = async () => {
  //   let result = await launchCamera({
  //     mediaType: 'mixed',
  //     quality: 1,
  //     includeBase64: true,
  //   });
  //   console.log(result);
  //   // setImage('data:image/png;base64,' + result.assets[0].base64);
  // };

  useEffect(() => {
    // openLibrary();
  }, []);

  return (
    <View style={styles.container}>
      <Text>hihi</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%' },
});

export default Upload;
