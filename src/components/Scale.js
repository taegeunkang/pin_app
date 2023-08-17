import {BASE_HEIGHT, BASE_WIDTH} from '../utils/constants';
import {Dimensions} from 'react-native';
const screen = Dimensions.get('screen');
const screenWidth = screen.width;
const screenHeight = screen.height;

export const responsiveHeight = h => {
  return (h / BASE_HEIGHT) * screenHeight;
};
export const responsiveWidth = w => {
  return (w / BASE_WIDTH) * screenWidth;
};
