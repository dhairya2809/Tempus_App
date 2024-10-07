/* eslint-disable @typescript-eslint/no-empty-interface */
import AppColors from '@src/styles/colors';
import React from 'react';
import {
  View,
  ActivityIndicator as RNActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';

// Required props
interface ActivityIndicatorRequiredProps {}

// Optional props
interface ActivityIndicatorOptionalProps {
  color?: string;
  size?: number;
  thickness?: number;
  containerStyle?: ViewStyle;
}

// Combine required and optional props to build the full prop interface
interface ActivityIndicatorProps
  extends ActivityIndicatorRequiredProps,
    ActivityIndicatorOptionalProps {}

// Use the optional prop interface to define the default props
const defaultProps: ActivityIndicatorOptionalProps = {
  color: AppColors.BLACK,
  size: 45,
  containerStyle: undefined,
};

const ActivityIndicator = (props: ActivityIndicatorProps) => {
  const {color, size, containerStyle} = props;
  return (
    <View testID="ActivityIndicator" style={[styles.container, containerStyle]}>
      <RNActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

ActivityIndicator.defaultProps = defaultProps;

ActivityIndicator.propTypes = {};

export default ActivityIndicator;
