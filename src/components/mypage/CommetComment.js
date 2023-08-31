import {View, StyleSheet, Text, Image, Pressable} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {useTheme} from '../../hooks';
import {API_URL} from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import {timeAgo} from '../../utils/util';
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
  const {Fonts, Images, Colors} = useTheme();
  const isMine = async () => {
    return (await AsyncStorage.getItem('id')) == writerId;
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
          <Text style={[Fonts.contentMediumMedium, {color: Colors.textNormal}]}>
            {content}
          </Text>

          {/* 답글 작성 &  대댓글 있으면 개수 표시 및 더보기 */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: responsiveHeight(5),
            }}>
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
});

export default CommentComment;
