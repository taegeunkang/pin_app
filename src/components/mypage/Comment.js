import {View, StyleSheet, Text, Image, Pressable} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {useTheme} from '../../hooks';
import {API_URL} from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import FastImage from 'react-native-fast-image';
const Comment = ({
  commentId,
  writerId,
  nickname,
  profileImage,
  createdDate,
  content,
  replyCount,
  showReply,
  onPress,
  onReplyPress,
}) => {
  const {Fonts, Images} = useTheme();
  const [closed, setClosed] = useState(true);
  const myComment = async () => {
    const id = await AsyncStorage.getItem('id');
    return id == writerId;
  };

  const showReplyProxy = async commentId => {
    await showReply(commentId);
    setClosed(false);
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
            {myComment() && (
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
            width: responsiveWidth(320),
            marginLeft: responsiveWidth(10),
          }}>
          <Text style={Fonts.contentMediumMedium}>{content}</Text>

          {/* 답글 작성 &  대댓글 있으면 개수 표시 및 더보기 */}

          <View style={{flexDirection: 'row', marginTop: responsiveHeight(5)}}>
            <Pressable onPress={onReplyPress}>
              <Text style={[Fonts.contentRegularRegualr]}>답글 달기</Text>
            </Pressable>
          </View>
          {closed && replyCount > 0 && (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginRight: responsiveWidth(10),
              }}
              onPress={() => showReplyProxy(commentId)}>
              <Text style={[Fonts.contentRegularRegualr]}>
                --------- 답글 {replyCount}개 더 보기
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: responsiveHeight(70),
    marginTop: responsiveHeight(10),
  },
  content: {
    width: responsiveWidth(370),
    alignItems: 'center',
  },
});

export default Comment;
