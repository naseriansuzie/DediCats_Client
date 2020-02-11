import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AddCatMap from './AddCatMap';
import AddCatBio from './AddCatBio';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  guide: {
    paddingTop: 10,
    color: '#767577',
    fontSize: 25,
    fontWeight: '400',
    textAlign: 'center',
  },
});

const AddCatForm = () => (
  <View style={styles.container}>
    <Text style={styles.guide}>Fill cat's info</Text>
    <View style={{ flex: 1, width: '100%' }}>
      <AddCatMap />
    </View>
    <View style={{ flex: 2, width: '100%' }}>
      <AddCatBio />
    </View>
  </View>
);

export default AddCatForm;
