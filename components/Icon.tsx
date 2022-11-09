import React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';

const Icon = ({name, color, size, style, onPress}) => {
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
