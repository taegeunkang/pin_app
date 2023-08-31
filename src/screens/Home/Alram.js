import {Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useTheme} from '../../hooks';
import {ScrollView} from 'react-native-gesture-handler';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {useEffect, useLayoutEffect} from 'react';
const Alram = ({navigation}) => {
  const {Images, Colors} = useTheme();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Setting');
          }}>
          <Image
            source={Images.detail}
            style={{
              width: responsiveWidth(20),
              height: responsiveHeight(20),
              marginRight: responsiveWidth(10),
            }}
          />
        </TouchableOpacity>
      ),
    });
  });

  return (
    <ScrollView style={{backgroundColor: Colors.primary}}>
      {/* <Notify
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
      /> */}
    </ScrollView>
  );
};

const Notify = ({image, title, read}) => {
  const {Fonts} = useTheme();
  return (
    <View style={[styles.notiContainer, read ? styles.isRead : '']}>
      <View style={styles.content}>
        <Image source={image} style={styles.profileImg} />
        <Text style={Fonts.contentMediumMedium}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notiContainer: {
    height: responsiveHeight(55),
    alignItems: 'center',
    justifyContent: 'center',
  },
  isRead: {backgroundColor: '#EAF3FE'},
  profileImg: {
    width: responsiveWidth(35),
    height: responsiveHeight(35),
    borderRadius: responsiveWidth(12),
    marginRight: responsiveWidth(5),
  },
  content: {
    width: responsiveWidth(370),
    height: responsiveHeight(45),
    paddingHorizontal: responsiveWidth(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default Alram;
