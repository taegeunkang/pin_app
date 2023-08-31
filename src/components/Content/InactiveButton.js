import {View, Text, TouchableOpacity} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {useTheme} from '../../hooks';

const InactiveButton = ({img, title, onPress}) => {
  const {Fonts, Colors} = useTheme();
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        style={[
          {width: responsiveWidth(370), height: responsiveHeight(48)},
          {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.buttonThirdBackground,
            borderRadius: responsiveWidth(12),
            flexDirection: 'row',
            position: 'relative',
          },
          ,
        ]}>
        <Text
          style={[
            Fonts.contentMediumBold,
            {
              color: Colors.buttonThirdContent,
            },
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InactiveButton;
