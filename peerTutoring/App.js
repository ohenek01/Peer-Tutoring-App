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
import TutorDetailScreen from './components/TutorDetailScreen';
import ChatScreen from './components/ChatScreen';
import TutorHome from './components/TutorHome';
import LearnerPage from './components/LearnerPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProfilePage from './components/ProfilePage';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ActivityIndicator, View } from 'react-native';
import LearnerDetailScreen from './components/LearnerDetailScreen';
import ChatPage from './components/ChatPage';
import Ionicons from '@expo/vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" 
      component={HomeTab} 
      options={{ 
        headerShown: false, 
        tabBarIcon: ({color, size}) => (
          <Entypo name="home" size={24} color="black" />  
        ),
        
        }} />
      <Tab.Screen name="Search" 
      component={SearchPage} 
      options={{ 
        headerShown: false, 
        tabBarIcon: ({color, size}) => (
           <FontAwesome name="search" size={24} color="black" />
        )
      }} />
        <Tab.Screen name= "Chats"
        component = {ChatPage}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Ionicons name="chatbubbles" size={24} color="black" />
          )
        }}
        />
        <Tab.Screen name="Profile" 
      component={ProfilePage} 
      options={{ 
        headerShown: false, 
        tabBarIcon: ({color, size}) => (
           <FontAwesome name="user" size={24} color="black" />
        )
        }} />
    </Tab.Navigator>
  );
}

function HomeTab({ navigation }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token not found');

      const res = await axios.get('http://192.168.0.102:5001/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserRole(res.data.data.role);
    } catch (error) {
      console.error('Error fetching Role:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return userRole === 'Tutor' ? <TutorHome /> : <Home />;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name='Welcome' component={Welcome} options={{headerShown: false}}/>
        <Stack.Screen name='TutorHome' component={TutorHome} options={{headerShown: false}}/>
        <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
        <Stack.Screen name='SignUp' component={Signup} options={{headerShown: false}}/>
        <Stack.Screen name='Role' component={Role} options={{headerShown: false}}/>
        <Stack.Screen name='Profile' component={Profile} options={{headerShown: false}}/>
        <Stack.Screen name='Tutor-Profile' component={Tutorprofile} options={{headerShown: false}}/>
        <Stack.Screen name='TutorPage' component={TutorPage} options={{headerShown: false}}/>
        <Stack.Screen name='LearnerPage' component={LearnerPage} options={{headerShown: false}}/>
        <Stack.Screen name='TutorDetailScreen' component={TutorDetailScreen} options={{headerShown: false}}/>
        <Stack.Screen name='LearnerDetailScreen' component={LearnerDetailScreen} options={{headerShown: false}}/>
        <Stack.Screen name='ChatScreen' component={ChatScreen} options={{headerShown: false}}/>
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


