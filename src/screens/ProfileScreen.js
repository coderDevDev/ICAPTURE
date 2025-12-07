import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  IconButton,
  Avatar,
  Divider,
  List
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@omr_teacher_profile';

export default function ProfileScreen({ navigation }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Profile data
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem(PROFILE_KEY);
      if (profileData) {
        const profile = JSON.parse(profileData);
        setProfileImage(profile.profileImage || null);
        setName(profile.name || '');
        setEmail(profile.email || '');
        setSchool(profile.school || '');
        setDepartment(profile.department || '');
        setPhone(profile.phone || '');
        setBio(profile.bio || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const profile = {
        profileImage,
        name,
        email,
        school,
        department,
        phone,
        bio,
        updatedAt: new Date().toISOString()
      };
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    loadProfile(); // Reload original data
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              {profileImage ? (
                <Avatar.Image size={100} source={{ uri: profileImage }} />
              ) : (
                <Avatar.Icon size={100} icon="account" style={styles.avatarIcon} />
              )}
              {editing && (
                <IconButton
                  icon="camera"
                  size={24}
                  iconColor="#FFFFFF"
                  style={styles.cameraButton}
                  onPress={pickImage}
                />
              )}
            </View>
            {!editing ? (
              <>
                <Title style={styles.profileName}>{name || 'Teacher Name'}</Title>
                <Paragraph style={styles.profileEmail}>{email || 'email@example.com'}</Paragraph>
                <Button
                  mode="contained"
                  icon="pencil"
                  style={styles.editButton}
                  onPress={() => setEditing(true)}>
                  Edit Profile
                </Button>
              </>
            ) : (
              <Paragraph style={styles.editingText}>Editing Profile</Paragraph>
            )}
          </Card.Content>
        </Card>

        {/* Profile Information */}
        {editing ? (
          <Card style={styles.infoCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Personal Information</Title>
              
              <TextInput
                label="Full Name *"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
              />

              <TextInput
                label="Email Address *"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                left={<TextInput.Icon icon="phone" />}
              />

              <Divider style={styles.divider} />

              <Title style={styles.sectionTitle}>Professional Information</Title>

              <TextInput
                label="School/Institution"
                value={school}
                onChangeText={setSchool}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="school" />}
              />

              <TextInput
                label="Department"
                value={department}
                onChangeText={setDepartment}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="book-education" />}
              />

              <TextInput
                label="Bio"
                value={bio}
                onChangeText={setBio}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.input}
                left={<TextInput.Icon icon="text" />}
              />

              <View style={styles.buttonRow}>
                <Button
                  mode="outlined"
                  onPress={cancelEdit}
                  style={styles.cancelButton}
                  disabled={saving}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={saveProfile}
                  style={styles.saveButton}
                  loading={saving}
                  disabled={saving || !name || !email}>
                  Save Changes
                </Button>
              </View>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.infoCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Personal Information</Title>
              
              <List.Item
                title="Full Name"
                description={name || 'Not set'}
                left={props => <List.Icon {...props} icon="account" />}
                style={styles.listItem}
              />
              
              <List.Item
                title="Email"
                description={email || 'Not set'}
                left={props => <List.Icon {...props} icon="email" />}
                style={styles.listItem}
              />
              
              <List.Item
                title="Phone"
                description={phone || 'Not set'}
                left={props => <List.Icon {...props} icon="phone" />}
                style={styles.listItem}
              />

              <Divider style={styles.divider} />

              <Title style={styles.sectionTitle}>Professional Information</Title>

              <List.Item
                title="School/Institution"
                description={school || 'Not set'}
                left={props => <List.Icon {...props} icon="school" />}
                style={styles.listItem}
              />
              
              <List.Item
                title="Department"
                description={department || 'Not set'}
                left={props => <List.Icon {...props} icon="book-education" />}
                style={styles.listItem}
              />
              
              {bio ? (
                <View style={styles.bioContainer}>
                  <Paragraph style={styles.bioLabel}>Bio</Paragraph>
                  <Paragraph style={styles.bioText}>{bio}</Paragraph>
                </View>
              ) : null}
            </Card.Content>
          </Card>
        )}

        {/* Quick Actions */}
        {!editing && (
          <Card style={styles.actionsCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Quick Actions</Title>
              
              <Button
                mode="outlined"
                icon="account-group"
                style={styles.actionButton}
                onPress={() => navigation.navigate('StudentsTab')}>
                Manage Students
              </Button>
              
              <Button
                mode="outlined"
                icon="key"
                style={styles.actionButton}
                onPress={() => navigation.navigate('AnswerKeysTab')}>
                Manage Answer Keys
              </Button>
              
              <Button
                mode="outlined"
                icon="google-classroom"
                style={styles.actionButton}
                onPress={() => navigation.navigate('ClassesTab')}>
                Manage Classes
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    borderRadius: 12
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 24
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16
  },
  avatarIcon: {
    backgroundColor: '#2E7D32'
  },
  cameraButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#2E7D32',
    elevation: 4
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16
  },
  editingText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 8
  },
  editButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16
  },
  infoCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    borderRadius: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF'
  },
  divider: {
    marginVertical: 20
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16
  },
  cancelButton: {
    flex: 1,
    borderColor: '#666666'
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2E7D32'
  },
  listItem: {
    paddingVertical: 4
  },
  bioContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8
  },
  bioLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 8
  },
  bioText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20
  },
  actionsCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    borderRadius: 12
  },
  actionButton: {
    marginBottom: 12,
    borderColor: '#2E7D32'
  }
});
