import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { useEffect, useState } from "react";
import GpsAlert from "../../components/Content/GpsAlert";
import ListModal from "../../components/Content/ListModal";
import { Colors } from "../../theme/Variables";
import { launchCamera } from "react-native-image-picker";
import { WithLocalSvg } from "react-native-svg";
import CurrentLocationBtn from "../../theme/assets/images/current_location_btn.svg";
import ListBtn from "../../theme/assets/images/list_btn.svg";
import MyPageBtn from "../../theme/assets/images/mypage_btn.svg";
import UploadBtn from "../../theme/assets/images/upload_btn.svg";
import { useTheme } from "../../hooks";
import MyPage from "./MyPage";
import Upload from "./Upload";

const Home = ({ navigation }) => {
  const [gpsPermission, setGpsPermission] = useState(false);
  const [image, setImage] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [region, setRegion] = useState(null);
  const [listBtn, setListBtn] = useState(false);

  const { Gutters } = useTheme();
  const openCamera = async () => {
    let result = await launchCamera({
      mediaType: "mixed",
      quality: 1,
      includeBase64: true,
    });
    console.log(result);
    let tmp = image;
    tmp.push("data:image/png;base64," + result.assets[0].base64);
    setImage(tmp);
    // setImage('data:image/png;base64,' + result.assets[0].base64);
    // 캔슬할 때 에러 처리
  };

  const upload = async () => {
    await openCamera();
    navigation.navigate("Upload", { images: tmp });
  };

  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log("latitude : " + position["coords"]["latitude"] + "  " + "longtitude : " + position["coords"]["longitude"]);
        setLatitude(position["coords"]["latitude"]);
        setLongitude(position["coords"]["longitude"]);

      },
      error => {
        switch (error["code"]) {
          case 1:
            setGpsPermission(true);
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

  };

  const updatePosition = (region) => {
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

  const moveToUpload = () => {
    navigation.navigate(Upload);
  };

  const showList = () => {
    setListBtn(true);
  };

  useEffect(() => {
    getCurrentLocation();

  }, []);

  return (

    <View style={styles.container}>
      {!latitude && !longitude && <ActivityIndicator size={"large"} style={[Gutters.largeVMargin]} />}
      {latitude && longitude && <>

        <View style={{
          width: 50,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 30,
          right: 20,
          backgroundColor: Colors.transparent,
          zIndex: 100,
        }}>
          <Pressable style={{ width: "100%", height: "100%" }} onPress={moveToMyPage}>
            <WithLocalSvg width={50} height={50} asset={MyPageBtn} />
          </Pressable>
        </View>


        <View style={{
          width: 50,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 100,
          right: 20,
          backgroundColor: Colors.transparent,
          zIndex: 100,
        }}>
          <Pressable style={{ width: "100%", height: "100%" }} onPress={showList}>
            <WithLocalSvg width={50} height={50} asset={ListBtn} />
          </Pressable>
        </View>

        <View style={{
          width: 50,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 30,
          left: 20,
          backgroundColor: Colors.transparent,
          zIndex: 100,
        }}>
          <Pressable style={{ width: "100%", height: "100%" }} onPress={returnCurrentLocation}>
            <WithLocalSvg width={50} height={50} asset={CurrentLocationBtn} />
          </Pressable>
        </View>
        <View
          style={{
            width: 60,
            height: 60,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            marginLeft: "50%",
            marginRight: "50%",
            bottom: 0,
            zIndex: 100,
          }}
        >

          <Pressable style={styles.uploadBtn} onPress={moveToUpload}>
            <WithLocalSvg width={50} height={50} asset={UploadBtn} />
          </Pressable>
        </View>


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
        >
          {/* <Marker coordinate={{
        latitude:37.77684,
        longitude: -122.45035,
        latitudeDelta: 0.0035,
        longitudeDelta: 0.0035,
      }} pinColor='#000000' /> */}
        </MapView></>}

      <Modal visible={listBtn} animationType={"fade"} transparent={true}>
        <ListModal closeModal={() => setListBtn(false)} />
      </Modal>

      <Modal visible={gpsPermission} animationType={"fade"} transparent={true}>
        <GpsAlert />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 1,
  },
  uploadBtn: {
    width: 60,
    height: 60,
    backgroundColor: Colors.transparent,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
