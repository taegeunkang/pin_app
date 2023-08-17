import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  TouchableOpacity,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {toByteArray} from 'base64-js';
import {useIsFocused} from '@react-navigation/native';
import Sample1 from '../../theme/assets/images/sample/sample1.png';
import Tag from '../../components/Content/Tag';
import {WithLocalSvg} from 'react-native-svg';
import {BorderRadius, FontSize} from '../../theme/Variables';
import RightArrow from '../../theme/assets/images/arrow-right-solid.svg';
import Plus from '../../theme/assets/images/plus-solid.svg';
import Geolocation from '@react-native-community/geolocation';
import {Buffer} from 'buffer';
import {Switch} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import GpsAlert from '../../components/Content/GpsAlert';
import axios from 'axios';

// 동영상일 때는 썸네일 파일도 같이 넘겨줘야해서 수정 필요

const WriteContent = ({navigation, route}) => {
  const [text, setText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [gpsPermission, setGpsPermission] = useState(false);
  const isFocused = useIsFocused();
  const {t} = useTranslation('newPost');
  const [media, setMeida] = useState(null);
  const {mediaFiles, locationName} = route.params;

  useEffect(() => {
    checkRefreshMediaFiles();
  });

  const checkRefreshMediaFiles = () => {
    if (mediaFiles && !locationName) {
      setMeida(mediaFiles);
    } else if (!mediaFiles && locationName) {
      return;
    }
  };
  // 포스트 제출
  // API_URL + "/post/create"
  // 동영상 기능 추가해야함
  const submitPost = async () => {
    // const latitude = parseFloat(await AsyncStorage.getItem('lat'));
    // const lontitude = parseFloat(await AsyncStorage.getItem('lon'));
    // const token = await AsyncStorage.getItem('token');
    // console.log(token);
    // const base64Images = await JSON.parse(await AsyncStorage.getItem('images'));
    // const base64Videos = await JSON.parse(await AsyncStorage.getItem('videos'));
    // //이미지 추가 및 섬네일 생성
    // const response = await fetch(API_URL + '/post/create', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: 'Bearer ' + token,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     content: text,
    //     photoFiles: base64Images,
    //     lat: latitude,
    //     lon: lontitude,
    //     locationName: locationName,
    //     isPrivate: isPrivate,
    //     tags: tags,
    //   }),
    // });
    // if (response.status != 200) {
    //   Alert('알 수 없는 에러가 발생했습니다.');
    // }
    // navigation.reset({routes: [{name: 'Home'}]});
  };

  const onChangeTyping = e => {
    setText(e);
    // text가 비었는지 체크 -> for re-render
    if (e.length >= 1) {
      setTexting(true);
    } else {
      setTexting(false);
    }
  };

  // const loadImages = async () => {
  //   const storedImages = await AsyncStorage.getItem('images');
  //   const parsedImages = JSON.parse(storedImages);
  //   console.log('gg');
  //   console.log(parsedImages);

  //   setImages(parsedImages);
  //   if (parsedImages.length > 1) {
  //     setMultiple(true);
  //   }
  // };

  function generateBoundary() {
    let boundary = '--------------------------'; // Start with a common prefix
    const possibleCharacters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 20; i++) {
      // Append random characters to the prefix
      const randomIndex = Math.floor(Math.random() * possibleCharacters.length);
      boundary += possibleCharacters.charAt(randomIndex);
    }

    return boundary;
  }

  // const base64ToBlob = base64String => {
  //   base64String.replace('data:image/jpeg;base64,', '');
  //   // 패딩 추가
  //   while (base64String.length % 4 !== 0) {
  //     base64String += '=';
  //   }

  //   return new Blob([toByteArray(base64String)], {type: 'image/jpeg'});
  // };

  return (
    <View style={{flex: 1}}>
      <View style={styles.inptContainer}>
        {media && media.length > 0 && (
          <View style={styles.imageContainer}>
            <View
              style={{
                width: 23,
                height: 23,
                borderRadius: 100,
                backgroundColor: '#ececec',
                position: 'absolute',
                bottom: 15,
                right: 15,
                zIndex: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text>{media.length < 10 ? '+' + (media.length - 1) : '+n'}</Text>
            </View>
            <Image
              style={{width: '100%', height: '100%'}}
              source={{uri: media[0].uri}}
            />
          </View>
        )}
        <View style={styles.inputTextContainer}>
          <View style={styles.inputBox}>
            <TextInput
              value={text}
              placeholder={t('write.content.placeholder')}
              multiline={true}
              style={{
                width: '100%',
                height: '100%',
                textAlignVertical: 'top',
                padding: 5,
              }}
              onChangeText={e => onChangeTyping(e)}
            />
          </View>
        </View>
      </View>

      <View style={{flex: 1, padding: 10}}>
        <View style={styles.listContent}>
          <Text style={{fontSize: FontSize.medium}}>위치</Text>
          {locationName && <Text>{locationName}</Text>}

          <TouchableOpacity
            onPress={() => navigation.navigate('FindingLocation')}>
            <View>
              <WithLocalSvg asset={Plus} width={20} height={20} />
            </View>
          </TouchableOpacity>
        </View>

        {/* 친구 기능 추가 후 생성 */}
        {/* <View style={styles.listContent}>
          <Text style={{fontSize: FontSize.medium}}>함꼐한 친구</Text>
          <WithLocalSvg asset={RightArrow} width={20} height={20} />
        </View> */}
        <View style={styles.listContent}>
          <Text style={{fontSize: FontSize.medium}}>비공개</Text>
          <Switch
            value={isPrivate}
            onValueChange={() => setIsPrivate(!isPrivate)}
            color="gray"
          />
        </View>

        <View
          style={{
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 1,
          }}>
          <TouchableOpacity
            style={{
              width: '95%',
              height: 50,
              backgroundColor: '#bcbcbc',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={submitPost}>
            <Text style={{fontSize: FontSize.medium}}>
              {t('write.content.upload')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={gpsPermission} animationType={'fade'} transparent={true}>
        <GpsAlert />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: Dimensions.get('window').width * 0.3333,
    height: Dimensions.get('window').width * 0.3333,
    borderRadius: BorderRadius.large,
    padding: 10,
    position: 'relative',
  },
  inptContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  inputTextContainer: {
    width: Dimensions.get('window').width * 0.6667,
    padding: 10,
    height: Dimensions.get('window').width * 0.3333,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.medium,
  },
  listContent: {
    width: '100%',
    height: 50,
    fontSize: FontSize.large,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: 'gray',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
});

export default WriteContent;
