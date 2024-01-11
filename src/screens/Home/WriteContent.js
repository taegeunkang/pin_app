import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  SafeAreaView,
  Alert,
  Pressable,
} from 'react-native';
import {useEffect, useRef, useState, useLayoutEffect} from 'react';
import {BorderRadius, FontSize} from '../../theme/Variables';
import Geolocation from '@react-native-community/geolocation';
import {Switch} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import SubmitButton from '../../components/SubmitButton';
import {useTheme} from '../../hooks';
import * as RNFS from 'react-native-fs';
import {reIssue} from '../../utils/login';
import HeaderLeftButton from '../../components/HeaderLeftButton';
import {useDispatch, useSelector} from 'react-redux';
import {updateNewPost} from '../../store/newPost';
import {setInitialWriting, saveText, savePrivate} from '../../store/writing';
import {setInitialFriends} from '../../store/friends';

const WriteContent = ({navigation, route}) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [gpsPermission, setGpsPermission] = useState(false);
  const {t} = useTranslation('newPost');
  const {Images, Fonts, Colors} = useTheme();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const writingContent = useSelector(state => state.writing.writing);
  const friendsList = useSelector(state => state.friends.friends);

  const inptRef = useRef(null);

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  const getAbsolutePath = async assetPath => {
    const destination = `${RNFS.TemporaryDirectoryPath}${Math.random()
      .toString(36)
      .substring(7)}.mp4`;
    try {
      let absolutePath = await RNFS.copyAssetsVideoIOS(
        assetPath,
        destination,
        0,
        0,
      );
      return absolutePath;
    } catch (error) {
      console.log(error);
    }
  };

  // 포스트 제출
  // API_URL + "/post/create"
  // 동영상 기능 추가해야함
  const submitPost = async () => {
    if (writingContent.text.trim().length == 0) {
      Alert.alert('내용을 입력해 주세요.');
      return;
    }
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    let m = []; // 미디어 파일들
    let thumbnails = [];
    formData.append('content', writingContent.text); // 글 내용
    if (writingContent.media) {
      for (let i = 0; i < writingContent.media.length; i++) {
        const med = writingContent.media[i];
        if (med.accessUri.substring(med.accessUri.length - 3) === 'mp4') {
          const absolutePath = await getAbsolutePath(med.uri);
          m.push({uri: absolutePath, type: 'video/mp4', name: `video${i}`});
          thumbnails.push({
            uri: med.accessUri,
            typ: 'image/png',
            name: `thumbnailFiles${i}`,
          });
        } else {
          m.push({uri: med.accessUri, type: 'image/png', name: `image${i}`});
        }
      }

      m.forEach((mm, index) => {
        formData.append('mediaFiles', mm);
      });

      thumbnails.forEach((t, index) => {
        formData.append('thumbnailFiles', t);
      });
    }
    console.log("위도/경도", writingContent.latitude, writingContent.longitude)
    formData.append('lat', writingContent.latitude); // latitude;
    formData.append('lon', writingContent.longitude); // lontitude;
    formData.append('locationName', writingContent.location);
    formData.append('isPrivate', isPrivate);
    if (friendsList) {
      let fff = [];
      for (let j = 0; j < friendsList.length; j++) {
        fff.push(friendsList[j].userId);
      }
      formData.append('mention', fff);
    }

    const response = await fetch(API_URL + '/post/create', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    });
    if (response.status == 200) {
      dispatch(updateNewPost({newState: true}));
      dispatch(setInitialFriends());
      dispatch(setInitialWriting());
      navigation.popToTop();
      setLoading(false);
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await submitPost(postId);
          break;
      }
    }

    setLoading(false);
  };

  const moveToFindingFriends = async () => {
    navigation.navigate('FindingFriends', {
      userId: await AsyncStorage.getItem('id'),
    });
  };

  const styles = StyleSheet.create({
    imageContainer: {
      width: responsiveWidth(100),
      height: responsiveHeight(100),
      borderRadius: responsiveWidth(12),
      marginRight: responsiveWidth(5),
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inptContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    listContent: {
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'column',
      marginBottom: responsiveHeight(10),
    },
    friendsList: {
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'column',
      marginBottom: responsiveHeight(10),
    },
    friendsImage: {
      width: responsiveWidth(35),
      height: responsiveWidth(35),
      borderRadius: responsiveWidth(8),
      marginRight: responsiveWidth(5),
    },
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.contentBackground}}>
      <View style={styles.inptContainer}>
        {writingContent.media && writingContent.media.length > 0 && (
          <>
            <ScrollView
              horizontal={true}
              style={{
                width: '100%',
                paddingHorizontal: responsiveWidth(10),
                height: responsiveHeight(115),
                paddingVertical: responsiveHeight(5),
              }}>
              {writingContent.media.map((m, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    style={{
                      width: responsiveWidth(95),
                      height: responsiveWidth(95),
                      borderRadius: responsiveWidth(12),
                    }}
                    source={{uri: m.uri}}
                  />
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* <View style={{marginTop: responsiveHeight(10)}} /> */}

        <View
          style={{
            width: '100%',
            height: responsiveHeight(180),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.screenBackground,
            marginBottom: responsiveHeight(20),
          }}>
          <TextInput
            value={writingContent.text}
            placeholder={t('write.content.placeholder')}
            placeholderTextColor={Colors.inputPlaceHolder}
            multiline={true}
            style={[
              Fonts.contentMediumMedium,
              {
                width: responsiveWidth(370),
                height: responsiveHeight(160),
                textAlignVertical: 'top',
                color: Colors.textNormal,
                backgroundColor: Colors.contentBackground,
                borderRadius: responsiveWidth(12),
                paddingVertical: responsiveHeight(10),
                paddingHorizontal: responsiveWidth(10),
              },
            ]}
            onChangeText={e => dispatch(saveText({text: e}))}
            ref={inptRef}
            maxLength={500}
          />
        </View>
      </View>

      <Pressable
        style={{flex: 1, paddingHorizontal: responsiveWidth(10)}}
        onPress={() => closeKeyboard()}>
        <View style={styles.listContent}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: responsiveHeight(5),
            }}>
            <Text style={[Fonts.contentMediumBold, {color: Colors.textBold}]}>
              위치
            </Text>
            <View
              style={{
                marginBottom: responsiveHeight(5),
              }}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('SearchLocation')}>
              <Image
                source={Images.plusBtn}
                style={{
                  width: responsiveWidth(25),
                  height: responsiveWidth(25),
                  marginLeft: responsiveWidth(5),
                }}
              />
            </TouchableOpacity>
          </View>
          {writingContent.location && (
            <Text
              style={[
                Fonts.contentMediumRegualr,
                {
                  color: Colors.textNormal,
                },
              ]}>
              {writingContent.location}
            </Text>
          )}
        </View>

        <View style={styles.friendsList}>
          <View
            style={{flexDirection: 'row', marginBottom: responsiveHeight(5)}}>
            <Text style={[Fonts.contentMediumBold, {color: Colors.textBold}]}>
              함께한 친구
            </Text>
            <TouchableOpacity onPress={moveToFindingFriends}>
              <Image
                source={Images.plusBtn}
                style={{
                  width: responsiveWidth(25),
                  height: responsiveWidth(25),
                  // marginTop: responsiveHeight(2),
                  marginLeft: responsiveWidth(5),
                }}
              />
            </TouchableOpacity>
          </View>
          {friendsList.map((u, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginBottom: responsiveHeight(5),
              }}>
              <Image
                source={{
                  uri: API_URL + `/user/profile/image?watch=${u.profileImg}`,
                }}
                style={styles.friendsImage}
              />
              <Text
                style={[Fonts.contentMediumMedium, {color: Colors.textNormal}]}>
                {u.nickname}
              </Text>
            </View>
          ))}
        </View>

        {/* 친구 기능 추가 후 생성 */}
        {/* <View style={styles.listContent}>
          <Text style={{fontSize: FontSize.medium}}>함꼐한 친구</Text>
          <WithLocalSvg asset={RightArrow} width={20} height={20} />
        </View> */}
        <View style={styles.listContent}>
          <Text
            style={[
              Fonts.contentMediumBold,
              {color: Colors.textBold, marginBottom: responsiveHeight(5)},
            ]}>
            비공개
          </Text>
          <Switch
            value={writingContent.private}
            onValueChange={() =>
              dispatch(savePrivate({isPrivate: !writingContent.private}))
            }
            color={Colors.buttonSecondContent}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: responsiveHeight(10),
          }}>
          <SubmitButton title={'완료'} onPress={submitPost} loading={loading} />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default WriteContent;
