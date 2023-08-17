import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
} from 'react-native';
import Sample1 from '../../theme/assets/images/sample/sample1.png';
import Sample2 from '../../theme/assets/images/sample/sample2.png';
import Sample3 from '../../theme/assets/images/sample/sample3.png';
import Sample4 from '../../theme/assets/images/sample/sample4.png';
import Sample5 from '../../theme/assets/images/sample/sample5.png';
import {FontSize} from '../../theme/Variables';
import Cells from '../../theme/assets/images/table-cells-solid.svg';

import {WithLocalSvg} from 'react-native-svg';
import {useSSR, useTranslation} from 'react-i18next';
import ProfileButton from '../../components/mypage/ProfileButton';
import {useTheme} from '../../hooks';
import PostBox from '../../components/mypage/PostBox';
import {useState, useEffect} from 'react';
import FollowButton from '../../components/mypage/FollowButton';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
// 게시글 없을 때 check

const MyPage = ({navigation}) => {
  const {t} = useTranslation('myPage');
  const {Fonts} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const onRefresh = () => {
    setRefreshing(true);

    // 햅틱 피드백 발생
    // const options = {
    //   enableVibrateFallback: true,
    //   ignoreAndroidSystemSettings: false,
    // };
    // RNHapticFeedback.trigger('impactMedium', options);

    // 여기서 데이터를 새로 고치는 로직을 추가합니다.
    // 예를 들면 아래와 같이 2초 후에 로딩을 중지할 수 있습니다.
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const fetchData = async () => {
    setLoading(true);

    // 예: API에서 데이터를 가져오는 코드
    // const response = await fetch(`YOUR_API_URL?page=${page}`);
    // const result = await response.json();

    // setData(prevData => [...prevData, ...result]);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
    // setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
        <Image source={Sample1} style={styles.backgroundImage} />
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
              <Image source={Sample5} style={styles.profileImage} />
              <ProfileButton title={t('profile.edit')} />
              {/* <FollowButton title={'팔로잉'} /> */}
            </View>
            <Text style={[styles.nickname, Fonts.contentMediumBold]}>
              noisy_loud_dean
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
                <Text style={[{marginRight: 5}, Fonts.contentRegularBold]}>
                  {t('profile.posts')}
                </Text>
                <Text style={Fonts.contentMediumRegular}>
                  {formatNumber(13)}
                </Text>
              </View>

              <Pressable
                onPress={() => navigation.navigate('FollowerList')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginRight: responsiveWidth(30),
                }}>
                <Text style={[{marginRight: 5}, Fonts.contentRegularBold]}>
                  {t('profile.follower')}
                </Text>
                <Text style={Fonts.contentMediumRegular}>
                  {formatNumber(13)}
                </Text>
              </Pressable>
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
                onPress={() => navigation.navigate('FollowingList')}>
                <Text
                  style={[
                    {marginRight: responsiveWidth(5)},
                    Fonts.contentRegularBold,
                  ]}>
                  {t('profile.following')}
                </Text>
                <Text style={Fonts.contentMediumRegular}>
                  {formatNumber(13)}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={{marginBottom: responsiveHeight(10)}} />
        <PostBox />
        <PostBox />
        <PostBox />

        {loading && <ActivityIndicator />}
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
    return num.toString();
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

export default MyPage;
