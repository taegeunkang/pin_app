import {
  View,
  Dimensions,
  Text,
  Preesable,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import {useState} from 'react';
import Sample1 from '../../theme/assets/images/sample/sample1.png';
import Comment from '../../theme/assets/images/comment-regular.svg';
import Like from '../../theme/assets/images/heart-regular.svg';
import ClickedLike from '../../theme/assets/images/heart-solid.svg';
import Share from '../../theme/assets/images/paper-plane-regular.svg';
import Tag from '../../components/Content/Tag';
import {WithLocalSvg} from 'react-native-svg';
import {BorderRadius, FontSize} from '../../theme/Variables';
const Detail = () => {
  const [liked, setLiked] = useState(false);

  const clickLike = () => {
    setLiked(!liked);
    console.log('clicked');
  };

  return (
    <View>
      <Image
        source={Sample1}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width,
        }}
      />

      <View style={styles.infoBar}>
        <View style={{flexDirection: 'row'}}>
          <Pressable onPress={clickLike}>
            <WithLocalSvg
              asset={liked ? ClickedLike : Like}
              width={25}
              height={25}
              style={{marginRight: 10}}
            />
          </Pressable>
          <WithLocalSvg asset={Comment} width={25} height={25} />
        </View>

        {/* url로 앱 여는 기능 구현 후 추가  */}
        {/* <View style={{flexDirection: 'row'}}>
          <WithLocalSvg asset={Share} width={25} height={25} />
        </View> */}
      </View>

      <View style={styles.content}>
        <Text
          style={{
            fontSize: FontSize.regular,
            fontWeight: 600,
            marginBottom: 10,
          }}>
          27 Likes..
        </Text>

        <Text style={{marginBottom: 10}}>
          <Text style={{fontSize: FontSize.regular, fontWeight: 600}}>
            {'mars2727'}
          </Text>
          {'  '}
          {/* 일정 글자수 늘어나면 ... 더보기로 content + comments 화면 따로 제작 */}
          Trep Trep Trep Trep Trep
        </Text>

        <View style={styles.tagContainer}>
          {/* tag */}
          <Tag tagName={'스위스'} bgColor={'yellow'} />
          <Tag tagName={'기러기'} bgColor={'#ff2281'} />
          <Tag tagName={'토마토'} bgColor={'#75d5fd'} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 7,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'gray',
  },

  content: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tagContainer: {flex: 1, flexDirection: 'row', flexWrap: 'wrap'},
});

export default Detail;
