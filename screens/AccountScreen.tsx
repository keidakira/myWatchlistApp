import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomText from '../components/CustomText';
import Icon from '../components/Icon';
import Separator from '../components/Separator';

const AccountScreen = () => {
  return (
    <View style={styles.main}>
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
        <Pressable>
          <View style={styles.listItem}>
            <Icon name="ios-heart-outline" size={24} color="white" />
            <CustomText style={styles.listItemText}>Favorites</CustomText>
          </View>
        </Pressable>
        <Separator />
        <Pressable>
          <View style={styles.listItem}>
            <Icon name="ios-settings-outline" size={24} color="white" />
            <CustomText style={styles.listItemText}>Settings</CustomText>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'black',
    flex: 1,
    paddingHorizontal: 16,
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

export default AccountScreen;
