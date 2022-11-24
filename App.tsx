import 'react-native-gesture-handler';

import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Icon from './components/Icon';
import SearchScreen from './screens/Search';
import HomeScreen from './screens/HomeScreen';
import AccountStackScreen from './screens/AccountScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <BottomSheetModalProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle={'dark-content'} />
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: 'black',
                borderTopColor: 'black',
              },
              tabBarActiveTintColor: 'white',
            }}>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({focused, color}) => (
                  <Icon
                    name={focused ? 'home' : 'home-outline'}
                    size={focused ? 28 : 24}
                    color={color}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Search"
              component={SearchScreen}
              options={{
                tabBarLabel: 'Search',
                tabBarIcon: ({focused, color}) => (
                  <Icon
                    name={focused ? 'search' : 'md-search-sharp'}
                    size={focused ? 28 : 24}
                    color={color}
                  />
                ),
                unmountOnBlur: true,
              }}
            />
            <Tab.Screen
              name="AccountBase"
              component={AccountStackScreen}
              options={{
                tabBarLabel: 'Account',
                tabBarIcon: ({focused, color}) => (
                  <Icon
                    name={focused ? 'person' : 'ios-person-outline'}
                    size={focused ? 28 : 24}
                    color={color}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    padding: 16,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  separator: {
    height: 20,
  },
  scrollView: {
    flex: 1,
  },
  horizontalScrollView: {
    backgroundColor: 'black',
    marginVertical: 8,
  },
  main: {
    backgroundColor: 'black',
    flex: 1,
  },
  header: {
    backgroundColor: 'black',
    height: 80,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: 200,
    resizeMode: 'contain',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  posterImage: {
    width: 128,
    aspectRatio: 2 / 3,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  poster: {
    marginRight: 12,
  },
});

export default App;
