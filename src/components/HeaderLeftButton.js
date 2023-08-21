import {useTheme} from '../hooks';
import {Image, View} from 'react-native';
import {responsiveHeight, responsiveWidth} from './Scale';
const HeaderLeftButton = () => {
  const {Images} = useTheme();
  return (
    <View
      style={{
        width: responsiveWidth(35),
        height: responsiveHeight(25),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <Image
        source={Images.leftChevron}
        style={{
          marginLeft: responsiveWidth(5),
          width: responsiveWidth(20),
          height: responsiveHeight(20),
        }}
      />
    </View>
  );
};

export default HeaderLeftButton;
