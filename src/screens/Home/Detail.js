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
import {useEffect, useState} from 'react';
import Sample1 from '../../theme/assets/images/sample/sample1.png';
import Comment from '../../theme/assets/images/comment-regular.svg';
import Like from '../../theme/assets/images/heart-regular.svg';
import ClickedLike from '../../theme/assets/images/heart-solid.svg';
import Share from '../../theme/assets/images/paper-plane-regular.svg';
import Tag from '../../components/Content/Tag';
import {WithLocalSvg} from 'react-native-svg';
import {BorderRadius, FontSize} from '../../theme/Variables';
import {API_URL} from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Slider} from '../../components/Content/Slider';
const Detail = ({route, navigation}) => {
  const {id} = route.params;
  const [nickName, setNickName] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [videoes, setVideoes] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [tags, setTags] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [createdDate, setCreatedDate] = useState('');
  const [medialFiles, setMediaFiles] = useState([]);
  const clickLike = () => {
    setLiked(!liked);
    console.log('clicked');
  };

  const parseDate = d => {
    let timestamp = Date.parse(d);
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth();
    if (month < 10) month = '0' + month;
    let day = date.getDay();
    if (day < 10) day = '0' + day;
    return year + '•' + month + '•' + day;
  };

  const load = async () => {
    const response = await fetch(API_URL + '/post/find?id=' + id, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    });
    switch (response.status) {
      case 200:
        const res = await response.json();
        // 차후에 이미지, 동영상 하나로 합침
        let p = res.videoFiles;
        p = p.concat(res.photoFiles);
        console.log(p);
        setMediaFiles(p);
        setNickName(res.nickName);
        setContent(res.content);
        setImages(res.photoFiles);
        setVideoes(res.videoFiles);
        setLocationName(res.locationName);
        setTags(res.tags);
        setLiked(res.liked);
        setLikesCount(res.likesCount);
        setCommentsCount(res.commentsCount);
        setCreatedDate(res.createdDate);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View>
      {/* <Image
        source={Sample1}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width,
        }}
      /> */}
      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Slider media={medialFiles} />
      </View>

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
          {likesCount} Likes..
        </Text>

        <Text style={{marginBottom: 10}}>
          <Text style={{fontSize: FontSize.regular, fontWeight: 600}}>
            {nickName}
          </Text>
          {'  '}
          {/* 일정 글자수 늘어나면 ... 더보기로 content + comments 화면 따로 제작 */}
          {content}
        </Text>
        <View style={styles.createdDateContainer}>
          <Text>{parseDate(createdDate)}</Text>
        </View>

        <View style={styles.tagContainer}>
          {/* tag */}
          {tags &&
            tags.map((tag, index) => (
              <Tag key={index} tagName={tag} bgColor={'yellow'} />
            ))}
        </View>

        {/*  댓글 0개일 때는 표시 안하고 0개 이상일 때만 댓글 개수 표시 -> 누르면 댓글 모달로 표시*/}
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

  createdDateContainer: {
    width: '100%',
    height: 45,
    textAlign: 'left',
  },
});

export default Detail;
