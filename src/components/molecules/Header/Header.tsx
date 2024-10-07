/*
 *   Copyright (c) 2023
 *   All rights reserved.
 */
import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  ViewStyle,
  ImageBackground,
} from 'react-native';
import HeaderLeft, {HeaderLeftProps} from './HeaderLeft';
import HeaderCenter, {HeaderCenterProps} from './HeaderCenter';
import HeaderRight, {HeaderRightProps} from './HeaderRight';
import {isIphoneX} from 'react-native-iphone-x-helper';
import AppColors from '@styles/colors';
import images from '@src/assets/images';

// Required props
interface HeaderRequiredProps {
  title: string;
}

// Optional props
interface HeaderOptionalProps {
  headerColor: string;
  containerStyle?: ViewStyle;
  statusBarStyle: ViewStyle;
}

// Combine required and optional props to build the full prop interface
interface HeaderProps
  extends HeaderRequiredProps,
    HeaderOptionalProps,
    HeaderLeftProps,
    HeaderCenterProps,
    HeaderRightProps {}

// Use the optional prop interface to define the default props
const defaultProps: HeaderOptionalProps = {
  headerColor: AppColors.WHITE,
  containerStyle: {},
  statusBarStyle: {},
};

const IS_IPHONE_X = isIphoneX();
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 110 : 80) : 70;
export const HEADER_EXPANDED_HEIGHT =
  Platform.OS === 'ios' ? (IS_IPHONE_X ? 150 : 126) : 122;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

const Header = (props: HeaderProps) => {
  const {headerColor, containerStyle, statusBarStyle} = props;
  return (
    <>
      <View style={[styles.statusBar, statusBarStyle]} />
      <ImageBackground
        testID="Header"
        source={images.bg_gradient}
        style={[
          styles.container,
          containerStyle,
          {backgroundColor: headerColor},
        ]}>
        <HeaderLeft {...props} />
        <HeaderCenter {...props} />
        <HeaderRight {...props} />
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: NAV_BAR_HEIGHT,
    justifyContent: 'center',
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: AppColors.WHITE,
  },
});

Header.defaultProps = defaultProps;

Header.propTypes = {};

export default Header;
