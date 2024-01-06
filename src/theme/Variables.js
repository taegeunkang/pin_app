/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */
/**
 * Colors
 */
export const Colors = {
  // Example.tsx colors:
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  white: '#ffffff',
  text: '#212529',
  primary: '#4880EE',
  success: '#28a745',
  error: '#dc3545',
  black: '#000000',
  lightGray: '#E4E4E4',
  DarkGray: '#BBBBBB',
  red: '#E44949',
  heartRed: '#F04452',

  screenBackground: '#F2F4F6',
  contentBackground: '#FFFFFF',
  textNormal: '#505866',
  textBold: '#353C49',
  navNotSelect: '#6D7582',
  warn: '#E44949',
  navSelect: '#1A1E27',
  headerTitle: '#1A1E27',

  buttonThirdBackground: '#F2F3F4',
  buttonThirdContent: '#505866',
  buttonSecondBackground: '#EAF3FE',
  buttonSecondContent: '#4880EE',
  buttonFirstBackground: '#4880EE',
  buttonFirstContent: '#FFFFFF',

  inputBackground: '#F2F4F6',
  inputPlaceHolder: '#6D7582',
  inputContent: '#505866',
};
export const NavigationColors = {
  primary: Colors.primary,
};

export const BorderRadius = {
  small: 7,
  medium: 8,
  large: 12,
  xLarge: 16,
};
/**
 * FontSize
 */
export const FontSize = {
  tiny: 12,
  small: 14,
  regular: 16,
  large: 20,
  xLarge: 30,
};
/**
 * Metrics Sizes
 */
const tiny = 10;
const small = tiny * 2; // 20
const regular = tiny * 3; // 30
const large = regular * 2; // 60
export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
};
export default {
  Colors,
  BorderRadius,
  NavigationColors,
  FontSize,
  MetricsSizes,
};
