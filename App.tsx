
  import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';
import { Helmet } from 'react-helmet-async';
import { HelmetProvider } from 'react-helmet-async';
import LoginScreen from "./screens/LoginScreen"
import HomeScreen from "./screens/HomeScreen"
import ChatScreen from "./screens/ChatScreen"
  
const Stack = createNativeStackNavigator();
  
function RootStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}
  
export default function App() {
  return (
    <HelmetProvider>
      <SafeAreaProvider style={styles.container}>
        <Helmet defaultTitle="DiagnoAide" titleTemplate="DiagnoAide">
          <title>DiagnoAide</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Helmet>
        <Toaster />
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </HelmetProvider>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
