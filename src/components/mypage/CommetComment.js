import {View, StyleSheet, Text, Image, Pressable} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {useTheme} from '../../hooks';
import {API_URL} from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
const CommentComment = ({
  commentId,
  nickname,
  writerId,
  profileImage,
  createdDate,
  content,
  onPress,
  onReplyPress,
}) => {
  const {Fonts, Images} = useTheme();
  const isMine = async () => {
    return (await AsyncStorage.getItem('id')) == writerId;
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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <FastImage
              source={{
                uri: API_URL + `/post/image?watch=${profileImage}`,
                priority: FastImage.priority.high,
              }}
              style={{
                width: responsiveWidth(25),
                height: responsiveWidth(25),
                borderRadius: responsiveWidth(6),
                marginRight: responsiveWidth(5),
              }}
            />
            <Text style={Fonts.contentMediumBold}>{nickname}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={[
                Fonts.contentRegualrMedium,
                {marginRight: responsiveWidth(10)},
              ]}>
              {timeAgo(createdDate)}
            </Text>
            {isMine() && (
              <Pressable onPress={onPress}>
                <Image
                  source={Images.more}
                  style={{
                    width: responsiveWidth(20),
                    height: responsiveHeight(20),
                  }}
                />
              </Pressable>
            )}
          </View>
        </View>
        <View
          style={{
            width: responsiveWidth(270),
            marginLeft: responsiveWidth(10),
          }}>
          <Text style={Fonts.contentMediumMedium}>{content}</Text>

          {/* 답글 작성 &  대댓글 있으면 개수 표시 및 더보기 */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: responsiveHeight(5),
            }}>
            <Pressable onPress={onReplyPress}>
              <Text style={[Fonts.contentRegularRegualr]}>답글 달기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: responsiveHeight(70),
    alignItems: 'flex-end',
    marginTop: responsiveHeight(10),
  },
  content: {
    width: responsiveWidth(340),
    alignItems: 'center',
    marginLeft: responsiveWidth(10),
  },
  sub: {
    marginRight: responsiveWidth(5),
    color: '#6D7582',
    fontFamily: 'SpoqaHanSansNeo-Medium',
    fontSize: responsiveWidth(14),
    lineHeight: responsiveHeight(24),
    letterSpacing: responsiveWidth(-0.6),
  },
});

export default CommentComment;
