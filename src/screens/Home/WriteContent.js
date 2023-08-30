import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {BorderRadius, FontSize} from '../../theme/Variables';
import Geolocation from '@react-native-community/geolocation';
import {Switch} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import SubmitButton from '../../components/SubmitButton';
import Plus from '../../theme/assets/images/light/plus.svg';
import {useTheme} from '../../hooks';
import * as RNFS from 'react-native-fs';
import {reIssue} from '../../utils/login';

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
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const inptRef = useRef(null);
  useEffect(() => {
    checkRefreshMediaFiles();
    getCurrentLocation();
  });

  const checkRefreshMediaFiles = () => {
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

  const getAbsolutePath = async assetPath => {
    const destination = `${RNFS.TemporaryDirectoryPath}${Math.random()
      .toString(36)
      .substring(7)}.mp4`;
    try {
      let absolutePath = await RNFS.copyAssetsVideoIOS(
        assetPath,
        destination,
        0,
        0,
      );
      return absolutePath;
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        setLat(position['coords']['latitude']);
        setLon(position['coords']['longitude']);
      },
      error => {
        switch (error['code']) {
          case 1:
            setGpsPermission(true);
            break;
        }
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  // 포스트 제출
  // API_URL + "/post/create"
  // 동영상 기능 추가해야함
  const submitPost = async () => {
    if (text.trim().length == 0) {
      return;
    }
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    let m = []; // 미디어 파일들
    let thumbnails = [];
    formData.append('content', text); // 글 내용
    if (media) {
      for (let i = 0; i < media.length; i++) {
        const med = media[i];
        if (med.accessUri.substring(med.accessUri.length - 3) === 'mp4') {
          const absolutePath = await getAbsolutePath(med.uri);
          m.push({uri: absolutePath, type: 'video/mp4', name: `video${i}`});
          thumbnails.push({
            uri: med.accessUri,
            typ: 'image/png',
            name: `thumbnailFiles${i}`,
          });
        } else {
          m.push({uri: med.accessUri, type: 'image/png', name: `image${i}`});
        }
      }

      m.forEach((mm, index) => {
        formData.append('mediaFiles', mm);
      });

      thumbnails.forEach((t, index) => {
        formData.append('thumbnailFiles', t);
      });
    }

    formData.append('lat', lat); // latitude;
    formData.append('lon', lon); // lontitude;
    formData.append('locationName', loc);
    formData.append('isPrivate', isPrivate);
    if (friends) {
      let fff = [];
      for (let j = 0; j < friends.length; j++) {
        fff.push(friends[j].userId);
      }
      formData.append('mention', fff);
    }

    const response = await fetch(API_URL + '/post/create', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    });
    if (response.status == 200) {
      navigation.reset({routes: [{name: 'Home'}]});
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await submitPost(postId);
          break;
      }
    }

    setLoading(false);
  };

  const moveToFindingFriends = async () => {
    navigation.navigate('FindingFriends', {
      userId: await AsyncStorage.getItem('id'),
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => inptRef.current.blur()}>
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
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      style={{
                        width: responsiveWidth(100),
                        height: responsiveHeight(100),
                        borderRadius: responsiveWidth(12),
                      }}
                      source={{uri: m.uri}}
                    />
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
              ref={inptRef}
              maxLength={500}
            />
          </View>
        </View>

        <View style={{flex: 1, paddingHorizontal: responsiveWidth(10)}}>
          <View style={styles.listContent}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={styles.subTitle}>위치</Text>
              <View
                style={{
                  marginBottom: responsiveHeight(5),
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('FindingLocation', {lat: lat, lon: lon})
                }>
                <Plus
                  width={responsiveWidth(20)}
                  height={responsiveHeight(20)}
                  style={{marginTop: responsiveHeight(2)}}
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
              <TouchableOpacity onPress={moveToFindingFriends}>
                <Plus
                  width={responsiveWidth(20)}
                  height={responsiveHeight(20)}
                  style={{marginTop: responsiveHeight(2)}}
                />
              </TouchableOpacity>
            </View>
            {f &&
              f.map((u, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginBottom: responsiveHeight(5),
                  }}>
                  <Image
                    source={{
                      uri:
                        API_URL + `/user/profile/image?watch=${u.profileImg}`,
                    }}
                    style={styles.friendsImage}
                  />
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
              onPress={submitPost}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
