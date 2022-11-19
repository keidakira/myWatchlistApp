import React from 'react';
import {StyleSheet, Text} from 'react-native';

interface TextProps {
  children: string;
  style?: any;
  numberOfLines?: number;
}

const CustomText = ({children, style, numberOfLines}: TextProps) => {
  return (
    <Text
      style={[styles.text, style]}
      numberOfLines={numberOfLines ?? undefined}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
});

export default CustomText;
