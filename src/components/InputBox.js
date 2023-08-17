import {View, Text, TextInput, StyleSheet, Dimensions} from 'react-native';
import {useTheme} from '../hooks';
import React from 'react';
import {responsiveHeight, responsiveWidth} from './Scale';
const InputBox = React.forwardRef(
  (
    {
      title,
      placeholder,
      onChangeText,
      value,
      isWrong,
      passwordInvisible,
      width,
      maxLength,
      editable,
      keyboardType,
    },
    ref,
  ) => {
    const {Fonts} = useTheme();
    const screen = Dimensions.get('screen');
    const screenWidth = screen.width;
    const screenHeight = screen.height;

    const styles = StyleSheet.create({
      headerContainer: {
        width: !width ? responsiveWidth(370) : responsiveWidth(width),
        height: responsiveHeight(26),
      },
      loginInput: {
        height: responsiveHeight(48),
        width: !width ? responsiveWidth(370) : responsiveWidth(width),
        borderRadius: responsiveWidth(12),
        backgroundColor: '#F2F4F6',
        paddingHorizontal: responsiveWidth(10),
      },
      wrongInput: {
        borderWidth: responsiveWidth(1),
        borderColor: '#E44949',
      },
    });

    return (
      <>
        <View style={styles.headerContainer}>
          <Text style={Fonts.inputHeader}>{title}</Text>
        </View>
        <TextInput
          style={[
            Fonts.contentRegualrMedium,
            styles.loginInput,
            isWrong ? styles.wrongInput : '',
          ]}
          placeholder={placeholder}
          placeholderTextColor={'#6D7582'}
          onChangeText={onChangeText}
          secureTextEntry={passwordInvisible}
          value={value}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={!editable}
          ref={ref}
        />
      </>
    );
  },
);

export default InputBox;
