/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
  View,
} from 'react-native';
import ActivityIndicator from '@atoms/ActivityIndicator';
import Text from '@atoms/Text';
import AppColors from '@src/styles/colors';
import Spacing from '@src/styles/spacing';
import {boxShadow, scaleSize} from '@src/styles/mixins';

// Required props
interface ButtonRequiredProps {
  onPress: () => void;
  title: string;
}

// Optional props
interface ButtonOptionalProps {
  disabled: boolean;
  loading: boolean;
  loadingColor?: string;
  titleStyle: TextStyle | TextStyle[];
  testID: any;
  buttonStyle: ViewStyle | ViewStyle[];
  leftIconName: string;
  leftIconColor: string;
  leftIconSize: number;
  leftIconStyle: ViewStyle | ViewStyle[];
  rightIconName: string;
  rightIconColor: string;
  rightIconSize: number;
  rightIconStyle: ViewStyle | ViewStyle[];
  rounded: boolean;
  hasBorder: boolean;
  borderColor: any;
  noBackground: boolean;
  xlarge: any;
  large: any;
  medium: any;
  small: any;
  xsmall: any;
  titleSecondaryFont: boolean;
  leftComponent?: React.ReactNode;
  rightElement?: React.ReactNode;
  width?: string;
}

// Combine required and optional props to build the full prop interface
interface ButtonProps extends ButtonRequiredProps, ButtonOptionalProps {}

// Use the optional prop interface to define the default props
const defaultProps: ButtonOptionalProps = {
  disabled: false,
  loading: false,
  titleStyle: {},
  testID: '',
  buttonStyle: {},
  leftIconName: '',
  leftIconColor: AppColors.WHITE,
  leftIconSize: 20,
  leftIconStyle: {},
  rightIconName: '',
  rightIconColor: AppColors.WHITE,
  rightIconSize: 10,
  rightIconStyle: {},
  rounded: false,
  hasBorder: false,
  borderColor: AppColors.BLACK,
  noBackground: false,
  xlarge: '',
  large: '',
  medium: '',
  small: '',
  xsmall: '',
  titleSecondaryFont: false,
  width: '100%',
};

const Button = (props: ButtonProps) => {
  const {
    onPress,
    title,
    disabled,
    loading,
    loadingColor = AppColors.WHITE,
    titleStyle,
    buttonStyle,
    testID,
    rounded,
    hasBorder,
    borderColor,
    noBackground,
    xlarge,
    large,
    medium,
    small,
    xsmall,
  } = props;
  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.buttonContainer,
        styles.activeButtonStyle,
        rounded && styles.rounded,
        hasBorder && styles.border,
        hasBorder && {borderColor: borderColor},
        noBackground && styles.noBackground,
        xlarge !== '' && {height: 60},
        large !== '' && {height: 50},
        medium !== '' && {height: 40},
        small !== '' && {height: 36},
        xsmall !== '' && {height: 24},
        buttonStyle,
        disabled && {opacity: 0.5} && styles.disabledButtonStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}>
      <>
        <View style={styles.flexRowCenter}>
          <>
            <View />
            {loading || (
              <Text
                textstyle={[
                  styles.title,
                  styles.activeTextStyle,
                  disabled && styles.disabledTextStyle,
                  titleStyle,
                ]}
                text={title}
                fontWeight="semiBold"
              />
            )}
          </>
        </View>

        <View />
        {loading && <ActivityIndicator color={loadingColor} size={24} />}
      </>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: Spacing.SCALE_16,
    paddingHorizontal: 20,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(65),
    width: scaleSize(260),
    marginTop: Spacing.SCALE_16,
    ...boxShadow(AppColors.DARK_GRAY, {height: 1, width: 0.3}, 4, 1),
  },
  title: {
    color: AppColors.WHITE,
    fontSize: Spacing.SCALE_24,
    lineHeight: 32,
    fontWeight: '600',
  },
  icon: {
    paddingRight: 8,
  },
  rounded: {
    width: 50,
    height: 50,
    borderRadius: Spacing.SCALE_50,
  },
  border: {
    borderWidth: 1,
    backgroundColor: AppColors.TRANSPARENT,
    borderColor: AppColors.GREY,
  },
  noBackground: {
    borderWidth: 0,
    backgroundColor: AppColors.TRANSPARENT,
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeButtonStyle: {
    backgroundColor: AppColors.THEME,
  },
  disabledButtonStyle: {
    backgroundColor: AppColors.THEME,
  },
  activeTextStyle: {
    color: AppColors.WHITE,
  },
  disabledTextStyle: {
    color: AppColors.BLACK,
  },
});

Button.defaultProps = defaultProps;

export default Button;
