import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './components/Welcome';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Role from './components/Role';
import Profile from './components/Profile';
import Tutorprofile from './components/Tutorprofile';
import SearchPage from './components/SearchPage';
import TutorPage from './components/TutorPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name='Welcome' component={Welcome} options={{headerShown: false}}/>
        <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
        <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
        <Stack.Screen name='Search' component={SearchPage} options={{headerShown: false}}/>
        <Stack.Screen name='SignUp' component={Signup} options={{headerShown: false}}/>
        <Stack.Screen name='Role' component={Role} options={{headerShown: false}}/>
        <Stack.Screen name='Profile' component={Profile} options={{headerShown: false}}/>
        <Stack.Screen name='Tutor-Profile' component={Tutorprofile} options={{headerShown: false}}/>
        <Stack.Screen name='TutorPage' component={TutorPage} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


