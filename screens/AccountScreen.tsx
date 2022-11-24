import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import CustomText from '../components/CustomText';
import Icon from '../components/Icon';
import Separator from '../components/Separator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HeartsScreen from './HeartsScreen';
import {TouchableOpacity} from 'react-native-gesture-handler';

// Use stack navigation to go to a new HeartsScreen.tsx

const Stack = createNativeStackNavigator();

const Account = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      styles.container.opacity = 1;
    }, 500);
  }, []);

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.profile}>
          <Icon
            name="ios-person-outline"
            size={64}
            color="white"
            style={styles.circle}
            onPress={undefined}
          />
          <Separator />
          <Text style={styles.title}>Hey, Srinandan</Text>
        </View>
        <View style={styles.list}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Hearts');
            }}>
            <View style={styles.listItem}>
              <Icon name="heart" size={24} color="white" material />
              <CustomText style={styles.listItemText}>Favorites</CustomText>
            </View>
          </TouchableOpacity>
          <Separator />
          <TouchableOpacity>
            <View style={styles.listItem}>
              <Icon name="play-box-multiple" size={24} color="white" material />
              <CustomText style={styles.listItemText}>Watchlist</CustomText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const AccountStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Hearts"
        component={HeartsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'black',
    flex: 1,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    opacity: 1,
  },
  title: {
    color: 'white',
    fontSize: 24,
  },
  profile: {
    alignItems: 'center',
  },
  circle: {
    borderRadius: 58,
    borderWidth: 1,
    borderColor: 'white',
    padding: 24,
  },
  list: {
    marginVertical: 32,
  },
  listItem: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemText: {
    marginLeft: 16,
  },
});

export default AccountStackScreen;
