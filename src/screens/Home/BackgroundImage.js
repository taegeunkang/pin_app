import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {useLayoutEffect, useState} from 'react';
import {useTheme} from '../../hooks';
import SubmitButton from '../../components/SubmitButton';
import {API_URL} from '../../utils/constants';
import ChoosePic from '../../components/Content/ChoosePic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {reIssue} from '../../utils/login';
const BackgroundImage = ({navigation, route}) => {
  const {backgroundImg} = route.params;
  const [pressed, setPressed] = useState(false);
  const [pic, setPic] = useState(null);
  const [defaultPic, setDefaultPic] = useState(false);
  const {Fonts, Colors} = useTheme();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={submit}
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
  const showPic = () => {
    if (pic && !defaultPic) return pic.accessUri;

    return defaultPic
      ? API_URL + `/user/profile/image?watch=default-background.png`
      : API_URL + `/user/profile/image?watch=${backgroundImg}`;
  };

  const closeModal = item => {
    console.log(item);
    setPic(item);
    setDefaultPic(false);
    setPressed(false);
  };
  const submit = async () => {
    if (!pic && !defaultPic) {
      Alert.alert('사진을 선택해 주세요.');
      return;
    }
    const formData = new FormData();
    if (pic) {
      formData.append('backgroundImage', {
        uri: pic.uri,
        name: 'backgroundImage.png',
        type: 'image/png',
      });
    }

    const response = await fetch(
      API_URL + '/user/profile/update/backgroundImage',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        },
        body: formData,
      },
    );

    switch (response.status) {
      case 200:
        navigation.pop();
        return;
      case 400:
        switch (response['code']) {
          case 'U08':
            await reIssue();
            await submit();
            break;
        }
    }
  };
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Modal visible={pressed} animationType={'slide'} transparent={true}>
        <ChoosePic onPress={closeModal} cancel={() => setPressed(false)} />
      </Modal>
      <View
        style={{
          width: '100%',
          height: responsiveHeight(250),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{
            uri: showPic(),
          }}
          style={{
            width: '100%',
            height: responsiveHeight(200),
            backgroundColor: 'black',
          }}
        />
      </View>

      <SubmitButton title={'사진 선택하기'} onPress={() => setPressed(true)} />
      <View
        style={{width: responsiveWidth(370), marginTop: responsiveHeight(10)}}>
        <TouchableOpacity
          onPress={() => {
            setDefaultPic(true);
            setPic(null);
          }}>
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
