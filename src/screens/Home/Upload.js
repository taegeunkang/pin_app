import { Dimensions, FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import CameraBtn from "../../theme/assets/images/camera-solid.svg";
import CropBtn from "../../theme/assets/images/crop-solid.svg";
import { Colors, FontSize } from "../../theme/Variables";
import { WithLocalSvg } from "react-native-svg";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Square1 from "./Square1";
import * as RNFS from "react-native-fs";

const Upload = ({ navigation, route }) => {
  const [croppedImage, setCroppedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [scales, setScales] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [target, setTarget] = useState(null);
  const [galleryCursor, setGalleryCursor] = useState(null);
  const [array, setArray] = useState([]);
  const [arrayId, setArrayId] = useState([]);

  useEffect(() => {
    const t = async () => {
      await getGalleryPhotos();

    };
    t();
  }, []);

  const cropImg = () => {
    setScale((scale == 1) ? 2 : 1);
    // 구현 해야하는 기능
    // 이미지 다중 선택시 이미지 별로 스케일 따로 저장
    // 동영상 -> 이건 실물 기기 연결한 상태에서 해야함

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
  const isArrayContain = (target) => {
    let arr = array;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == target) {
        return true;
      }
    }
    return false;
  };

  const addArray = (target) => {
    let arr = array;
    if (!isArrayContain(target) && arr.length <= 10) {
      arr.push(target);
      setArray(arr);
    }
    setTarget(target);
  };
  const findArrayIdx = (target) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i] == target) return i + 1;
    }
    return -1;

  };
  const removeTargetFromArray = (target) => {
    let arr = array;
    let i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i] === target) {
        break;
      }
    }
    let newArr = arr.slice(0, i).concat(arr.slice(i + 1));
    setArray(newArr);

  };

  return (
    <View style={styles.container}>
      {target &&
        <View style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").width }}>
          <Square1 image={target} scale={scale} setScale={setScale} />
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
        backgroundColor: Colors.white,
      }}>
        <Text style={{ fontSize: FontSize.regular, fontWeight: 600 }}>사진 목록</Text>
        <View style={{ flexDirection: "row" }}>

          <WithLocalSvg asset={CameraBtn} width={20} height={20} style={{ marginRight: 5 }} />
        </View>
      </View>

      <FlatList
        data={photos}
        renderItem={({ item }) => (
          <View>
            <Pressable onPress={() => addArray(item.uri)}>
              <Image source={{ uri: item.uri }}
                     style={{
                       width: Dimensions.get("window").width / 4,
                       height: Dimensions.get("window").width / 4,
                     }} />
            </Pressable>
            {(findArrayIdx(item.uri) !== -1) && <Pressable onPress={() => removeTargetFromArray(item.uri)} style={{
              width: 20,
              height: 20,
              borderRadius: 100,
              backgroundColor: "rgba(255,255,255,0.7)",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 5,
              left: 5,
            }}>
              <Text>{findArrayIdx(item.uri)}</Text>
            </Pressable>}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        style={{ backgroundColor: Colors.white }}

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
