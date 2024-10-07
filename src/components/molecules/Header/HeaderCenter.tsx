import React from 'react';
import fonts from '@assets/fonts';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import Text from '@components/atoms/Text';
import {FontSize} from '@src/styles/typography';
import AppColors from '@src/styles/colors';

// Required props
interface HeaderCenterRequiredProps {
  title: string;
}

// Optional props
interface HeaderCenterOptionalProps {
  centerContainerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  centerElement?: any;
}

// Combine required and optional props to build the full prop interface
export interface HeaderCenterProps
  extends HeaderCenterRequiredProps,
    HeaderCenterOptionalProps {}

// Use the optional prop interface to define the default props
const defaultProps: HeaderCenterOptionalProps = {
  centerContainerStyle: undefined,
  titleStyle: undefined,
  centerElement: undefined,
};
const HeaderCenter = (props: HeaderCenterProps) => {
  const {centerContainerStyle, title, titleStyle, centerElement} = props;

  function renderHeaderCenter() {
    if (centerElement) {
      const CenterElement = centerElement;
      return (
        <View style={[styles.container, centerContainerStyle]}>
          <CenterElement />
        </View>
      );
    }
    return (
      <View style={[styles.container, centerContainerStyle]}>
        <Text textstyle={[styles.title, titleStyle]} text={title} />
      </View>
    );
  }
  return renderHeaderCenter();
};

HeaderCenter.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
  },
  title: {
    color: AppColors.BLACK,
    fontFamily: fonts.medium,
    fontSize: FontSize._16,
  },
});

export default HeaderCenter;
