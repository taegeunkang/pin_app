import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {BorderRadius, Colors, FontSize} from '../../theme/Variables';
import {useTranslation} from 'react-i18next';
import SubmitButton2 from '../SubmitButton2';
import SubmitButton from '../SubmitButton';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {useTheme} from '../../hooks';
const EditComment = ({close, deleteComment}) => {
  const {t} = useTranslation('register');
  const {Fonts, Colors} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0, 0.3)',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: responsiveHeight(25),
    },
    content: {
      width: responsiveWidth(370),
      borderRadius: responsiveWidth(16),
      backgroundColor: Colors.contentBackground,
    },

    btn: {
      width: responsiveWidth(370),
      height: responsiveHeight(70),
      alignItems: 'center',
      justifyContent: 'center',
    },

    last: {
      marginVertical: responsiveHeight(10),
      backgroundColor: Colors.contentBackground,
      borderRadius: responsiveWidth(16),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={deleteComment}
          style={[styles.btn, styles.normal]}>
          <Text style={[{color: Colors.primary}, Fonts.contentMediumMedium]}>
            삭제
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={close} style={[styles.btn, styles.last]}>
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
      </TouchableOpacity>
    </View>
  );
};

export default EditComment;
