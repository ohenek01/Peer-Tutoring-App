import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './components/Welcome';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Role from './components/Role';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name='Welcome' component={Welcome} options={{headerShown: false}}/>
        <Stack.Screen name='Home' component={Home}/>
        <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name='SignUp' component={Signup} options={{headerShown: false}}/>
        <Stack.Screen name='Role' component={Role} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


