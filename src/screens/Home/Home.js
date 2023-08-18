import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
  Image,
} from 'react-native';
import {Marker} from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Geolocation from '@react-native-community/geolocation';
import {useEffect, useState, useRef} from 'react';
import GpsAlert from '../../components/Content/GpsAlert';
import ListModal from '../../components/Content/ListModal';
import {Colors} from '../../theme/Variables';
import {launchCamera} from 'react-native-image-picker';
import {WithLocalSvg} from 'react-native-svg';
import CurrentLocationBtn from '../../theme/assets/images/nav/location.svg';
import {useTheme} from '../../hooks';
import MyPage from './MyPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Sample5 from '../../theme/assets/images/sample/sample5.png';
const Home = ({navigation}) => {
  const [gpsPermission, setGpsPermission] = useState(false);
  const [image, setImage] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [contents, setContents] = useState([
    {lat: 37.785834, lon: -122.40641},
    {lat: 37.785834, lon: -122.40641},
  ]);
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
  const openCamera = async () => {
    let result = await launchCamera({
      mediaType: 'mixed',
      quality: 1,
      includeBase64: true,
    });
    console.log(result);
    let tmp = image;
    tmp.push('data:image/png;base64,' + result.assets[0].base64);
    setImage(tmp);
    // setImage('data:image/png;base64,' + result.assets[0].base64);
    // 캔슬할 때 에러 처리
  };

  const getCurrentLocation = async () => {
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
        switch (error['code']) {
          case 1:
            setGpsPermission(true);
            break;
        }
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  // const updatePosition = region => {
  //   setRegion(region);
  //   console.log(region);
  // };

  const returnCurrentLocation = () => {
    // setRegion({
    //   latitude: latitude,
    //   longitude: longitude,
    //   latitudeDelta: 0.0175,
    //   longitudeDelta: 0.0175,
    // });

    mapRef.current.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0175,
      longitudeDelta: 0.0175,
    });
  };

  const moveToDetail = () => {
    setListBtn(false);
    navigation.navigate('Detail');
  };

  const getMyPosts = async () => {
    const response = await fetch(
      API_URL + '/post/all?id=' + (await AsyncStorage.getItem('id')),
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        },
      },
    );
    const res = await response.json();
    setContents(res['contents']);
    console.log(res['contents']);
  };

  useEffect(() => {
    const t = async () => {
      await getCurrentLocation();
      // getMyPosts();
    };
    const intervalId = setInterval(t, 5000);
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
              <WithLocalSvg
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
                asset={CurrentLocationBtn}
              />
            </Pressable>
          </Animated.View>

          <MapView
            style={styles.map}
            showsUserLocation={true}
            userLocationUpdateInterval={5000}
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
                  onPress={onPress}
                />
              );
            }}>
            {contents &&
              contents.map((content, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: content.lat,
                    longitude: content.lon,
                  }}
                  // 클릭 후 상세 페이지로 이동
                  onPress={() => console.log('called')}>
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
                    <Image
                      source={Sample5}
                      style={{
                        width: '91%',
                        height: '85%',
                        borderRadius: 300,
                      }}
                    />
                    <Image
                      source={Images.pin}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 100,
                        position: 'absolute',
                        top: responsiveHeight(10),
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
              ))}
          </MapView>
        </>
      )}

      {/*  GPS허용 모달*/}

      <Modal visible={gpsPermission} animationType={'fade'} transparent={true}>
        <GpsAlert />
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
