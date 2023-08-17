import {useEffect, useState, useLayoutEffect} from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import {Slider} from '../../components/Content/Slider';
import {useTheme} from '../../hooks';
import Square1 from './Square1';
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

      {item && <Square1 image={item} scale={scale} setScale={setScale} />}
    </View>
  );
};

export default Preview;
