import {useState, useRef} from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import Square1 from './Square1';
import Video from 'react-native-video';
const Preview = ({route}) => {
  const item = route.params.item;
  const [scale, setScale] = useState(1);
  const [paused, setPaused] = useState(false);
  const lastTap = useRef(null);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
      setPaused(prevPaused => !prevPaused); // 동영상의 정지/재생 상태를 전환
    } else {
      if (paused) {
        // 동영상이 정지 상태라면
        setPaused(false); // 동영상을 재생
      }
      lastTap.current = now;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {item && item.substring(item.length - 3) === 'mp4' && (
        <TouchableWithoutFeedback onPress={handleDoubleTap}>
          <Video
            source={{uri: item}}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            resizeMode="contain"
            paused={paused} // 비디오의 정지/재생 상태를 제어
          />
        </TouchableWithoutFeedback>
      )}
      {item && item.substring(item.length - 3) === 'png' && (
        <Square1 image={item} scale={scale} setScale={setScale} />
      )}
    </View>
  );
};

export default Preview;
