/* eslint-disable @typescript-eslint/no-empty-function */
import Spacing from '@styles/spacing';
import React from 'react';
import {StyleSheet, TouchableOpacity, TextStyle, ViewStyle} from 'react-native';
import colors from '@styles/colors';
import Text from '@atoms/Text';
import AppColors from '@styles/colors';
import { FontSize } from '@src/styles/typography';
import Fonts from '@src/assets/fonts';

// Required props
interface HeaderLeftRequiredProps {
  title: string;
}

// Optional props
interface HeaderLeftOptionalProps {
  leftContainerStyle?: ViewStyle;
  onLeftPressed?: () => void;
  leftIconName?: string;
  leftIconColor?: string;
  leftIconSize?: number;
  leftText?: string;
  leftTextStyle?: TextStyle;
  leftElement?: any;
}

// Combine required and optional props to build the full prop interface
export interface HeaderLeftProps
  extends HeaderLeftRequiredProps,
    HeaderLeftOptionalProps {}

// Use the optional prop interface to define the default props
const defaultProps: HeaderLeftOptionalProps = {
  leftContainerStyle: {},
  onLeftPressed: () => {},
  leftIconName: '',
  leftIconColor: colors.WHITE,
  leftIconSize: 20,
  leftText: '',
  leftTextStyle: {},
  leftElement: undefined,
};

const HeaderLeft = (props: HeaderLeftProps) => {
  const {
    leftContainerStyle,
    onLeftPressed,
    leftText,
    leftTextStyle,
    leftElement,
  } = props;
  const LeftElement = leftElement;

  return (
    <TouchableOpacity
      testID={'HeaderLeft'}
      disabled
      style={[styles.container, leftContainerStyle]}
      onPress={onLeftPressed}>
      {leftText !== '' ? (
        <Text
          textstyle={[styles.leftText, leftTextStyle]}
          text={leftText || ''}
        />
      ) : null}
      {leftElement && <LeftElement />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  leftText: {
    lineHeight: 24,
    fontSize: FontSize._22,
    fontWeight: '700',
    paddingStart: Spacing.SCALE_24,
    fontFamily: Fonts.bold,
    color: AppColors.WHITE,
    textAlign: 'left',
  },
});

HeaderLeft.defaultProps = defaultProps;

export default HeaderLeft;
