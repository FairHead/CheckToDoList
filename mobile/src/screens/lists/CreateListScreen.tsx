/**
 * Create List Screen
 * 
 * Screen for creating a new list with custom name.
 * 
 * @see web/app.js - createNewList() for reference
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const CreateListScreen: React.FC<Props> = ({ navigation }) => {
  const [listName, setListName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateList = async () => {
    // TODO: Implement - Issue #3
    // 1. Validate name is not empty
    // 2. Call listService.createList({ name: listName })
    // 3. Navigate to ListDetailScreen with new list ID
    
    if (!listName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    setLoading(true);
    try {
      // const newList = await listService.createList({ name: listName.trim() });
      // navigation.replace(ROUTES.LISTS.LIST_DETAIL, { listId: newList.id });
      Alert.alert('Not Implemented', 'Issue #3 - Create list');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New List</Text>
        <TouchableOpacity 
          onPress={handleCreateList}
          disabled={loading || !listName.trim()}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={[
              styles.createButton,
              !listName.trim() && styles.createButtonDisabled
            ]}>Create</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>List Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter list name..."
          placeholderTextColor={COLORS.textSecondary}
          value={listName}
          onChangeText={setListName}
          autoFocus
          maxLength={50}
        />
        <Text style={styles.hint}>
          {listName.length}/50 characters
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  cancelButton: {
    color: COLORS.white,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  createButton: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    padding: 20,
  },
  label: {
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.contentBackground,
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    color: COLORS.text,
  },
  hint: {
    color: COLORS.white,
    opacity: 0.5,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
});

export default CreateListScreen;
