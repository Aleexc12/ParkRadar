import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { ChevronRight, MapPin, Bell, Shield, CircleHelp as HelpCircle, Info, Moon } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleSwitch = (setting: string, value: boolean) => {
    switch (setting) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'locationTracking':
        setLocationTracking(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <View style={styles.iconContainer}>
                <Bell size={20} color={Colors.primary[600]} />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={(value) => toggleSwitch('notifications', value)}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[400] }}
              thumbColor={notifications ? Colors.primary[600] : Colors.neutral[100]}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <View style={styles.iconContainer}>
                <MapPin size={20} color={Colors.primary[600]} />
              </View>
              <Text style={styles.settingText}>Location Tracking</Text>
            </View>
            <Switch
              value={locationTracking}
              onValueChange={(value) => toggleSwitch('locationTracking', value)}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[400] }}
              thumbColor={locationTracking ? Colors.primary[600] : Colors.neutral[100]}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <View style={styles.iconContainer}>
                <Moon size={20} color={Colors.primary[600]} />
              </View>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(value) => toggleSwitch('darkMode', value)}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[400] }}
              thumbColor={darkMode ? Colors.primary[600] : Colors.neutral[100]}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <View style={styles.iconContainer}>
                <Shield size={20} color={Colors.primary[600]} />
              </View>
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <View style={styles.iconContainer}>
                <HelpCircle size={20} color={Colors.primary[600]} />
              </View>
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <View style={styles.iconContainer}>
                <Info size={20} color={Colors.primary[600]} />
              </View>
              <Text style={styles.settingText}>About ParkRadar</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>ParkRadar v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginVertical: 12,
    paddingHorizontal: 16,
    fontFamily: 'Inter-SemiBold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: Colors.neutral[800],
    fontFamily: 'Inter-Regular',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 24,
  },
  versionText: {
    fontSize: 14,
    color: Colors.neutral[500],
    fontFamily: 'Inter-Regular',
  },
});