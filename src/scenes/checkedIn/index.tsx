import * as React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import ScreenContainer from '@molecules/ScreenContainer';
import ScreenLayout from '@molecules/ScreenLayout';
import Spacing from '@styles/spacing';
import images from '@src/assets/images';
import {scaleSize} from '@src/styles/mixins';
import AppColors from '@src/styles/colors';
import Header from '@molecules/Header';
import {localiseString} from '@src/locales';
import Text from '@src/components/atoms/Text';
import {FontSize, LineHeight} from '@src/styles/typography';
import {useNavigation} from '@react-navigation/native';
import {getCurrentLocation, getCurrentTimeStamp} from '@src/utils/GeoLocations';
import {IResponse} from '@src/services/Common';
import {postAPI} from '@src/services/API';
import EndPoints from '@src/services/EndPoints';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCheckedInData,
  setCheckedOutData,
} from '@src/store/redux/actions/Comman';
import {
  persistCheckedOutData,
  removeCheckedInData,
  removeCheckedOutData,
} from '@src/store/local/LocalStorage';
import NetInfo from '@react-native-community/netinfo';
import BottomModal from '@src/components/molecules/BottomModal';
import SensitiveStorage from '@src/store/sensitive/SensitiveStorage';
import moment from 'moment';
import {useDebounce} from '@utils/TouchableHandler';

function CheckedIn() {
  const [isLoading, setIsLoading] = React.useState(false);
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const selector = useSelector((event: any) => event.state);
  const empData = selector.employeeData;
  const companyData = selector.companyData;
  const checkedInTime = selector.checkedInData.timestamp;
  const [showLogoutModal, setLogoutModal] = React.useState(false);
  const {debounce} = useDebounce();

  const handleCheck = async (type: string) => {
    try {
      const currentLocation: any = await getCurrentLocation();
      const formattedLocation = `${currentLocation.lat}, ${currentLocation.long}`;
      const time = getCurrentTimeStamp();

      if (type === 'out') {
        const data: any = {
          timestamp: time,
          location: formattedLocation,
        };
        dispatch(setCheckedOutData(data));
        callApiService(type, formattedLocation, time);
      }
    } catch (error) {
      console.log('Error while getting location for check in/out', error);
    }
  };

  const callApiService = async (
    type: string,
    location: any,
    timestamp: any,
  ) => {
    const netInfoState = await NetInfo.fetch();
    const token = await SensitiveStorage.getCreds();

    const body: any = {
      coordinates: location,
      type: type,
      timestamp: timestamp,
      token: token?.password,
    };

    // In case internet is not connected, data should save offline and save to local storage.
    if (!netInfoState.isConnected) {
      setOfflineData(body);
      return;
    }

    //If Internet, then online services resumes.
    setIsLoading(true);
    const response: IResponse = await postAPI(EndPoints.CHECK_IN_OUT, body);
    setIsLoading(false);

    if (response.data.success) {
      dispatch(setCheckedInData({}));
      dispatch(setCheckedOutData({}));
      removeCheckedInData();
      removeCheckedOutData();
      navigation.goBack();
    }
  };

  const setOfflineData = async (data: any) => {
    data.employeeData = empData;
    data.companyData = companyData;
    data.mode = 'offline';
    persistCheckedOutData(data);
    dispatch(setCheckedOutData(data));
    navigation.goBack();
  };

  return (
    <ScreenContainer
      backgroundType={'image'}
      backgroundImage={images.group_BG}
      showLoaderModal={isLoading}>
      <ScreenLayout
        paddingHorizontal={Spacing.SCALE_20}
        contentContainerStyle={styles.container}
        header={
          <Header
            leftText={companyData?.companyName}
            title={''}
            navigation={navigation}
            onPressLogout={() => {
              setLogoutModal(true);
            }}
          />
        }>
        <Image source={images.check} style={styles.logoStyle} />

        <Text
          text={'Presença registada\ncom sucesso'}
          fontSize={FontSize._30}
          lineHeight={LineHeight._40}
          color={AppColors.THEME_TEXT}
          weight={'700'}
          marginTop={scaleSize(80)}
        />

        <Text
          text={`${empData.Name}\n${empData.Id}\n${moment(checkedInTime).format(
            'YYYY-MM-DD HH:mm:SS',
          )}`}
          fontSize={FontSize._20}
          lineHeight={LineHeight._24}
          color={AppColors.THEME_TEXT}
          weight={'400'}
          marginTop={scaleSize(20)}
        />

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => {
            debounce(() => {
              handleCheck('out');
            });
          }}>
          <Image
            source={images.out}
            style={styles.outIconStyle}
            resizeMode={'contain'}
          />
          <Text text="Sair" paddingEnd={40} textstyle={styles.actionTitle} />
        </TouchableOpacity>

        <View style={[styles.flexRow, styles.footerView]}>
          <Image source={images.text_logo} />
          <Text
            text={localiseString('companyLogin.copyright')}
            fontSize={FontSize._12}
            lineHeight={LineHeight._16}
            primaryColor
            textstyle={styles.copyRightAdditionalStyle}
          />
        </View>

        <BottomModal
          isVisible={showLogoutModal}
          navigation={navigation}
          onClose={() => {
            setLogoutModal(false);
          }}
        />
      </ScreenLayout>
    </ScreenContainer>
  );
}

export default CheckedIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.WHITE_OPACITY_4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoStyle: {
    height: scaleSize(136),
    width: scaleSize(136),
    alignSelf: 'center',
    top: scaleSize(30),
    position: 'absolute',
  },
  inIconStyle: {
    height: scaleSize(118),
    width: scaleSize(112),
  },
  outIconStyle: {
    height: scaleSize(118),
    width: scaleSize(122),
  },
  flexRow: {
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'space-between',
  },
  copyRightAdditionalStyle: {
    fontWeight: '300',
  },
  footerView: {
    position: 'absolute',
    bottom: scaleSize(20),
  },
  actionTitle: {
    fontSize: FontSize._24,
    fontWeight: '700',
    lineHeight: LineHeight._36,
    color: AppColors.THEME_TEXT,
    textAlign: 'center',
  },
  checkoutButton: {
    top: scaleSize(60),
  },
});
