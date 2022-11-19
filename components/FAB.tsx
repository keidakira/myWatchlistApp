// FAB: Floating Action Button

import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from './Icon';

const FAB = ({icon, onPress}) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Icon name={icon} size={30} color="black" material={true} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FAB;
