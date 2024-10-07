import React from 'react';
import {ViewStyle, View} from 'react-native';
interface BannerRequiredProps {
  isSuccess: boolean;
  isVisible: boolean;
}
interface BannerOptionalProps {
  title?: string;
  message?: string;
  style: ViewStyle;
}

interface BannerProps extends BannerRequiredProps, BannerOptionalProps {}

const defaultProps: BannerOptionalProps = {
  style: {},
};

const Banner = (props: BannerProps) => {
  const {isSuccess, isVisible} = props;

  return <>{isVisible && <View>{isSuccess ? <View /> : <View />}</View>}</>;
};

Banner.defaultProps = defaultProps;

export default Banner;
