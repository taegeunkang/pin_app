import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {API_URL} from '../../utils/constants';
import {useEffect, useRef, useState} from 'react';
import WebView from 'react-native-webview';
import FastImage from 'react-native-fast-image';

export const Slider = ({media}) => {
  // 게시글 업로드시 포스터 생성 후 포스터도 같이 표시를 해주어ㅑ 한다.
  const [fastImageResizeMode, setFastImageResizeMode] = useState(
    FastImage.resizeMode.cover,
  );
  return (
    <Swiper style={styles.wrapper} showsButtons={false}>
      {media.map((file, index) => {
        const ext = file.substring(file.length - 4, file.length);
        const fileHtml = ` <!DOCTYPE html>
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
                src="${API_URL}/post/streaming?watch=${file}"
                poster="${API_URL}/post/image?watch=${file}"
                controls
                muted
                playsinline
                class="video-player"
              ></video>
            </div>
          </body>
        </html>
        `;
        return ext == '.png' ? (
          <Pressable
            onPress={() => {
              // Toggle resizeMode when FastImage is pressed
              setFastImageResizeMode(
                fastImageResizeMode === FastImage.resizeMode.cover
                  ? FastImage.resizeMode.contain
                  : FastImage.resizeMode.cover,
              );
            }}>
            <FastImage
              key={index}
              source={{
                uri: API_URL + '/post/image?watch=' + file,
                priority: FastImage.priority.high,
              }}
              resizeMode={fastImageResizeMode}
              style={{width: '100%', height: '100%'}}
            />
          </Pressable>
        ) : (
          <WebView
            key={index}
            source={{html: fileHtml}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsFullscreenVideo={false}
            allowsInlineMediaPlayback={true}
          />
        );
      })}
    </Swiper>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    // width: screenWidth,
    // height: screenWidth,
    backgroundColor: '#17171B',
  },
});
