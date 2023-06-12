import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
const FindingLocation = ({navigation}) => {
  const [nearByLocations, setNearByLocations] = useState([]);
  const {t} = useTranslation('newPost');
  const getNearByLocations = async () => {
    const response = await fetch(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.5077, 126.8916&radius=100&key=AIzaSyBILqPwgBj9FmAjrifBmJGyJlcYz4w6ClY&language=ko&rankby=prominence',
      {method: 'GET'},
    ).then(async res => await res.json());

    setNearByLocations(response['results'].map(item => item['name']));
  };

  const goBack = item => {
    navigation.navigate('WriteContent', {locationName: item});
  };

  useEffect(() => {
    getNearByLocations();
  }, []);
  return (
    <ScrollView>
      <Pressable style={styles.list}>
        <Text>{t('write.content.location')}</Text>
      </Pressable>
      {nearByLocations &&
        nearByLocations.map(item => (
          <Pressable style={styles.list} id={item} onPress={() => goBack(item)}>
            <Text>{item}</Text>
          </Pressable>
        ))}

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
});
export default FindingLocation;
