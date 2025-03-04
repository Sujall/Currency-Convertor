import { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Bell, Moon, Globe, Info, CircleHelp as HelpCircle, Star, Trash2 } from 'lucide-react-native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Toggle settings
  const toggleDarkMode = () => {
    setDarkMode(previousState => !previousState);
    // In a real app, you would apply the theme change here
  };

  const toggleNotifications = () => {
    setNotifications(previousState => !previousState);
    // In a real app, you would handle notification permissions here
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(previousState => !previousState);
  };

  // Clear data
  const clearData = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to clear all app data? This action cannot be undone.')) {
        // Clear data logic would go here
        alert('All data has been cleared.');
      }
    } else {
      Alert.alert(
        'Clear App Data',
        'Are you sure you want to clear all app data? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => {
              // Clear data logic would go here
              Alert.alert('Success', 'All data has been cleared.');
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Settings */}
      <ScrollView style={styles.scrollView}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Moon size={20} color="#64748B" style={styles.settingIcon} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={darkMode ? '#3B82F6' : '#FFFFFF'}
              ios_backgroundColor="#E2E8F0"
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#64748B" style={styles.settingIcon} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={notifications ? '#3B82F6' : '#FFFFFF'}
              ios_backgroundColor="#E2E8F0"
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Globe size={20} color="#64748B" style={styles.settingIcon} />
              <Text style={styles.settingText}>Auto-refresh Rates</Text>
            </View>
            <Switch
              value={autoRefresh}
              onValueChange={toggleAutoRefresh}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={autoRefresh ? '#3B82F6' : '#FFFFFF'}
              ios_backgroundColor="#E2E8F0"
            />
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Star size={20} color="#64748B" style={styles.settingIcon} />
              <Text style={styles.settingText}>Favorite Currencies</Text>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Info size={20} color="#64748B" style={styles.settingIcon} />
              <Text style={styles.settingText}>About This App</Text>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <HelpCircle size={20} color="#64748B" style={styles.settingIcon} />
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={clearData}
          >
            <View style={styles.settingInfo}>
              <Trash2 size={20} color="#EF4444" style={styles.settingIcon} />
              <Text style={styles.dangerText}>Clear App Data</Text>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Currency Converter v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 Currency Converter</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1E293B',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1E293B',
  },
  dangerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#EF4444',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  appVersion: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  appCopyright: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94A3B8',
  },
});