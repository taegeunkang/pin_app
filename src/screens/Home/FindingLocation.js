import {useEffect, useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Image,
} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {useTheme} from '../../hooks';
const FindingLocation = ({navigation, route}) => {
  const {lat, lon} = route.params;
  const [nearByLocations, setNearByLocations] = useState([]);
  const [customTyping, setCustomTyping] = useState('');
  const [typing, setTyping] = useState(false);
  const {t} = useTranslation('newPost');
  const inputRef = useRef(null);
  const {Colors, Images, Fonts} = useTheme();

  const getNearByLocations = async () => {
    const response = await fetch(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
        lat +
        ', ' +
        lon +
        '&radius=100&key=AIzaSyDkubxoTiG0x3a60Fbcp4iTg6LxJZqE-vo&language=ko&rankby=prominence',
      {method: 'GET'},
    ).then(async res => await res.json());
    setNearByLocations(response['results'].map(item => item['name']));
  };

  const goBack = item => {
    navigation.navigate('WriteContent', {locationName: item});
  };
  const onChangeTyping = e => {
    setCustomTyping(e);
    if (e.length > 0) {
      setTyping(true);
    } else {
      setTyping(false);
    }
  };

  useEffect(() => {
    getNearByLocations();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.contentBackground,
      alignItems: 'center',
      paddingVertical: responsiveHeight(20),
    },
    locationList: {
      width: responsiveWidth(370),
      height: responsiveHeight(45),
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },

    loginInput: {
      height: responsiveHeight(48),
      width: responsiveWidth(370),
      borderRadius: responsiveWidth(12),
      backgroundColor: Colors.inputBackground,
      paddingHorizontal: responsiveWidth(10),

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginInput}>
        <Image
          source={Images.searchNotSelect}
          style={{width: responsiveWidth(25), height: responsiveHeight(25)}}
        />

        <TextInput
          ref={inputRef}
          style={{
            flex: 1,
            textAlign: 'left',
            marginLeft: responsiveWidth(10),
            color: Colors.inputContent,
          }}
          placeholder={t('media.location')}
          placeholderTextColor={Colors.inputPlaceHolder}
          onChangeText={e => {
            onChangeTyping(e);
          }}
          value={customTyping}
        />
      </View>

      <View style={{marginTop: responsiveHeight(20)}} />
      {/* 첫 화면 진입시 검색 기록이 존재 하지 않을 때 */}
      {/* <View style={{flex: 1, backgroundColor: Colors.white}}></View> */}

      {/* 검색 결과가 있을 때*/}
      <ScrollView
        // onScroll={({nativeEvent}) => {
        //   if (loading) return;
        //   const isCloseToBottom =
        //     nativeEvent.layoutMeasurement.height +
        //       nativeEvent.contentOffset.y >=
        //     nativeEvent.contentSize.height - responsiveHeight(70);
        //   if (isCloseToBottom) {
        //     setPage(page => page + 1);
        //   }
        // }}
        scrollEventThrottle={400}>
        {typing ? (
          <Pressable
            style={styles.locationList}
            onPress={() => goBack(customTyping)}>
            <Text
              style={[Fonts.contentMediumMedium, {color: Colors.textNormal}]}>
              {customTyping}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.locationList}
            onPress={() => goBack(customTyping)}>
            <Text
              style={[Fonts.contentMediumMedium, {color: Colors.textNormal}]}>
              직접 입력
            </Text>
          </Pressable>
        )}
        {nearByLocations &&
          !typing &&
          nearByLocations.map((item, key) => (
            <Pressable
              key={key}
              style={styles.locationList}
              id={item}
              onPress={() => goBack(item)}>
              <Text
                style={[Fonts.contentMediumMedium, {color: Colors.textNormal}]}>
                {item}
              </Text>
            </Pressable>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FindingLocation;
