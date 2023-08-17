import {useTheme} from '../hooks';
import {Image} from 'react-native';
const HeaderLeftButton = () => {
  const {Images} = useTheme();
  return (
    <Image
      source={Images.leftChevron}
      style={{marginLeft: 5, width: 25, height: 25}}
    />
  );
};

export default HeaderLeftButton;
