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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import GeoLocations, {
  getCurrentLocation,
  getCurrentTimeStamp,
} from '@utils/GeoLocations';
import {IResponse} from '@src/services/Common';
import {postAPI} from '@src/services/API';
import EndPoints from '@src/services/EndPoints';
import {useDispatch, useSelector} from 'react-redux';
import {setCheckedInData, setCheckedOutData} from '@store/redux/actions/Comman';
import BottomModal from '@molecules/BottomModal';
import NetInfo from '@react-native-community/netinfo';
import {
  persistCheckedInData,
  persistCheckedOutData,
  removeCheckedInData,
  removeCheckedOutData,
  retrieveCheckedInData,
  retrieveCheckedOutData,
  persistOfflineCheckedData,
  retrieveOfflineCheckedData,
} from '@src/store/local/LocalStorage';
import SensitiveStorage from '@src/store/sensitive/SensitiveStorage';
import {useDebounce} from '@utils/TouchableHandler';
import Clock from '@src/components/molecules/Clock';
import SuccessView from './SuccessView';

function Dashboard() {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const selector = useSelector((event: any) => event.state);
  const checkedInTime = selector?.checkedInData?.timestamp;
  const empData = selector.employeeData;
  const companyData = selector.companyData;
  const [isLoading, setIsLoading] = React.useState(false);
  const [showLogoutModal, setLogoutModal] = React.useState(false);
  const [showSuccessView, setShowSuccess] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const [checkedOutTime, setCheckedOutTime] = React.useState('');
  const {debounce} = useDebounce();

  React.useEffect(() => {
    GeoLocations.requestLocationPermission();
    checkIfAlreadyCheckedIn();
  }, [isFocused]);

  const checkIfAlreadyCheckedIn = async () => {
    const data = await retrieveCheckedInData();
    const dataOut = await retrieveCheckedOutData();
    if (data !== null && data?.type === 'in') {
      dispatch(setCheckedInData(data));
    }
    if (dataOut !== null && dataOut?.type === 'out') {
      dispatch(setCheckedOutData(data));
      setCheckedOutTime(dataOut?.timestamp);
    } else {
      setCheckedOutTime('');
    }
  };

  const handleCheck = async (type: string) => {
    setIsLoading(true);
    try {
      const currentLocation: any = await getCurrentLocation();
      const formattedLocation = `${currentLocation.lat}, ${currentLocation.long}`;
      const time = getCurrentTimeStamp();
      const data: any = {
        timestamp: time,
        location: formattedLocation,
      };
      dispatch(
        type === 'in' ? setCheckedInData(data) : setCheckedOutData(data),
      );
      callApiService(type, formattedLocation, time);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const callApiService = async (
    type: string,
    location: any,
    timestamp: any,
  ) => {
    const netInfoState = await NetInfo.fetch();
    const token = await SensitiveStorage.getEmployeeData();
    const body: any = {
      coordinates: location,
      type: type,
      timestamp: timestamp,
      token: token?.username,
    };
    // In case internet is not connected,
    // data should save offline and save to local storage.
    if (!netInfoState.isConnected) {
      setOfflineData(body);
      return;
    }

    //If Internet, then online services resumes.
    const response: IResponse = await postAPI(EndPoints.CHECK_IN_OUT, body);
    setIsLoading(false);
    if (response.data.success) {
      body.employeeData = empData;
      body.companyData = companyData;
      body.mode = 'online';
      type === 'in' ? clearCheckInState(body) : clearCheckOutState(body);
    }
  };

  const setOfflineData = async (data: any) => {
    data.employeeData = empData;
    data.companyData = companyData;
    data.mode = 'offline';

    const offlineExistingData = await retrieveOfflineCheckedData();
    let offlineArray: any[][] = [];
    if (offlineExistingData !== null && offlineExistingData?.length > 0) {
      offlineExistingData?.push(data);
      persistOfflineCheckedData(offlineExistingData);
    } else {
      offlineArray.push(data);
      persistOfflineCheckedData(offlineArray);
    }

    persistCheckedInData(data);
    dispatch(
      data?.type === 'in' ? setCheckedInData(data) : setCheckedOutData(data),
    );
    data?.type === 'in' ? clearCheckInState(data) : clearCheckOutState(data);
  };

  const clearCheckInState = (body: any) => {
    setIsLoading(false);
    removeCheckedOutData();
    persistCheckedInData(body);
    dispatch(setCheckedInData(body));
    dispatch(setCheckedOutData({}));
    setCheckedOutTime('');
    setModalMessage(localiseString('dashboard.checkedInSuccess'));
    checkIfAlreadyCheckedIn();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const clearCheckOutState = (body: any) => {
    setIsLoading(false);
    dispatch(setCheckedInData({}));
    removeCheckedInData();
    persistCheckedOutData(body);
    setModalMessage(localiseString('dashboard.checkedOutSuccess'));
    setShowSuccess(true);
    checkIfAlreadyCheckedIn();
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const renderActionButtons = () => {
    return (
      <View style={styles.flexRow}>
        <TouchableOpacity
          onPress={() =>
            debounce(() => {
              handleCheck('in');
            })
          }>
          <Image
            source={images.in}
            style={styles.inIconStyle}
            resizeMode={'contain'}
          />
          <Text
            text={localiseString('dashboard.checkIn')}
            textstyle={styles.actionTitle}
            paddingEnd={10}
            textAlign={'right'}
          />
        </TouchableOpacity>

        <TouchableOpacity
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
          <Text
            text={localiseString('dashboard.checkOut')}
            paddingEnd={40}
            textstyle={styles.actionTitle}
          />
        </TouchableOpacity>
      </View>
    );
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
        <View style={styles.logoStyle}>
          <Image
            source={{uri: companyData.companyLogo}}
            defaultSource={images.datelka_logo}
            style={{height: scaleSize(51), width: scaleSize(126)}}
          />
          <Clock />
        </View>

        {renderActionButtons()}
        {Boolean(checkedInTime) && !isLoading && (
          <Text
            text={localiseString('dashboard.lastCheckIn') + checkedInTime}
            primaryColor
            fontWeight="semibold"
            fontSize={FontSize._16}
            marginTop={Spacing.SCALE_20}
          />
        )}
        {Boolean(checkedOutTime) && !isLoading && (
          <Text
            text={localiseString('dashboard.lastCheckOut') + checkedOutTime}
            primaryColor
            fontWeight="semibold"
            fontSize={FontSize._16}
            marginTop={Spacing.SCALE_20}
          />
        )}
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
        <SuccessView
          showView={showSuccessView}
          close={() => {
            setShowSuccess(false);
          }}
          message={modalMessage}
        />
      </ScreenLayout>
    </ScreenContainer>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.WHITE_OPACITY,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoStyle: {
    height: scaleSize(51),
    width: scaleSize(126),
    alignSelf: 'center',
    top: scaleSize(30),
    position: 'absolute',
    alignItems: 'center',
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
    bottom: scaleSize(30),
  },
  actionTitle: {
    fontSize: FontSize._24,
    fontWeight: '700',
    lineHeight: LineHeight._36,
    color: AppColors.THEME_TEXT,
  },
});
