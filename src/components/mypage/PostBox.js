import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import Sample5 from '../../theme/assets/images/sample/sample5.png';
import {useTheme} from '../../hooks';
import {WithLocalSvg} from 'react-native-svg';
import SmaileIcon from '../../theme/assets/images/nav/smile.svg';
import SmaileIconNot from '../../theme/assets/images/nav/smile-not.svg';
import CommentIcon from '../../theme/assets/images/nav/comment.svg';
import CommentIconNot from '../../theme/assets/images/nav/comment-not.svg';
import LocationIconNot from '../../theme/assets/images/nav/loc.svg';
import LocationIconNotIconNot from '../../theme/assets/images/nav/loc-not.svg';
import {useEffect, useState} from 'react';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {API_URL} from '../../utils/constants';
const PostBox = ({
  postId,
  writerName,
  writerProfileImage,
  content,
  mediaFiles,
  locationName,
  mention,
  isLiked,
  likeCount,
  commentCount,
  createdDate,
  onPress,
  thumbsUp,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likedCount, setLikedCount] = useState(likeCount);
  const onLikePress = async () => {
    const r = await thumbsUp(postId);
    setLiked(!liked);
    setLikedCount(r);
  };

  // useEffect(() => {}, [liked]);

  const {Fonts} = useTheme();
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.postContainer}>
        <View style={styles.writerBox}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{
                uri:
                  API_URL + `/user/profile/image?watch=${writerProfileImage}`,
              }}
              style={styles.writerImage}
            />
            <Text
              style={[
                Fonts.contentMediumBold,
                {marginRight: responsiveWidth(5)},
              ]}>
              {writerName}
            </Text>
            <Text style={Fonts.contentRegualrMedium}>
              {timeAgo(createdDate)}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {mention &&
              mention.map((f, index) => {
                if (index < 2) {
                  return (
                    <Image
                      key={index}
                      source={{
                        uri:
                          API_URL +
                          `/user/profile/image?watch=${f.profileImage}`,
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
          </View>
        </View>
        {/* 간략 목록 글 최대 200자 */}
        {content && (
          <Text
            style={[Fonts.contentMediumMedium, {width: responsiveWidth(370)}]}>
            {content.substring(0, 200) +
              (content.length > 200 ? '...더보기' : '')}
          </Text>
        )}

        {/* 첨부 파일*/}
        <View style={{marginBottom: responsiveHeight(20)}} />
        {mediaFiles && <PostFiles images={mediaFiles} />}
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
            <WithLocalSvg
              width={responsiveWidth(20)}
              height={responsiveHeight(20)}
              asset={liked ? SmaileIcon : SmaileIconNot}
              style={{marginRight: responsiveWidth(5)}}
              onPress={() => onLikePress(postId)}
            />
            <Text style={Fonts.contentMediumMedium}>
              {formatNumber(likedCount)}
            </Text>
          </View>

          <View
            style={{flexDirection: 'row', marginRight: responsiveWidth(10)}}>
            <WithLocalSvg
              width={responsiveWidth(20)}
              height={responsiveHeight(20)}
              asset={CommentIconNot}
              style={{marginRight: responsiveWidth(5)}}
            />
            <Text style={Fonts.contentMediumMedium}>
              {' '}
              {formatNumber(commentCount)}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <WithLocalSvg
              width={responsiveWidth(20)}
              height={responsiveHeight(20)}
              asset={LocationIconNot}
              style={{marginRight: responsiveWidth(5)}}
            />
            <Text style={Fonts.contentMediumMedium}>{locationName}</Text>
          </View>
        </View>
      </View>
    </Pressable>
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

const PostFiles = ({images}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      {images.map((image, index) => {
        if (index < 3) {
          return (
            <Image
              key={index}
              source={{uri: API_URL + `/post/image?watch=${image}`}}
              style={styles.media}
            />
          );
        } else {
          return;
        }
      })}
      {images.length > 3 && (
        <View style={styles.media}>
          <Text
            style={{
              fontFamily: 'SpoqaHanSansNeo-Bold',
              fontSize: responsiveWidth(14),
              lineHeight: responsiveHeight(24),
              letterSpacing: responsiveWidth(-0.6),
              color: '#505866',
            }}>
            {'+' + (images.length - 3)}
          </Text>
        </View>
      )}
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
    return num;
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
    maxHeight: responsiveHeight(300),
    backgroundColor: '#ffffff',
    alignItems: 'center',
    marginBottom: responsiveHeight(10),
  },
  postContainer: {width: responsiveWidth(370)},
  writerImage: {
    width: responsiveWidth(25),
    height: responsiveHeight(25),
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
});

export default PostBox;
