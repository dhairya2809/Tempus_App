import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet, Animated, Dimensions} from 'react-native';
import PropTypes from 'prop-types';

const SCREEN_HEIGHT = Dimensions.get('screen').height;

// Required props
interface BlurOverlayRequiredProps {}

// Optional props
interface BlurOverlayOptionalProps {
  showOverlay?: boolean;
  overlayBlurType?: any;
  overlaySolidColor?: any;
  overlayType: any;
  children?: any;
  overlayGradientColors: any;
}

// Combine required and optional props to build the full prop interface
interface BlurOverlayProps
  extends BlurOverlayRequiredProps,
    BlurOverlayOptionalProps {}

// Use the optional prop interface to define the default props
const defaultProps: BlurOverlayOptionalProps = {
  overlayBlurType: 'dark',
  overlayGradientColors: ['transparent', '#1e3c60'],
  overlayType: 'solid',
  overlaySolidColor: '#ffffff',
};

const BlurOverlay = (blurOverlayProps: BlurOverlayProps, {}) => {
  const {showOverlay, overlaySolidColor, children} = blurOverlayProps;
  const blurContainerOpacityAnimationValue = useRef(
    new Animated.Value(0),
  ).current;
  const blurContainerTranslateYAnimationValue = useRef(
    new Animated.Value(0),
  ).current;

  const viewRef = React.useRef<View | null>(null);

  const [hideOverlay, setHideOverlay] = useState(true);

  if (showOverlay) {
    Animated.sequence([
      Animated.timing(blurContainerTranslateYAnimationValue, {
        toValue: -SCREEN_HEIGHT,
        duration: 1,
        useNativeDriver: true,
      }),
      Animated.timing(blurContainerOpacityAnimationValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  } else {
    Animated.sequence([
      Animated.timing(blurContainerOpacityAnimationValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(blurContainerTranslateYAnimationValue, {
        toValue: 0,
        duration: 1,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!hideOverlay) {
        setHideOverlay(true);
      }
    });
  }

  useEffect(() => {
    if (showOverlay && hideOverlay) {
      setHideOverlay(false);
    }
  }, [hideOverlay, showOverlay]);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: overlaySolidColor,
          },
        ]}
        ref={viewRef}>
        {children}
      </View>
      <Animated.View
        style={[
          styles.blurContainer,
          {
            opacity: blurContainerOpacityAnimationValue,
            transform: [
              {
                translateY: blurContainerTranslateYAnimationValue,
              },
            ],
          },
        ]}>
        {/* Problem on Android */}
        {/* {!hideOverlay && (
          <BlurView
            style={styles.blur}
            // viewRef={viewRef.current}
            blurType={overlayBlurType}
            blurAmount={10}
            {...props}
          />
        )} */}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  blur: {flex: 1},
  blurContainer: {
    height: SCREEN_HEIGHT,
    left: 0,
    position: 'absolute',
    right: 0,
    top: SCREEN_HEIGHT,
  },
  container: {
    flex: 1,
  },
});

BlurOverlay.defaultProps = defaultProps;

BlurOverlay.propTypes = {
  children: PropTypes.node,
};

export default React.memo(BlurOverlay);
