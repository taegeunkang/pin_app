import {View, StyleSheet, Image, Text, Pressable} from 'react-native';
import {useTheme} from '../../hooks';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {API_URL} from '../../utils/constants';
import {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';

const FriendsCell = ({profileImage, nickname, onAdd, onSub}) => {
  const {Images} = useTheme();
  const [added, setAdded] = useState(false);
  const addPress = () => {
    onAdd();
    setAdded(true);
  };
  const subPress = () => {
    onSub();
    setAdded(false);
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <FastImage
          source={{
            uri: API_URL + `/user/profile/image?watch=${profileImage}`,
            priority: FastImage.priority.high,
          }}
          style={{
            width: responsiveWidth(35),
            height: responsiveHeight(35),
            borderRadius: responsiveWidth(12),
            backgroundColor: 'black',
          }}
        />
        <Text style={styles.nickname}>{nickname}</Text>
      </View>
      {added ? (
        <Pressable
          style={{width: responsiveWidth(20), height: responsiveHeight(20)}}
          onPress={subPress}>
          <Image
            source={Images.close}
            style={{width: responsiveWidth(15), height: responsiveHeight(15)}}
          />
        </Pressable>
      ) : (
        <Pressable
          style={{width: responsiveWidth(20), height: responsiveHeight(20)}}
          onPress={addPress}>
          <Image
            source={Images.plus}
            style={{width: responsiveWidth(15), height: responsiveHeight(15)}}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(370),
    height: responsiveHeight(45),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nickname: {
    fontFamily: 'SpoqaHanSansNeo-Medium',
    fontSize: responsiveWidth(14),
    lineHeight: responsiveHeight(20),
    letterSpacing: responsiveWidth(-0.6),
    marginLeft: responsiveWidth(5),
  },
});
export default FriendsCell;
