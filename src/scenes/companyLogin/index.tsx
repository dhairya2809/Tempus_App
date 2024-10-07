import * as React from 'react';
import {Image, Linking, StyleSheet, View} from 'react-native';
import ScreenContainer from '@molecules/ScreenContainer';
import ScreenLayout from '@molecules/ScreenLayout';
import Text from '@atoms/Text';
import Spacing from '@styles/spacing';
import images from '@assets/images';
import {scaleSize} from '@styles/mixins';
import {FontSize, LineHeight} from '@styles/typography';
import {localiseString} from '@src/locales';
import TextInput from '@atoms/TextInput';
import Button from '@atoms/Button';
import Helpers from '@src/utils/Helpers';
import {useNavigation} from '@react-navigation/native';
import {RouteName} from '@src/navigation/RouteName';
import {postAPI} from '@src/services/API';
import EndPoints from '@src/services/EndPoints';
import {IResponse} from '@src/services/Common';
import {useDispatch} from 'react-redux';
import {setCompanyData} from '@src/store/redux/actions/Comman';
import SensitiveStorage from '@store/sensitive/SensitiveStorage';
import {ToastHandler} from '@utils/ToastController';
import AppColors from '@styles/colors';

function CompanyLogin() {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  const [companyCode, setCompanyCode] = React.useState('');
  const [companyServer, setCompanyServer] = React.useState('');
  const [isEmptyField, setEmptyField] = React.useState(false);
  const [isEmptyServerField, setEmptyServerField] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onRegister = () => {
    Helpers.logTrace('CompanyLogin::onRegister', 'start');
    if (!companyServer) {
      setEmptyServerField(true);
      return;
    }
    if (!companyCode) {
      setEmptyField(true);
      return;
    }
    validateComanyCode();
  };

  const validateComanyCode = async () => {
    setIsLoading(true);
    const body = {
      CompanyCode: companyCode,
    };
    let serverString = '';
    if (companyServer?.trim()?.startsWith('https://')) {
      // If it does, remove "https://"
      serverString = companyServer.slice(8);
    } else if (companyServer?.trim()?.startsWith('http://')) {
      // If it does, remove "http://"
      serverString = companyServer.slice(7);
    } else {
      // If not, update the state with the input text as is
      serverString = companyServer;
    }
    SensitiveStorage.saveCompanyServerEndpoint(companyCode, serverString);
    const response: IResponse = await postAPI(EndPoints.COMPANY_LOGIN, body);
    console.log('parentFileresponse :', response);

    setIsLoading(false);
    if (response?.data?.success) {
      dispatch(setCompanyData(response.data.data));
      SensitiveStorage.saveCompanyData(
        response?.data?.data?.companyAuthToken,
        JSON.stringify(response.data.data),
      );
      navigation.navigate(RouteName.EmployeeLogin);
    } else if (response?.data && !response?.data?.success) {
      ToastHandler.showToast(
        'warning',
        localiseString('companyLogin.invalidCompanyDetails'),
      );
    }
  };

  const onPressPrivacyPolicy = () => {
    Linking.openURL('http://www.datelka.pt/empresa/rgpd/app-tempus-mobile/');
  };

  const renderBottom = () => {
    return (
      <View style={styles.bottomView}>
        <Image source={images.datelka_logo} style={styles.logoStyle} />
        <Text
          text={localiseString('companyLogin.copyright')}
          fontSize={FontSize._12}
          lineHeight={LineHeight._16}
          primaryColor
        />
      </View>
    );
  };

  return (
    <ScreenContainer
      backgroundType={'image'}
      backgroundImage={images.login_background}>
      <ScreenLayout
        useSafeArea={true}
        paddingHorizontal={Spacing.SCALE_16}
        contentContainerStyle={styles.container}>
        <Image source={images.app_tempus} style={styles.appTempusLogo} />
        <TextInput
          titleText={localiseString('companyLogin.fieldLabel')}
          containerStyle={{marginTop: Spacing.SCALE_44}}
          value={companyServer}
          onChangeText={(text: string) => {
            setCompanyServer(text?.trim()?.toLowerCase());
            setEmptyServerField(false);
          }}
          errorText={
            isEmptyServerField
              ? localiseString('companyLogin.invalidCompanyServer')
              : ''
          }
        />
        <TextInput
          titleText={localiseString('companyLogin.fieldNameLabel')}
          containerStyle={{marginTop: Spacing.SCALE_14}}
          value={companyCode}
          onChangeText={(text: string) => {
            setCompanyCode(text);
            setEmptyField(false);
          }}
          errorText={
            isEmptyField
              ? localiseString('companyLogin.invalidCompanyName')
              : ''
          }
        />

        <Button
          title={localiseString('companyLogin.register')}
          onPress={onRegister}
          loading={isLoading}
        />

        <Text
          text={'By registering, "You agree to our'}
          primaryColor
          textstyle={{marginTop: Spacing.SCALE_10}}
        />
        <Text
          text={'Privacy Policy"'}
          primaryColor
          textstyle={{textDecorationLine: 'underline'}}
          fontWeight={'bold'}
          onPress={onPressPrivacyPolicy}
        />

        {renderBottom()}
      </ScreenLayout>
    </ScreenContainer>
  );
}

export default CompanyLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  appLogoStyle: {
    height: scaleSize(50),
  },
  bottomView: {
    top: '12%',
    alignItems: 'center',
  },
  appTempusLogo: {
    height: scaleSize(108),
    width: scaleSize(260),
    marginTop: scaleSize(100),
  },
  logoStyle: {
    height: scaleSize(51),
    width: scaleSize(126),
  },
  iconButton: {
    margin: scaleSize(9),
    padding: scaleSize(3),
    position: 'absolute',
    right: 0,
  },
  iconStyle: {
    height: scaleSize(20),
    width: scaleSize(20),
    tintColor: AppColors.THEME,
  },
});
