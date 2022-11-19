import React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Icon = ({name, color, size, style, onPress, material}) => {
  if (material) {
    return (
      <MaterialCommunityIcon
        name={name}
        color={color}
        size={size}
        style={style}
        onPress={onPress}
      />
    );
  }

  return (
    <IonIcon
      name={name}
      size={size}
      color={color}
      style={style}
      onPress={onPress}
    />
  );
};

export default Icon;
