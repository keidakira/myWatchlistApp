import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const CustomButton = ({title, onPress, icon}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {icon && <IonIcon name={icon} size={24} color="black" />}
      {icon && <View style={styles.seperator}></View>}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 4,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seperator: {
    width: 8,
  },
});

export default CustomButton;
