import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
} from 'react-native';
import {useTheme} from '../../hooks';
import {WithLocalSvg} from 'react-native-svg';
import SmaileIcon from '../../theme/assets/images/light/smile-select.svg';
import SmaileIconNot from '../../theme/assets/images/light/smile-not-select.svg';
import CommentIconNot from '../../theme/assets/images/light/comment-not-select.svg';
import LocationIconNot from '../../theme/assets/images/light/pin-not-select.svg';
import {useState, useEffect, useRef} from 'react';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {Slider} from '../../components/Content/Slider';
import Comment from '../../components/mypage/Comment';
import CommentComment from '../../components/mypage/CommetComment';
import {API_URL} from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditComment from '../../components/Content/EditComment';
import {reIssue} from '../../utils/login';
import FastImage from 'react-native-fast-image';
const screenWidth = Dimensions.get('screen').width;
const Detail = ({navigation, route}) => {
  const {
    postId,
    nickname,
    profileImage,
    content,
    mediaFiles,
    locationName,
    liked,
    likesCount,
    commentsCount,
    createdDate,
    mention,
    thumbsUp,
    userId,
    reload,
  } = route.params;
  const {Fonts, Images} = useTheme();
  const [isLiked, setIsLiked] = useState(liked);
  const [likedCount, setLikedCount] = useState(likesCount);
  const [commentCount, setCommentCount] = useState(commentsCount);
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
  const inptRef = useRef(null);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComment(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const onLike = async () => {
    const r = await thumbsUp(postId);
    setIsLiked(!isLiked);
    setLikedCount(r);
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
      } else {
        let a = commentList;
        a = a.concat(r);
        setCommentList(a);
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
          writer: nickname,
          writerId: await AsyncStorage.getItem('id'),
          profileImage: profileImage,
          replyCount: 0,
          createdDate: new Date().toISOString().replace('Z', '+00:00'),
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
          writer: nickname,
          writerId: await AsyncStorage.getItem('id'),
          profileImage: profileImage,
          createdDate: new Date().toISOString().replace('Z', '+00:00'),
        };
        c[reply] = c[reply].concat(d);
        setReplyList(c);
      }
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
      setCommentCount(commentCount - 1);
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

  const isMyPost = async () => {
    const myId = await AsyncStorage.getItem('id');
    return myId == userId;
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
      reload(postId);
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
      console.log(r);
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
  useEffect(() => {
    fetchComment();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
      behavior="padding"
      enabled
      keyboardVerticalOffset={100}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
        }}>
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
          {/* <GpsAlert onPress={() => setModalVisible(false)} /> */}
        </Modal>
        <Modal visible={modlaVisible} animationType={'fade'} transparent={true}>
          <EditComment
            deleteComment={() => {
              deleteComment();
              setModalVisible(false);
            }}
            close={() => setModalVisible(false)}
          />
          {/* <GpsAlert onPress={() => setModalVisible(false)} /> */}
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
              nativeEvent.contentSize.height - responsiveHeight(10);
            if (isCloseToBottom) {
              fetchComment();
            }
          }}
          scrollEventThrottle={400}>
          <View style={styles.container}>
            <View style={styles.postContainer}>
              <View style={styles.writerBox}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FastImage
                    source={{
                      uri: API_URL + `/post/image?watch=${profileImage}`,
                      priority: FastImage.priority.high,
                    }}
                    style={styles.writerImage}
                  />
                  <Text
                    style={[
                      Fonts.contentMediumBold,
                      {marginRight: responsiveWidth(5)},
                    ]}>
                    {nickname}
                  </Text>
                  <Text style={Fonts.contentRegualrMedium}>
                    {timeAgo(createdDate)}
                  </Text>
                </View>
                <Pressable
                  onPress={() =>
                    navigation.push('DetailMention', {friends: mention})
                  }
                  style={{flexDirection: 'row'}}>
                  {mention &&
                    mention.map((f, index) => {
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

                  {mention && mention.length - 2 > 0 && (
                    <MoreFriends count={mention.length - 2} />
                  )}
                  {isMyPost() && (
                    <Pressable
                      onPress={() => setPostModalVisible(true)}
                      style={{
                        width: responsiveWidth(25),
                        height: responsiveHeight(25),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={Images.more}
                        style={{
                          width: responsiveWidth(20),
                          height: responsiveHeight(20),
                        }}
                      />
                    </Pressable>
                  )}
                </Pressable>
              </View>
              {/* 본문 글 최대 500자 */}
              <Text
                style={[
                  Fonts.contentMediumMedium,
                  {width: responsiveWidth(370)},
                ]}>
                {content}
              </Text>
              <View style={{marginTop: responsiveHeight(10)}} />

              {/* 첨부 파일*/}
              {mediaFiles.length > 0 && (
                <View
                  style={{
                    width: responsiveWidth(370),
                    height: responsiveWidth(370),
                  }}>
                  <Slider media={mediaFiles} />
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
                  {isLiked ? (
                    <Pressable onPress={() => onLike()}>
                      <SmaileIcon
                        width={responsiveWidth(20)}
                        height={responsiveHeight(20)}
                        style={{marginRight: responsiveWidth(5)}}
                      />
                    </Pressable>
                  ) : (
                    <Pressable onPress={() => onLike()}>
                      <SmaileIconNot
                        width={responsiveWidth(20)}
                        height={responsiveHeight(20)}
                        style={{marginRight: responsiveWidth(5)}}
                      />
                    </Pressable>
                  )}

                  <Text style={Fonts.contentMediumMedium}>
                    {formatNumber(likedCount)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginRight: responsiveWidth(10),
                  }}>
                  <CommentIconNot
                    width={responsiveWidth(20)}
                    height={responsiveHeight(20)}
                    style={{marginRight: responsiveWidth(5)}}
                  />
                  <Text style={Fonts.contentMediumMedium}>
                    {formatNumber(commentCount)}
                  </Text>
                </View>
                {locationName && (
                  <View style={{flexDirection: 'row'}}>
                    <LocationIconNot
                      width={responsiveWidth(20)}
                      height={responsiveHeight(20)}
                      style={{marginRight: responsiveWidth(5)}}
                    />
                    <Text style={Fonts.contentMediumMedium}>
                      {locationName}
                    </Text>
                  </View>
                )}
              </View>
            </View>
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
                        style={{width: '100%', height: responsiveHeight(20)}}>
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
            position: 'absolute',
            bottom: 0,
            height: responsiveHeight(70),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
          }}>
          {/* 댓글 최대 150자*/}
          <TextInput
            style={[Fonts.contentRegualrMedium, styles.loginInput]}
            placeholder={'댓글 입력'}
            placeholderTextColor={'#6D7582'}
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const MoreFriends = ({count}) => {
  return (
    <View
      style={{
        width: responsiveWidth(25),
        height: responsiveHeight(25),
        borderRadius: responsiveWidth(8),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F2F3F4',
        marginRight: responsiveWidth(5),
      }}>
      <Text
        style={{
          fontFamily: 'SpoqaHanSansNeo-Bold',
          fontSize: responsiveWidth(12),
          lineHeight: responsiveHeight(18),
          letterSpacing: responsiveWidth(-0.6),
          color: '#505866',
        }}>
        {'+' + count}
      </Text>
    </View>
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

const timeAgo = dateInput => {
  let t = dateInput.substring(0, dateInput.length - 10);
  const now = new Date();
  const utcNow = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
  );

  const date = new Date(t);
  const utcDate = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );

  const seconds = Math.floor((utcNow - utcDate) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}초전`;
  } else if (minutes < 60) {
    return `${minutes}분전`;
  } else if (hours < 24) {
    return `${hours}시간전`;
  } else if (days <= 7) {
    return `${days}일전`;
  } else {
    // mm.dd.YYYY 형식으로 반환
    const year = date.getFullYear();
    // 월은 0부터 시작하기 때문에 1을 더해줍니다.
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}.${year}`;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    marginBottom: responsiveHeight(10),
  },
  postContainer: {width: responsiveWidth(370)},
  writerImage: {
    width: responsiveWidth(30),
    height: responsiveHeight(30),
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
    backgroundColor: '#F2F3F4',
    borderRadius: responsiveWidth(10),
    marginRight: responsiveWidth(5),
  },

  loginInput: {
    height: responsiveHeight(48),
    width: responsiveWidth(370),
    borderRadius: responsiveWidth(12),
    backgroundColor: '#F2F4F6',
    paddingHorizontal: responsiveWidth(10),
  },
});

export default Detail;
