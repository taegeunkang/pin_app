import {
  View,
  StyleSheet,
  Text,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {BorderRadius, Colors, FontSize} from '../../theme/Variables';
import {useTranslation} from 'react-i18next';
import SubmitButton2 from '../SubmitButton2';
import SubmitButton from '../SubmitButton';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {useTheme} from '../../hooks';
const Edit = ({
  myPage,
  close,
  setProfileImage,
  setBackgroundImage,
  setNickname,
}) => {
  const {t} = useTranslation('register');
  const {Fonts, Colors} = useTheme();

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
      borderRadius: responsiveWidth(12),
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={setBackgroundImage}
          style={[styles.btn, styles.normal]}>
          <Text style={[{color: Colors.primary}, Fonts.contentMediumMedium]}>
            배경 이미지 변경
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={setProfileImage}
          style={[styles.btn, styles.normal]}>
          <Text style={[{color: Colors.primary}, Fonts.contentMediumMedium]}>
            프로필 이미지 변경
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={setNickname}
          style={[styles.btn, styles.normal]}>
          <Text style={[{color: Colors.primary}, Fonts.contentMediumMedium]}>
            닉네임 편집
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={close} style={[styles.btn, styles.last]}>
        <Text
          style={[
            Fonts.contentMediumMedium,
            {
              color: Colors.warn,
            },
          ]}>
          취소
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Edit;
