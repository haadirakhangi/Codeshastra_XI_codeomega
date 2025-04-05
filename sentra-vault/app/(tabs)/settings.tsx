import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, Book, Flag, Lock } from 'lucide-react-native';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Controls</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Flag size={24} color="#162C88" />
            <Text style={styles.settingText}>View Flagged Queries</Text>
          </View>
          <Switch
            trackColor={{ false: '#E5E7EB', true: '#162C88' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Book size={24} color="#162C88" />
            <Text style={styles.settingText}>Edit Knowledge Base</Text>
          </View>
          <Switch
            trackColor={{ false: '#E5E7EB', true: '#162C88' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Lock size={24} color="#162C88" />
            <Text style={styles.settingText}>Access Controls</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <AlertTriangle size={24} color="#D21C1C" />
            <Text style={[styles.settingText, { color: '#D21C1C' }]}>
              Security Alerts
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#162C88',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#1F2937',
  },
  badge: {
    backgroundColor: '#D21C1C',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});