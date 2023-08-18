import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Sample5 from '../../theme/assets/images/sample/sample5.png';
import Sample1 from '../../theme/assets/images/sample/sample1.png';
import Sample3 from '../../theme/assets/images/sample/sample3.png';
import {useTheme} from '../../hooks';
import {WithLocalSvg} from 'react-native-svg';
import SmaileIcon from '../../theme/assets/images/nav/smile.svg';
import SmaileIconNot from '../../theme/assets/images/nav/smile-not.svg';
import CommentIcon from '../../theme/assets/images/nav/comment.svg';
import CommentIconNot from '../../theme/assets/images/nav/comment-not.svg';
import LocationIconNot from '../../theme/assets/images/nav/loc.svg';
import LocationIconNotIconNot from '../../theme/assets/images/nav/loc-not.svg';
import {useState, useEffect} from 'react';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {Slider} from '../../components/Content/Slider';
import Comment from '../../components/mypage/Comment';
import CommentComment from '../../components/mypage/CommetComment';
const screenWidth = Dimensions.get('screen').width;
const Detail = () => {
  const {Fonts} = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const onRefresh = () => {
    setRefreshing(true);

    // 햅틱 피드백 발생
    // const options = {
    //   enableVibrateFallback: true,
    //   ignoreAndroidSystemSettings: false,
    // };
    // RNHapticFeedback.trigger('impactMedium', options);

    // 여기서 데이터를 새로 고치는 로직을 추가합니다.
    // 예를 들면 아래와 같이 2초 후에 로딩을 중지할 수 있습니다.
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const fetchData = async () => {
    setLoading(true);

    // 예: API에서 데이터를 가져오는 코드
    // const response = await fetch(`YOUR_API_URL?page=${page}`);
    // const result = await response.json();

    // setData(prevData => [...prevData, ...result]);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
    // setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
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
          nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
          nativeEvent.contentSize.height - responsiveHeight(50);
        if (isCloseToBottom) {
          setPage(prevPage => prevPage + 1);
        }
      }}
      scrollEventThrottle={400}>
      <View style={styles.container}>
        <View style={styles.postContainer}>
          <View style={styles.writerBox}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={Sample5} style={styles.writerImage} />
              <Text
                style={[
                  Fonts.contentMediumBold,
                  {marginRight: responsiveWidth(5)},
                ]}>
                noisy_loud_dean
              </Text>
              <Text style={Fonts.contentRegualrMedium}>
                {timeAgo('2023-08-06T12:00:00.000')}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image source={Sample5} style={styles.writerImage} />
              <Image source={Sample5} style={styles.writerImage} />
              <MoreFriends count={3} />
            </View>
          </View>
          {/* 본문 글 최대 250자 */}
          <Text
            style={[Fonts.contentMediumMedium, {width: responsiveWidth(370)}]}>
            컨텐츠를 여기 이정도 만큼 확보할 수 있습니다. 컨텐츠를 여기 이정도
            만큼 확보할 수 있습니다. 컨텐츠를 여기 이정도 만큼 확보할 수
            있습니다. 컨텐츠를 여기 이정도 만큼 확보할 수 있습니다. 컨텐츠를
            여기 이정도 만큼 확보할 수 있습니다. 컨텐츠를 여기 이정도 만큼
            확보할 수 있습니다. 컨텐츠를 여기 이정도 만큼 확보할 수 있습니다.
            컨텐츠를 여기 까지. ... 더보기확보할 수 있습니다. 컨텐츠를 여기
            이정도 만큼 확보할 수 있습니다. 컨텐츠를 여기 이정도 만큼 확보할 수
            있습니다. 컨텐츠를 여기 이정도 만큼 확보할 수 있습니다. 컨텐츠를
            여기 이정도 만큼 확보할 수 있습니다. 컨텐츠를 여기 이정도 만큼
            확보할 수 있습니다. 컨텐츠를 여기 이정도 만큼 확보할 수 있습니다.
            컨텐츠를 여기 까지.
          </Text>

          {/* 첨부 파일*/}
          <View
            style={{width: responsiveWidth(370), height: responsiveWidth(370)}}>
            <Slider media={[Sample5, Sample1, Sample3]} />
          </View>
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
                asset={isLiked ? SmaileIcon : SmaileIconNot}
                style={{marginRight: responsiveWidth(5)}}
                onPress={() => setIsLiked(!isLiked)}
              />
              <Text style={Fonts.contentMediumMedium}>
                {formatNumber(14000)}
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
              <Text style={Fonts.contentMediumMedium}> {formatNumber(23)}</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <WithLocalSvg
                width={responsiveWidth(20)}
                height={responsiveHeight(20)}
                asset={LocationIconNot}
                style={{marginRight: responsiveWidth(5)}}
              />
              <Text style={Fonts.contentMediumMedium}>떼르미니 역</Text>
            </View>
          </View>
        </View>

        <Comment />
        <CommentComment />

        {loading && (
          <View style={{marginVertical: responsiveHeight(20)}}>
            <ActivityIndicator color={'#4880EE'} size={'large'} />
          </View>
        )}
      </View>
    </ScrollView>
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
      <Image source={Sample5} style={styles.media} />
      <Image source={Sample5} style={styles.media} />
      <View style={styles.media}>
        <Text
          style={{
            fontFamily: 'SpoqaHanSansNeo-Bold',
            fontSize: responsiveWidth(14),
            lineHeight: responsiveHeight(24),
            letterSpacing: responsiveWidth(-0.6),
            color: '#505866',
          }}>
          +3
        </Text>
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default Detail;
