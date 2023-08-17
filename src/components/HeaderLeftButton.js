import {useTheme} from '../hooks';
import {Image} from 'react-native';
import {responsiveHeight, responsiveWidth} from './Scale';
const HeaderLeftButton = () => {
  const {Images} = useTheme();
  return (
    <Image
      source={Images.leftChevron}
      style={{
        marginLeft: responsiveWidth(5),
        width: responsiveWidth(25),
        height: responsiveHeight(25),
      }}
    />
  );
};

export default HeaderLeftButton;
