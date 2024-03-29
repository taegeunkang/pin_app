import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Pressable,
  Modal,
  TouchableOpacity,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import {reIssue} from '../../utils/login';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {setInitialPost, appendPost} from '../../store/post';
import {setLikeCount, likeToggle} from '../../store/post';
// 게시글 없을 때 check

const UserPage = ({navigation, route}) => {
  let {userId} = route.params;

  const {t} = useTranslation('myPage');
  const {Fonts, Colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [modlaVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [followLoading, setFollowLoading] = useState(false);
  const [f, setF] = useState(-1);
  const [open, setOpen] = useState(false);
  const postList = useSelector(state => state.post.post);
  const dispatch = useDispatch();

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(
      API_URL + `/post/find/all?userId=${userId}&page=${page + 1}&size=${20}`,
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
        if (r.length > 0) setPage(page + 1);
        dispatch(appendPost({userId: userId, post: r}));
        break;
      case 400:
        const k = await response.json();
        switch (k['code']) {
          case 'U08':
            await reIssue();
            await fetchData();
            break;
        }
        break;
    }

    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    await getProfile();
    await initData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  // 사용자의 포스트 목록 조회
  const initData = async () => {
    setLoading(true);
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
        dispatch(setInitialPost({userId: userId, post: r}));
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
    const response = await fetch(API_URL + `/post/like?postId=${postId}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    });

    if (response.status == 200) {
      const r = await response.json();
      dispatch(setLikeCount({userId: userId, postId: postId, count: r}));
      dispatch(likeToggle({userId: userId, postId: postId}));
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

  const followStatus = () => {
    switch (userInfo.followStatus) {
      case 3:
        return <ProfileButton title={'언팔로잉'} onPress={follow} />;
      case 2:
        return <FollowButton title={'맞팔하기'} onPress={follow} />;
      case 1:
        return <FollowButton title={'팔로잉'} onPress={follow} />;
      case 0:
        return (
          <ProfileButton
            title={'프로필 편집'}
            onPress={() => setModalVisible(true)}
          />
        );
    }
  };

  const moveToDetail = async post => {
    if (open) return;

    setOpen(true);
    navigation.push('Detail', {
      ...post,
      userId: userId,
      before: 'MyPage',
      open: setOpen,
    });
  };

  const follow = async () => {
    setFollowLoading(true);
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
        a.follower = a.follower + 1;
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.contentBackground,
      alignItems: 'center',
    },
    backgroundImage: {
      height: responsiveHeight(200),
      width: '100%',
    },
    profileContainer: {
      height: responsiveHeight(110),
      width: responsiveWidth(370),
      backgroundColor: Colors.contentBackground,
    },
    profileImage: {
      width: responsiveWidth(75),
      height: responsiveWidth(75),
      borderRadius: responsiveWidth(12),
      marginTop: responsiveHeight(-40),
      borderWidth: responsiveWidth(3),
      borderColor: Colors.contentBackground,
      marginRight: responsiveWidth(10),
    },
    nickname: {
      marginBottom: responsiveHeight(10),
      color: Colors.textBold,
    },
  });
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
      </Modal>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            style={{backgroundColor: Colors.contentBackground}}
          />
        }
        onScroll={({nativeEvent}) => {
          if (loading) return;

          const isCloseToBottom =
            nativeEvent.layoutMeasurement.height +
              nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - responsiveHeight(50);
          if (isCloseToBottom) {
            fetchData();
          }
        }}
        scrollEventThrottle={400}
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: Colors.screenBackground,
        }}>
        <FastImage
          source={{
            uri:
              API_URL + `/user/profile/image?watch=${userInfo.backgroundImg}`,
            priority: FastImage.priority.high,
          }}
          style={styles.backgroundImage}
        />
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            backgroundColor: Colors.contentBackground,
          }}>
          <View style={styles.profileContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginBottom: responsiveHeight(5),
              }}>
              <FastImage
                source={{
                  uri:
                    API_URL +
                    `/user/profile/image?watch=${userInfo.profileImg}`,
                  priority: FastImage.priority.high,
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
                <Text
                  style={[
                    {marginRight: 5, color: Colors.textBold},
                    Fonts.contentMediumRegular,
                  ]}>
                  {t('profile.posts')}
                </Text>
                <Text
                  style={[Fonts.contentRegularBold, {color: Colors.textBold}]}>
                  {formatNumber(userInfo.post)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  navigation.push('FollowerList', {userId: userId});
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginRight: responsiveWidth(30),
                }}>
                <Text
                  style={[
                    {marginRight: 5, color: Colors.textBold},
                    Fonts.contentMediumRegular,
                  ]}>
                  {t('profile.follower')}
                </Text>
                <Text
                  style={[Fonts.contentRegularBold, {color: Colors.textBold}]}>
                  {formatNumber(userInfo.follower)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
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
                    {marginRight: responsiveWidth(5), color: Colors.textBold},
                    Fonts.contentMediumRegular,
                  ]}>
                  {t('profile.following')}
                </Text>
                <Text
                  style={[Fonts.contentRegularBold, {color: Colors.textBold}]}>
                  {formatNumber(userInfo.following)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{marginBottom: responsiveHeight(5)}} />
        {postList[userId] &&
          postList[userId].map((post, index) => {
            return (
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
                thumbsUp={thumbsUp}
                mention={post.mention}
                onPress={() => moveToDetail(post)}
              />
            );
          })}
        {postList.length == 0 && (
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={[Fonts.contentMediumMedium, {color: Colors.textNormal}]}>
              게시글이 존재하지 않습니다.
            </Text>
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

export default UserPage;
