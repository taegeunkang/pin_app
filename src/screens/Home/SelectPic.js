import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
} from 'react-native';
import {useEffect, useState, useLayoutEffect} from 'react';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useTheme} from '../../hooks';
import SubmitButton from '../../components/SubmitButton';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import HeaderLeftButton from '../../components/HeaderLeftButton';
import {useDispatch} from 'react-redux';
import {setInitialFriends} from '../../store/friends';
import {saveMedia, setInitialWriting} from '../../store/writing';

// ios 일 떄 파일 형식 변경을 해야지 정상적으로 불러오기 및 저장 가능
const Medias = ({navigation}) => {
  const dispatch = useDispatch();
  const [photos, setPhotos] = useState([]);
  const [galleryCursor, setGalleryCursor] = useState(null);
  const [last, setLast] = useState(false);
  const [array, setArray] = useState([]);
  const {Images, Fonts, Colors} = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftButton
          onPress={() => {
            dispatch(setInitialFriends());
            dispatch(setInitialWriting());
            navigation.pop();
          }}
          close={true}
        />
      ),
    });
  });

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
    if (last) {
      return;
    }
    const params = {
      //이미지를 불러올 개수 (최신순으로)
      first: 50,
      assetType: 'All',
      ...(galleryCursor && {after: galleryCursor}),
    };
    try {
      //사진을 불러옵니다. edges는 gallery photo에 대한 정보
      const {edges, page_info} = await CameraRoll.getPhotos(params);
      if (page_info.has_next_page) {
        setGalleryCursor(page_info.end_cursor);
      } else {
        setLast(true);
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
      if (photos) {
        let b = photos;
        b = b.concat(arr);
        setPhotos(b);
      } else {
        setPhotos(arr);
      }
    } catch (error) {
      console.log('[takeStore getPhotos error occured] ', error);
    }
  };

  const isArrayContain = target => {
    let arr = array;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].accessUri === target.accessUri) {
        return true;
      }
    }
    return false;
  };

  const addArray = async target => {
    if (array && array.length >= 10) return;
    let newArr = [...array];
    if (!isArrayContain(target) && newArr.length <= 10) {
      newArr.push(target);
      setArray(newArr);
    }
  };

  const findArrayIdx = target => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].accessUri === target.accessUri) return i + 1;
    }
    return -1;
  };
  const removeTargetFromArray = target => {
    let arr = array;
    let i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i].accessUri === target.accessUri) {
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
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.screenBackground,
      }}>
      {/* 갤러리 사진 */}

      <FlatList
        data={photos}
        onEndReached={getGalleryPhotos} // 스크롤이 끝나면 사진 불러오기 함수 호출
        onEndReachedThreshold={0.5}
        renderItem={({item}) => (
          <View style={{backgroundColor: Colors.screenBackground}}>
            <Pressable
              onPress={() =>
                watchPreview(Platform.OS === 'ios' ? item.accessUri : item.uri)
              }>
              <Image
                source={{
                  uri: item.accessUri,
                }}
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
                  height: responsiveWidth(20),
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
                  height: responsiveWidth(20),
                  borderRadius: responsiveWidth(100),
                  backgroundColor: Colors.buttonSecondContent,
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
        numColumns={4}
        style={{backgroundColor: Colors.screenBackground, flex: 1}}
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
          onPress={() => {
            dispatch(saveMedia({media: array}));
            navigation.navigate('WriteContent', {mediaFiles: array});
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Medias;
