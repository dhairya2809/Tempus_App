import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  Image,
} from 'react-native';
import images from '@src/assets/images';
import {scaleSize} from '@src/styles/mixins';
import {RouteName} from '@src/navigation/RouteName';
import AppColors from '@src/styles/colors';
import { useDispatch } from 'react-redux';
import { setLangModalState } from '@src/store/redux/actions/Comman';

// Required props
interface HeaderRightRequiredProps {
  title: string;
  navigation: any;
  onPressLogout?: any;
}

// Optional props
interface HeaderRightOptionalProps {
  containerStyle?: ViewStyle;
  onPress?: any;
  rightMostElementStyle?: any;
  showRightElements?: boolean;
  showLogoutButton?: boolean;
}

// Combine required and optional props to build the full prop interface
export interface HeaderRightProps
  extends HeaderRightRequiredProps,
    HeaderRightOptionalProps {}

// Use the optional prop interface to define the default props
const defaultProps: HeaderRightOptionalProps = {
  containerStyle: undefined,
  onPress: () => {},
  rightMostElementStyle: {},
  showRightElements: true,
  showLogoutButton: false,
};

const HeaderRight = (props: HeaderRightProps) => {
  const {
    containerStyle,
    showRightElements,
    navigation,
    onPressLogout,
    showLogoutButton,
  } = props;

  const dispatch = useDispatch();

  const onPressHome = async () => {
    navigation?.navigate(RouteName.Dashboard);
  };

  const onPressLanguage = () => {
    dispatch(setLangModalState(true));
  };

  if (showLogoutButton) {
    return (
      <View testID={'HeaderRight'} style={[styles.container, containerStyle]}>
        <TouchableOpacity onPress={onPressLogout} style={styles.iconButton}>
          <Image
            source={images.signout}
            style={styles.iconStyle}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
    );
  }

  if (!showRightElements) {
    return null;
  }

  return (
    <View testID={'HeaderRight'} style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={() => {
          navigation?.navigate(RouteName.Profile);
        }}
        style={styles.iconButton}>
        <Image
          source={images.user}
          style={styles.iconStyle}
          resizeMode={'contain'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressHome} style={styles.iconButton}>
        <Image
          source={images.home}
          style={styles.iconStyle}
          resizeMode={'contain'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressLanguage} style={styles.iconButton}>
        <Image
          source={images.language}
          style={styles.iconStyle}
          resizeMode={'contain'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressLogout} style={styles.iconButton}>
        <Image
          source={images.signout}
          style={styles.iconStyle}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginEnd: scaleSize(10),
  },
  iconStyle: {
    height: scaleSize(20),
    width: scaleSize(20),
    tintColor: AppColors.WHITE,
  },
  iconButton: {
    margin: scaleSize(9),
    padding: scaleSize(3),
  },
});

HeaderRight.defaultProps = defaultProps;

HeaderRight.propTypes = {};

export default HeaderRight;
