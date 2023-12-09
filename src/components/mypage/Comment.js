import {View, StyleSheet, Text, Image, Pressable} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {useTheme} from '../../hooks';
import {API_URL} from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {timeAgo} from '../../utils/util';
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
  const {Fonts, Images, Colors} = useTheme();
  const [closed, setClosed] = useState(true);
  const myComment = async () => {
    const id = await AsyncStorage.getItem('id');
    return id == writerId;
  };

  const showReplyProxy = async commentId => {
    await showReply(commentId);
    setClosed(false);
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
            <Text style={[Fonts.contentMediumBold, {color: Colors.textBold}]}>
              {nickname}
            </Text>
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
                {marginRight: responsiveWidth(10), color: Colors.textNormal},
              ]}>
              {timeAgo(createdDate)}
            </Text>
            {myComment() && (
              <Pressable
                onPress={onPress}
                style={{
                  width: responsiveWidth(20),
                  height: responsiveHeight(20),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={Images.more}
                  style={{
                    width: responsiveWidth(15),
                    height: responsiveHeight(15),
                    resizeMode: 'contain',
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
          <Text style={[Fonts.contentMediumMedium, {color: Colors.textNormal}]}>
            {content}
          </Text>

          {/* 답글 작성 &  대댓글 있으면 개수 표시 및 더보기 */}

          <View style={{flexDirection: 'row', marginTop: responsiveHeight(5)}}>
            <Pressable onPress={onReplyPress}>
              <Text
                style={[
                  Fonts.contentRegularRegualr,
                  {color: Colors.textNormal},
                ]}>
                답글 달기
              </Text>
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
              <Text
                style={[
                  Fonts.contentRegularRegualr,
                  {color: Colors.textNormal},
                ]}>
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
