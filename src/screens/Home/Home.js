import { View, StyleSheet, Text, Modal, Pressable, ActivityIndicator } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useState, useEffect } from 'react';
import GpsAlert from '../../components/Content/GpsAlert';
import { Colors } from '../../theme/Variables';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../hooks';
const Home = ({ navigation }) => {
  const [gpsPermission, setGpsPermission] = useState(false);
  const [image, setImage] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [region, setRegion] = useState(null);
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
    navigation.navigate('Upload', { images: tmp });
  };

  const getCurrentLocation = async() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log("latitude : " + position["coords"]["latitude"] +"  "+ "longtitude : " + position["coords"]["longitude"])
        setLatitude(position["coords"]["latitude"]);
        setLongitude(position["coords"]["longitude"]);
        
      },
      error => {
        console.log('Error:', error);
        setGpsPermission(true);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

  }

  const updatePosition = (region) => {
    setRegion(region);
    console.log(region);
  }

  const returnCurrentLocation = () => {
    getCurrentLocation();
    setRegion({
      latitude:latitude,
      longitude: longitude,
      latitudeDelta: 0.0175,
      longitudeDelta: 0.0175,
    })
  }

  useEffect(() => {
    getCurrentLocation();
    
  },[]);

  return (

    <View style={styles.container}>
      {!latitude && !longitude && <ActivityIndicator size={'large'} style={[Gutters.largeVMargin]} />}
      {latitude && longitude && <>

      <View style={{ width: 45, height: 45, alignItems: 'center', justifyContent:'center', position: 'absolute', bottom: 30, left : 20, backgroundColor: Colors.lightGray, zIndex:100}}>
         <Pressable style={{ width:'100%', height: '100%'}} onPress={returnCurrentLocation}>
          <Text>return</Text>
        </Pressable>
      </View>
      <View
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
        }}
      >
       
        <Pressable style={styles.uploadBtn} onPress={upload}>
          <Text> upload </Text>
        </Pressable>
      </View>
      <MapView
        style={styles.map}
         showsUserLocation = {true}
         userLocationUpdateInterval = {5000}
         showsMyLocationButton = {false}
         initialRegion={{
          latitude:latitude,
          longitude: longitude,
          latitudeDelta: 0.0175,
          longitudeDelta: 0.0175,
        }}
         region = {region}
         onRegionChange={updatePosition}
      >
      {/* <Marker coordinate={{
        latitude:37.77684,
        longitude: -122.45035,
        latitudeDelta: 0.0035,
        longitudeDelta: 0.0035,
      }} pinColor='#000000' /> */}
      </MapView></>}

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
    backgroundColor: Colors.lightGray,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
