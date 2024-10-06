import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import main from './app/screens/main'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const Stack = createStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
      <StatusBar barStyle="light-content"/>
        <Stack.Navigator
         initialRouteName="Home"
         screenOptions={{
          headerShown:false,
         }}>
          <Stack.Screen 
            name="Home" 
            component={main} 
            
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
