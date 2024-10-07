import Fonts from '@src/assets/fonts';
import images from '@src/assets/images';
import Text from '@src/components/atoms/Text';
import {localiseString, setAppLocale} from '@src/locales';
import {
  persistCurrentLang,
  retrieveCurrentLang,
} from '@src/store/local/LocalStorage';
import {setCurrentLanguage, setLangModalState} from '@src/store/redux/actions/Comman';
import AppColors from '@src/styles/colors';
import {scaleSize} from '@src/styles/mixins';
import Spacing from '@src/styles/spacing';
import {FontSize} from '@src/styles/typography';
import React, {useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';

interface LanguageModalProps {}

const LanguageModal: React.FC<LanguageModalProps> = () => {
  const LANGUAGE_OPTIONS = [
    localiseString('general.portuguese'),
    localiseString('general.english'),
    localiseString('general.french'),
    localiseString('general.spanish'),
  ];

  const [currentLang, setCurrentLang] = useState(LANGUAGE_OPTIONS[0]);
  const [showLangModal, setShowLangModal] = useState(false);
  const dispatch = useDispatch();

  const langaugeModalState = useSelector(
    (event: any) => event?.state?.showLangModal,
  );

  React.useEffect(() => {
    initLanguage();
  }, []);

  React.useEffect(() => {
    if (langaugeModalState) {
      setShowLangModal(true);
    } else {
      setShowLangModal(false);
    }
  }, [langaugeModalState]);

  const initLanguage = async () => {
    const lang = await retrieveCurrentLang();
    setCurrentLang(lang?.langCode);
  };

  const onPressLangSelection = (langName: string, langCode: string) => {
    setCurrentLang(langCode);
    setAppLocale(langCode);
    persistCurrentLang({langCode: langCode});
    dispatch(setCurrentLanguage(langCode));
    onClose();
  };

  const onClose = () => {
    dispatch(setLangModalState(false));
    setShowLangModal(false);
  };

  return (
    <Modal
      isVisible={showLangModal}
      onBackdropPress={onClose}
      style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text textstyle={styles.title}>
          {localiseString('langaugeModal.title')}
        </Text>
        <Text textstyle={styles.description}>
          {localiseString('langaugeModal.desc')}
        </Text>

        <View style={styles.langButtonParentView}>
          <TouchableOpacity
            onPress={() => {
              onPressLangSelection(LANGUAGE_OPTIONS[0], 'pt');
            }}>
            <Image source={images.portugal} style={styles.langButton} />
            <Text text={LANGUAGE_OPTIONS[0]} />
            {currentLang === 'pt' && (
              <Image source={images.checkMark} style={styles.checkIcon} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onPressLangSelection(LANGUAGE_OPTIONS[1], 'en');
            }}>
            <Image source={images.english} style={styles.langButton} />
            <Text text={LANGUAGE_OPTIONS[1]} />
            {currentLang === 'en' && (
              <Image source={images.checkMark} style={styles.checkIcon} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onPressLangSelection(LANGUAGE_OPTIONS[2], 'fr');
            }}>
            <Image source={images.france} style={styles.langButton} />
            <Text text={LANGUAGE_OPTIONS[2]} />
            {currentLang === 'fr' && (
              <Image source={images.checkMark} style={styles.checkIcon} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onPressLangSelection(LANGUAGE_OPTIONS[3], 'es');
            }}>
            <Image source={images.spain} style={styles.langButton} />
            <Text text={LANGUAGE_OPTIONS[3]} />
            {currentLang === 'es' && (
              <Image source={images.checkMark} style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        </View>
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
    textAlign: 'left',
  },
  description: {
    fontSize: FontSize._16,
    marginBottom: Spacing.SCALE_16,
    color: AppColors.GREY,
    fontFamily: Fonts.normal,
    fontWeight: '600',
    textAlign: 'left',
  },
  button: {
    width: '100%',
  },
  buttonText: {
    fontSize: FontSize._16,
    fontFamily: Fonts.semiBold,
  },
  langButton: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  langButtonParentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkIcon: {
    height: Spacing.SCALE_20,
    width: Spacing.SCALE_20,
    position: 'absolute',
    right: 0,
    zIndex: 999,
  },
});

export default LanguageModal;
