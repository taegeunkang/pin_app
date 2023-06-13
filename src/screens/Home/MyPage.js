import {View, StyleSheet, Text, Image, Dimensions} from 'react-native';
import Sample1 from '../../theme/assets/images/sample/sample1.png';
import Sample2 from '../../theme/assets/images/sample/sample2.png';
import Sample3 from '../../theme/assets/images/sample/sample3.png';
import Sample4 from '../../theme/assets/images/sample/sample4.png';
import {FontSize} from '../../theme/Variables';
import Cells from '../../theme/assets/images/table-cells-solid.svg';

import {WithLocalSvg} from 'react-native-svg';
const MyPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.infoContainer}>
          <View
            style={{
              width: 100,
              height: 100,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <View style={styles.imgContainer}>
              <Image source={Sample1} style={styles.img} />
            </View>
          </View>

          <View style={styles.info}>
            <View>
              <Text style={styles.infoTitle}>4,421</Text>
              <Text style={styles.infoInfo}>게시물</Text>
            </View>
            <View>
              <Text style={styles.infoTitle}>120만</Text>
              <Text style={styles.infoInfo}>팔로워</Text>
            </View>
            <View>
              <Text style={styles.infoTitle}>37</Text>
              <Text style={styles.infoInfo}>팔로잉</Text>
            </View>
          </View>
        </View>
        <View style={{width: '100%', marginTop: 10}}>
          <Text style={{fontSize: FontSize.regular, fontWeight: 'bold'}}>
            강태근
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            height: 60,
            marginTop: 10,
          }}>
          <View
            style={{
              width: '25%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
            }}>
            <WithLocalSvg asset={Cells} width={30} height={30} />
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <Image source={Sample1} style={{width: '100%', height: '100%'}} />
        </View>
        <View style={styles.content}>
          <Image source={Sample2} style={{width: '100%', height: '100%'}} />
        </View>
        <View style={styles.content}>
          <Image source={Sample3} style={{width: '100%', height: '100%'}} />
        </View>
        <View style={styles.content}>
          <Image source={Sample4} style={{width: '100%', height: '100%'}} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    height: 200,
    padding: 10,
  },
  imgContainer: {
    borderRadius: 100,
    width: 75,
    height: 75,
    borderWidth: 1,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    height: 100,
  },
  info: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 120,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  nameContainer: {},
  infoTitle: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoInfo: {
    fontSize: FontSize.regular,
    fontWeight: '400',
    textAlign: 'center',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  content: {
    width: Dimensions.get('window').width * 0.3333,
    height: Dimensions.get('window').width * 0.3333,
    borderWidth: 0.3,
    borderColor: 'black',
  },
});

export default MyPage;
