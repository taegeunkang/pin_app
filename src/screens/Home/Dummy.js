import { View, Text, StyleSheet, Button, Image } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import { useEffect, useState } from 'react';

const Dummy = () => {
  const [img, setImage] = useState(false);
  const openLibrary = async () => {
    let result = await launchImageLibrary({
      mediaType: 'mixed',
      quality: 1,
      includeBase64: true,
    });
    setImage('data:image/png;base64,' + result.assets[0].base64);
  };

  const openCamera = async () => {
    let result = await launchCamera({
      mediaType: 'mixed',
      quality: 1,
      includeBase64: true,
    });
    console.log(result);
    // setImage('data:image/png;base64,' + result.assets[0].base64);
  };

  useEffect(() => {
    openCamera();
  }, []);

  return (
    <View style={styles.container}>
      <Text>hihi</Text>
      <Button onPress={openLibrary} title="open library" />
      <Button onPress={openCamera} title="open camera" />
      {img && (
        <Image
          style={{
            width: 50,
            height: 50,
            flex: 1,
          }}
          source={{ uri: img }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%' },
});

export default Dummy;
