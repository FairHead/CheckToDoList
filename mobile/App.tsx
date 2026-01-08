/**
 * CheckToDoList Mobile App
 * Collaborative ToDo-Listen App mit Firebase Backend
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Firebase initialisieren
import '@react-native-firebase/app';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0288D1" />
      <View style={styles.header}>
        <Text style={styles.headerText}>CheckToDoList</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>🎉 Firebase Connected!</Text>
        <Text style={styles.subText}>
          Die App ist erfolgreich eingerichtet.
        </Text>
        <Text style={styles.subText}>
          Nächster Schritt: Authentication implementieren
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#29B6F6',
  },
  header: {
    backgroundColor: '#0288D1',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default App;
