/*
 *   Copyright (c) 2023
 *   All rights reserved.
 */
import * as React from 'react';
import {
  CardStyleInterpolators,
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';
import {RouteName, StackName} from './RouteName';
import Splash from '@src/scenes/splash';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const Stack = createStackNavigator();

//NOTE: Onboarding Screens //
export const StackNavigator: React.FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={StackScreenOptions}>
      <Stack.Screen name={RouteName.Splash} component={Splash} />
      <Stack.Screen name={StackName.Auth} component={AuthNavigator} />
      <Stack.Screen name={StackName.App} component={AppNavigator} />
    </Stack.Navigator>
  );
};

export const StackScreenOptions: StackNavigationOptions = {
  headerShown: false,
  gestureEnabled: false,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export default StackNavigator;
