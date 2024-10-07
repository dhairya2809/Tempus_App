import React from 'react';
import {Text as NativeText} from 'react-native';
import fonts from '@assets/fonts';
import AppColors from '@src/styles/colors';

export type FontWeight =
  | 'regular'
  | 'medium'
  | 'bold'
  | 'semibold'
  | 'light'
  | 'black';

// Required props
interface TextRequiredProps {
  text?: string;
}

// Optional props
interface TextOptionalProps {
  fontSize?: number;
  fontWeight?: FontWeight;
  fontStyle?: string;
  letterSpacing?: number;
  textAlign?: any;
  color?: string;
  children?: any;
  textstyle?: any;
  secondary?: boolean;
  numberOfLines?: number;
  lineHeight?: number;
  error?: boolean;
  underLine: boolean;
  paddingEnd?: number;
  onPress?: () => void;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip' | undefined;
  primaryColor: boolean;
  weight?: string;
  marginTop?: number;
}

// Combine required and optional props to build the full prop interface
interface TextProps extends TextRequiredProps, TextOptionalProps {}

// Use the optional prop interface to define the default props
const defaultProps: TextOptionalProps = {
  fontSize: 14,
  fontWeight: 'regular',
  fontStyle: 'normal',
  letterSpacing: 0,
  textAlign: 'center',
  color: AppColors.BLACK,
  children: undefined,
  textstyle: undefined,
  secondary: false,
  error: false,
  lineHeight: 24,
  numberOfLines: 0,
  primaryColor: false,
  underLine: false,
};

const Text = (textProps: TextProps) => {
  const {
    fontSize,
    fontWeight,
    letterSpacing,
    textAlign,
    color,
    children,
    text,
    numberOfLines,
    textstyle,
    lineHeight,
    error,
    onPress,
    ellipsizeMode,
    primaryColor,
    ...props
  } = textProps;

  const getPrimaryFont = () => {
    switch (fontWeight) {
      case 'regular':
        return fonts.regular;
      case 'medium':
        return fonts.regular;
      case 'black':
        return fonts.black;
      case 'bold':
        return fonts.bold;
      case 'semibold':
        return fonts.semiBold;
      case 'light':
        return fonts.light;
      default:
        return fonts.regular;
    }
  };

  return (
    <NativeText
      onPress={onPress}
      allowFontScaling={false}
      style={[
        {
          fontSize,
          letterSpacing,
          textAlign,
          color: primaryColor ? AppColors.THEME_TEXT : color,
          fontFamily: getPrimaryFont(),
          lineHeight: lineHeight,
          paddingEnd: props.paddingEnd,
          fontWeight: props?.weight,
          marginTop: props?.marginTop,
        },
        error && {color: AppColors.RED},
        textstyle,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      {...props}>
      {children || text}
    </NativeText>
  );
};

Text.defaultProps = defaultProps;

// nothing to memo, each prop changed will require update anyway
export default Text;
