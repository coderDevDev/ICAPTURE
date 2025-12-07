import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import our screens
import HomeScreen from './src/screens/HomeScreen';
import CameraOverlayScreen from './src/screens/CameraOverlayScreen';
import DocumentExtractionScreen from './src/screens/DocumentExtractionScreen';
import RectanglePreviewScreen from './src/screens/RectanglePreviewScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import TemplateScreen from './src/screens/TemplateScreen';
import AnswerKeysScreen from './src/screens/AnswerKeysScreen';
import CreateAnswerKeyScreen from './src/screens/CreateAnswerKeyScreen';
import StudentsScreen from './src/screens/StudentsScreen';
import CreateStudentScreen from './src/screens/CreateStudentScreen';
import StudentStatsScreen from './src/screens/StudentStatsScreen';
import ClassesScreen from './src/screens/ClassesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CreditsScreen from './src/screens/CreditsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for main screens
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'StudentsTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'AnswerKeysTab') {
            iconName = focused ? 'key' : 'key-outline';
          } else if (route.name === 'ClassesTab') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'CreditsTab') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600'
        },
        headerStyle: {
          backgroundColor: '#2E7D32',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18
        }
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home', headerTitle: 'ICAPTURE' }}
      />
      <Tab.Screen
        name="StudentsTab"
        component={StudentsScreen}
        options={{ title: 'Students' }}
      />
      <Tab.Screen
        name="AnswerKeysTab"
        component={AnswerKeysScreen}
        options={{ title: 'Answer Keys' }}
      />
      <Tab.Screen
        name="ClassesTab"
        component={ClassesScreen}
        options={{ title: 'Classes' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen
        name="CreditsTab"
        component={CreditsScreen}
        options={{ title: 'Credits' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2E7D32',
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18
              },
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0]
                        })
                      }
                    ]
                  }
                };
              }
            }}>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Template"
              component={TemplateScreen}
              options={{ title: 'Select Template' }}
            />
            <Stack.Screen
              name="Camera"
              component={CameraOverlayScreen}
              options={{
                title: 'Camera Overlay',
                headerShown: false // Hide header for full-screen camera
              }}
            />
            <Stack.Screen
              name="DocumentExtraction"
              component={DocumentExtractionScreen}
              options={{
                title: 'Extracting Document',
                headerShown: false
              }}
            />
            <Stack.Screen
              name="RectanglePreview"
              component={RectanglePreviewScreen}
              options={{ title: 'Verify Detection' }}
            />
            <Stack.Screen
              name="Results"
              component={ResultsScreen}
              options={{ title: 'OMR Results' }}
            />
            <Stack.Screen
              name="AnswerKeys"
              component={AnswerKeysScreen}
              options={{ title: 'Answer Keys' }}
            />
            <Stack.Screen
              name="CreateAnswerKey"
              component={CreateAnswerKeyScreen}
              options={{ title: 'Create Answer Key' }}
            />
            <Stack.Screen
              name="CreateStudent"
              component={CreateStudentScreen}
              options={{ title: 'Add Student' }}
            />
            <Stack.Screen
              name="StudentStats"
              component={StudentStatsScreen}
              options={{ title: 'Student Statistics' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
