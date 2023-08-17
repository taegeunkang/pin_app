import {Image, View, StyleSheet, Text} from 'react-native';
import {useTheme} from '../../hooks';
import {ScrollView} from 'react-native-gesture-handler';
import Sample5 from '../../theme/assets/images/sample/sample5.png';
const Alram = () => {
  return (
    <ScrollView style={{backgroundColor: '#F2F4F6'}}>
      <Notify
        image={Sample5}
        title={'mars2727 님이 새로운 게시글을 업로드 하였습니다.'}
        read={true}
      />
      <Notify
        image={Sample5}
        title={'mars2727 님이 새로운 게시글을 업로드 하였습니다.'}
      />
      <Notify
        image={Sample5}
        title={'mars2727 님이 새로운 게시글을 업로드 하였습니다.'}
        read={true}
      />
      <Notify
        image={Sample5}
        title={'mars2727 님이 새로운 게시글을 업로드 하였습니다.'}
      />
      <Notify
        image={Sample5}
        title={'mars2727 님이 새로운 게시글을 업로드 하였습니다.'}
      />
    </ScrollView>
  );
};

const Notify = ({image, title, read}) => {
  return (
    <View style={[styles.notiContainer, read ? styles.isRead : '']}>
      <View style={styles.content}>
        <Image source={image} style={styles.profileImg} />
        <Text>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notiContainer: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  isRead: {backgroundColor: '#EAF3FE'},
  profileImg: {width: 35, height: 35, borderRadius: 12, marginRight: 5},
  content: {
    width: 370,
    height: 45,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default Alram;
