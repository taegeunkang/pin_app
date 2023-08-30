import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
} from 'react-native';
import {Marker} from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Geolocation from '@react-native-community/geolocation';
import {useEffect, useState, useRef} from 'react';
import {WithLocalSvg} from 'react-native-svg';
import CurrentLocationBtn from '../../theme/assets/images/light/current-location.svg';
import {useTheme} from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import Permission from './Permission';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {reIssue} from '../../utils/login';
import Detail1 from './Detail1';
import FastImage from 'react-native-fast-image';
const Home = ({navigation}) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [contents, setContents] = useState([]);
  const [permission, setPermission] = useState(true);
  const [detailPressed, setDetailPressed] = useState(false);
  const [focusedPin, setFocusedPin] = useState({});
  const mapRef = useRef(null);
  const {Gutters, Images} = useTheme();

  const scaleValue = useState(new Animated.Value(1))[0];

  const onButtonPressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true, // 원활한 성능을 위해 네이티브 드라이버 사용
    }).start();
  };

  const onButtonPressOut = () => {
    Animated.timing(scaleValue, {
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
          console.log(
            'latitude : ' +
              position['coords']['latitude'] +
              '  ' +
              'longtitude : ' +
              position['coords']['longitude'],
          );
          setLatitude(position['coords']['latitude']);
          setLongitude(position['coords']['longitude']);
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

  const getMyPosts = async () => {
    console.log('post response');
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
      console.log(res);
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

  useEffect(() => {
    getMyPosts();
    console.log(focusedPin);
  }, [detailPressed]);

  useEffect(() => {
    const t = async () => {
      await getCurrentLocation();
    };
    checkPermissions();
    getMyPosts();
    const intervalId = setInterval(t, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <View style={styles.container}>
      {!latitude && !longitude && (
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
          }}>
          <ActivityIndicator
            size={'large'}
            color={'#4880EE'}
            style={[Gutters.largeVMargin]}
          />
        </View>
      )}
      {latitude && longitude && (
        <>
          <Animated.View
            style={{
              width: responsiveWidth(45),
              height: responsiveHeight(45),
              position: 'absolute',
              bottom: responsiveHeight(30),
              left: responsiveWidth(20),
              backgroundColor: '#EAF3FE',
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
              onPressIn={onButtonPressIn}
              onPressOut={onButtonPressOut}
              style={{}}
              onPress={returnCurrentLocation}>
              <CurrentLocationBtn
                width={responsiveWidth(35)}
                height={responsiveHeight(35)}
              />
            </Pressable>
          </Animated.View>

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
                      height: responsiveHeight(100),
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: '91%',
                        height: '91%',
                        borderRadius: 300,
                        backgroundColor: '#EAF3FE',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveWidth(34),
                          fontFamily: 'SpoqaHanSansNeo-Bold',
                          lineHeight: responsiveHeight(70),
                          letterSpacing: responsiveWidth(-0.6),
                          color: '#353C49',
                        }}>{`+${points}`}</Text>
                    </View>
                    <Image
                      source={Images.pin}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 100,
                        position: 'absolute',
                        // top: responsiveHeight(10),
                        // left: '50%',
                        // top: '50%',
                        // transform: [
                        //   {translateX: -50}, // Adjust these values accordingly
                        //   {translateY: -12}, // For instance, -50% of your element width and height
                        // ],
                      }}
                    />
                  </View>
                </Marker>
              );
            }}>
            {contents &&
              contents.map((content, index) => {
                console.log(content);
                return (
                  <Marker
                    key={content.contentId}
                    coordinate={{
                      latitude: content.lat,
                      longitude: content.lon,
                    }}
                    // 클릭 후 상세 페이지로 이동
                    onPress={() => {
                      setFocusedPin(content.detail);
                      setDetailPressed(true);
                    }}>
                    <View
                      {...content}
                      style={{
                        position: 'relative',
                        width: responsiveWidth(100),
                        height: responsiveHeight(100),
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
                          width: '91%',
                          height: '91%',
                          borderRadius: 300,
                          backgroundColor: 'black',
                          marginBottom: responsiveHeight(10),
                        }}
                        resizeMode="contain"
                      />
                      <Image
                        source={Images.pin}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 100,
                          position: 'absolute',
                          // top: responsiveHeight(10),
                          // left: '50%',
                          // top: '50%',
                          // transform: [
                          //   {translateX: -50}, // Adjust these values accordingly
                          //   {translateY: -12}, // For instance, -50% of your element width and height
                          // ],
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
      <Modal visible={detailPressed} animationType={'slide'} transparent={true}>
        <Detail1 {...focusedPin} close={close} navigation={navigation} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    flex: 1,
  },
});

export default Home;
