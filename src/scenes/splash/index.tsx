import * as React from 'react';
import {Image, StyleSheet} from 'react-native';
import ScreenContainer from '@molecules/ScreenContainer';
import ScreenLayout from '@molecules/ScreenLayout';
import Spacing from '@styles/spacing';
import images from '@assets/images';
import {useNavigation} from '@react-navigation/native';
import {RouteName, StackName} from '@src/navigation/RouteName';
import {scaleSize} from '@styles/mixins';
import SensitiveStorage from '@store/sensitive/SensitiveStorage';
import {useDispatch} from 'react-redux';
import {setCompanyData, setEmployeeData} from '@store/redux/actions/Comman';
import {SharedWebCredentials} from 'react-native-keychain';
import {retrieveCurrentLang} from '@store/local/LocalStorage';
import {setAppLocale} from '@src/locales';

function Splash() {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  React.useEffect(() => {
    getUserCreds();
  }, []);

  const getUserCreds = async () => {
    const empData: SharedWebCredentials =
      await SensitiveStorage.getEmployeeData();
    const compnyData: SharedWebCredentials =
      await SensitiveStorage.getCompanyData();

    const currentLang = await retrieveCurrentLang();

    if (currentLang !== null) {
      setAppLocale(currentLang?.langCode);
    }

    console.log('empData :', empData.password);
    console.log('compnyData :', compnyData.password);
    console.log('empDataUsername :', empData.username);
    console.log('compnyDataUsername :', compnyData.username);

    setTimeout(() => {
      const validateState = async () => {
        try {
          // both data exists
          if (compnyData?.password && empData?.password) {
            dispatch(setCompanyData(JSON.parse(compnyData?.password)));
            dispatch(setEmployeeData(JSON.parse(empData?.password)));
            navigation.replace(StackName.App);
          }
          // only company data exists
          else if (compnyData?.password && !empData?.password) {
            dispatch(setCompanyData(JSON.parse(compnyData?.password)));
            navigation.replace(StackName.Auth, {
              screen: RouteName.EmployeeLogin,
            });
          }
          // neither company nor employee data exists
          else if (!compnyData?.password && !empData?.password) {
            navigation.replace(StackName.Auth);
          }
        } catch (error) {
          console.log('Error while getting Credentials. ', error);
          navigation.replace(StackName.Auth);
        }
      };
      validateState();
    }, 3000);
  };

  return (
    <ScreenContainer
      backgroundType={'image'}
      backgroundImage={images.login_background}>
      <ScreenLayout
        useSafeArea={true}
        paddingHorizontal={Spacing.SCALE_16}
        contentContainerStyle={styles.container}>
        <Image source={images.datelka_logo} style={styles.logoStyle} />
      </ScreenLayout>
    </ScreenContainer>
  );
}

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoStyle: {
    height: scaleSize(51),
    width: scaleSize(126),
  },
});
