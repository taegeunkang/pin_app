import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Edit from '../../components/Content/Edit';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import PostBox from '../../components/mypage/PostBox';
import ProfileButton from '../../components/mypage/ProfileButton';
import {useTheme} from '../../hooks';
import {API_URL} from '../../utils/constants';
import {reIssue} from '../../utils/login';
import {useDispatch, useSelector} from 'react-redux';
import {
  appendPost,
  likeToggle,
  setInitialPost,
  setLikeCount,
} from '../../store/post';
// 게시글 없을 때 check

const MyPage = ({navigation}) => {
  const {t} = useTranslation('myPage');
  const {Fonts, Colors, Images} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [modlaVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [id, setId] = useState(null);

  const [reloadLoading, setReloadLoading] = useState(false);

  const postList = useSelector(state => state.post.post);
  const dispatch = useDispatch();

  const reload = async postid => {
    if (reloadLoading) return;
    // 게시글 삭제 후 state에서 삭제
    // 리덕스로 교체 후 바꿈
    setReloadLoading(true);
    // setIsPopped(true);
    let a = postList;
    let b = [];
    for (let i = 0; i < a.length; i++) {
      if (a[i].postId == postid) {
        continue;
      }
      b.push(a[i]);
    }
    setPostList(b);

    let c = userInfo;
    c.post = c.post - 1;
    setUserInfo(c);
    setReloadLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);

    // 여기서 데이터를 새로 고치는 로직을 추가합니다.
    setPage(0);
    await getProfile();
    await initData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
      dispatch(setLikeCount({postId: postId, count: r}));
      dispatch(likeToggle({postId: postId}));

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

  // 사용자의 포스트 목록 조회
  const initData = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem('id');
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
        console.log('db 데이터 ', r);
        dispatch(setInitialPost({post: r}));
        break;
      case 400:
        const k = await response.json();
        switch (k['code']) {
          case 'U08':
            await reIssue();
            await initData();
            break;
        }
        break;
    }

    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem('id');
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
        dispatch(appendPost(r));
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
  const getProfile = async () => {
    const id = await AsyncStorage.getItem('id');
    setId(id);
    const response = await fetch(API_URL + `/user/profile/info?userId=${id}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    });
    if (response.status == 200) {
      const r = await response.json();
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
      height: responsiveHeight(120),
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

              <Pressable
                onPress={() =>
                  navigation.navigate('FollowerList', {userId: id})
                }
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
                  style={(Fonts.contentRegularBold, {color: Colors.textBold})}>
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
                  navigation.navigate('FollowingList', {userId: id})
                }>
                <Text
                  style={[
                    {marginRight: responsiveWidth(5), color: Colors.textBold},
                    Fonts.contentMediumRegular,
                  ]}>
                  {t('profile.following')}
                </Text>
                <Text
                  style={(Fonts.contentRegularBold, {color: Colors.textBold})}>
                  {formatNumber(userInfo.following)}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={{marginBottom: responsiveHeight(5)}} />
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
            thumbsUp={thumbsUp}
            mention={post.mention}
            onPress={() => {
              navigation.push('Detail', {
                ...post,
                userId: id,
                before: 'MyPage',
              });
            }}
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

export default MyPage;
