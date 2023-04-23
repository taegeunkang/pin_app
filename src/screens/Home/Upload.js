import { Dimensions, FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import CameraBtn from "../../theme/assets/images/camera-solid.svg";
import CropBtn from "../../theme/assets/images/crop-solid.svg";
import { FontSize } from "../../theme/Variables";
import { WithLocalSvg } from "react-native-svg";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import * as RNFS from "react-native-fs";
import * as ImagePicker from "react-native-image-crop-picker";

const Upload = ({ navigation, route }) => {
  const [croppedImage, setCroppedImage] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [target, setTarget] = useState(null);
  const [galleryCursor, setGalleryCursor] = useState(null);
  useEffect(() => {
    const t = async () => {
      await getGalleryPhotos();

    };
    t();
  }, []);

  const cropImg = () => {
    ImagePicker.openCropper({
      path: target,
      width: 400,
      height: 400,
      freeStyleCropEnabled: false,
    }).then(image => {
      console.log(image);
      setTarget(image["path"]);
    }).catch(error => console.warn(error));
  };
  const getGalleryPhotos = async () => {
    const params = {
      //이미지를 불러올 개수 (최신순으로)
      first: 50,
      assetType: "Photos",
      ...galleryCursor && { after: galleryCursor },
    };

    try {
      //사진을 불러옵니다. edges는 gallery photo에 대한 정보
      const { edges, page_info } = await CameraRoll.getPhotos(params);
      if (page_info.has_next_page === false) {
        setGalleryCursor(null);
      } else {
        setGalleryCursor(page_info.end_cursor);
      }

      /*ios인 경우는 ph:// 형식으로 사진이 저장됩니다.
      이미지를 읽을 수 없는 오류가 생기기 때문에
      react-native-fs의 파일 시스템을 이용하여 변환 시켜줍니다.*/
      if (Platform.OS === "ios") {
        for await (const item of edges) {
          const fileName = item.node.image.uri.replace("ph://", "");
          const result = await phPathToFilePath(
            item.node.image.uri,
            fileName,
          );
          item.node.image.uri = result;
        }
      }
      let arr = [];
      for (let e = 0; e < edges.length; e++) {
        let a = { id: e + 1, uri: edges[e].node.image.uri };
        arr.push(a);
      }
      setPhotos(arr);
    } catch (error) {
      console.log("[takeStore getPhotos error occured] ", error);
    }

  };

  const phPathToFilePath = async (uri) => {
    let fileURI = encodeURI(uri);

    if (uri.startsWith("ph://")) {
      const copyPath = `${RNFS.DocumentDirectoryPath
      }/${new Date().toISOString()}.jpg`.replace(/:/g, "-");

      // ph경로의 이미지를 file로 옮기는 작업
      fileURI = await RNFS.copyAssetsFileIOS(uri, copyPath, 360, 360);
    }

    return fileURI;
  };

  return (
    <View style={styles.container}>
      {target && <View>
        <Image source={{
          uri: target,
        }} style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").width }} />
        <Pressable style={{
          width: 40,
          height: 40,
          borderRadius: 100,
          backgroundColor: "rgba(255,255,255,0.5)",
          position: "absolute",
          bottom: 15,
          left: 15,
          alignItems: "center",
          justifyContent: "center",
        }} onPress={cropImg}>
          <WithLocalSvg asset={CropBtn} width={20} height={20} />
        </Pressable>
      </View>}


      {!target &&
        <View style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").width }} />}


      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,
        height: 40,
        alignItems: "center",
      }}>
        <Text style={{ fontSize: FontSize.regular, fontWeight: 600 }}>사진 목록</Text>
        <View style={{ flexDirection: "row" }}>
          <Pressable style={{
            paddingLeft: 5,
            paddingRight: 5,
            paddingTop: 2,
            paddingBottom: 2,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 25,
            backgroundColor: "rgba(0,0,0,0.1)",
          }}>
            <Text style={{ fontSize: FontSize.tiny }}>여러가지 선택</Text>
          </Pressable>
          <WithLocalSvg asset={CameraBtn} width={20} height={20} style={{ marginRight: 5 }} />
        </View>
      </View>

      <FlatList
        data={photos}
        renderItem={({ item }) => (
          <Pressable onPress={() => setTarget(item.uri)}>
            <Image source={{ uri: item.uri }}
                   style={{ width: Dimensions.get("window").width / 4, height: Dimensions.get("window").width / 4 }} />
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}

      />
    </View>
  );
};


const ImageBox = ({ image }) => {
  return (<Image source={image} style={{ width: "100%", height: Dimensions.get("window").width }} />);
};


const openCamera = async () => {
  await launchCamera({
    mediaType: "mixed",
    quality: 1,
    includeBase64: true,
  }).then(data => console.log(data)).catch(error => console.log(error));
  // setImage('data:image/png;base64,' + result.assets[0].base64);
};

const styles = StyleSheet.create({
  container: { width: "100%", height: "100%" },

});

export default Upload;
