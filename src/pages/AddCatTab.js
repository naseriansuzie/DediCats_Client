import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AddCatTab = () => <View />;

export default AddCatTab;

AddCatTab.navigationOptions = {
  title: '길고양이 등록',
  tabBarIcon: ({ focused }) => {
    const color = focused ? '#6772F1' : '#767577';
    const size = 30;
    return <MaterialCommunityIcons size={size} name="paw" color={color} />;
  },
  tabBarOptions: { activeTintColor: '#6772F1' },
};
