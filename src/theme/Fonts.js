/**
 * This file contains all application's style relative to fonts
 */
import {StyleSheet} from 'react-native';
export default function ({FontSize, Colors}) {
  return StyleSheet.create({
    textTiny: {
      fontSize: FontSize.tiny,
      color: Colors.text,
    },
    textSmall: {
      fontSize: FontSize.small,
      color: Colors.text,
    },
    textRegular: {
      fontSize: FontSize.regular,
      color: Colors.text,
    },
    textLarge: {
      fontSize: FontSize.large,
      color: Colors.text,
    },
    textBold: {
      fontWeight: 'bold',
    },
    textUppercase: {
      textTransform: 'uppercase',
    },
    titleSmall: {
      fontSize: FontSize.small * 2,
      fontWeight: 'bold',
      color: Colors.text,
    },
    titleRegular: {
      fontSize: FontSize.regular * 2,
      fontWeight: 'bold',
      color: Colors.text,
    },
    titleLarge: {
      fontSize: FontSize.large * 2,
      fontWeight: 'bold',
      color: Colors.text,
    },
    textCenter: {
      textAlign: 'center',
    },
    textJustify: {
      textAlign: 'justify',
    },
    textLeft: {
      textAlign: 'left',
    },
    textRight: {
      textAlign: 'right',
    },
    textError: {
      color: Colors.error,
    },
    textSuccess: {
      color: Colors.success,
    },
    textPrimary: {
      color: Colors.primary,
    },
    boldFont: {
      fontFamily: 'SpoqaHanSansNeo-Bold',
    },
    regularFont: {
      fontFamily: 'SpoqaHanSansNeo-Regular',
    },
    thinFont: {
      fontFamily: 'SpoqaHanSansNeo-Thin',
    },
    lightFont: {
      fontFamily: 'SpoqaHanSansNeo-Light',
    },
    inputHeader: {
      fontFamily: 'SpoqaHanSansNeo-Bold',
      fontSize: 12,
      lineHeight: 18,
      letterSpacing: -0.6,
      color: '#353C49',
    },
  });
}
