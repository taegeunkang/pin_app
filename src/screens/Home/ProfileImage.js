import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  Modal,
  Alert,
} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {useEffect, useLayoutEffect, useState} from 'react';
import {useTheme} from '../../hooks';
import SubmitButton from '../../components/SubmitButton';
import {API_URL} from '../../utils/constants';
import ChoosePic from '../../components/Content/ChoosePic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {reIssue} from '../../utils/login';
import HeaderLeftButton from '../../components/HeaderLeftButton';
const ProfileImage = ({navigation, route}) => {
  const {profileImg} = route.params;
  const [pressed, setPressed] = useState(false);
  const [pic, setPic] = useState(null);
  const [defaultPic, setDefaultPic] = useState(false);
  const {Fonts, Colors} = useTheme();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftButton
          onPress={() => {
            navigation.pop();
          }}
          close={true}
        />
      ),
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
            style={[
              Fonts.contentMediumBold,
              {
                color: Colors.primary,
              },
            ]}>
            완료
          </Text>
        </TouchableOpacity>
      ),
    });
  });
  const showPic = () => {
    if (pic && !defaultPic) return pic.accessUri;

    return defaultPic
      ? API_URL + `/user/profile/image?watch=default-profile.png`
      : API_URL + `/user/profile/image?watch=${profileImg}`;
  };

  const closeModal = item => {
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
      formData.append('profileImage', {
        uri: pic.uri,
        name: 'profileImage.png',
        type: 'image/png',
      });
    }

    const response = await fetch(
      API_URL + '/user/profile/update/profileImage',
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
        const k = await response.json();
        switch (k['code']) {
          case 'U08':
            await reIssue();
            await submit();
        }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.contentBackground,
      }}>
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
            width: responsiveWidth(100),
            height: responsiveHeight(100),
            borderRadius: responsiveWidth(12),
            backgroundColor: Colors.screenBackground,
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
            style={[
              Fonts.contentMediumMedium,
              {
                color: Colors.navNotSelect,
              },
            ]}>
            기본 이미지 선택
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileImage;
