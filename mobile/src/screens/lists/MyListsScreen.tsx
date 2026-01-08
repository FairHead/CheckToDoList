/**
 * My Lists Screen
 * 
 * Main screen showing user's own lists.
 * Grid layout similar to web app.
 * 
 * @see web/app.js - renderLists() for reference implementation
 * @see docs/MOBILE_APP_SPECIFICATION.md
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../constants/routes';
import { List } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const MyListsScreen: React.FC<Props> = ({ navigation }) => {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // TODO: Implement - Issue #3
    // Subscribe to user's lists using listService.subscribeToMyLists()
    setLoading(false);
  }, []);

  const handleCreateList = () => {
    navigation.navigate(ROUTES.LISTS.CREATE_LIST);
  };

  const handleOpenList = (list: List) => {
    navigation.navigate(ROUTES.LISTS.LIST_DETAIL, { listId: list.id });
  };

  const renderListItem = ({ item }: { item: List }) => (
    <TouchableOpacity 
      style={styles.listCard}
      onPress={() => handleOpenList(item)}
    >
      <View style={styles.listHeader}>
        <Text style={styles.listName} numberOfLines={1}>{item.name}</Text>
      </View>
      <View style={styles.listContent}>
        <Text style={styles.itemCount}>
          {item.completedCount}/{item.itemCount} items
        </Text>
      </View>
      <View style={styles.listFooter}>
        <Text style={styles.memberCount}>
          {Object.keys(item.members || {}).length + 1} members
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Lists</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateList}
        >
          <Text style={styles.createButtonText}>+ New List</Text>
        </TouchableOpacity>
      </View>

      {lists.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No lists yet</Text>
          <Text style={styles.emptySubtext}>
            Create your first list to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={lists}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                // Manual refresh if needed
                setRefreshing(false);
              }}
              tintColor={COLORS.white}
            />
          }
        />
      )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  createButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  listCard: {
    backgroundColor: COLORS.contentBackground,
    borderRadius: 12,
    width: '48%',
    marginBottom: 15,
    overflow: 'hidden',
  },
  listHeader: {
    backgroundColor: COLORS.primary,
    padding: 12,
  },
  listName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
    minHeight: 60,
  },
  itemCount: {
    color: COLORS.text,
    fontSize: 14,
  },
  listFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberCount: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: COLORS.white,
    opacity: 0.7,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MyListsScreen;
