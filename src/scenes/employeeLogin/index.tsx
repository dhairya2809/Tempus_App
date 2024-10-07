import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import ScreenContainer from '@molecules/ScreenContainer';
import ScreenLayout from '@molecules/ScreenLayout';
import Spacing from '@styles/spacing';
import images from '@assets/images';
import {scaleSize} from '@styles/mixins';
import {localiseString} from '@src/locales';
import TextInput from '@atoms/TextInput';
import Button from '@atoms/Button';
import Helpers from '@src/utils/Helpers';
import AppColors from '@src/styles/colors';
import Text from '@atoms/Text';
import {FontSize, LineHeight} from '@styles/typography';
import {useNavigation} from '@react-navigation/native';
import {RouteName} from '@src/navigation/RouteName';
import Header from '@molecules/Header';
import {IResponse} from '@src/services/Common';
import {postAPI} from '@src/services/API';
import EndPoints from '@src/services/EndPoints';
import {useDispatch, useSelector} from 'react-redux';
import {
  setVerificationToken,
  setUserCredentials,
} from '@src/store/redux/actions/Comman';
import SensitiveStorage from '@store/sensitive/SensitiveStorage';
import {ToastHandler} from '@src/utils/ToastController';
import BottomModal from '@src/components/molecules/BottomModal';

function EmployeeLogin() {
  const navigation: any = useNavigation();

  const dispatch = useDispatch();
  const selector = useSelector((event: any) => event.state);
  const companyData = selector.companyData;
  const [employeeNumber, setEmployeeNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isEmptyNumber, setEmptyNumber] = React.useState(false);
  const [isEmptyPassword, setEmptyPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showLogoutModal, setLogoutModal] = React.useState(false);

  const onLogin = () => {
    Helpers.logTrace('EmployeeLogin::onLogin', 'start');
    if (!employeeNumber) {
      setEmptyNumber(true);
      return;
    }
    if (!password) {
      setEmptyPassword(true);
      return;
    }
    validateEmpLoginCode();
  };

  const validateEmpLoginCode = async () => {
    setIsLoading(true);
    const body = {
      userId: employeeNumber,
      userPassword: password,
      companyAuthToken: companyData.companyAuthToken,
    };
    const response: IResponse = await postAPI(EndPoints.LOGIN, body);
    setIsLoading(false);
    if (response?.data?.success) {
      SensitiveStorage.saveCreds(
        employeeNumber,
        response?.data?.data?.verificationToken,
      );
      dispatch(
        setUserCredentials({
          userId: employeeNumber,
          token: response?.data?.data?.verificationToken,
        }),
      );
      dispatch(setVerificationToken(response?.data?.data?.verificationToken));
      navigation.navigate(RouteName.LoginCode);
    } else if (!response?.data?.success) {
      ToastHandler.showToast(
        'warning',
        localiseString('employeeLogin.invalidCreds'),
      );
    }
  };

  return (
    <ScreenContainer backgroundType={'image'} backgroundImage={images.group_BG}>
      <ScreenLayout
        useSafeArea={true}
        contentContainerStyle={{justifyContent: 'center'}}
        header={
          <Header
            leftText={companyData?.companyName}
            title={''}
            showRightElements={false}
            showLogoutButton
            navigation={navigation}
            onPressLogout={() => {
              setLogoutModal(true);
            }}
          />
        }>
        <View style={styles.whiteTransparentView}>
          {/* //NOTE: This image is dynamic with using useselector. */}
          <Image
            source={{uri: companyData.companyLogo}}
            defaultSource={images.datelka_logo}
            style={styles.logoStyle}
          />
          <TextInput
            titleText={localiseString('employeeLogin.companyNumber')}
            containerStyle={{marginTop: Spacing.SCALE_44}}
            value={employeeNumber}
            onChangeText={(text: string) => {
              setEmployeeNumber(text);
              setEmptyNumber(false);
            }}
            errorText={
              isEmptyNumber
                ? localiseString('employeeLogin.invalidCompanyNumber')
                : ''
            }
          />
          <TextInput
            titleText={localiseString('employeeLogin.password')}
            containerStyle={{marginTop: Spacing.SCALE_16}}
            value={password}
            onChangeText={(text: string) => {
              setPassword(text);
              setEmptyPassword(false);
            }}
            errorText={
              isEmptyPassword
                ? localiseString('employeeLogin.invalidPassword')
                : ''
            }
            secureTextEntry={true}
          />
          <Button
            title={localiseString('employeeLogin.login')}
            onPress={onLogin}
            loading={isLoading}
          />

          <View style={styles.flexRow}>
            <Image source={images.text_logo} />
            <Text
              text={localiseString('companyLogin.copyright')}
              fontSize={FontSize._12}
              lineHeight={LineHeight._16}
              primaryColor
              textstyle={styles.copyRightAdditionalStyle}
            />
          </View>
        </View>

        <BottomModal
          isVisible={showLogoutModal}
          navigation={navigation}
          onClose={() => {
            setLogoutModal(false);
          }}
          hideEmployeeButton={true}
        />
      </ScreenLayout>
    </ScreenContainer>
  );
}

export default EmployeeLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appLogoStyle: {
    height: scaleSize(50),
  },
  bottomView: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  appTempusLogo: {
    height: scaleSize(108),
    width: scaleSize(260),
    marginTop: scaleSize(100),
  },
  whiteTransparentView: {
    padding: Spacing.SCALE_20,
    backgroundColor: AppColors.WHITE_OPACITY_4,
    borderRadius: Spacing.SCALE_16,
    width: scaleSize(320),
    alignItems: 'center',
    minHeight: scaleSize(600),
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  logoStyle: {
    height: scaleSize(51),
    width: scaleSize(126),
    marginTop: 30,
  },
  headerGradient: {
    height: scaleSize(75),
    width: scaleSize(375),
  },
  dtaAccessText: {
    position: 'absolute',
    fontSize: 25,
    fontWeight: '700',
    paddingStart: Spacing.SCALE_30,
    color: AppColors.WHITE,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  copyRightAdditionalStyle: {
    fontWeight: '300',
  },
});
