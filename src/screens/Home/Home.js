import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
} from 'react-native';
import {Marker} from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Geolocation from '@react-native-community/geolocation';
import {useEffect, useState} from 'react';
import GpsAlert from '../../components/Content/GpsAlert';
import ListModal from '../../components/Content/ListModal';
import {Colors} from '../../theme/Variables';
import {launchCamera} from 'react-native-image-picker';
import {WithLocalSvg} from 'react-native-svg';
import CurrentLocationBtn from '../../theme/assets/images/nav/location.svg';
import {useTheme} from '../../hooks';
import MyPage from './MyPage';
import Upload from './Upload';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';

const Home = ({navigation}) => {
  const [gpsPermission, setGpsPermission] = useState(false);
  const [image, setImage] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [region, setRegion] = useState(null);
  const [listBtn, setListBtn] = useState(false);
  const [contents, setContents] = useState([]);

  const {Gutters} = useTheme();
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

  const upload = async () => {
    await openCamera();
    navigation.navigate('Upload', {images: tmp});
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

  const updatePosition = region => {
    setRegion(region);
    console.log(region);
  };

  const returnCurrentLocation = () => {
    getCurrentLocation();
    setRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0175,
      longitudeDelta: 0.0175,
    });
  };

  const moveToMyPage = () => {
    navigation.navigate(MyPage);
  };
  // 게시글 생성 페이지 이동
  const moveToUpload = async () => {
    console.log(latitude, longitude);
    await AsyncStorage.setItem('lat', latitude.toString());
    await AsyncStorage.setItem('lon', longitude.toString());
    navigation.navigate(Upload);
  };

  const showList = () => {
    setListBtn(true);
  };

  const moveToList = () => {
    navigation.navigate('MyList');
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
    getCurrentLocation();
    getMyPosts();
  }, []);

  return (
    <View style={styles.container}>
      {!latitude && !longitude && (
        <ActivityIndicator size={'large'} style={[Gutters.largeVMargin]} />
      )}
      {latitude && longitude && (
        <>
          <View
            style={{
              width: 45,
              height: 45,
              position: 'absolute',
              bottom: 30,
              left: 20,
              backgroundColor: '#EAF3FE',
              borderRadius: 100,
              zIndex: 100,
              shadowOffset: {width: 0, height: 3},
              shadowOpacity: 0.25,
              shadowRadius: 3,
              shadowColor: '#000000',
              elevation: 3,
            }}>
            <Pressable
              style={{
                width: 45,
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={returnCurrentLocation}>
              <WithLocalSvg width={25} height={25} asset={CurrentLocationBtn} />
            </Pressable>
          </View>
          {/* <View
            style={{
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              marginLeft: '50%',
              marginRight: '50%',
              bottom: 0,
              zIndex: 100,
            }}>
            <Pressable style={styles.uploadBtn} onPress={moveToUpload}>
              <WithLocalSvg width={50} height={50} asset={UploadBtn} />
            </Pressable>
          </View> */}

          <MapView
            style={styles.map}
            showsUserLocation={true}
            userLocationUpdateInterval={5000}
            showsMyLocationButton={false}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0175,
              longitudeDelta: 0.0175,
            }}
            region={region}
            onRegionChange={updatePosition}
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
                  onPress={() => console.log('called')}
                />
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
  },
  map: {
    flex: 1,
  },
  uploadBtn: {
    width: 60,
    height: 60,
    backgroundColor: Colors.transparent,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
