/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import {ImageBackground, View, StyleSheet} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Banner from '@molecules/Banner';
import BlurOverlay from '@molecules/BlurOverlay';
import ScreenLoader from '@molecules/ScreenLoader';

// Required props
interface ScreenContainerRequiredProps {
  backgroundType: any;
  children: any;
}

// Optional props
interface ScreenContainerOptionalProps {
  backgroundImage: any;
  backgroundColor: string;
  showOverlay?: boolean;
  overlayType?: string;
  overlayGradientColors?: any;
  overlaySolidColor?: string;
  showLoaderModal?: boolean;
  loaderMessage?: string;
  onLoaderTimeout?: Function;
  moduleScreen?: boolean;
  shouldBlurOnLoading?: boolean;
  isBannerVisible?: boolean;
  isSuccessBanner?: boolean;
  noWrapper?: boolean;
}

// Combine required and optional props to build the full prop interface
interface ScreenContainerProps
  extends ScreenContainerRequiredProps,
    ScreenContainerOptionalProps {}

// Use the optional prop interface to define the default props
const defaultProps: ScreenContainerOptionalProps = {
  backgroundImage: 0,
  backgroundColor: '#0000',
  showOverlay: false,
  overlayType: 'solid',
  overlayGradientColors: ['transparent', '#1e3c60'],
  overlaySolidColor: '#ffffff',
  showLoaderModal: false,
  moduleScreen: false,
  shouldBlurOnLoading: true,
  isBannerVisible: false,
  isSuccessBanner: false,
};

// Use the full props within the actual component
const ScreenContainer = (props: ScreenContainerProps) => {
  const {
    backgroundType,
    backgroundImage,
    backgroundColor,
    showOverlay,
    overlayType,
    overlaySolidColor,
    children,
    showLoaderModal,
    loaderMessage,
    overlayGradientColors,
    onLoaderTimeout,
    shouldBlurOnLoading,
    isBannerVisible,
    isSuccessBanner,
    noWrapper,
  } = props;

  const _renderChildren = () => {
    if (backgroundType === 'image') {
      return (
        <View style={[styles.container, {backgroundColor}]}>
          <ImageBackground
            source={backgroundImage}
            style={styles.imageBackground}>
            {children}
            <ScreenLoader
              onLoaderTimeout={onLoaderTimeout}
              showLoader={showLoaderModal}
              message={loaderMessage}
              shouldBlurOnLoading={shouldBlurOnLoading}
            />
          </ImageBackground>
        </View>
      );
    } else {
      return (
        <View style={[styles.container, {backgroundColor}]}>
          {children}
          <ScreenLoader
            showLoader={showLoaderModal}
            message={loaderMessage}
            onLoaderTimeout={onLoaderTimeout}
            shouldBlurOnLoading={shouldBlurOnLoading}
          />
        </View>
      );
    }
  };

  function renderContent() {
    const isTablet = DeviceInfo.isTablet();
    const Wrapper = BlurOverlay;

    if (isTablet) {
      if (noWrapper) {
        return _renderChildren();
      }
      return <Wrapper>{_renderChildren()}</Wrapper>;
    }

    return (
      <BlurOverlay
        showOverlay={showOverlay}
        overlayType={overlayType}
        overlayGradientColors={overlayGradientColors}
        overlaySolidColor={overlaySolidColor}>
        {_renderChildren()}
      </BlurOverlay>
    );
  }

  return (
    <React.Fragment>
      {renderContent()}
      <Banner
        isSuccess={Boolean(isSuccessBanner)}
        isVisible={Boolean(isBannerVisible)}
      />
    </React.Fragment>
  );
};

ScreenContainer.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    height: '100%',
    width: '100%',
  },
});

export default ScreenContainer;
