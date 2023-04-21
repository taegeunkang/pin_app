import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { BorderRadius, Colors, FontSize } from '../../theme/Variables';
import ListContent from "./ListContent.js";
import { WithLocalSvg } from 'react-native-svg';
import UpBtn from "../../theme/assets/images/up-long-solid.svg";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
const ListModal = ({closeModal}) => {
  const { t } = useTranslation('content');
  const [modalHeight, setModalHeight] = useState(70);
  const stretch = () => {
    setModalHeight((modalHeight == 70) ? 95 : 70);
  }

  return (
    <View style={styles.container}>
      <Pressable style={{backgroundColor : 'transparent', flex: 1}} onPress={closeModal} />
      <View style={[styles.popUp, {height: modalHeight +'%'}]}>
        <View style={styles.content}>
          <Text
            style={{
              fontSize: FontSize.large,
              fontWeight: '800',
            }}
          >
            {t('content.title')}
          </Text>
          <Pressable onPress={stretch} style={{flexDirection: 'row'}}>
            <WithLocalSvg width={20} height={20} asset={UpBtn} /><Text style={{fontSize: FontSize.tiny}}>up</Text>
          </Pressable>
        </View>
        <ScrollView style={[{width: '100%', height: '80%', backgroundColor: Colors.lightGray}]}>
            <ListContent/>
            <ListContent/>
            <ListContent/>
            <ListContent/>
            <ListContent/>
            <ListContent/>

        </ScrollView>
     
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.3)',
    justifyContent: 'flex-end',
  },
  popUp: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xLarge,
    borderTopRightRadius: BorderRadius.xLarge,
  },
  content: {
    width: '100%',
    height: 70,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection:'row',
    justifyContent : 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    height: '40%',
    backgroundColor: Colors.transparent,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cancle: {
    width: 170,
    height: 60,
    borderWidth: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.small,
  },
  goBack: {
    width: 170,
    height: 60,
    borderWidth: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.small,
    backgroundColor: Colors.DarkGray,
  },
});

export default ListModal;
