/**
 * Invite Members Screen
 * 
 * Screen for inviting contacts to share a list.
 * Shows phone contacts with option to filter by app users.
 * 
 * @see docs/MOBILE_APP_SPECIFICATION.md - Invitation Flow
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { contactsService } from '../../services';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
};

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  isAppUser: boolean;
}

const InviteMembersScreen: React.FC<Props> = ({ navigation, route }) => {
  const { listId } = route.params as { listId: string };
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAppUsersOnly, setShowAppUsersOnly] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchQuery, showAppUsersOnly, contacts]);

  const loadContacts = async () => {
    // TODO: Implement - Issue #6
    // 1. Request contacts permission
    // 2. Get all contacts using contactsService
    // 3. Check which are app users
    
    setLoading(true);
    try {
      // const allContacts = await contactsService.getAllContacts();
      // setContacts(allContacts);
      Alert.alert('Not Implemented', 'Issue #6 - Load contacts');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = [...contacts];
    
    if (showAppUsersOnly) {
      filtered = filtered.filter(c => c.isAppUser);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.phoneNumber.includes(query)
      );
    }
    
    setFilteredContacts(filtered);
  };

  const toggleContactSelection = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const handleSendInvites = async () => {
    // TODO: Implement - Issue #5
    // 1. For each selected contact, call inviteService.sendInvitation()
    // 2. Show success message
    // 3. Navigate back
    
    if (selectedContacts.size === 0) {
      Alert.alert('Error', 'Please select at least one contact');
      return;
    }

    Alert.alert('Not Implemented', 'Issue #5 - Send invitations');
    navigation.goBack();
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity 
      style={[
        styles.contactRow,
        selectedContacts.has(item.id) && styles.contactRowSelected
      ]}
      onPress={() => toggleContactSelection(item.id)}
    >
      <View style={styles.contactAvatar}>
        <Text style={styles.contactInitial}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
      </View>
      {item.isAppUser && (
        <View style={styles.appUserBadge}>
          <Text style={styles.appUserText}>App User</Text>
        </View>
      )}
      <View style={[
        styles.selectIndicator,
        selectedContacts.has(item.id) && styles.selectIndicatorActive
      ]}>
        {selectedContacts.has(item.id) && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Invite Members</Text>
        <TouchableOpacity onPress={handleSendInvites}>
          <Text style={styles.sendButton}>
            Send ({selectedContacts.size})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <TouchableOpacity 
        style={styles.filterToggle}
        onPress={() => setShowAppUsersOnly(!showAppUsersOnly)}
      >
        <View style={[
          styles.filterCheckbox,
          showAppUsersOnly && styles.filterCheckboxActive
        ]}>
          {showAppUsersOnly && <Text style={styles.checkmarkSmall}>✓</Text>}
        </View>
        <Text style={styles.filterText}>Show app users only</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.white} />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No contacts found</Text>
            </View>
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
  sendButton: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    backgroundColor: COLORS.contentBackground,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  filterCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCheckboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmarkSmall: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterText: {
    color: COLORS.white,
    fontSize: 14,
  },
  listContent: {
    padding: 15,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.contentBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  contactRowSelected: {
    backgroundColor: 'rgba(2, 136, 209, 0.3)',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInitial: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  contactPhone: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  appUserBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  appUserText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  selectIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectIndicatorActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.white,
    marginTop: 10,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default InviteMembersScreen;
