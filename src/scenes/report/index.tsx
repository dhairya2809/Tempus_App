/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenContainer from '@molecules/ScreenContainer';
import ScreenLayout from '@molecules/ScreenLayout';
import Spacing from '@styles/spacing';
import images from '@assets/images';
import {scaleSize} from '@styles/mixins';
import AppColors from '@styles/colors';
import Header from '@molecules/Header';
import {localiseString} from '@src/locales';
import Text from '@atoms/Text';
import {FontSize, LineHeight} from '@styles/typography';
import {useNavigation} from '@react-navigation/native';
import {IResponse} from '@services/Common';
import {getAPI} from '@services/API';
import EndPoints from '@services/EndPoints';
import moment from 'moment';
import {useSelector} from 'react-redux';
import MonthPicker from 'react-native-month-year-picker';
import BottomModal from '@molecules/BottomModal';
import SensitiveStorage from '@src/store/sensitive/SensitiveStorage';
import Helpers from '@src/utils/Helpers';
import {retrieveCurrentLang} from '@src/store/local/LocalStorage';

function Report() {
  const navigation = useNavigation();
  const selector = useSelector((event: any) => event.state);
  const companyData = selector.companyData;
  const empData = selector.employeeData;
  const langCode = selector?.currentLang;
  const [isLoading, setLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedMonth, setSelectedMonth] = React.useState(
    moment(new Date()).format('MM'),
  );
  const [reportData, setReportData] = React.useState([]);
  const [showPicker, setShowPicker] = React.useState(false);
  const [currentLang, setCurrentLang] = React.useState('');
  const [showLogoutModal, setLogoutModal] = React.useState(false);

  const minimumDate = new Date();
  minimumDate.setMonth(0); // Set the month to January
  minimumDate.setDate(1);

  React.useEffect(() => {
    if (langCode) {
      setCurrentLang(langCode);
    } else {
      initLanguage();
    }
  }, [langCode]);

  React.useEffect(() => {
    getMonthlyReport(selectedMonth);
    initLanguage();
  }, []);

  const initLanguage = async () => {
    const lang = await retrieveCurrentLang();
    setCurrentLang(lang?.langCode);
  };

  const getMonthlyReport = async (month: string) => {
    const token = await SensitiveStorage.getEmployeeData();
    try {
      const response: IResponse = await getAPI(
        `${EndPoints.GET_MONTHLY_REPORT}token=${token?.username}&month=${month}`,
      );
      setLoading(false);
      if (response?.status === 200) {
        const uniqueEntries: any = Helpers.removeDuplicateTimestamps(
          response?.data?.data,
        );
        setReportData(uniqueEntries);
      }
    } catch (error) {
      console.log('Error while getting monthly report', error);
    }
  };

  const handlePickerState = React.useCallback(
    (value: any) => setShowPicker(value),
    [],
  );

  const onValueChange = React.useCallback(
    (event: any, newDate: any) => {
      setShowPicker(false);
      setLoading(true);
      setSelectedDate(newDate);
      setSelectedMonth(moment(newDate).format('MM'));
      getMonthlyReport(moment(newDate).format('MM'));
    },
    [selectedDate, showPicker],
  );

  const renderReportItem = ({item}: any) => {
    return (
      <View style={[styles.flexRow, styles.reportView]}>
        <Text
          text={moment(item?.timestamp).format('DD-MM-YYYY')}
          textstyle={styles.reportText}
        />
        {item?.type === 'in' ? (
          <Text
            text={moment(item?.timestamp).format('HH:mm:ss')}
            textstyle={styles.reportText}
          />
        ) : (
          <Text text={'-::-::-'} textstyle={styles.reportText} />
        )}
        {item?.type === 'out' ? (
          <Text
            text={moment(item?.timestamp).format('HH:mm:ss')}
            textstyle={styles.reportText}
          />
        ) : (
          <Text text={'-::-::-'} textstyle={styles.reportText} />
        )}
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={[styles.flexRow, styles.reportView, styles.header]}>
        <Text
          text={localiseString('report.date')}
          textstyle={styles.headerText}
        />
        <Text
          text={localiseString('dashboard.checkIn')}
          textstyle={styles.headerText}
        />
        <Text
          text={localiseString('dashboard.checkOut')}
          textstyle={styles.headerText}
        />
      </View>
    );
  };

  const renderEmptyItem = () => {
    return (
      <View style={styles.listEmpty}>
        <Text
          text={localiseString('report.noDataFound')}
          textstyle={[styles.headerText, {width: '100%'}]}
        />
      </View>
    );
  };

  return (
    <ScreenContainer
      backgroundType={'image'}
      backgroundImage={images.group_BG}
      showLoaderModal={isLoading}>
      <ScreenLayout
        paddingHorizontal={Spacing.SCALE_28}
        paddingBottom={Spacing.SCALE_20}
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
        <Image
          source={{uri: companyData?.companyLogo}}
          defaultSource={images.datelka_logo}
          style={styles.logoStyle}
        />
        <Image
          defaultSource={images.profile}
          source={{uri: empData?.ProfileImage}}
          style={styles.profileView}
        />
        <Text
          text={`${empData?.Name}\n${empData?.Id}`}
          fontSize={FontSize._16}
          lineHeight={LineHeight._24}
          color={AppColors.THEME_TEXT}
          weight={'700'}
          marginTop={scaleSize(10)}
        />

        {/* Calendar Button */}
        <View style={styles.datePickerView}>
          <Image source={images.calendar} style={styles.calendarIcon} />
          <TouchableOpacity
            onPress={handlePickerState}
            style={styles.monthView}>
            <Text
              text={moment(selectedDate).format('YYYY-MM')}
              color={AppColors.DARK_GRAY}
              weight={'700'}
              lineHeight={18}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePickerState}
            style={styles.monthView}>
            <Image source={images.downArrow} style={styles.downArrow} />
          </TouchableOpacity>
        </View>
        {/* Calendar Button */}

        {renderHeader()}

        <FlatList
          style={{maxHeight: scaleSize(300)}}
          data={reportData}
          keyExtractor={(item, index) => index?.toString()}
          renderItem={renderReportItem}
          ListEmptyComponent={renderEmptyItem}
        />

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

        {showPicker && (
          <MonthPicker
            onChange={onValueChange}
            value={new Date()}
            minimumDate={new Date(2022, 12)}
            maximumDate={new Date()}
            locale={currentLang}
          />
        )}
      </ScreenLayout>
    </ScreenContainer>
  );
}

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.WHITE_OPACITY,
    alignItems: 'center',
    width: '100%',
  },
  logoStyle: {
    height: scaleSize(51),
    width: scaleSize(126),
    alignSelf: 'center',
    marginTop: scaleSize(20),
  },
  flexRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  copyRightAdditionalStyle: {
    fontWeight: '300',
  },
  footerView: {
    position: 'absolute',
    bottom: scaleSize(30),
  },
  profileView: {
    height: scaleSize(85),
    width: scaleSize(85),
    marginTop: scaleSize(20),
    borderRadius: scaleSize(45),
  },
  datePickerView: {
    flexDirection: 'row',
    width: '30%',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: Spacing.SCALE_8,
  },
  monthView: {
    borderWidth: 2,
    borderColor: AppColors.DARK_GRAY,
    paddingStart: 4,
    paddingEnd: 4,
    marginStart: 10,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.WHITE,
  },
  calendarIcon: {
    height: scaleSize(24),
    width: scaleSize(24),
  },
  downArrow: {
    height: scaleSize(10),
    width: scaleSize(10),
    backgroundColor: AppColors.WHITE,
  },
  reportText: {
    fontWeight: '700',
    lineHeight: LineHeight._24,
    color: AppColors.DARK_GRAY,
    width: '26%',
    fontSize: FontSize._12,
  },
  headerText: {
    fontWeight: '700',
    lineHeight: LineHeight._24,
    color: AppColors.WHITE,
    fontSize: FontSize._16,
    width: '26%',
  },
  reportView: {
    backgroundColor: AppColors.WHITE,
    padding: Spacing.SCALE_14,
    width: '95%',
    marginTop: Spacing.SCALE_4,
  },
  listEmpty: {
    backgroundColor: AppColors.RED,
    padding: 14,
    width: '92%',
    marginTop: Spacing.SCALE_20,
  },
  header: {
    backgroundColor: AppColors.GRAY_BG,
    width: '100%',
    alignSelf: 'center',
  },
});
