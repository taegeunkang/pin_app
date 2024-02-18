import {
  View,
  Text,
  StyleSheet,
  Image,
  RefreshControl,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../hooks';
import {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {Slider} from '../../components/Content/Slider';
import Comment from '../../components/mypage/Comment';
import CommentComment from '../../components/mypage/CommetComment';
import {API_URL} from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditComment from '../../components/Content/EditComment';
import {reIssue} from '../../utils/login';
import FastImage from 'react-native-fast-image';
import {getUtcPlus9Time, timeAgo} from '../../utils/util';
import HeaderLeftButton from '../../components/HeaderLeftButton';
import {
  likeToggle,
  setLikeCount,
  setCommentCount,
  appendPost,
} from '../../store/post';
import {useDispatch, useSelector} from 'react-redux';
import {removeMapPost} from '../../store/map';
import {updateNewPost} from '../../store/newPost';

const Detail = ({navigation, route}) => {
  const {postId, userId, before, open} = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftButton
          onPress={() => {
            if (open) open(false);
            navigation.pop();
          }}
          close={before == 'Home' || before == 'Alram' ? true : false}
        />
      ),
    });
  });

  // 사용자 정보
  const [myId, setMyId] = useState('');
  const [myNickname, setMyNickname] = useState('');
  const [myProfileImage, setMyProfileImage] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [replyList, setReplyList] = useState({});
  const [page, setPage] = useState(-1);
  const [inpt, setInpt] = useState('');
  const [modlaVisible, setModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState(-1);
  const [selectedReply, setSelectedReply] = useState(-1);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [reply, setReply] = useState(null);
  const [replyPage, setReplyPage] = useState({});
  const [replyLoading, setReplyLoading] = useState(false);
  const {Colors, Fonts, Images} = useTheme();
  const inptRef = useRef(null);
  const [postDetail, setPostDetail] = useState({});
  const post = useSelector(state => state.post.post);
  const userPost = post[userId]
    ? post[userId].filter(item => item.postId == postId)[0]
    : {};

  const findPostByPostId = async () => {
    if (post[userId]) {
      for (let i = 0; i < post[userId].length; i++) {
        if (post[userId][i].postId == postId) {
          console.log('이미 있음');
          console.log(post[userId][i]);
          return post[userId][i];
        }
      }
    }

    const response = await fetch(API_URL + `/post/find?id=${postId}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    });
    if (response.status == 200) {
      const r = await response.json();
      console.log('여기임');
      console.log(r);
      dispatch(appendPost({userId: userId, post: r}));
      return r;
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await findPostByPostId();
          break;
      }
    } else if (response.status == 500) {
      const k = await response.json();
      switch (k['code']) {
        case 'P01':
          Alert('게시글이 존재하지 않습니다.');
          navigation.pop();
          break;
      }
    }
  };

  // redux dispatcher
  const dispatch = useDispatch();

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

  const onRefresh = () => {
    setRefreshing(true);
    fetchComment(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const onLike = async () => {
    const r = await thumbsUp(postId);
    console.log(r);
  };
  // 댓글 조회
  const fetchComment = async isRefresh => {
    if (loading) return;
    setLoading(true);
    const response = await fetch(
      API_URL +
        `/post/comment?postId=${postId}&page=${
          isRefresh ? 0 : page + 1
        }&size=${20}`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        },
      },
    );

    if (response.status == 200) {
      const r = await response.json();
      if (page == -1 || isRefresh) {
        setCommentList(r);
        dispatch(
          setCommentCount({userId: userId, postId: postId, count: r.length}),
        );
      } else {
        let a = commentList;
        a = a.concat(r);
        setCommentList(a);
        dispatch(
          setCommentCount({userId: userId, postId: postId, count: a.length}),
        );
      }
      if (r.length > 0 && !isRefresh) {
        setPage(page + 1);
      } else if (isRefresh) {
        setPage(-1);
      }
    } else if (response.status == 400) {
      const k = await response.json();

      switch (k['code']) {
        case 'P01':
          Alert.alert('게시글이 존재하지 않음', '게시글이 존재하지 않습니다.');
          navigation.pop();
        case 'U08':
          await reIssue();
          await fetchComment(isRefresh);
          break;
      }
    } else if (response.status == 500) {
      const k = await response.json();

      switch (k['code']) {
        case 'P01':
          Alert.alert('게시글이 존재하지 않음', '게시글이 존재하지 않습니다.');
          navigation.pop();
          break;
      }
    }
    setLoading(false);
  };

  const submitComment = async () => {
    if (!inpt || inpt.length == 0) return;
    const bodyItem = {postId: postId, content: inpt};
    if (reply) bodyItem.replyId = reply;
    const response = await fetch(API_URL + '/post/comment/write', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyItem),
    });

    if (response.status == 200) {
      // 새로고침하기 전에 수동으로 댓글을 넣어둠
      // 댓글일 때
      const cId = await response.json();
      if (!reply) {
        let a = commentList;
        let b = {
          commentId: cId,
          content: inpt,
          writer: myNickname,
          writerId: myId,
          profileImage: myProfileImage,
          replyCount: 0,
          createdDate: getUtcPlus9Time().toString(),
        };
        a = a.concat(b);
        setCommentList(a);
      } else {
        // 대댓글
        let c = replyList;
        if (!c[reply]) c[reply] = [];
        let d = {
          commentId: cId,
          content: inpt,
          writer: myNickname,
          writerId: myId,
          profileImage: myProfileImage,
          createdDate: getUtcPlus9Time().toString(),
        };
        c[reply] = c[reply].concat(d);
        setReplyList(c);
      }

      dispatch(
        setCommentCount({
          userId: userId,
          postId: postId,
          count: postDetail.commentsCount + 1,
        }),
      );
      setInpt('');
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await submitComment();
          break;
      }
    }
  };
  const deleteComment = async () => {
    const response = await fetch(
      API_URL + `/post/comment/delete?replyId=${selectedComment}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status == 200) {
      let a = [];
      for (let i = 0; i < commentList.length; i++) {
        if (commentList[i].commentId == selectedComment) {
          continue;
        }
        a.push(commentList[i]);
      }
      setSelectedComment(-1);
      setCommentList(a);
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await deleteComment();
          break;
      }
    }
  };

  const deleteReply = async () => {
    const response = await fetch(
      API_URL + `/post/comment/delete?replyId=${selectedReply}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status == 200) {
      let tt = replyList;
      let b = [];
      for (let i = 0; i < replyList[selectedComment].length; i++) {
        if (replyList[selectedComment][i].commentId == selectedReply) {
          continue;
        }
        b.push(replyList[selectedComment][i]);
      }
      tt[selectedComment] = b;
      // 대댓 수 1개 감소
      let tt1 = commentList;
      for (let j = 0; j < tt1.length; j++) {
        if (tt1[j].commentId == selectedComment) {
          tt1[j].replyCount = tt1[j].replyCount - 1;
        }
      }

      setCommentList(tt1);
      setSelectedComment(-1);
      setSelectedReply(-1);
      setReplyList(tt);
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await deleteReply();
          break;
      }
    }
  };

  const deletePost = async () => {
    const response = await fetch(API_URL + `/post/delete?id=${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        'Content-Type': 'application/json',
      },
    });
    if (response.status == 200) {
      dispatch(removeMapPost({userId: userId, postId: postId}));
      dispatch(removeMapPost({postId: postId}));
      dispatch(updateNewPost({newState: true}));

      navigation.pop();
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await deletePost();
          break;
      }
    }
  };

  const getReply = async commentId => {
    setReplyLoading(true);
    if (!replyPage[commentId]) {
      // 첫 호출이라면 페이지 초기화
      let a = replyPage;
      a[commentId] = 0;
      setReplyPage(a);
    }

    const response = await fetch(
      API_URL +
        `/post/comment/reply?postId=${postId}&replyId=${commentId}&page=${
          replyPage[commentId]
        }&size=${20}`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        },
      },
    );
    if (response.status == 200) {
      const r = await response.json();
      // 페이지 늘림
      let b = replyPage;
      b[commentId] = b[commentId] + 1;
      setReplyPage(b);

      if (!replyList[commentId]) {
        let c = replyList;
        c[commentId] = r;
        setReplyList(c);
      } else {
        let c1 = replyList;
        c1[commentId] = c1[commentId].concat(r);
        setReplyList(c1);
      }
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await getReply(commentId);
          break;
      }
    }

    setReplyLoading(false);
  };
  const init = async () => {
    setMyId(await AsyncStorage.getItem('id'));
    setMyNickname(await AsyncStorage.getItem('myNickname'));
    setMyProfileImage(await AsyncStorage.getItem('myProfileImage'));
    const r = await findPostByPostId();
    setPostDetail(r);

    await fetchComment();
  };
  useEffect(() => {
    const t = async () => {
      await init();
    };
    t();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.contentBackground,
      alignItems: 'center',
      marginBottom: responsiveHeight(10),
    },
    postContainer: {width: responsiveWidth(370)},
    writerImage: {
      width: responsiveWidth(30),
      height: responsiveWidth(30),
      borderRadius: responsiveWidth(8),
      marginRight: responsiveWidth(5),
    },
    writerBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: responsiveHeight(45),
    },
    media: {
      width: responsiveWidth(35),
      height: responsiveHeight(35),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.buttonThirdBackground,
      borderRadius: responsiveWidth(10),
      marginRight: responsiveWidth(5),
    },

    loginInput: {
      height: responsiveHeight(48),
      width: responsiveWidth(370),
      borderRadius: responsiveWidth(12),
      backgroundColor: Colors.screenBackground,
      paddingHorizontal: responsiveWidth(10),
      color: Colors.textNormal,
    },
  });

  const MoreFriends = ({count}) => {
    return (
      <TouchableOpacity
        style={{
          width: responsiveWidth(25),
          height: responsiveHeight(25),
          borderRadius: responsiveWidth(8),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.buttonThirdBackground,
          marginRight: responsiveWidth(5),
        }}>
        <Text
          style={{
            fontFamily: 'SpoqaHanSansNeo-Bold',
            fontSize: responsiveWidth(12),
            lineHeight: responsiveHeight(18),
            letterSpacing: responsiveWidth(-0.6),
            color: Colors.buttonThirdContent,
          }}>
          {'+' + count}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        width: Dimensions.get('screen').width,
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
      }}
      behavior="padding"
      enabled
      keyboardVerticalOffset={90}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.contentBackground,
          alignItems: 'center',
        }}>
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
              nativeEvent.contentSize.height - responsiveHeight(10);
            if (isCloseToBottom) {
              fetchComment();
            }
          }}
          scrollEventThrottle={400}
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: Colors.contentBackground,
          }}>
          <View style={styles.container}>
            <View style={styles.postContainer}>
              <View style={styles.writerBox}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('UserPage', {userId: userId});
                    }}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FastImage
                      source={{
                        uri:
                          API_URL +
                          `/post/image?watch=${postDetail.profileImage}`,
                        priority: FastImage.priority.high,
                      }}
                      style={styles.writerImage}
                    />
                    <Text
                      style={[
                        Fonts.contentMediumBold,
                        {
                          marginRight: responsiveWidth(5),
                          color: Colors.textNormal,
                        },
                      ]}>
                      {postDetail.nickname}
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={[
                      Fonts.contentRegualrMedium,
                      {color: Colors.textNormal},
                    ]}>
                    {timeAgo(postDetail.createdDate)}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {postDetail.mention && postDetail.mention && (
                    <Pressable
                      onPress={() => {
                        navigation.push('DetailMention', {
                          friends: postDetail.mention,
                        });
                      }}
                      style={{
                        flexDirection: 'row',
                      }}>
                      {postDetail.mention &&
                        postDetail.mention.map((f, index) => {
                          if (index < 2) {
                            return (
                              <FastImage
                                key={index}
                                source={{
                                  uri:
                                    API_URL +
                                    `/user/profile/image?watch=${f.profileImage}`,
                                  priority: FastImage.priority.high,
                                }}
                                style={styles.writerImage}
                              />
                            );
                          } else {
                            return;
                          }
                        })}

                      {postDetail.mention &&
                        postDetail.mention.length - 2 > 0 && (
                          <MoreFriends count={postDetail.mention.length - 2} />
                        )}
                    </Pressable>
                  )}

                  {myId == userId && (
                    <TouchableOpacity
                      onPress={() => setPostModalVisible(true)}
                      style={{
                        width: responsiveWidth(25),
                        height: responsiveWidth(25),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={Images.more}
                        style={{
                          width: responsiveWidth(15),
                          height: responsiveWidth(15),
                          resizeMode: 'contain',
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {/* 본문 글 최대 500자 */}
              <Text
                style={[
                  Fonts.contentMediumMedium,
                  {width: responsiveWidth(370), color: Colors.textNormal},
                ]}>
                {postDetail.content}
              </Text>
              <View style={{marginTop: responsiveHeight(10)}} />

              {/* 첨부 파일*/}
              {postDetail.mediaFiles && postDetail.mediaFiles.length > 0 && (
                <View
                  style={{
                    width: responsiveWidth(370),
                    height: responsiveWidth(370),
                  }}>
                  <Slider media={postDetail.mediaFiles} />
                </View>
              )}
              <View style={{marginBottom: responsiveHeight(20)}} />
              {/* 좋아요, 댓글, 위치*/}
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: responsiveHeight(5),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginRight: responsiveWidth(10),
                    marginBottom: responsiveHeight(5),
                  }}>
                  {userPost && userPost.liked ? (
                    <TouchableOpacity onPress={() => onLike()}>
                      <Image
                        source={Images.smileSelect}
                        style={{
                          width: responsiveWidth(20),
                          height: responsiveWidth(20),
                          marginRight: responsiveWidth(5),
                          resizeMode: 'contain',
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => onLike()}>
                      <Image
                        source={Images.smileNotSelect}
                        style={{
                          width: responsiveWidth(20),
                          height: responsiveWidth(20),
                          marginRight: responsiveWidth(5),
                          resizeMode: 'contain',
                        }}
                      />
                    </TouchableOpacity>
                  )}

                  <Text
                    style={[
                      Fonts.contentMediumMedium,
                      {color: Colors.textNormal},
                    ]}>
                    {userPost && formatNumber(userPost.likesCount)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginRight: responsiveWidth(10),
                  }}>
                  <Image
                    source={Images.commentNotSelect}
                    style={{
                      width: responsiveWidth(20),
                      height: responsiveWidth(20),
                      marginRight: responsiveWidth(5),
                      resizeMode: 'contain',
                    }}
                  />
                  <Text
                    style={[
                      Fonts.contentMediumMedium,
                      {color: Colors.textNormal},
                    ]}>
                    {formatNumber(postDetail.commentsCount)}
                  </Text>
                </View>
                {postDetail.locationName && (
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={Images.pinNotSelect}
                      style={{
                        width: responsiveWidth(20),
                        height: responsiveWidth(20),
                        marginRight: responsiveWidth(5),
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={[
                        Fonts.contentMediumMedium,
                        {color: Colors.textNormal},
                      ]}>
                      {postDetail.locationName}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View>
              {commentList &&
                commentList.map((comment, index) => (
                  <>
                    <Comment
                      key={index}
                      writerId={comment.writerId}
                      commentId={comment.commentId}
                      nickname={comment.writer}
                      profileImage={comment.profileImage}
                      createdDate={comment.createdDate}
                      content={comment.content}
                      replyCount={comment.replyCount}
                      showReply={getReply}
                      move={() =>
                        navigation.push('UserPage', {userId: comment.writerId})
                      }
                      onPress={() => {
                        setModalVisible(true);
                        setSelectedComment(comment.commentId);
                      }}
                      onReplyPress={() => {
                        setReply(comment.commentId);
                        inptRef.current.focus();
                      }}
                    />
                    {replyList[comment.commentId] &&
                      replyList[comment.commentId].map((r, index1) => {
                        return (
                          <CommentComment
                            key={index1}
                            commentId={r.commentId}
                            nickname={r.writer}
                            writerId={r.writerId}
                            profileImage={r.profileImage}
                            content={r.content}
                            createdDate={r.createdDate}
                            onPress={() => {
                              setReplyModalVisible(true);
                              setSelectedComment(comment.commentId);
                              setSelectedReply(r.commentId);
                            }}
                            onReplyPress={() => {
                              setReply(comment.commentId);
                              inptRef.current.focus();
                            }}
                          />
                        );
                      })}
                    {replyList[comment.commentId] &&
                      comment.replyCount >
                        replyList[comment.commentId].length && (
                        <Pressable
                          onPress={() => getReply(comment.commentId)}
                          style={{
                            width: '100%',
                            height: responsiveHeight(20),
                          }}>
                          <Text
                            style={[
                              Fonts.contentRegualrMedium,
                              {marginLeft: responsiveWidth(30)},
                            ]}>
                            더보기
                          </Text>
                        </Pressable>
                      )}
                  </>
                ))}
            </View>

            <View style={{height: responsiveHeight(70)}} />

            {/* {loading && (
            <View style={{marginVertical: responsiveHeight(30)}}>
              <ActivityIndicator color={'#4880EE'} size={'large'} />
            </View>
          )} */}
          </View>
        </ScrollView>
        <View
          style={{
            width: '100%',
            // position: 'absolute',
            // bottom: responsiveHeight(15),
            height: responsiveHeight(70),
            backgroundColor: Colors.contentBackground,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 400,
          }}>
          {/* 댓글 최대 150자*/}
          <TextInput
            style={[Fonts.contentRegualrMedium, styles.loginInput]}
            placeholder={'댓글 입력'}
            placeholderTextColor={Colors.inputPlaceHolder}
            onChangeText={e => setInpt(e)}
            value={inpt}
            // keyboardType={keyboardType}
            maxLength={150}
            onSubmitEditing={() => submitComment()}
            // editable={!editable}
            ref={inptRef}
            onBlur={() => setReply(null)}
          />
        </View>
        <Modal
          visible={replyModalVisible}
          animationType={'fade'}
          transparent={true}>
          <EditComment
            deleteComment={() => {
              deleteReply();
              setReplyModalVisible(false);
            }}
            close={() => setReplyModalVisible(false)}
          />
        </Modal>
        <Modal visible={modlaVisible} animationType={'fade'} transparent={true}>
          <EditComment
            deleteComment={() => {
              deleteComment();
              setModalVisible(false);
            }}
            close={() => setModalVisible(false)}
          />
        </Modal>
        <Modal
          visible={postModalVisible}
          animationType={'fade'}
          transparent={true}>
          <EditComment
            deleteComment={() => {
              deletePost();
              setPostModalVisible(false);
            }}
            close={() => setPostModalVisible(false)}
          />
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
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

export default Detail;
