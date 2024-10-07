import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainRoute from './StackNavigator';

const Navigator = React.forwardRef<
  Partial<React.ComponentProps<typeof NavigationContainer>>
>(() => {
  return (
    <NavigationContainer>
      <MainRoute />
    </NavigationContainer>
  );
});

export default Navigator;
