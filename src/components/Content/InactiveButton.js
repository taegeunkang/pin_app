import {View, Text, TouchableOpacity, Image} from 'react-native';
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
        <View
          style={{
            width: responsiveWidth(180),
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingLeft: responsiveWidth(10),
          }}>
          <Image
            source={img}
            style={{
              width: responsiveWidth(30),
              height: responsiveHeight(30),
              resizeMode: 'contain',
              marginRight: responsiveWidth(10),
            }}
          />
          <Text
            style={[
              Fonts.contentMediumBold,
              {
                color: Colors.buttonThirdContent,
              },
            ]}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default InactiveButton;
