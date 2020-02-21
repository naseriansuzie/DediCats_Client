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
  catMap: { flex: 1, width: '100%' },
  catBio: { flex: 2, width: '100%' },
});

const AddCatForm = () => (
  <View style={styles.container}>
    <Text style={styles.guide}>Fill cat's info</Text>
    <View style={styles.catMap}>
      <AddCatMap />
    </View>
    <View style={styles.catBio}>
      <AddCatBio />
    </View>
  </View>
);

export default AddCatForm;
