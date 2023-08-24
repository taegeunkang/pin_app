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
} from 'react-native';
import Edit from '../../components/Content/Edit';
import React from 'react';
import {useSSR, useTranslation} from 'react-i18next';
import ProfileButton from '../../components/mypage/ProfileButton';
import {useTheme} from '../../hooks';
import PostBox from '../../components/mypage/PostBox';
import {useState, useEffect} from 'react';
import FollowButton from '../../components/mypage/FollowButton';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import GpsAlert from '../../components/Content/GpsAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import {useFocusEffect} from '@react-navigation/native';
import {reIssue} from '../../utils/login';
// 게시글 없을 때 check

const UserPage1 = ({navigation, route}) => {
  const {t} = useTranslation('myPage');
  const {Fonts} = useTheme();
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [modlaVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [id, setId] = useState(null);
  const [postList, setPostList] = useState([]);
  const [isPopped, setIsPopped] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [f, setF] = useState(-1);
  useFocusEffect(
    React.useCallback(() => {
      if (isPopped) {
        // pop 후에만 실행할 동작
        initData();
        setIsPopped(false);
      }
    }, [isPopped]), // isPopped 의존성을 추가
  );

  const onRefresh = async () => {
    setRefreshing(true);

    // 햅틱 피드백 발생
    // const options = {
    //   enableVibrateFallback: true,
    //   ignoreAndroidSystemSettings: false,
    // };
    // RNHapticFeedback.trigger('impactMedium', options);

    // 여기서 데이터를 새로 고치는 로직을 추가합니다.
    setPage(0);
    setPostList([]);
    await getProfile();
    await initData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  // 사용자의 포스트 목록 조회
  const initData = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem('homeId');
    const response = await fetch(
      API_URL + `/post/find/all?userId=${userId}&page=${0}&size=${20}`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        },
      },
    );

    switch (response.status) {
      case 200:
        let r = await response.json();

        for (let a = 0; a < r.length; a++) {
          console.log(r[a]);
        }
        setPostList(r);
        break;
      case 400:
        const k = await response.json();
        switch (k['code']) {
          case 'U08':
            await reIssue();
            await initData();
        }
        break;
    }

    setLoading(false);
  };
  const getProfile = async () => {
    const userId = await AsyncStorage.getItem('homeId');
    setUserId(userId);
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
      setF(r.followStatus);
      // status 3 -> 맞팔, 내가 팔로잉
      // 2 상대방이 나를 팔로잉
      // 1 양쪽다 언팔
      // 0 내 페이지
      setUserInfo(r);
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await getProfile();
          break;
      }
    }
  };

  const thumbsUp = async postId => {
    console.log(postId);
    const response = await fetch(API_URL + `/post/like?postId=${postId}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    });

    if (response.status == 200) {
      const r = await response.json();
      likeRefreshPost(postId, r);
      return r;
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await thumbsUp(postId);
          break;
      }
    }
  };

  const likeRefreshPost = (postId, likeCount) => {
    let tmp = postList;
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].postId == postId) {
        tmp[i].likesCount = likeCount;
      }
    }
    setPostList(tmp);
  };
  const followStatus = () => {
    switch (userInfo.followStatus) {
      case 3:
        return <ProfileButton title={'언팔로잉'} onPress={follow} />;
      case 2:
        return <FollowButton title={'맞팔하기'} onPress={follow} />;
      case 1:
        return <FollowButton title={'팔로잉'} onPress={follow} />;
    }
  };

  const follow = async () => {
    setFollowLoading(true);
    const userId = await AsyncStorage.getItem('homeId');
    const response = await fetch(API_URL + `/user/follow?userId=${userId}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    });
    if (response.status == 200) {
      const r = await response.json();
      let a = userInfo;
      // 현재 1인데 3-> 팔로워 + 1
      // 현재 3인데 2 -> 팔로잉 - 1
      // 현재 3인데 1 -> 팔로워 - 1
      // 현재 2인데 3 ->  팔로워 + 1
      setF(r);
      a.followStatus = r;
      if (f == 1 && r == 3) {
        a.follower = a.follower + 1;
      } else if (f == 3 && r == 2) {
        a.follower = a.follower - 1;
      } else if (f == 3 && r == 1) {
        a.follower = a.follower - 1;
      } else if (f == 2 && r == 3) {
        console.log('팔로우 상태', a.follower);
        a.follower = a.follower + 1;
        console.log(a.follower);
      }

      setUserInfo(a);
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await follow();
          break;
      }
    }
    setFollowLoading(false);
  };

  useEffect(() => {
    getProfile();
    initData();
  }, []);

  useEffect(() => {
    // fetchData();
  }, [page]);

  return (
    <SafeAreaView style={[styles.container]}>
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
              {followStatus()}
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
        {postList.map((post, index) => (
          <PostBox
            key={index}
            postId={post.postId}
            writerName={post.nickname}
            writerProfileImage={post.profileImage}
            content={post.content}
            mediaFiles={post.mediaFiles}
            locationName={post.locationName}
            isLiked={post.liked}
            likeCount={post.likesCount}
            commentCount={post.commentsCount}
            createdDate={post.createdDate}
            mention={post.mention}
            onPress={() => {
              navigation.navigate('Detail', {
                ...post,
                onLikePress: thumbsUp,
                userId: id,
                reload: () => setIsPopped(true),
              });
            }}
            thumbsUp={thumbsUp}
          />
        ))}
        {postList.length == 0 && (
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={Fonts.contentMediumMedium}>
              게시글이 존재하지 않습니다.
            </Text>
          </View>
        )}

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

export default UserPage1;
