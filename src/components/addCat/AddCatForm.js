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
  // safeContainer: {
  //   flex: 1,
  //   marginTop: Constants.statusBarHeight,
  // },
  guide: {
    paddingVertical: 20,
    color: '#767577',
    fontSize: 25,
    fontWeight: '400',
    textAlign: 'center',
  },
  // scrollView: {
  //   marginHorizontal: 5,
  // },
});

const AddCatForm = () => (
  <View style={styles.container}>
    {/* <SafeAreaView style={styles.safeContainer}> */}
    <Text style={styles.guide}>Fill cat's info</Text>
    <AddCatMap />
    {/* <ScrollView style={styles.scrollView}> */}
    <AddCatBio />
    {/* </ScrollView> */}
    {/* </SafeAreaView> */}
  </View>
);

export default AddCatForm;
