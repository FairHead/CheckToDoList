/**
 * List Detail Screen
 * 
 * Shows items in a list with add/edit/delete/toggle functionality.
 * 
 * @see web/app.js - renderLists() items section for reference
 * @see docs/MOBILE_APP_SPECIFICATION.md
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';
import { List, Item } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
};

const ListDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { listId } = route.params as { listId: string };
  const [list, setList] = useState<List | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement - Issue #3 & #4
    // 1. Subscribe to list using listService.subscribeToList(listId)
    // 2. Subscribe to items using itemService.subscribeToItems(listId)
    setLoading(false);
  }, [listId]);

  const handleAddItem = async () => {
    // TODO: Implement - Issue #4
    // Call itemService.addItem(listId, { text: newItemText })
    if (!newItemText.trim()) return;
    
    Alert.alert('Not Implemented', 'Issue #4 - Add item');
    setNewItemText('');
  };

  const handleToggleItem = async (item: Item) => {
    // TODO: Implement - Issue #4
    // Call itemService.toggleItemCompleted(listId, item.id)
    Alert.alert('Not Implemented', 'Issue #4 - Toggle item');
  };

  const handleDeleteItem = (item: Item) => {
    // TODO: Implement - Issue #4
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.text}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // itemService.deleteItem(listId, item.id)
            Alert.alert('Not Implemented', 'Issue #4 - Delete item');
          }
        }
      ]
    );
  };

  const handleInviteMembers = () => {
    navigation.navigate(ROUTES.LISTS.INVITE_MEMBERS, { listId });
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemRow}>
      <TouchableOpacity 
        style={styles.checkbox}
        onPress={() => handleToggleItem(item)}
      >
        <View style={[styles.checkboxInner, item.completed && styles.checkboxChecked]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
      
      <Text style={[styles.itemText, item.completed && styles.itemTextCompleted]}>
        {item.text}
      </Text>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteItem(item)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {list?.name || 'Loading...'}
        </Text>
        <TouchableOpacity onPress={handleInviteMembers}>
          <Text style={styles.inviteButton}>+ Invite</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.addItemInput}
          placeholder="Add new item..."
          placeholderTextColor={COLORS.textSecondary}
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={handleAddItem}
          returnKeyType="done"
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddItem}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items yet</Text>
            <Text style={styles.emptySubtext}>Add your first item above</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {items.filter(i => i.completed).length}/{items.length} completed
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
  },
  backButton: {
    color: COLORS.white,
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  inviteButton: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  addItemContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  addItemInput: {
    flex: 1,
    backgroundColor: COLORS.contentBackground,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  listContent: {
    padding: 15,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.contentBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 24,
    color: COLORS.danger,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: COLORS.white,
    opacity: 0.7,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.white,
    opacity: 0.7,
  },
});

export default ListDetailScreen;
