import React from 'react';
import {View, ScrollView, StyleSheet, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Spacing} from '@src/styles';

// Required props
interface ScreenLayoutRequiredProps {
  paddingHorizontal?: number;
}

// Optional props
interface ScreenLayoutOptionalProps {
  header?: any;
  paddingTop: any;
  paddingBottom: number;
  useSafeArea: boolean;
  neverForceInset: any;
  scrollable: boolean;
  children: any;
  contentContainerStyle: ViewStyle;
  awareKeyboard: boolean;
  keyboardShouldPersistTaps?: any | 'always' | 'never' | 'handled' | undefined;
}

// Combine required and optional props to build the full prop interface
interface ScreenLayoutProps
  extends ScreenLayoutRequiredProps,
    ScreenLayoutOptionalProps {}

// Use the optional prop interface to define the default props
const defaultProps: ScreenLayoutOptionalProps = {
  // header: null,
  paddingBottom: 36,
  paddingTop: 16,
  useSafeArea: false,
  neverForceInset: null,
  scrollable: false,
  contentContainerStyle: {},
  children: undefined,
  keyboardShouldPersistTaps: 'handled',
  awareKeyboard: true,
};

const ScreenLayout = (props: ScreenLayoutProps) => {
  const {
    header,
    paddingBottom,
    paddingHorizontal = Spacing.default.SCALE_24,
    paddingTop,
    useSafeArea: enableSafeView,
    neverForceInset,
    children,
    scrollable,
    contentContainerStyle,
    keyboardShouldPersistTaps,
    awareKeyboard = true,
  } = props;

  const safeAreaInsets = useSafeAreaInsets();
  const contentArea = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={[
            {marginTop: paddingTop, paddingBottom, paddingHorizontal},
            contentContainerStyle,
          ]}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          {...props}>
          <KeyboardAwareScrollView scrollEnabled={false}>
            {children}
          </KeyboardAwareScrollView>
        </ScrollView>
      );
    } else if (awareKeyboard) {
      return (
        <KeyboardAwareScrollView
          scrollEnabled={false}
          keyboardDismissMode={'on-drag'}
          contentContainerStyle={[styles.container, contentContainerStyle]}>
          <View
            style={[
              styles.container,
              {paddingTop, paddingBottom, paddingHorizontal},
              contentContainerStyle,
            ]}
            {...props}>
            {children}
          </View>
        </KeyboardAwareScrollView>
      );
    } else if (!awareKeyboard) {
      return (
        <View style={[styles.container, contentContainerStyle]}>
          <View
            style={[
              styles.container,
              {paddingTop, paddingBottom, paddingHorizontal},
              contentContainerStyle,
            ]}
            {...props}>
            {children}
          </View>
        </View>
      );
    }
  };

  const defaultInset = {
    // if header is included set it to 0, header layout will have its safe area
    paddingTop: header ? 0 : safeAreaInsets.top,
    paddingRight: safeAreaInsets.right,
    paddingBottom: safeAreaInsets.bottom,
    paddingLeft: safeAreaInsets.left,
  };

  const forceInsets =
    neverForceInset && neverForceInset.length
      ? neverForceInset.reduce(
          (m: any, inset: string) => {
            let paddingString = '';

            // although tecnically right and left have a 0 value anyway, we maintain this,
            // because it could have a value in landscape mode (which we don't support)
            if (inset === 'top') {
              paddingString = 'paddingTop';
            }
            if (inset === 'right') {
              paddingString = 'paddingRight';
            }
            if (inset === 'bottom') {
              paddingString = 'paddingBottom';
            }
            if (inset === 'left') {
              paddingString = 'paddingLeft';
            }

            return {
              ...m,
              [paddingString]: 0,
            };
          },
          {
            ...defaultInset,
          },
        )
      : {...defaultInset};

  return (
    <View style={[styles.container, enableSafeView ? forceInsets : null]}>
      {header}
      {contentArea()}
    </View>
  );
};

ScreenLayout.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
});

export default ScreenLayout;
