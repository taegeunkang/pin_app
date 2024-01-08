import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated as Ani,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import {Marker} from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Geolocation from '@react-native-community/geolocation';
import {useEffect, useState, useRef} from 'react';
import {useTheme} from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import Permission from './Permission';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {reIssue} from '../../utils/login';
import FastImage from 'react-native-fast-image';
import {fcmService} from '../../firebase/push.fcm';
import {localNotificationService} from '../../firebase/push.noti';
import {useDispatch, useSelector} from 'react-redux';
import {likeToggle, setLikeCount} from '../../store/post';
import {updateNewPost} from '../../store/newPost';

const Home = ({navigation}) => {
  const [latitude, setLatitude] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [contents, setContents] = useState([]);
  const [permission, setPermission] = useState(true);
  const [detailPressed, setDetailPressed] = useState(false);
  const [homeRefresh, setHomeRefresh] = useState(false);
  const mapRef = useRef(null);
  const {Gutters, Images, Colors, Fonts} = useTheme();
  const scaleValue = useState(new Ani.Value(1))[0];
  const refreshScale = useState(new Ani.Value(1))[0];

  const dispatch = useDispatch();
  const isNewPost = useSelector(state => state.newPost.newPost);

  const onButtonPressIn = scale => {
    Ani.timing(scale, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true, // 원활한 성능을 위해 네이티브 드라이버 사용
    }).start();
  };

  const onButtonPressOut = scale => {
    Ani.timing(scale, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true, // 원활한 성능을 위해 네이티브 드라이버 사용
    }).start();
  };

  const getCurrentLocation = async () => {
    const location = await check(PERMISSIONS.IOS.LOCATION_ALWAYS); // 혹은 LOCATION_ALWAYS
    const locationUsage = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (location == RESULTS.GRANTED || locationUsage == RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        position => {
          setLatitude(position['coords']['latitude']);
          setLongitude(position['coords']['longitude']);
          console.log(
            '[Locatin] lat: ',
            position['coords']['latitude'],
            ' lon : ',
            position['coords']['longitude'],
          );
        },
        error => {
          console.log(error['code']);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    }
  };

  const checkPermissions = async () => {
    if (Platform.OS == 'ios') {
      // const camera = await check(PERMISSIONS.IOS.CAMERA);
      // const microphone = await check(PERMISSIONS.IOS.MICROPHONE);
      const photo = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      const location = await check(PERMISSIONS.IOS.LOCATION_ALWAYS); // 혹은 LOCATION_ALWAYS
      const locationUsage = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      // console.log('사진 : ' + photo);
      // console.log('위치 정보 항상 : ' + location);
      // console.log('사용할 때만 위치 : ' + locationUsage);

      setPermission(
        // camera === RESULTS.GRANTED &&
        // microphone === RESULTS.GRANTED &&
        photo === RESULTS.GRANTED &&
          (location === RESULTS.GRANTED || locationUsage === RESULTS.GRANTED),
      );
    } else {
      // const camera = await check(PERMISSIONS.ANDROID.CAMERA);
      // const microphone = await check(PERMISSIONS.ANDROID.MICROPHONE);
      const photo = await check(PERMISSIONS.ANDROID.PHOTO_LIBRARY);
      const location = await check(PERMISSIONS.ANDROID.LOCATION_ALWAYS); // 혹은 LOCATION_ALWAYS

      setPermission(
        // camera === RESULTS.GRANTED &&
        // microphone === RESULTS.GRANTED &&
        photo === RESULTS.GRANTED && location === RESULTS.GRANTED,
      );
    }
  };

  const returnCurrentLocation = () => {
    mapRef.current.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0175,
      longitudeDelta: 0.0175,
    });
  };

  const thumbsUp = async postId => {
    const response = await fetch(API_URL + `/post/like?postId=${postId}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    });

    if (response.status == 200) {
      const r = await response.json();
      dispatch(setLikeCount({userId: id, postId: postId, count: r}));
      dispatch(likeToggle({userId: id, postId: postId}));

      return r;
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await thumbsUp(postId);
          break;
      }
    }
  };

  /**
   * @description 지도상에서 사용자가 올린 전체 게시글과 24시간 내의 업로드된 팔로잉 하는 사용자들의 게시글을 받아옴
   *
   */
  const getMyPosts = async () => {
    setMyUserId(await AsyncStorage.getItem('id'));

    const response = await fetch(
      API_URL + '/post/all?id=' + (await AsyncStorage.getItem('id')),
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        },
      },
    );
    if (response.status == 200) {
      const res = await response.json();
      setContents(res['contents']);
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await getMyPosts();
          break;
      }
    } else {
      setContents([]);
    }
  };
  const close = async () => {
    setDetailPressed(false);
  };

  const onRegister = tk => {
    console.log('[App] onRegister : token :', tk);
    if (tk) {
      updateFirebaseToken(tk);
    }
  };

  const updateFirebaseToken = async tk => {
    fetch(API_URL + `/user/notification/init?fcmToken=${tk}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    });
  };

  const onNotification = notify => {
    console.log('[App] onNotification : notify :', notify);
    const options = {
      soundName: 'default',
      playSound: true,
    };

    localNotificationService.showNotification(
      0,
      notify.title,
      notify.body,
      notify,
      options,
    );
  };

  const onOpenNotification = notify => {
    console.log('[App] onOpenNotification : notify :', notify);
  };

  const getUserProfile = async () => {
    const userId = await AsyncStorage.getItem('id');

    let response = await fetch(
      API_URL + '/user/profile/info?userId=' + userId,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        },
      },
    );
    if (response.status == 200) {
      const r = await response.json();
      await AsyncStorage.setItem('myProfileImage', r.profileImg);
      await AsyncStorage.setItem('myNickname', r.nickname);
    }
  };

  /**
   * @description 새 게시물이 게시되고 새로고침 버튼 활성화 및 새로고침 완료후 버튼 사라짐
   */
  const refreshPost = async () => {
    setHomeRefresh(true);
    // 게시물 새로 받아오는 로직 추가
    // 새로 게시된것만 애니메이션으로 추가할 수 있는지?
    await getMyPosts();
    returnCurrentLocation();
    setHomeRefresh(false);
    dispatch(updateNewPost({newState: false}));
  };

  useEffect(() => {
    checkPermissions();
    getMyPosts();
    getUserProfile();
    const intervalId = setInterval(getCurrentLocation, 2000);

    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: Colors.contentBackground,
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    map: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      {!latitude && !longitude && (
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.contentBackground,
          }}>
          <ActivityIndicator
            size={'large'}
            color={Colors.primary}
            style={[Gutters.largeVMargin]}
          />
        </View>
      )}
      {latitude && longitude && (
        <>
          <Ani.View
            style={{
              width: responsiveWidth(45),
              height: responsiveWidth(45),
              position: 'absolute',
              bottom: responsiveHeight(30),
              left: responsiveWidth(15),
              backgroundColor: Colors.buttonSecondBackground,
              borderRadius: responsiveWidth(100),
              zIndex: 100,
              shadowOffset: {width: 0, height: responsiveHeight(3)},
              shadowOpacity: 0.25,
              shadowRadius: responsiveWidth(3),
              shadowColor: '#000000',
              elevation: 3,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{scale: scaleValue}],
            }}>
            <Pressable
              onPressIn={() => onButtonPressIn(scaleValue)}
              onPressOut={() => onButtonPressOut(scaleValue)}
              style={{}}
              onPress={returnCurrentLocation}>
              <Image
                source={Images.currentLocation}
                style={{
                  width: responsiveWidth(35),
                  height: responsiveWidth(35),
                  resizeMode: 'contain',
                }}
              />
            </Pressable>
          </Ani.View>
          {/* 게시글 새로 생성했을 때 새로고침 버튼 표시  */}
          {isNewPost && (
            <Ani.View
              style={{
                width: responsiveWidth(120),
                height: responsiveWidth(30),
                position: 'absolute',
                top: responsiveHeight(40),
                left: '35%', // 화면 좌측에서 50% 위치
                backgroundColor: Colors.buttonSecondBackground,
                borderRadius: responsiveWidth(100),
                zIndex: 100,
                shadowOffset: {width: 0, height: responsiveHeight(3)},
                shadowOpacity: 0.25,
                shadowRadius: responsiveWidth(3),
                shadowColor: '#000000',
                elevation: 3,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{scale: refreshScale}],
              }}>
              <Pressable
                onPressIn={() => onButtonPressIn(refreshScale)}
                onPressOut={() => onButtonPressOut(refreshScale)}
                onPress={() => refreshPost()}
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  position: 'relative',
                }}>
                <Text
                  style={[Fonts.contentMediumMedium, {color: Colors.primary}]}>
                  새로고침
                </Text>
                {homeRefresh && (
                  <ActivityIndicator
                    size={'small'}
                    style={[
                      Gutters.largeVMargin,
                      {
                        width: responsiveWidth(25),
                        height: responsiveHeight(25),
                        position: 'absolute',
                        right: responsiveWidth(7),
                      },
                    ]}
                    color={Colors.primary}
                  />
                )}
              </Pressable>
            </Ani.View>
          )}

          <MapView
            style={styles.map}
            showsUserLocation={true}
            userLocationUpdateInterval={1000}
            showsMyLocationButton={false}
            ref={mapRef}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0175,
              longitudeDelta: 0.0175,
            }}
            // onRegionChange={updatePosition}
            renderCluster={cluster => {
              // 클러스터링 정보
              const {id, geometry, onPress, properties} = cluster;
              const points = properties.point_count; // 클러스터링된 숫자
              return (
                // 클러스터링된 마커 렌더링
                <Marker
                  key={id}
                  coordinate={{
                    longitude: geometry.coordinates[0],
                    latitude: geometry.coordinates[1],
                  }}
                  onPress={onPress}>
                  <View
                    style={{
                      position: 'relative',
                      width: responsiveWidth(100),
                      height: responsiveWidth(100),
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: '85%',
                        height: '85%',
                        borderRadius: 300,
                        backgroundColor: Colors.buttonSecondBackground,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveWidth(34),
                          fontFamily: 'SpoqaHanSansNeo-Bold',
                          lineHeight: responsiveHeight(70),
                          letterSpacing: responsiveWidth(-0.6),
                          color: Colors.textBold,
                        }}>{`+${points}`}</Text>
                    </View>
                    <Image
                      source={Images.pin}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 100,
                        position: 'absolute',
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                </Marker>
              );
            }}>
            {contents &&
              contents.map((content, index) => {
                return (
                  <Marker
                    key={content.contentId}
                    coordinate={{
                      latitude: content.lat,
                      longitude: content.lon,
                    }}
                    // 클릭 후 상세 페이지로 이동
                    onPress={() => {
                      setDetailPressed(true);
                      const p = content.detail;
                      navigation.push('MapDetail', {
                        postId: p.postId,
                        nickname: p.nickname,
                        profileImage: p.profileImage,
                        content: p.content,
                        mediaFiles: p.mediaFiles,
                        locationName: p.locationName,
                        liked: p.liked,
                        likesCount: p.likesCount,
                        commentsCount: p.commentsCount,
                        createdDate: p.createdDate,
                        mention: p.mention,
                        thumbsUp: thumbsUp,
                        userId: content.userId,
                        before: 'Home',
                        reload: close,
                      });
                    }}>
                    <View
                      {...content}
                      style={{
                        position: 'relative',
                        width: responsiveWidth(100),
                        height: responsiveWidth(100),
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <FastImage
                        source={{
                          uri:
                            API_URL + '/post/image?watch=' + content.thumbnail,
                          priority: FastImage.priority.high,
                        }}
                        style={{
                          width: '85%',
                          height: '85%',
                          borderRadius: 300,
                          backgroundColor: Colors.contentBackground,
                          marginBottom: responsiveHeight(10),
                        }}
                        resizeMode="cover"
                      />

                      <Image
                        source={
                          content.userId == myUserId
                            ? Images.pin
                            : Images.pinFriend
                        }
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 100,
                          position: 'absolute',
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </Marker>
                );
              })}
          </MapView>
        </>
      )}
      {/*  GPS허용 모달*/}

      <Modal visible={!permission} animationType={'slide'} transparent={true}>
        <Permission
          close={() => {
            setPermission(true);
          }}
        />
      </Modal>
    </View>
  );
};

export default Home;
