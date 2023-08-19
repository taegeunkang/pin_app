import {useEffect, useState, useLayoutEffect} from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import {Slider} from '../../components/Content/Slider';
import {useTheme} from '../../hooks';
import Square1 from './Square1';
import Video
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
          src="${uri}"
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
  const screenWidth = Dimensions.get('window').width;
  useEffect(() => {}, [item]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* {item && (
        <Image
          source={{uri: item}}
          style={{width: screenWidth, height: screenWidth}}
          resizeMode="contain"
        />
      )} */}
      {/* {item && item.substring(item.length - 3) === 'mp4' && (
        // <Video
        //   source={{uri: item}}
        //   style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        //   resizeMode={'cover'}
        // />
      )} */}
      {/* {item && <Square1 image={item} scale={scale} setScale={setScale} />} */}
    </View>
  );
};

export default Preview;
