import Fonts from '@src/assets/fonts';
import AppColors from '@src/styles/colors';
import Spacing from '@src/styles/spacing';
import {FontSize, LineHeight} from '@src/styles/typography';
import {StyleSheet} from 'react-native';
import {
  showMessage,
  MessageType,
  hideMessage,
} from 'react-native-flash-message';

const showToast = (type: MessageType, message: string) => {
  let color = '';
  switch (type) {
    case 'success':
      color = AppColors.GREEN_SUCCESS;
      break;
    case 'danger':
      color = AppColors.RED;
      break;
    case 'warning':
      color = AppColors.YELLOW;
      break;
    case 'info':
      color = AppColors.THEME;
      break;

    default:
      break;
  }
  showMessage({
    message: message,
    type: type,
    animationDuration: 800,
    animated: true,
    style: styles.toastContainer,
    backgroundColor: color,
    titleStyle: styles.titleStyle,
  });
  setTimeout(() => {
    hideMessage();
  }, 3000);
};

export const ToastHandler = {
  showToast,
};

export const styles = StyleSheet.create({
  toastContainer: {
    borderRadius: Spacing.SCALE_6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  titleStyle: {
    fontSize: FontSize._16,
    fontFamily: Fonts.regular,
    lineHeight: LineHeight._24,
  },
});
