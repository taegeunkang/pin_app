import {View, Text, TouchableOpacity} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../Scale';

const InactiveButton = ({img, title, onPress}) => {
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
            backgroundColor: '#F2F3F4',
            borderRadius: responsiveWidth(12),
            flexDirection: 'row',
            position: 'relative',
          },
          ,
        ]}>
        <Text
          style={{
            fontFamily: 'SpoqaHanSansNeo-Bold',
            fontSize: responsiveWidth(14),
            lineHeight: responsiveHeight(24),
            letterSpacing: responsiveWidth(-0.6),
            color: '#505866',
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InactiveButton;
