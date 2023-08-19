import {useEffect, useState, useLayoutEffect} from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import {Slider} from '../../components/Content/Slider';
import {useTheme} from '../../hooks';
import Square1 from './Square1';
import VideoPlayer from 'react-native-video-controls';

const videoHtml = uri => {
  return ` <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          background-color: black;
        }
        .video-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .video-player {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
    </head>
    <body>
      <div class="video-container">
        <video
          src="http://localhost:8080/post/streaming?watch=sampleVideo.mp4"
          poster="http://localhost:8080/post/image?watch=a2874a19-3618-485a-98f0-100873bd9250.png"
          controls
          muted
          playsinline
          class="video-player"
        ></video>
      </div>
    </body>
  </html>
  `;
};

const Preview = ({navigation, route}) => {
  const item = route.params.item;
  const [scale, setScale] = useState(1);
  const [b, setB] = useState(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    console.log(item);
    console.log('file://' + item);
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
            uri: 'file://' + item,
          }}
          onError={e => console.log(e)}
        />
      )}
      {/* {item && <Square1 image={item} scale={scale} setScale={setScale} />} */}
    </View>
  );
};

export default Preview;
