import * as React from 'react';
import {useNavigation} from '@react-navigation/native';
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
import Text from '@src/components/atoms/Text';
import {FontSize, LineHeight} from '@src/styles/typography';
import Header from '@src/components/molecules/Header';
import {StackName} from '@src/navigation/RouteName';
import {IResponse} from '@src/services/Common';
import {postAPI} from '@src/services/API';
import EndPoints from '@src/services/EndPoints';
import {useDispatch, useSelector} from 'react-redux';
import {setEmployeeData} from '@store/redux/actions/Comman';
import {persistUserData} from '@store/local/LocalStorage';
import SensitiveStorage from '@src/store/sensitive/SensitiveStorage';
import {ToastHandler} from '@src/utils/ToastController';

function LoginCode() {
  const navigation: any = useNavigation();

  const dispatch = useDispatch();
  const selector = useSelector((event: any) => event.state);
  const verificationToken = selector.verificationToken;
  const companyData = selector.companyData;

  const [code, setCode] = React.useState('');
  const [isEmptyCode, setEmptyCode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const validateLoginCode = async () => {
    setIsLoading(true);
    const body = {
      code: code,
      verificationToken: verificationToken,
    };
    const response: IResponse = await postAPI(
      EndPoints.TWO_FA_VERIFICATION,
      body,
    );
    setIsLoading(false);
    if (response?.data?.success) {
      dispatch(setEmployeeData(response?.data?.data?.employeeData));
      SensitiveStorage.saveEmployeeData(
        response?.data?.data?.authToken,
        JSON.stringify(response?.data?.data?.employeeData),
      );
      persistUserData(response?.data?.data?.employeeData);
      navigation.replace(StackName.App);
    } else if (!response?.data?.success) {
      ToastHandler.showToast(
        'warning',
        localiseString('loginCode.invalidCode'),
      );
    }
  };

  const onSubmit = () => {
    Helpers.logTrace('LoginCode::onSubmit', 'start');
    if (!code) {
      setEmptyCode(true);
      return;
    }

    validateLoginCode();
  };

  return (
    <ScreenContainer backgroundType={'image'} backgroundImage={images.group_BG}>
      <ScreenLayout
        useSafeArea={true}
        paddingHorizontal={Spacing.SCALE_16}
        contentContainerStyle={styles.container}
        header={
          <Header
            leftText={companyData?.companyName}
            title={''}
            showRightElements={false}
            navigation={undefined}
          />
        }>
        <View style={styles.whiteTransparentView}>
          {/* //NOTE: This image will dynamic */}
          <Image
            source={{uri: companyData.companyLogo}}
            style={styles.logoStyle}
          />
          <TextInput
            titleText={localiseString('loginCode.enterCode')}
            containerStyle={{marginTop: scaleSize(90)}}
            value={code}
            onChangeText={(text: string) => {
              setCode(text);
              setEmptyCode(false);
            }}
            errorText={
              isEmptyCode ? localiseString('loginCode.invalidCode') : ''
            }
          />
          <Button
            title={localiseString('loginCode.submit')}
            onPress={onSubmit}
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
      </ScreenLayout>
    </ScreenContainer>
  );
}

export default LoginCode;

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
