/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';
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
import Button from '@src/components/atoms/Button';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RouteName} from '@src/navigation/RouteName';
import {IResponse} from '@src/services/Common';
import {getAPI} from '@src/services/API';
import EndPoints from '@src/services/EndPoints';
import {retrieveUserData} from '@src/store/local/LocalStorage';
import Helpers from '@src/utils/Helpers';
import {setEmployeeData} from '@src/store/redux/actions/Comman';
import BottomModal from '@src/components/molecules/BottomModal';
import SensitiveStorage from '@src/store/sensitive/SensitiveStorage';
import moment from 'moment';
import Clock from '@src/components/molecules/Clock';

function Profile() {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const selector = useSelector((event: any) => event.state);
  const empData = selector.employeeData;
  const checkedInData = selector?.checkedInData;
  const [isLoading, setIsLoading] = React.useState(false);
  const [employeData, setEmployeData] = React.useState<any>(empData);
  const [showLogoutModal, setLogoutModal] = React.useState(false);
  const companyData = selector.companyData;

  React.useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    //Retreiving profile data from local storage.
    const localEmpData = await retrieveUserData();
    const token = await SensitiveStorage.getEmployeeData();

    if (localEmpData?.Email) {
      dispatch(setEmployeeData(localEmpData));
      setEmployeData(localEmpData);
      return;
    }

    //Retreiving profile data from server if not available in redux and local store.
    setIsLoading(true);
    const response: IResponse = await getAPI(
      `${EndPoints.GET_PROFILE}?token=${token?.username}`,
    );
    setIsLoading(false);
    if (response?.data?.success) {
      setEmployeData(response?.data?.data);
    } else if (!response?.data?.success && Boolean(response?.data?.errorCode)) {
      if (localEmpData?.Email) {
        dispatch(setEmployeeData(localEmpData));
        setEmployeData(localEmpData);
      }
    }
  };

  const onActionReport = () => {
    Helpers.logTrace('Profile::onActionReport', 'start');
    navigation.navigate(RouteName.Report);
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

        {!isLoading && (
          <View style={styles.infoParentView}>
            <Image
              defaultSource={images.profile}
              source={{uri: employeData?.ProfileImage}}
              style={styles.profileView}
            />
            <Text
              text={`${employeData?.Name}\n${employeData?.Id}`}
              fontSize={FontSize._28}
              lineHeight={LineHeight._40}
              color={AppColors.THEME_TEXT}
              weight={'700'}
              marginTop={scaleSize(20)}
            />

            {/* In-Case checked-in data */}
            {checkedInData !== null && checkedInData?.type === 'in' && (
              <Text
                text={localiseString('dashboard.checkIn')}
                fontSize={FontSize._24}
                lineHeight={LineHeight._40}
                color={AppColors.THEME_TEXT}
                weight={'700'}
                marginTop={scaleSize(20)}
              />
            )}
            {checkedInData !== null && checkedInData?.type === 'in' && (
              <Text
                text={moment(checkedInData?.timestamp).format(
                  'DD-MM-YYYY HH:mm:ss',
                )}
                fontSize={FontSize._20}
                lineHeight={LineHeight._24}
                color={AppColors.THEME_TEXT}
                weight={'400'}
              />
            )}

            <Button
              title={localiseString('profile.report')}
              onPress={onActionReport}
              buttonStyle={styles.reportButton}
            />
          </View>
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
      </ScreenLayout>
    </ScreenContainer>
  );
}

export default Profile;

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
  profileView: {
    height: scaleSize(124),
    width: scaleSize(124),
    borderRadius: scaleSize(62),
  },
  reportButton: {
    marginTop: scaleSize(30),
  },
  infoParentView: {
    alignItems: 'center',
    marginTop: '20%',
  },
});
