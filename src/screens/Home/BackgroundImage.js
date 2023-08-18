import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {useLayoutEffect, useState} from 'react';
import {useTheme} from '../../hooks';
import SubmitButton from '../../components/SubmitButton';
const BackgroundImage = ({navigation}) => {
  const {Fonts, Colors} = useTheme();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}
          style={{
            backgroundColor: Colors.transparent,
            width: responsiveWidth(60),
            height: responsiveHeight(30),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'SpoqaHanSansNeo-Bold',
              fontSize: responsiveWidth(14),
              lineHeight: responsiveHeight(24),
              letterSpacing: responsiveWidth(-0.6),
              color: '#4880EE',
            }}>
            완료
          </Text>
        </TouchableOpacity>
      ),
    });
  });
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View
        style={{
          width: '100%',
          height: responsiveHeight(250),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: '100%',
            height: responsiveHeight(200),
            backgroundColor: 'black',
          }}></View>
      </View>

      <SubmitButton title={'사진 선택하기'} />
      <View
        style={{width: responsiveWidth(370), marginTop: responsiveHeight(10)}}>
        <TouchableOpacity>
          <Text
            style={{
              fontFamily: 'SpoqaHanSansNeo-Medium',
              fontSize: responsiveWidth(14),
              lineHeight: responsiveHeight(24),
              letterSpacing: responsiveWidth(-0.6),
              color: '#6D7582',
            }}>
            기본 이미지 선택
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
export default BackgroundImage;
