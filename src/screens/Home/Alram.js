import {Image, View} from 'react-native';
import {useTheme} from '../../hooks';
const Alram = () => {
  const {Images} = useTheme();
  return (
    <View style={{flex: 1}}>
      <Image source={Images.createBtn} />
    </View>
  );
};

export default Alram;
