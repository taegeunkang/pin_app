import {useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Slider} from '../../components/Content/Slider';
import {useTheme} from '../../hooks';
import Square1 from './Square1';
import VideoPlayer from 'react-native-video-controls';

const Preview = ({navigation, route}) => {
  const item = route.params.item;
  const [scale, setScale] = useState(1);
  const [b, setB] = useState(null);
  const screenWidth = Dimensions.get('window').width;

  const upload = async () => {
    console.log(item);

    const response = await fetch(item);
    console.log(response);
    let formData = new FormData();

    formData.append('video', {uri: item, name: 'v.mp4', type: 'video/mp4'});
    fetch('http://localhost:8080/post/v', {
      method: 'POST',
      body: formData,
    });
  };
  useEffect(() => {
    console.log('동영상 업로드');
    upload();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {item && item.substring(item.length - 3) === 'mp4' && (
        <VideoPlayer
          source={{
            uri: item,
          }}
          paused={false}
          resizeMode={'contain'}
          // style={styles.fullScreen}
          onError={e => console.log(e)}
        />
      )}
      {/* {item && <Square1 image={item} scale={scale} setScale={setScale} />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Preview;
