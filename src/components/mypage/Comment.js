import {View, StyleSheet, Text, Image, Pressable} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../Scale';
import Sample5 from '../../theme/assets/images/sample/sample5.png';
import {useTheme} from '../../hooks';
const Comment = ({}) => {
  const {Fonts, Images} = useTheme();

  const timeAgo = dateInput => {
    const now = new Date();
    const date = new Date(dateInput);
    const seconds = Math.floor((now - date) / 1000); // 1초 = 1000밀리초
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
            <Image
              source={Sample5}
              style={{
                width: responsiveWidth(25),
                height: responsiveWidth(25),
                borderRadius: responsiveWidth(6),
                marginRight: responsiveWidth(5),
              }}
            />
            <Text style={Fonts.contentMediumBold}>noisy_loud_dean</Text>
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
              {timeAgo('2023-08-06T12:00:00.000')}
            </Text>
            <Image
              source={Images.more}
              style={{width: responsiveWidth(20), height: responsiveHeight(20)}}
            />
          </View>
        </View>
        <View
          style={{
            width: responsiveWidth(320),
            marginLeft: responsiveWidth(10),
          }}>
          <Text style={Fonts.contentMediumMedium}>
            Good Pic!!! Good Pic!!!Good Pic!!!Good Pic!!!Good Pic!!! Good Pic!!!
            Good Pic!!!Good Pic!!!Good Pic!!!Good Pic!!! Good Pic!!! Good
            Pic!!!Good Pic!!!Good Pic!!!Good Pic!!!
          </Text>

          {/* 답글 작성 &  대댓글 있으면 개수 표시 및 더보기 */}
          <View style={{flexDirection: 'row', marginTop: responsiveHeight(5)}}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginRight: responsiveWidth(10),
              }}>
              <Text style={[styles.sub]}>답글 6개</Text>
              {/** 펼쳤을 때 */}
              <Image
                source={Images.upChevron}
                style={{
                  width: responsiveWidth(10),
                  height: responsiveHeight(10),
                }}
              />
              {/** 닫혔을 때 */}
              {/* 
              <Image
                source={Images.downChevron}
                style={{
                  width: responsiveWidth(10),
                  height: responsiveHeight(10),
                }}
              /> */}
            </Pressable>

            <Pressable>
              <Text style={styles.sub}>답글 달기</Text>
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
    marginTop: responsiveHeight(10),
  },
  content: {
    width: responsiveWidth(370),
    alignItems: 'center',
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

export default Comment;
