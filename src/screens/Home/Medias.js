import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
} from 'react-native';
import {useEffect, useState, useLayoutEffect} from 'react';
import {Colors} from '../../theme/Variables';
import {WithLocalSvg} from 'react-native-svg';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import {useTheme} from '../../hooks';
import SubmitButton from '../../components/SubmitButton';
import {useNavigation} from '@react-navigation/native';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {Card} from 'react-native-paper';
// ios 일 떄 파일 형식 변경을 해야지 정상적으로 불러오기 및 저장 가능

const Medias = () => {
  const [scale, setScale] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [target, setTarget] = useState(null);
  const [galleryCursor, setGalleryCursor] = useState(null);
  const [array, setArray] = useState([]);
  const {Images} = useTheme();
  const navigation = useNavigation();
  useEffect(() => {
    const t = async () => {
      await getGalleryPhotos();
    };
    t();
  }, [array]);

  const convertLocalIdentifierToAssetLibrary = (localIdentifier, ext) => {
    const hash = localIdentifier.split('/')[0];
    return `assets-library://asset/asset.${ext}?id=${hash}&ext=${ext}`;
  };
  const getGalleryPhotos = async () => {
    const params = {
      //이미지를 불러올 개수 (최신순으로)
      first: 50,
      assetType: 'All',
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
      이미지를 읽을 수 없는 오류가 생기기 때문에 변환 시켜줍니다.*/
      if (Platform.OS === 'ios') {
      }
      let arr = [];
      for (let e = 0; e < edges.length; e++) {
        let a = {
          id: e + 1,
          uri: edges[e].node.image.uri,
          // 기기 내부에서 접근 하기 위한 uri 생성
          accessUri:
            Platform.OS === 'ios'
              ? convertLocalIdentifierToAssetLibrary(
                  edges[e].node.image.uri.replace('ph://', ''),
                  edges[e].node.type === 'image' ? 'png' : 'mp4',
                )
              : '',
        };
        arr.push(a);
      }
      setPhotos(arr);
    } catch (error) {
      console.log('[takeStore getPhotos error occured] ', error);
    }
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

  const addArray = async target => {
    let arr = array;
    if (!isArrayContain(target) && arr.length <= 10) {
      arr.push(target);
      setArray(arr);
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
  // 프리뷰로 이동 및 재생(사진 동영상 둘다)
  const watchPreview = uri => {
    navigation.navigate('Preview', {item: uri});
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 갤러리 사진 */}

      <FlatList
        data={photos}
        renderItem={({item}) => (
          <View>
            <Pressable
              onPress={() =>
                watchPreview(Platform.OS === 'ios' ? item.accessUri : item.uri)
              }>
              <Image
                source={{uri: item.accessUri}}
                style={{
                  width: Dimensions.get('window').width / 4,
                  height: Dimensions.get('window').width / 4,
                }}
              />
            </Pressable>

            {findArrayIdx(item) === -1 && (
              <Pressable
                onPress={() => addArray(item)}
                style={{
                  width: responsiveWidth(20),
                  height: responsiveHeight(20),
                  borderRadius: responsiveWidth(100),
                  backgroundColor: Colors.transparent,
                  borderWidth: responsiveWidth(2),
                  borderColor: '#EAF3FE',
                  position: 'absolute',
                  top: responsiveHeight(5),
                  left: responsiveWidth(5),
                }}></Pressable>
            )}
            {findArrayIdx(item) !== -1 && (
              <Pressable
                onPress={() => removeTargetFromArray(item)}
                style={{
                  width: responsiveWidth(20),
                  height: responsiveHeight(20),
                  borderRadius: responsiveWidth(100),
                  backgroundColor: '#4880EE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: responsiveHeight(5),
                  left: responsiveWidth(5),
                }}>
                <Text
                  style={{
                    fontFamily: 'SpoqaHanSansNeo-Bold',
                    fontSize: responsiveWidth(12),
                    lineHeight: responsiveHeight(18),
                    letterSpacing: responsiveWidth(-0.6),
                    color: '#EAF3FE',
                  }}>
                  {findArrayIdx(item)}
                </Text>
              </Pressable>
            )}
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={4}
        style={{backgroundColor: Colors.white, flex: 1}}
      />
      <View
        style={{
          height: responsiveHeight(50),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: responsiveWidth(20),
          backgroundColor: 'rgba(234,243,254, 1)',
        }}>
        <Text>최대 10개의 사진, 동영상을 선택할 수 있습니다.</Text>
        <SubmitButton
          title="다음"
          width={40}
          height={40}
          onPress={() =>
            navigation.navigate('WriteContent', {mediaFiles: array})
          }
        />
      </View>
    </SafeAreaView>
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
  container: {flex: 1, justifyContent: 'center'},
  headerTitle: {
    fontFamily: 'SpoqaHanSansNeo-Bold',
    fontSize: responsiveWidth(14),
    lineHeight: responsiveHeight(20),
    letterSpacing: responsiveWidth(-0.6),
    color: '#1A1E27',
  },
  subscription: {
    fontFamily: 'SpoqaHanSansNeo-Medium',
    fontSize: responsiveWidth(14),
    lineHeight: responsiveHeight(20),
    letterSpacing: responsiveWidth(-0.6),
    color: '#505866',
  },
});

export default Medias;
