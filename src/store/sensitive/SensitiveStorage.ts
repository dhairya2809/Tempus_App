import Keychain from 'react-native-keychain';

const saveCreds = async (userName: string, token: string) => {
  // Store the credentials
  await Keychain.setGenericPassword(userName, token);
};

const getCreds = async () => {
  try {
    // Retrieve the credentials
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials;
    } else {
      console.log('No credentials stored');
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
};

const saveEmployeeData = async (userName: string, token: string) => {
  // Store the credentials
  await Keychain.setInternetCredentials('employee', userName, token);
};

const getEmployeeData = async () => {
  try {
    // Retrieve the credentials
    const credentials = await Keychain.getInternetCredentials('employee');
    if (credentials) {
      return credentials;
    } else {
      console.log('No employee data stored');
      return false;
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
};

const saveCompanyData = async (userName: string, token: string) => {
  // Store the credentials
  await Keychain.setInternetCredentials('company', userName, token);
};

const getCompanyData = async () => {
  try {
    // Retrieve the credentials
    const credentials = await Keychain.getInternetCredentials('company');
    if (credentials) {
      return credentials;
    } else {
      console.log('No company data stored');
      return false;
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
};

const saveCompanyServerEndpoint = async (userName: string, token: string) => {
  // Store the credentials
  await Keychain.setInternetCredentials('companyServer', userName, token);
};

const getCompanyServerEndpoint = async () => {
  try {
    // Retrieve the credentials
    const credentials = await Keychain.getInternetCredentials('companyServer');
    if (credentials) {
      return credentials;
    } else {
      console.log('No company data stored');
      return false;
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
};

const clearKeychain = async () => {
  await Keychain.resetGenericPassword();
};

const clearCompanyKeychain = async () => {
  await Keychain.resetGenericPassword();
  await Keychain.resetInternetCredentials('company');
  await Keychain.resetInternetCredentials('employee');
  await Keychain.resetInternetCredentials('companyServer');
};

const clearEmployeeKeychain = async () => {
  await Keychain.resetGenericPassword();
  await Keychain.resetInternetCredentials('employee');
};

const SensitiveStorage = {
  saveCreds,
  getCreds,
  clearKeychain,
  saveEmployeeData,
  getEmployeeData,
  saveCompanyData,
  getCompanyData,
  clearEmployeeKeychain,
  clearCompanyKeychain,
  saveCompanyServerEndpoint,
  getCompanyServerEndpoint,
};

export default SensitiveStorage;
