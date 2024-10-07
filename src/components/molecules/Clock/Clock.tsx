/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '@atoms/Text';
import {scaleSize} from '@src/styles/mixins';
import {FontSize, LineHeight} from '@src/styles/typography';
import AppColors from '@src/styles/colors';
import moment from 'moment';
import Fonts from '@src/assets/fonts';
import Spacing from '@src/styles/spacing';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    // Update the time every second
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View testID={'Clock'} style={styles.flexRow}>
      <Text
        text={currentTime.format('HH:mm:ss')}
        textstyle={styles.timeTitle}
      />
      <Text
        text={currentTime.format('DD-MM-YYYY')}
        textstyle={{marginTop: Spacing.SCALE_6, fontWeight: '700'}}
        primaryColor
        fontSize={FontSize._18}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  timeTitle: {
    lineHeight: LineHeight._40,
    fontSize: FontSize._28,
    color: AppColors.THEME_TEXT,
    fontFamily: Fonts.bold,
    textAlign: 'center',
    fontWeight: '800',
  },
  flexRow: {
    backgroundColor: AppColors.TRANSPARENT,
    padding: Spacing.SCALE_4,
    borderRadius: Spacing.SCALE_8,
    width: scaleSize(150),
    alignSelf: 'center',
  },
});

Clock.propTypes = {};

export default Clock;
