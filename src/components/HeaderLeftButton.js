import {useTheme} from '../hooks';
import {Image, View} from 'react-native';
import {responsiveHeight, responsiveWidth} from './Scale';
import LeftChevron from '../theme/assets/images/light/left-chevron.svg';
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
        paddingLeft: responsiveWidth(10),
      }}>
      <LeftChevron width={responsiveWidth(20)} height={responsiveHeight(20)} />
    </View>
  );
};

export default HeaderLeftButton;
