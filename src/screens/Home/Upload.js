import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import CameraBtn from '../../theme/assets/images/camera-solid.svg';
import CropBtn from '../../theme/assets/images/crop-solid.svg';
import {Colors, FontSize} from '../../theme/Variables';
import {WithLocalSvg} from 'react-native-svg';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Square1 from './Square1';
import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchblob from 'react-native-fetch-blob';
import {API_URL} from '../../utils/constants';
import axios from 'axios';
const Upload = ({navigation, route}) => {
  const [scale, setScale] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [target, setTarget] = useState(null);
  const [galleryCursor, setGalleryCursor] = useState(null);
  const [array, setArray] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const t = async () => {
      await getGalleryPhotos();
    };
    t();
  }, [array]);

  // 구현 해야하는 기능
  // 이미지에서 인스가르매처럼 드래그 줌 아웃 후 값 임시 저장 후 다음 페에지 넘어갈 때
  // 크롭해서 저장 후 사용
  const cropImg = () => {
    setScale(scale == 1 ? 2 : 1);
  };
  const getGalleryPhotos = async () => {
    const params = {
      //이미지를 불러올 개수 (최신순으로)
      first: 50,
      assetType: 'Photos',
      ...(galleryCursor && {after: galleryCursor}),
    };

    try {
      //사진을 불러옵니다. edges는 gallery photo에 대한 정보
      const {edges, page_info} = await CameraRoll.getPhotos(params);
      if (page_info.has_next_page === false) {
        setGalleryCursor(null);
      } else {
        setGalleryCursor(page_info.end_cursor);
      }

      /*ios인 경우는 ph:// 형식으로 사진이 저장됩니다.
      이미지를 읽을 수 없는 오류가 생기기 때문에
      react-native-fs의 파일 시스템을 이용하여 변환 시켜줍니다.*/
      if (Platform.OS === 'ios') {
        for await (const item of edges) {
          const fileName = item.node.image.uri.replace('ph://', '');
          const result = await phPathToFilePath(item.node.image.uri);
          item.node.image.uri = result;
        }
      }
      let arr = [];
      for (let e = 0; e < edges.length; e++) {
        let a = {id: e + 1, uri: edges[e].node.image.uri};
        arr.push(a);
      }
      setPhotos(arr);
    } catch (error) {
      console.log('[takeStore getPhotos error occured] ', error);
    }
  };

  const phPathToFilePath = async uri => {
    let fileURI = encodeURI(uri);

    if (uri.startsWith('ph://')) {
      const copyPath = `${
        RNFS.DocumentDirectoryPath
      }/${new Date().toISOString()}.jpg`.replace(/:/g, '-');

      // ph경로의 이미지를 file로 옮기는 작업
      fileURI = await RNFS.copyAssetsFileIOS(uri, copyPath, 360, 360);
    }

    return fileURI;
  };

  const isArrayContain = target => {
    let arr = array;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == target.id) {
        return true;
      }
    }
    return false;
  };

  const saveImageToLocalStorage = async imagesArray => {
    let arr = [];
    for (let i = 0; i < imagesArray.length; i++) {
      try {
        let imageUrl = imagesArray[i].uri;
        // Fetch the image data
        const response = await fetch(imageUrl);
        const imageData = await response.blob();

        // Convert the image data to a base64 string
        const base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageData);
        });
        arr.push(base64Image);
      } catch (error) {
        console.log('Error saving image:', error);
      }
    }
    await AsyncStorage.setItem('images', JSON.stringify(arr));
  };

  const addArray = async target => {
    let arr = array;
    if (!isArrayContain(target) && arr.length <= 10) {
      arr.push(target);
      setArray(arr);
      saveImageToLocalStorage(arr);
    }
    setTarget(target.uri); // viewer에 표시
  };
  const findArrayIdx = target => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id == target.id) return i + 1;
    }
    return -1;
  };
  const removeTargetFromArray = target => {
    let arr = array;
    let i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i].id === target.id) {
        break;
      }
    }
    let newArr = arr.slice(0, i).concat(arr.slice(i + 1));
    setArray(newArr);
  };

  return (
    <View style={styles.container}>
      {target && (
        <View
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').width,
          }}>
          <Square1 image={target} scale={scale} setScale={setScale} />
          <Pressable
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
              backgroundColor: 'rgba(255,255,255,0.5)',
              position: 'absolute',
              bottom: 15,
              left: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={cropImg}>
            <WithLocalSvg asset={CropBtn} width={20} height={20} />
          </Pressable>
        </View>
      )}
      {/* 선택된 사진이 없을 때 */}
      {!target && (
        <View
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').width,
          }}
        />
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: 10,
          paddingRight: 10,
          height: 40,
          alignItems: 'center',
          backgroundColor: Colors.white,
        }}>
        <Text style={{fontSize: FontSize.regular, fontWeight: 600}}>
          사진 목록
        </Text>
        <View style={{flexDirection: 'row'}}>
          <WithLocalSvg
            asset={CameraBtn}
            width={20}
            height={20}
            style={{marginRight: 5}}
          />
        </View>
      </View>
      {/* 갤러리 사진 */}
      <FlatList
        data={photos}
        renderItem={({item}) => (
          <View>
            <Pressable onPress={() => addArray(item)}>
              <Image
                source={{uri: item.uri}}
                style={{
                  width: Dimensions.get('window').width / 4,
                  height: Dimensions.get('window').width / 4,
                }}
              />
            </Pressable>
            {findArrayIdx(item) !== -1 && (
              <Pressable
                onPress={() => removeTargetFromArray(item)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 5,
                  left: 5,
                }}>
                <Text>{findArrayIdx(item)}</Text>
              </Pressable>
            )}
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={4}
        style={{backgroundColor: Colors.white}}
      />
    </View>
  );
};

const ImageBox = ({image}) => {
  return (
    <Image
      source={image}
      style={{width: '100%', height: Dimensions.get('window').width}}
    />
  );
};

const openCamera = async () => {
  await launchCamera({
    mediaType: 'mixed',
    quality: 1,
    includeBase64: true,
  })
    .then(data => console.log(data))
    .catch(error => console.log(error));
  // setImage('data:image/png;base64,' + result.assets[0].base64);
};

const styles = StyleSheet.create({
  container: {width: '100%', height: '100%'},
});

export default Upload;
