/**
 * This file contains all application's style relative to fonts
 */
import {StyleSheet} from 'react-native';
import {responsiveWidth, responsiveHeight} from '../components/Scale';
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
      fontSize: responsiveWidth(12),
      lineHeight: responsiveHeight(18),
      letterSpacing: responsiveWidth(-0.6),
      color: '#353C49',
    },
    contentRegularBold: {
      fontFamily: 'SpoqaHanSansNeo-Bold',
      fontSize: responsiveWidth(12),
      lineHeight: responsiveHeight(18),
      letterSpacing: responsiveWidth(-0.6),
      color: '#353C49',
    },
    contentRegularRegualr: {
      fontFamily: 'SpoqaHanSansNeo-Regular',
      fontSize: responsiveWidth(12),
      lineHeight: responsiveHeight(18),
      letterSpacing: responsiveWidth(-0.6),
      color: '#505866',
    },
    contentRegualrMedium: {
      fontFamily: 'SpoqaHanSansNeo-Medium',
      fontSize: responsiveWidth(12),
      lineHeight: responsiveHeight(18),
      letterSpacing: responsiveWidth(-0.6),
      color: '#505866',
    },
    contentMediumRegualr: {
      fontFamily: 'SpoqaHanSansNeo-Regular',
      fontSize: responsiveWidth(14),
      lineHeight: responsiveHeight(24),
      letterSpacing: responsiveWidth(-0.6),
      color: '#505866',
    },
    contentMediumMedium: {
      fontFamily: 'SpoqaHanSansNeo-Medium',
      fontSize: responsiveWidth(14),
      lineHeight: responsiveHeight(24),
      letterSpacing: responsiveWidth(-0.6),
      color: '#505866',
    },
    contentMediumBold: {
      fontFamily: 'SpoqaHanSansNeo-Bold',
      fontSize: responsiveWidth(14),
      lineHeight: responsiveHeight(24),
      letterSpacing: responsiveWidth(-0.6),
      color: '#505866',
    },
    contentSmallRegular: {
      fontFamily: 'SpoqaHanSansNeo-Regular',
      fontSize: responsiveWidth(10),
      lineHeight: responsiveHeight(18),
      letterSpacing: responsiveWidth(-0.6),
      color: '#6D7582',
    },
  });
}
