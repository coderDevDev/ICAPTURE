import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  HelperText,
  List,
  RadioButton
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveStudent, getAllClasses } from '../services/database';

export default function CreateStudentScreen({ navigation, route }) {
  const editingStudent = route.params?.student;
  const isEditing = !!editingStudent;

  const [name, setName] = useState(editingStudent?.name || '');
  const [studentId, setStudentId] = useState(editingStudent?.studentId || '');
  const [email, setEmail] = useState(editingStudent?.email || '');
  const [classId, setClassId] = useState(editingStudent?.classId || '');
  const [classes, setClasses] = useState([]);
  const [saving, setSaving] = useState(false);

  // Validation states
  const [nameError, setNameError] = useState('');
  const [studentIdError, setStudentIdError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const classesData = await getAllClasses();
    setClasses(classesData);
  };

  const validateEmail = (email) => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate student ID
    if (!studentId.trim()) {
      setStudentIdError('Student ID is required');
      isValid = false;
    } else {
      setStudentIdError('');
    }

    // Validate email
    if (email && !validateEmail(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving.');
      return;
    }

    setSaving(true);

    try {
      const studentData = {
        id: editingStudent?.id || `student_${Date.now()}`,
        name: name.trim(),
        studentId: studentId.trim(),
        email: email.trim() || null,
        classId: classId || null,
        createdAt: editingStudent?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await saveStudent(studentData);

      if (result.success) {
        Alert.alert(
          'Success',
          `Student ${isEditing ? 'updated' : 'created'} successfully!`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving student:', error);
      Alert.alert('Error', 'Failed to save student. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getClassName = (id) => {
    const classData = classes.find(c => c.id === id);
    return classData ? classData.name : 'No Class';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.headerTitle}>
              {isEditing ? '✏️ Edit Student' : '➕ Add New Student'}
            </Title>
            <Paragraph style={styles.headerText}>
              {isEditing
                ? 'Update student information'
                : 'Enter student details to add them to the system'}
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Student Information */}
        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>📝 Student Information</Title>

            {/* Name */}
            <TextInput
              label="Full Name *"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              error={!!nameError}
              left={<TextInput.Icon icon="account" />}
            />
            {nameError ? (
              <HelperText type="error" visible={!!nameError}>
                {nameError}
              </HelperText>
            ) : null}

            {/* Student ID */}
            <TextInput
              label="Student ID *"
              value={studentId}
              onChangeText={setStudentId}
              mode="outlined"
              style={styles.input}
              error={!!studentIdError}
              left={<TextInput.Icon icon="identifier" />}
              placeholder="e.g., 2024-001"
            />
            {studentIdError ? (
              <HelperText type="error" visible={!!studentIdError}>
                {studentIdError}
              </HelperText>
            ) : null}

            {/* Email */}
            <TextInput
              label="Email (Optional)"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              error={!!emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
              placeholder="student@example.com"
            />
            {emailError ? (
              <HelperText type="error" visible={!!emailError}>
                {emailError}
              </HelperText>
            ) : (
              <HelperText type="info">
                Email is optional but useful for notifications
              </HelperText>
            )}
          </Card.Content>
        </Card>

        {/* Class Assignment */}
        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>🏫 Class Assignment</Title>
            <Paragraph style={styles.sectionText}>
              Assign student to a class (optional)
            </Paragraph>

            {classes.length === 0 ? (
              <View style={styles.noClassContainer}>
                <Paragraph style={styles.noClassText}>
                  No classes available. Create a class first.
                </Paragraph>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Classes')}
                  icon="plus"
                  style={styles.createClassButton}>
                  Create Class
                </Button>
              </View>
            ) : (
              <RadioButton.Group
                onValueChange={value => setClassId(value)}
                value={classId}>
                <List.Item
                  title="No Class"
                  description="Student not assigned to any class"
                  left={() => <RadioButton.Android value="" />}
                  style={!classId && styles.selectedListItem}
                />
                {classes.map(classItem => (
                  <List.Item
                    key={classItem.id}
                    title={classItem.name}
                    description={`${classItem.section || 'No section'} • ${classItem.academicYear || 'N/A'}`}
                    left={() => <RadioButton.Android value={classItem.id} />}
                    style={classId === classItem.id && styles.selectedListItem}
                  />
                ))}
              </RadioButton.Group>
            )}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            disabled={saving}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            loading={saving}
            disabled={saving}
            icon="content-save">
            {isEditing ? 'Update Student' : 'Add Student'}
          </Button>
        </View>
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
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  headerText: {
    fontSize: 14,
    color: '#4A4A4A',
    marginTop: 4
  },
  formCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12
  },
  sectionText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF'
  },
  noClassContainer: {
    padding: 16,
    alignItems: 'center'
  },
  noClassText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12
  },
  createClassButton: {
    borderColor: '#2E7D32',
    borderWidth: 2
  },
  selectedListItem: {
    backgroundColor: '#F1F8E9'
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8
  },
  cancelButton: {
    flex: 1,
    borderColor: '#666666',
    borderWidth: 2
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2E7D32'
  }
});
