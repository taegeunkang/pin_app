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
  ScrollView,
} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {toByteArray} from 'base64-js';
import {useIsFocused} from '@react-navigation/native';
import Sample1 from '../../theme/assets/images/sample/sample1.png';
import Tag from '../../components/Content/Tag';
import {WithLocalSvg} from 'react-native-svg';
import {BorderRadius, FontSize} from '../../theme/Variables';
import RightArrow from '../../theme/assets/images/arrow-right-solid.svg';
import Geolocation from '@react-native-community/geolocation';
import Sample5 from '../../theme/assets/images/sample/sample5.png';
import {Buffer} from 'buffer';
import {Switch} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import GpsAlert from '../../components/Content/GpsAlert';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import SubmitButton from '../../components/SubmitButton';
import {useTheme} from '../../hooks';
// 동영상일 때는 썸네일 파일도 같이 넘겨줘야해서 수정 필요

const WriteContent = ({navigation, route}) => {
  const [text, setText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [gpsPermission, setGpsPermission] = useState(false);
  const isFocused = useIsFocused();
  const {t} = useTranslation('newPost');
  const [media, setMeida] = useState(null);
  const [loc, setLoc] = useState('');
  const [f, setF] = useState([]);
  const {mediaFiles, locationName, friends} = route.params;
  const {Images} = useTheme();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    checkRefreshMediaFiles();
  });

  const checkRefreshMediaFiles = () => {
    // if (mediaFiles && !locationName) {
    //   setMeida(mediaFiles);
    // } else if (!mediaFiles && locationName) {
    //   return;
    // } else if (!mediaFiles && friends) {
    //   return;
    // }
    if (mediaFiles) {
      setMeida(mediaFiles);
    }
    if (locationName) {
      setLoc(locationName);
    }
    if (friends) {
      setF(friends);
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
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <View style={styles.inptContainer}>
        {media && media.length > 0 && (
          <>
            <ScrollView
              horizontal={true}
              style={{
                width: '100%',
                paddingHorizontal: responsiveWidth(10),
                height: responsiveHeight(110),
                paddingVertical: responsiveHeight(5),
              }}>
              {media.map((m, index) => (
                <View style={styles.imageContainer}>
                  <Image
                    style={{
                      width: responsiveWidth(100),
                      height: responsiveHeight(100),
                      borderRadius: responsiveWidth(12),
                    }}
                    source={{uri: m.uri}}
                  />
                  {/* <Pressable
                  onPress={() => removeTargetFromArray(item)}
                  style={{
                    width: responsiveWidth(20),
                    height: responsiveHeight(20),
                    borderRadius: responsiveWidth(100),
                    backgroundColor: '#4880EE',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: responsiveHeight(5),
                    right: responsiveWidth(5),
                  }}>
                
                  <Text
                    style={{
                      fontFamily: 'SpoqaHanSansNeo-Bold',
                      fontSize: responsiveWidth(12),
                      lineHeight: responsiveHeight(18),
                      letterSpacing: responsiveWidth(-0.6),
                      color: '#EAF3FE',
                    }}></Text>
                </Pressable> */}
                </View>
              ))}
            </ScrollView>
          </>
        )}

        <View style={{marginTop: responsiveHeight(10)}} />

        <View
          style={{
            width: '100%',
            height: responsiveHeight(180),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F2F4F6',
            marginBottom: responsiveHeight(20),
          }}>
          <TextInput
            value={text}
            placeholder={t('write.content.placeholder')}
            placeholderTextColor={'#6D7582'}
            multiline={true}
            style={{
              width: responsiveWidth(370),
              height: responsiveHeight(160),
              textAlignVertical: 'top',
              fontFamily: 'SpoqaHanSansNeo-Medium',
              fontSize: responsiveWidth(14),
              lineHeight: responsiveHeight(24),
              letterSpacing: responsiveWidth(-0.6),
              color: '#505866',
              backgroundColor: '#FFFFFF',
              borderRadius: responsiveWidth(12),
              paddingVertical: responsiveHeight(10),
              paddingHorizontal: responsiveWidth(10),
            }}
            onChangeText={e => setText(e)}
          />
        </View>
      </View>

      <View style={{flex: 1, paddingHorizontal: responsiveWidth(10)}}>
        <View style={styles.listContent}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.subTitle}>위치</Text>
            <View style={{marginBottom: responsiveHeight(5)}} />
            <TouchableOpacity
              onPress={() => navigation.navigate('FindingLocation')}>
              <Image
                source={Images.plus}
                style={{
                  width: responsiveWidth(20),
                  height: responsiveHeight(20),
                }}
              />
            </TouchableOpacity>
          </View>
          {loc && (
            <Text
              style={{
                fontFamily: 'SpoqaHanSansNeo-Regular',
                fontSize: responsiveWidth(14),
                lineHeight: responsiveHeight(24),
                letterSpacing: responsiveWidth(-0.6),
                color: '#505866',
              }}>
              {loc}
            </Text>
          )}
        </View>

        <View style={styles.friendsList}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.subTitle}>함께한 친구</Text>
            <View style={{marginBottom: responsiveHeight(5)}} />
            <TouchableOpacity
              onPress={() => navigation.navigate('FindingFriends')}>
              <Image
                source={Images.plus}
                style={{
                  width: responsiveWidth(20),
                  height: responsiveHeight(20),
                }}
              />
            </TouchableOpacity>
          </View>
          {f &&
            f.map((u, index) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginBottom: responsiveHeight(5),
                }}>
                <Image source={Sample5} style={styles.friendsImage} />
                <Text
                  style={{
                    fontFamily: 'SpoqaHanSansNeo-Medium',
                    fontSize: responsiveWidth(14),
                    lineHeight: responsiveHeight(24),
                    letterSpacing: responsiveWidth(-0.6),
                    color: '#505866',
                  }}>
                  {u.nickname}
                </Text>
              </View>
            ))}
        </View>

        {/* 친구 기능 추가 후 생성 */}
        {/* <View style={styles.listContent}>
          <Text style={{fontSize: FontSize.medium}}>함꼐한 친구</Text>
          <WithLocalSvg asset={RightArrow} width={20} height={20} />
        </View> */}
        <View style={styles.listContent}>
          <Text style={styles.subTitle}>비공개</Text>
          <Switch
            value={isPrivate}
            onValueChange={() => setIsPrivate(!isPrivate)}
            color="#4880EE"
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: responsiveHeight(10),
          }}>
          <SubmitButton
            title={'완료'}
            onPress={async () => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                // navigation.popToTop();
                navigation.reset({index: 0, routes: [{name: 'Home'}]});
              }, 3000);
            }}
            loading={loading}
          />
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
    width: responsiveWidth(100),
    height: responsiveHeight(100),
    borderRadius: responsiveWidth(12),
    marginRight: responsiveWidth(5),
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inptContainer: {
    flexDirection: 'column',
    alignItems: 'center',
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginBottom: responsiveHeight(10),
  },
  friendsList: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginBottom: responsiveHeight(10),
  },
  subTitle: {
    fontFamily: 'SpoqaHanSansNeo-Bold',
    fontSize: responsiveWidth(14),
    lineHeight: responsiveHeight(24),
    letterSpacing: responsiveWidth(-0.6),
    color: '#353C49',
    marginRight: responsiveWidth(5),
    marginBottom: responsiveHeight(10),
  },
  friendsImage: {
    width: responsiveWidth(35),
    height: responsiveHeight(35),
    borderRadius: responsiveWidth(8),
    marginRight: responsiveWidth(5),
  },
});

export default WriteContent;
