/* eslint-disable @typescript-eslint/no-unused-vars */

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleProp,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import Text from '@atoms/Text';
import Spacing from '@styles/spacing';
import {FontSize, FontWeight} from '@src/styles/typography';
import AppColors from '@src/styles/colors';
import Fonts from '@src/assets/fonts';
import {scaleSize} from '@src/styles/mixins';

// Required props
interface TextInputRequiredProps {
  placeholder: string;
  placeholderTextColor: string;
  onChangeText: (text: string) => void;
  value: string;
}

// Optional props
interface TextInputOptionalProps {
  testID: string;
  editable: boolean;
  leftIconPressable: boolean;

  hasBorder: boolean;
  borderColor: any;
  borderWidth: number;
  borderRadius: number;

  backgroundColor: string;
  containerStyle: StyleProp<ViewStyle>;

  rightIconSize: number;
  rightIconName: string | any;
  rightIconColor: string;
  rightIconContainerStyle: ViewStyle;

  leftText?: string;
  leftIconSize: number;
  leftIconName: string | any;
  leftIconColor: string;
  leftIconContainerStyle: ViewStyle;

  textInputStyle: StyleProp<TextStyle>;

  onEndEditing: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  onFocus: () => void;
  onBlur: () => void;
  onPressLeftIcon: () => void;
  onPressRightIcon?: () => void;
  inputProps?: RNTextInputProps;
  value: string;
  returnKeyType: any;
  maxLength?: number;
  titleText?: string;
  titleStyle?: StyleProp<TextStyle>;
  errorText?: string | any;
  errorStyle?: StyleProp<TextStyle>;
  multiline?: boolean;
  secureTextEntry?: boolean;
  hint?: string;
}

// Combine required and optional props to build the full prop interface
interface TextInputProps
  extends TextInputRequiredProps,
    TextInputOptionalProps {}

// Use the optional prop interface to define the default props
const defaultProps: TextInputProps = {
  testID: '',
  placeholder: '',
  placeholderTextColor: AppColors.GREY,
  leftIconPressable: false,
  editable: true,
  hasBorder: false,
  borderColor: 'black',
  borderWidth: 1,
  borderRadius: Spacing.SCALE_8,

  containerStyle: {},
  backgroundColor: AppColors.WHITE,

  leftIconSize: 20,
  leftIconName: undefined,
  leftIconColor: 'black',
  leftIconContainerStyle: {},

  rightIconSize: 20,
  rightIconName: undefined,
  rightIconColor: 'black',
  rightIconContainerStyle: {},

  textInputStyle: {},
  onChangeText: (_text: string) => {},
  onEndEditing: (_text: string) => {},
  keyboardType: 'default',
  onFocus: () => {},
  onBlur: () => {},
  onPressLeftIcon: () => {},
  value: '',
  returnKeyType: 'default',
  maxLength: undefined,

  titleText: '',
  titleStyle: {},
  errorText: '',
  errorStyle: {},
  multiline: false,
  hint: '',
  secureTextEntry: false,
  onPressRightIcon: () => {},
};

const TextInput = (textInputProps: TextInputProps) => {
  const {
    testID,
    placeholder,
    placeholderTextColor = AppColors.GREY,
    editable,
    hasBorder,
    borderColor,
    borderWidth,
    borderRadius,
    containerStyle,
    backgroundColor,
    textInputStyle,
    onChangeText,
    keyboardType,
    onFocus,
    onBlur,
    inputProps,
    value,
    returnKeyType = 'default',
    maxLength,
    titleText,
    titleStyle,
    errorText,
    errorStyle,
    multiline,
    secureTextEntry,
    hint,
  } = textInputProps;
  const [isFocus, setIsFocus] = useState(false);

  const onFocusHandler = () => {
    setIsFocus(true);
  };

  const onBlurHandler = () => {
    setIsFocus(false);
  };

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        isFocus && {borderColor: AppColors.THEME},
        containerStyle,
      ]}>
      {Boolean(titleText) && (
        <Text
          textAlign={'left'}
          textstyle={[styles.titleText, titleStyle]}
          text={titleText}
          lineHeight={20}
        />
      )}
      <View
        style={[
          styles.subContainer,
          hasBorder && {
            borderWidth: borderWidth,
            borderColor: borderColor,
            borderRadius: borderRadius,
          },
        ]}>
        <View />
        <RNTextInput
          style={[
            styles.textInput,
            isFocus && {borderColor: AppColors.THEME},
            Boolean(errorText) && {borderColor: AppColors.RED},
            textInputStyle,
          ]}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          editable={editable}
          keyboardType={keyboardType}
          onFocus={() => {
            onFocusHandler();
            onFocus();
          }}
          onBlur={() => {
            onBlurHandler();
            onBlur();
          }}
          value={value}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          textAlignVertical={'center'}
          multiline={multiline}
          selectionColor={AppColors.BLACK}
          secureTextEntry={secureTextEntry}
          {...inputProps}
        />
        <View />
      </View>
      {Boolean(hint) && (
        <Text textAlign={'left'} lineHeight={14} textstyle={[styles.hintText]}>
          {hint}
        </Text>
      )}
      {Boolean(errorText) && (
        <View>
          <Text
            textAlign={'left'}
            textstyle={[styles.errorText, errorStyle]}
            text={errorText}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  subContainer: {
    alignItems: 'center',
  },
  textInput: {
    width: scaleSize(260),
    paddingHorizontal: Spacing.SCALE_6,
    fontSize: FontSize._16,
    color: AppColors.THEME_TEXT,
    height: scaleSize(65),
    marginTop: Spacing.SCALE_4,
    borderRadius: Spacing.SCALE_16,
    borderWidth: 1,
    paddingStart: Spacing.SCALE_10,
    borderColor: AppColors.THEME,
    backgroundColor: AppColors.WHITE_OPACITY,
  },
  titleText: {
    color: AppColors.THEME,
    fontSize: FontSize._14,
    fontFamily: Fonts.semiBold,
    fontWeight: FontWeight._600,
  },
  errorText: {color: AppColors.RED},
  hintText: {
    color: AppColors.BLACK,
    fontSize: FontSize._12,
    marginTop: Spacing.SCALE_8,
  },
});
TextInput.defaultProps = defaultProps;

export default TextInput;
