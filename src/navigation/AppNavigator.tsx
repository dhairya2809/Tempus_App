import * as React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import {RouteName} from './RouteName';
import Dashboard from '@src/scenes/dashboard';
import CheckedIn from '@src/scenes/checkedIn';
import Profile from '@src/scenes/profile';
import Report from '@src/scenes/report';

const Stack = createStackNavigator();

//NOTE: Onboarding Screens //
export const AppNavigator: React.FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={StackScreenOptions}>
      <Stack.Screen name={RouteName.Dashboard} component={Dashboard} />
      <Stack.Screen name={RouteName.checkedIn} component={CheckedIn} />
      <Stack.Screen name={RouteName.Profile} component={Profile} />
      <Stack.Screen name={RouteName.Report} component={Report} />
    </Stack.Navigator>
  );
};

export const StackScreenOptions: StackNavigationOptions = {
  headerShown: false,
  gestureEnabled: false,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export default AppNavigator;
