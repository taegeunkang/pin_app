import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useTheme} from '../../hooks';
import {WithLocalSvg} from 'react-native-svg';
import SmaileIcon from '../../theme/assets/images/light/smile-select.svg';
import SmaileIconNot from '../../theme/assets/images/light/smile-not-select.svg';
import CommentIconNot from '../../theme/assets/images/light/comment-not-select.svg';
import LocationIconNot from '../../theme/assets/images/light/pin-not-select.svg';
import {useState} from 'react';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {API_URL} from '../../utils/constants';
import FastImage from 'react-native-fast-image';
import { timeAgo } from '../../utils/util';
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
            <FastImage
              source={{
                uri:
                  API_URL + `/user/profile/image?watch=${writerProfileImage}`,
                priority: FastImage.priority.high,
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
            {liked ? (
              <Pressable onPress={() => onLikePress(postId)}>
                <SmaileIcon
                  width={responsiveWidth(20)}
                  height={responsiveHeight(20)}
                  style={{marginRight: responsiveWidth(5)}}
                />
              </Pressable>
            ) : (
              <Pressable onPress={() => onLikePress(postId)}>
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
            style={{flexDirection: 'row', marginRight: responsiveWidth(10)}}>
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
              <Text style={Fonts.contentMediumMedium}>{locationName}</Text>
            </View>
          )}
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
            <FastImage
              key={index}
              source={{
                uri: API_URL + `/post/image?watch=${image}`,
                priority: FastImage.priority.high,
              }}
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
});

export default PostBox;
