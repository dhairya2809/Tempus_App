import * as React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Spacing from '@styles/spacing';
import images from '@src/assets/images';
import {scaleSize} from '@src/styles/mixins';
import AppColors from '@src/styles/colors';
import Text from '@src/components/atoms/Text';
import {FontSize, LineHeight} from '@src/styles/typography';
import ReactNativeModal from 'react-native-modal';
import moment from 'moment';
import {useSelector} from 'react-redux';

function SuccessView({showView, close, message}: any) {
  const selector = useSelector((event: any) => event.state);
  const empData = selector.employeeData;
  const checkedInTime = selector?.checkedInData?.timestamp;
  const checkedOutTime = selector?.checkedOutData?.timestamp;

  return (
    <ReactNativeModal
      isVisible={showView}
      onBackdropPress={() => {
        close(false);
      }}
      style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <TouchableOpacity
          onPress={() => {
            close(false);
          }}>
          <Image
            source={images.cancel}
            style={styles.cancelStyle}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <Image source={images.check} style={styles.logoStyle} />

        <Text
          text={message}
          fontSize={FontSize._30}
          lineHeight={LineHeight._40}
          color={AppColors.THEME_TEXT}
          weight={'700'}
          marginTop={scaleSize(80)}
        />

        <Text
          text={`${empData.Name}\n${empData.Id}\n${moment(checkedInTime).format(
            'YYYY-MM-DD HH:mm:ss',
          )}`}
          fontSize={FontSize._20}
          lineHeight={LineHeight._24}
          color={AppColors.THEME_TEXT}
          weight={'400'}
          marginTop={scaleSize(20)}
        />
      </View>
    </ReactNativeModal>
  );
}

export default SuccessView;

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: AppColors.WHITE,
    padding: Spacing.SCALE_24,
    borderRadius: Spacing.SCALE_20,
  },
  logoStyle: {
    height: scaleSize(136),
    width: scaleSize(136),
    alignSelf: 'center',
    top: scaleSize(30),
  },
  cancelStyle: {
    height: scaleSize(32),
    width: scaleSize(32),
    alignSelf: 'flex-end',
  },
});
