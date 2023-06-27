import {
  View,
  Text,
  Preesable,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import Sample1 from '../../theme/assets/images/sample/sample1.png';
import Sample2 from '../../theme/assets/images/sample/sample2.png';
import Sample3 from '../../theme/assets/images/sample/sample3.png';
import Sample4 from '../../theme/assets/images/sample/sample4.png';
import Sample5 from '../../theme/assets/images/sample/sample5.png';
import PlusBtn from '../../theme/assets/images/plus-solid.svg';
import SampleProfile1 from '../../theme/assets/images/sample/sample_profile1.png';
import SampleProfile2 from '../../theme/assets/images/sample/sample_profile2.png';
import {Colors, FontSize} from '../../theme/Variables';
import {WithLocalSvg} from 'react-native-svg';
import {API_URL} from '../../utils/constants';
import {useEffect, useState} from 'react';
export default ListContent = ({locationName, photos, createdDate}) => {
  const parseDate = () => {
    let timestamp = Date.parse(createdDate);
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth();
    if (month < 10) month = '0' + month;
    let day = date.getDay();
    if (day < 10) day = '0' + day;
    return year + '•' + month + '•' + day;
  };

  // 사진 개수가 많으면 scorllEnabled true 설정
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView horizontal={true} scrollEnabled={true}>
          {photos.map(photo => (
            <ImageBox image={API_URL + '/post/image?watch=' + photo} />
          ))}
        </ScrollView>
      </View>

      <View style={{width: '100%', flexDirection: 'row', marginTop: 10}}>
        <View style={{width: '60%'}}>
          <Text style={styles.title}>{locationName}</Text>
          <Text style={styles.location}>{parseDate(createdDate)}</Text>
        </View>
        <View
          style={{
            width: '40%',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <ProfileImg image={SampleProfile1} />
          <ProfileImg image={SampleProfile2} />
          <Text style={{fontSize: FontSize.tiny}}>+3</Text>
        </View>
      </View>
    </View>
  );
};

const ImageBox = ({image}) => {
  return <Image source={{uri: image}} style={styles.img} />;
};

const ProfileImg = ({image}) => {
  return <Image source={image} style={styles.profile} />;
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
    height: 170,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
  },
  img: {
    marginRight: 7,
    width: 90,
    height: 90,
    borderRadius: 7,
  },
  title: {
    fontSize: FontSize.regular,
    fontWeight: 600,
  },
  location: {
    fontSize: FontSize.small,
  },
  profile: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginRight: 7,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
