import {View, StyleSheet, Text, Pressable, SafeAreaView} from 'react-native';
import {BorderRadius, Colors, FontSize} from '../../theme/Variables';
import {useTranslation} from 'react-i18next';
import SubmitButton2 from '../SubmitButton2';
import SubmitButton from '../SubmitButton';
import {responsiveHeight, responsiveWidth} from '../Scale';
const EditComment = ({close, deleteComment}) => {
  const {t} = useTranslation('register');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Pressable onPress={deleteComment} style={[styles.btn, styles.normal]}>
          <Text style={styles.main}>삭제</Text>
        </Pressable>
      </View>

      <Pressable onPress={close} style={[styles.btn, styles.last]}>
        <Text
          style={{
            fontFamily: 'SpoqaHanSansNeo-Medium',
            fontSize: responsiveWidth(14),
            lineHeight: responsiveHeight(24),
            letterSpacing: responsiveWidth(-0.6),
            color: '#E44949',
          }}>
          취소
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
    width: responsiveWidth(370),
    borderRadius: responsiveWidth(12),
    backgroundColor: '#FFFFFF',
  },
  main: {
    color: '#4880EE',
    fontFamily: 'SpoqaHanSansNeo-Medium',
    fontSize: responsiveWidth(14),
    lineHeight: responsiveHeight(24),
    letterSpacing: responsiveWidth(-0.6),
  },
  btn: {
    width: responsiveWidth(370),
    height: responsiveHeight(70),
    alignItems: 'center',
    justifyContent: 'center',
  },

  last: {
    marginVertical: responsiveHeight(10),
    backgroundColor: '#FFFFFF',
    borderRadius: responsiveWidth(12),
  },
});

export default EditComment;
