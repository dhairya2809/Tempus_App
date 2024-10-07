import * as React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import {RouteName} from './RouteName';
import CompanyLogin from '@scenes/companyLogin';
import EmployeeLogin from '@scenes/employeeLogin';
import LoginCode from '@scenes/loginCode';

const Stack = createStackNavigator();

//NOTE: Onboarding Screens //
export const AuthNavigator: React.FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={StackScreenOptions}>
      <Stack.Screen name={RouteName.CompanyLogin} component={CompanyLogin} />
      <Stack.Screen name={RouteName.EmployeeLogin} component={EmployeeLogin} />
      <Stack.Screen name={RouteName.LoginCode} component={LoginCode} />
    </Stack.Navigator>
  );
};

export const StackScreenOptions: StackNavigationOptions = {
  headerShown: false,
  gestureEnabled: false,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export default AuthNavigator;
