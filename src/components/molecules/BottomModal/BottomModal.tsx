import Fonts from '@src/assets/fonts';
import Button from '@src/components/atoms/Button';
import {localiseString} from '@src/locales';
import {RouteName, StackName} from '@src/navigation/RouteName';
import {
  removeCheckedInData,
  removeCheckedOutData,
  removeOfflineCheckedData,
} from '@src/store/local/LocalStorage';
import SensitiveStorage from '@src/store/sensitive/SensitiveStorage';
import AppColors from '@src/styles/colors';
import Spacing from '@src/styles/spacing';
import {FontSize} from '@src/styles/typography';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

interface BottomModalProps {
  isVisible: boolean;
  onClose: () => void;
  navigation: any;
  hideEmployeeButton?: boolean;
}

const BottomModal: React.FC<BottomModalProps> = ({
  isVisible,
  onClose,
  navigation,
  hideEmployeeButton = false,
}) => {
  const onPressLogout = (type: string) => {
    switch (type) {
      case 'company':
        SensitiveStorage.clearCompanyKeychain();
        onClose();
        removeCheckedInData();
        removeCheckedOutData();
        removeOfflineCheckedData();
        navigation.replace(StackName.Auth);
        break;
      case 'employee':
        removeCheckedInData();
        removeCheckedOutData();
        removeOfflineCheckedData();
        SensitiveStorage.clearEmployeeKeychain();
        navigation.replace(StackName.Auth, {screen: RouteName.EmployeeLogin});
        onClose();
        break;
      case 'cancel':
        onClose();
        break;

      default:
        break;
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{localiseString('logoutModal.title')}</Text>
        <Text style={styles.description}>
          {localiseString('logoutModal.desc')}
        </Text>
        <Button
          large
          title={localiseString('logoutModal.compTitle')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
          onPress={() => {
            onPressLogout('company');
          }}
        />
        {!hideEmployeeButton ? (
          <Button
            large
            title={localiseString('logoutModal.empTitle')}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            onPress={() => {
              onPressLogout('employee');
            }}
          />
        ) : null}
        <Button
          large
          title={localiseString('general.cancel')}
          noBackground
          buttonStyle={styles.cancelButton}
          titleStyle={styles.buttonText}
          onPress={() => {
            onPressLogout('cancel');
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: AppColors.WHITE,
    padding: Spacing.SCALE_24,
    borderTopLeftRadius: Spacing.SCALE_20,
    borderTopRightRadius: Spacing.SCALE_20,
  },
  title: {
    fontSize: FontSize._20,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: Fonts.normal,
  },
  description: {
    fontSize: FontSize._16,
    marginBottom: Spacing.SCALE_16,
    color: AppColors.GREY,
    fontFamily: Fonts.normal,
    fontWeight: '600',
  },
  button: {
    width: '100%',
  },
  cancelButton: {
    backgroundColor: AppColors.GRAY_BG,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: FontSize._16,
    fontFamily: Fonts.semiBold,
  },
});

export default BottomModal;
