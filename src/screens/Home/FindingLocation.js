import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
const FindingLocation = ({navigation}) => {
  const [nearByLocations, setNearByLocations] = useState([]);
  const [customTyping, setCustomTyping] = useState('');
  const [typing, setTyping] = useState(false);
  const {t} = useTranslation('newPost');

  const getNearByLocations = async () => {
    const lat = await AsyncStorage.getItem('lat');
    const lon = await AsyncStorage.getItem('lon');

    const response = await fetch(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
        lat +
        ', ' +
        lon +
        '&radius=100&key=AIzaSyBILqPwgBj9FmAjrifBmJGyJlcYz4w6ClY&language=ko&rankby=prominence',
      {method: 'GET'},
    ).then(async res => await res.json());

    setNearByLocations(response['results'].map(item => item['name']));
  };

  const goBack = item => {
    navigation.navigate('WriteContent', {locationName: item});
  };
  const onChangeTyping = e => {
    setCustomTyping(e);
    console.log(e);
    // console.log(customTyping);
    if (e.length > 0) {
      setTyping(true);
    } else {
      console.log('empty');
      setTyping(false);
    }
  };

  useEffect(() => {
    getNearByLocations();
  }, []);
  return (
    <ScrollView>
      <Pressable style={[styles.list, styles.search]}>
        <TextInput
          placeholder={t('write.content.location')}
          style={{width: '100%', height: '100%'}}
          value={customTyping}
          onChangeText={e => onChangeTyping(e)}
        />
      </Pressable>
      {nearByLocations &&
        !typing &&
        nearByLocations.map((item, key) => (
          <Pressable
            key={key}
            style={styles.list}
            id={item}
            onPress={() => goBack(item)}>
            <Text>{item}</Text>
          </Pressable>
        ))}
      {typing && (
        <Pressable style={styles.list} onPress={() => goBack(customTyping)}>
          <Text>{customTyping}</Text>
        </Pressable>
      )}

      {/* <Button onPress={goBack}>goBack</Button> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    width: '100%',
    height: 50,
    borderTopWidth: 1,
    borderTopColor: 'gray',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
  },
});
export default FindingLocation;
