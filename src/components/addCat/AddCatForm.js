import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from 'react-native';
import Constants from 'expo-constants';
import AddCatMap from './AddCatMap';
import AddCatBio from './AddCatBio';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  guide: {
    paddingBottom: 20,
    color: '#767577',
    fontSize: 25,
    fontWeight: '400',
    textAlign: 'center',
  },
  safeContainer: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  scrollView: {
    marginHorizontal: 5,
  },
});

const AddCatForm = () => (
  <View style={styles.container}>
    <SafeAreaView style={styles.safeContainer}>
      <Text style={styles.guide}>Fill cat's info</Text>
      <ScrollView style={styles.scrollView}>
        <AddCatMap />
        <AddCatBio />
      </ScrollView>
    </SafeAreaView>
  </View>
);

export default AddCatForm;
