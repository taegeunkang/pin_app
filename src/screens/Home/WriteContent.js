import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  TouchableOpacity,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {toByteArray} from 'base64-js';
import {useIsFocused} from '@react-navigation/native';
import Sample1 from '../../theme/assets/images/sample/sample1.png';
import Tag from '../../components/Content/Tag';
import {WithLocalSvg} from 'react-native-svg';
import {BorderRadius, FontSize} from '../../theme/Variables';
import RightArrow from '../../theme/assets/images/arrow-right-solid.svg';
import Plus from '../../theme/assets/images/plus-solid.svg';
import Geolocation from '@react-native-community/geolocation';
import {Buffer} from 'buffer';
import {Switch} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import GpsAlert from '../../components/Content/GpsAlert';
const WriteContent = ({navigation, route}) => {
  const [text, setText] = useState('');
  const [texting, setTexting] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [submitAva, setSubmitAva] = useState(false);
  const [rotation] = useState(new Animated.Value(0));
  const [toValue, setToValue] = useState(45);
  const [tagging, setTagging] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [multiple, setMultiple] = useState(false);
  const [gpsPermission, setGpsPermission] = useState(false);

  const isFocused = useIsFocused();
  // 사진 미니미 + 게시글 작성
  // 위치 지정
  // 함꼐한 친구 추가
  // 작성 버튼
  const {t} = useTranslation('newPost');
  const getLocationName = () => {
    try {
      if (route.params.locationName) {
        setLocationName(route.params.locationName);
        return route.params.locationName;
      }
    } catch {
      return '';
    }
  };

  const check = () => {
    if (text && locationName) {
      setSubmitAva(false);
    } else {
      setSubmitAva(true);
    }
  };

  const moveToFindingLocation = () => {
    navigation.navigate('FindingLocation');
  };
  // 포스트 제출
  // API_URL + "/post/create"
  const submitPost = async () => {
    // const lat = await AsyncStorage.getItem('lat');
    // const lon = await AsyncStorage.getItem('lon');
    // const arr = [];
    // const parsedImages = JSON.parse(await AsyncStorage.getItem('images'));
    // for (let i = 0; i < parsedImages.length; i++) {
    //   let res = base64ToBlob(parsedImages[i]);
    //   console.log(res);
    //   arr.push(res);
    // }
    // let bd = new FormData();
    // bd.append('content', text);
    // bd.append('photoFiles', arr);
    // bd.append('lat', lat);
    // bd.append('lon', lon);
    // bd.append('isPrivate', isPrivate);
    // bd.append('tags', tags);
    // console.log('Bearer ' + (await AsyncStorage.getItem('token')));
    // console.log(text);
    // console.log(lat);
    // console.log(lon);
    // console.log(isPrivate);
    // console.log(tags);
    // const response = await fetch(API_URL + '/post/create', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
    //     'Content-Type': 'multipart/form-data',
    //   },
    //   body: bd,
    // });
    // if (response.status != 200) {
    //   Alert('알 수 없는 에러가 발생했습니다.');
    // }
    // navigation.reset({routes: [{name: 'Home'}]});
  };
  const onChangeTyping = e => {
    setText(e);
    // text가 비었는지 체크 -> for re-render
    if (e.length >= 1) {
      setTexting(true);
    } else {
      setTexting(false);
    }
  };
  const rotateComponent = () => {
    Animated.timing(rotation, {
      toValue: toValue,
      duration: 300, // Adjust the duration as per your preference
      useNativeDriver: true,
    }).start();

    setToValue(toValue == 0 ? 45 : 0);
    setTagging(!tagging);
  };
  const inputTag = () => {
    let tagsVar = tags;

    tagsVar.push(tagInput);
    setTags(tagsVar);
    setTagInput('');
  };
  const loadImages = async () => {
    const storedImages = await AsyncStorage.getItem('images');
    const parsedImages = JSON.parse(storedImages);
    console.log(parsedImages[0]);
    setImages(parsedImages);
    if (parsedImages.length > 1) {
      setMultiple(true);
    }
  };

  const base64ToBlob = base64String => {
    return toByteArray(base64String);
  };

  useEffect(() => {
    const t = async () => {
      await loadImages();
    };
    check();
    getLocationName();
    t();
  }, [isFocused, locationName, tags, isPrivate, texting]);

  return (
    <View style={{flex: 1}}>
      <View style={styles.inptContainer}>
        {images && (
          <View style={styles.imageContainer}>
            {images.length > 1 && (
              <View
                style={{
                  width: 23,
                  height: 23,
                  borderRadius: 100,
                  backgroundColor: '#ececec',
                  position: 'absolute',
                  bottom: 15,
                  right: 15,
                  zIndex: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text>
                  {images.length < 10 ? '+' + (images.length - 1) : '+n'}
                </Text>
              </View>
            )}
            <Image
              style={{width: '100%', height: '100%'}}
              source={{uri: images[0]}}
            />
          </View>
        )}
        <View style={styles.inputTextContainer}>
          <View style={styles.inputBox}>
            <TextInput
              value={text}
              placeholder={t('write.content.placeholder')}
              multiline={true}
              style={{
                width: '100%',
                height: '100%',
                textAlignVertical: 'top',
                padding: 5,
              }}
              onChangeText={e => onChangeTyping(e)}
            />
          </View>
        </View>
      </View>

      <View style={{flex: 1, padding: 10}}>
        <View style={styles.listContent}>
          <Text style={{fontSize: FontSize.medium}}>위치</Text>
          <Text>{locationName}</Text>

          <TouchableOpacity onPress={moveToFindingLocation}>
            <View>
              <WithLocalSvg asset={Plus} width={20} height={20} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{width: '100%', flexDirection: 'column'}}>
          <View style={styles.listContent}>
            <Text style={{fontSize: FontSize.medium}}>태그</Text>
            {/* {AsyncStorage.getItem('currentLocation') && (
            <Text>{AsyncStorage.getItem('currentLocation')}</Text>
          )} */}

            <TouchableOpacity onPress={rotateComponent}>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: rotation.interpolate({
                        inputRange: [0, 45],
                        outputRange: ['0deg', '45deg'],
                      }),
                    },
                  ],
                }}>
                <WithLocalSvg asset={Plus} width={20} height={20} />
              </Animated.View>
            </TouchableOpacity>
          </View>
          {tagging && (
            <>
              <View style={{width: '100%'}}>
                <TextInput
                  value={tagInput}
                  onChangeText={e => setTagInput(e)}
                  style={{width: '100%'}}
                  placeholder="태그 입력(최대 20자)"
                  onSubmitEditing={inputTag}
                  maxLength={20}
                />
              </View>

              {/* <View style={{width: '100%', marginTop: 20, marginBottom: 20}}>
                <Text>
                  {tags.map((item, idx) => {
                    const colorSet = ['orange', 'red', 'blue', 'green'];
                    return (
                      <Tag
                        key={idx}
                        tagName={item}
                        bgColor={colorSet[idx % colorSet.length]}
                      />
                    );
                  })}
                </Text>
              </View> */}
            </>
          )}
          {tags && tags.length >= 1 && (
            <View style={{width: '100%', marginTop: 20, marginBottom: 20}}>
              <Text>
                {tags.map((item, idx) => {
                  const colorSet = ['orange', 'red', 'blue', 'green'];
                  return (
                    <Tag
                      key={idx}
                      tagName={item}
                      bgColor={colorSet[idx % colorSet.length]}
                    />
                  );
                })}
              </Text>
            </View>
          )}
        </View>
        {/* 친구 기능 추가 후 생성 */}
        {/* <View style={styles.listContent}>
          <Text style={{fontSize: FontSize.medium}}>함꼐한 친구</Text>
          <WithLocalSvg asset={RightArrow} width={20} height={20} />
        </View> */}
        <View style={styles.listContent}>
          <Text style={{fontSize: FontSize.medium}}>비공개</Text>
          <Switch
            value={isPrivate}
            onValueChange={() => setIsPrivate(!isPrivate)}
            color="gray"
          />
        </View>

        <View
          style={{
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 1,
          }}>
          <TouchableOpacity
            style={{
              width: '95%',
              height: 50,
              backgroundColor: '#bcbcbc',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            disabled={submitAva}
            onPress={submitPost}>
            <Text style={{fontSize: FontSize.medium}}>
              {t('write.content.upload')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={gpsPermission} animationType={'fade'} transparent={true}>
        <GpsAlert />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: Dimensions.get('window').width * 0.3333,
    height: Dimensions.get('window').width * 0.3333,
    borderRadius: BorderRadius.large,
    padding: 10,
    position: 'relative',
  },
  inptContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  inputTextContainer: {
    width: Dimensions.get('window').width * 0.6667,
    padding: 10,
    height: Dimensions.get('window').width * 0.3333,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.medium,
  },
  listContent: {
    width: '100%',
    height: 50,
    fontSize: FontSize.large,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: 'gray',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
});

export default WriteContent;
