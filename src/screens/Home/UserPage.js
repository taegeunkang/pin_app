import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Sample1 from '../../theme/assets/images/sample/sample1.png';
import Sample5 from '../../theme/assets/images/sample/sample5.png';
import {FontSize} from '../../theme/Variables';
import Cells from '../../theme/assets/images/table-cells-solid.svg';
import Edit from '../../components/Content/Edit';
import {WithLocalSvg} from 'react-native-svg';
import {useSSR, useTranslation} from 'react-i18next';
import ProfileButton from '../../components/mypage/ProfileButton';
import {useTheme} from '../../hooks';
import PostBox from '../../components/mypage/PostBox';
import {useState, useEffect, useLayoutEffect} from 'react';
import FollowButton from '../../components/mypage/FollowButton';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import GpsAlert from '../../components/Content/GpsAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import HeaderLeftButton from '../../components/HeaderLeftButton';
// 게시글 없을 때 check

const UserPage = ({navigation, route}) => {
  const {userId} = route.params;
  const {t} = useTranslation('myPage');
  const {Fonts, Colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [modlaVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const onRefresh = async () => {
    setRefreshing(true);

    // 햅틱 피드백 발생
    // const options = {
    //   enableVibrateFallback: true,
    //   ignoreAndroidSystemSettings: false,
    // };
    // RNHapticFeedback.trigger('impactMedium', options);

    // 여기서 데이터를 새로 고치는 로직을 추가합니다.
    await getProfile();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const fetchData = async () => {
    setLoading(true);

    // 예: API에서 데이터를 가져오는 코드
    // const response = await fetch(`YOUR_API_URL?page=${page}`);
    // const result = await response.json();

    // setData(prevData => [...prevData, ...result]);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // setLoading(false);
  };
  const getProfile = async () => {
    const response = await fetch(
      API_URL + `/user/profile/info?userId=${userId}`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        },
      },
    );
    if (response.status == 200) {
      const r = await response.json();
      console.log(r);
      setUserInfo(r);
    }
    console.log(userId);
    console.log(response.status);
  };

  useEffect(() => {
    fetchData();
    getProfile();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <SafeAreaView style={[styles.container]}>
      {/* 헤더*/}
      <View
        style={{
          flexDirection: 'row',
          height: '5%',
          backgroundColor: Colors.white,
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
          onPress={() => navigation.pop()}>
          <HeaderLeftButton />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#1A1E27',
              fontFamily: 'SpoqaHanSansNeo-Bold',
              fontSize: responsiveWidth(14),
              lineHeight: responsiveHeight(24),
              letterSpacing: responsiveWidth(-0.6),
            }}>
            {userInfo.nickname}
          </Text>
        </View>
        <View style={{flex: 1}}></View>
      </View>

      <Modal visible={modlaVisible} animationType={'fade'} transparent={true}>
        <Edit
          setProfileImage={() => {
            setModalVisible(false);
            navigation.navigate('ProfileImage', {
              profileImg: userInfo.profileImg,
            });
          }}
          setBackgroundImage={() => {
            setModalVisible(false);
            navigation.navigate('BackgroundImage', {
              backgroundImg: userInfo.backgroundImg,
            });
          }}
          setNickname={() => {
            setModalVisible(false);
            navigation.navigate('Nickname');
          }}
          close={() => setModalVisible(false)}
        />
        {/* <GpsAlert onPress={() => setModalVisible(false)} /> */}
      </Modal>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4880EE"
            colors={['#4880EE']}
            style={{backgroundColor: '#FFFFFF'}}
          />
        }
        onScroll={({nativeEvent}) => {
          if (loading) return;

          const isCloseToBottom =
            nativeEvent.layoutMeasurement.height +
              nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - responsiveHeight(50);
          if (isCloseToBottom) {
            setPage(prevPage => prevPage + 1);
          }
        }}
        scrollEventThrottle={400}
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: '#F2F4F6',
        }}>
        <Image
          source={{
            uri:
              API_URL + `/user/profile/image?watch=${userInfo.backgroundImg}`,
          }}
          style={styles.backgroundImage}
        />
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
          }}>
          <View style={styles.profileContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginBottom: responsiveHeight(5),
              }}>
              <Image
                source={{
                  uri:
                    API_URL +
                    `/user/profile/image?watch=${userInfo.profileImg}`,
                }}
                style={styles.profileImage}
              />
              <ProfileButton
                title={t('profile.edit')}
                onPress={() => setModalVisible(true)}
              />
              {/* <FollowButton title={'팔로잉'} /> */}
            </View>
            <Text style={[styles.nickname, Fonts.contentMediumBold]}>
              {userInfo.nickname}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginRight: responsiveWidth(30),
                }}>
                <Text style={[{marginRight: 5}, Fonts.contentMediumRegular]}>
                  {t('profile.posts')}
                </Text>
                <Text style={Fonts.contentRegularBold}>
                  {formatNumber(userInfo.post)}
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  navigation.push('FollowerList', {userId: userId})
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginRight: responsiveWidth(30),
                }}>
                <Text style={[{marginRight: 5}, Fonts.contentMediumRegular]}>
                  {t('profile.follower')}
                </Text>
                <Text style={Fonts.contentRegularBold}>
                  {formatNumber(userInfo.follower)}
                </Text>
              </Pressable>
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
                onPress={() =>
                  navigation.push('FollowingList', {userId: userId})
                }>
                <Text
                  style={[
                    {marginRight: responsiveWidth(5)},
                    Fonts.contentMediumRegular,
                  ]}>
                  {t('profile.following')}
                </Text>
                <Text style={Fonts.contentRegularBold}>
                  {formatNumber(userInfo.following)}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={{marginBottom: responsiveHeight(10)}} />
        <PostBox onPress={() => navigation.navigate('Detail')} />
        <PostBox />
        <PostBox />

        {loading && (
          <View style={{marginVertical: responsiveHeight(20)}}>
            <ActivityIndicator color={'#4880EE'} size={'large'} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const formatNumber = num => {
  if (num >= 1e9) {
    // 1,000,000,000 이상 (십억 이상)
    return (num / 1e9).toFixed(1) + 'b';
  } else if (num >= 1e6) {
    // 1,000,000 이상 (백만 이상)
    return (num / 1e6).toFixed(1) + 'm';
  } else if (num >= 1e3) {
    // 1,000 이상
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return num;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  backgroundImage: {
    height: responsiveHeight(200),
    width: '100%',
  },
  profileContainer: {
    height: responsiveHeight(110),
    width: responsiveWidth(370),
    backgroundColor: '#FFFFFF',
  },
  profileImage: {
    width: responsiveWidth(75),
    height: responsiveHeight(75),
    borderRadius: responsiveWidth(12),
    marginTop: responsiveHeight(-40),
    borderWidth: responsiveWidth(3),
    borderColor: '#ffffff',
    marginRight: responsiveWidth(10),
  },
  nickname: {
    marginBottom: responsiveHeight(10),
  },
});

export default UserPage;
