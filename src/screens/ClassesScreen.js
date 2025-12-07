import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput as RNTextInput
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  IconButton,
  Searchbar,
  ActivityIndicator,
  Dialog,
  Portal,
  TextInput
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllClasses, deleteClass, saveClass, getStudentsByClass } from '../services/database';

export default function ClassesScreen({ navigation }) {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [className, setClassName] = useState('');
  const [classSection, setClassSection] = useState('');
  const [academicYear, setAcademicYear] = useState('');

  useEffect(() => {
    loadClasses();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadClasses();
    });
    
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    filterClasses();
  }, [searchQuery, classes]);

  const loadClasses = async () => {
    setLoading(true);
    const classesData = await getAllClasses();
    setClasses(classesData);
    setLoading(false);
  };

  const filterClasses = () => {
    if (!searchQuery) {
      setFilteredClasses(classes);
      return;
    }
    
    const filtered = classes.filter(classItem =>
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.section?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClasses(filtered);
  };

  const handleDelete = async (classItem) => {
    // Check if class has students
    const students = await getStudentsByClass(classItem.id);
    
    if (students.length > 0) {
      Alert.alert(
        'Cannot Delete Class',
        `This class has ${students.length} student(s). Please remove or reassign students before deleting the class.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Delete Class',
      `Are you sure you want to delete "${classItem.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteClass(classItem.id);
            loadClasses();
          }
        }
      ]
    );
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setClassName(classItem.name);
    setClassSection(classItem.section || '');
    setAcademicYear(classItem.academicYear || '');
    setDialogVisible(true);
  };

  const handleCreate = () => {
    setEditingClass(null);
    setClassName('');
    setClassSection('');
    setAcademicYear('');
    setDialogVisible(true);
  };

  const handleSaveClass = async () => {
    if (!className.trim()) {
      Alert.alert('Validation Error', 'Class name is required');
      return;
    }

    const classData = {
      id: editingClass?.id || `class_${Date.now()}`,
      name: className.trim(),
      section: classSection.trim() || null,
      academicYear: academicYear.trim() || null,
      createdAt: editingClass?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveClass(classData);
    setDialogVisible(false);
    loadClasses();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Paragraph style={styles.loadingText}>Loading classes...</Paragraph>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>🏫 Classes</Title>
        <Paragraph style={styles.headerSubtitle}>
          Manage classes and sections
        </Paragraph>
      </View>

      <Searchbar
        placeholder="Search classes..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredClasses.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title style={styles.emptyTitle}>No Classes Yet</Title>
              <Paragraph style={styles.emptyText}>
                Create your first class to organize students.
              </Paragraph>
              <Button
                mode="contained"
                onPress={handleCreate}
                style={styles.emptyButton}
                icon="plus">
                Create Class
              </Button>
            </Card.Content>
          </Card>
        ) : (
          filteredClasses.map(classItem => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Class"
        onPress={handleCreate}
      />

      {/* Create/Edit Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {editingClass ? 'Edit Class' : 'Create New Class'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Class Name *"
              value={className}
              onChangeText={setClassName}
              mode="outlined"
              style={styles.dialogInput}
              placeholder="e.g., Grade 10"
            />
            <TextInput
              label="Section (Optional)"
              value={classSection}
              onChangeText={setClassSection}
              mode="outlined"
              style={styles.dialogInput}
              placeholder="e.g., Section A"
            />
            <TextInput
              label="Academic Year (Optional)"
              value={academicYear}
              onChangeText={setAcademicYear}
              mode="outlined"
              style={styles.dialogInput}
              placeholder="e.g., 2024-2025"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleSaveClass}>
              {editingClass ? 'Update' : 'Create'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

// Separate component for class card
function ClassCard({ classItem, onEdit, onDelete }) {
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    loadStudentCount();
  }, [classItem.id]);

  const loadStudentCount = async () => {
    const students = await getStudentsByClass(classItem.id);
    setStudentCount(students.length);
  };

  return (
    <Card style={styles.classCard}>
      <Card.Content>
        <View style={styles.classHeader}>
          <View style={styles.classInfo}>
            <Title style={styles.className}>{classItem.name}</Title>
            {classItem.section && (
              <Paragraph style={styles.classSection}>
                Section: {classItem.section}
              </Paragraph>
            )}
            {classItem.academicYear && (
              <Paragraph style={styles.classYear}>
                📅 {classItem.academicYear}
              </Paragraph>
            )}
          </View>
          <View style={styles.classActions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => onEdit(classItem)}
            />
            <IconButton
              icon="delete"
              size={20}
              iconColor="#D32F2F"
              onPress={() => onDelete(classItem)}
            />
          </View>
        </View>

        <View style={styles.studentCount}>
          <Paragraph style={styles.studentCountText}>
            👨‍🎓 {studentCount} student{studentCount !== 1 ? 's' : ''}
          </Paragraph>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4
  },
  searchBar: {
    margin: 16,
    elevation: 2
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    color: '#666666'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100
  },
  emptyCard: {
    marginTop: 40,
    backgroundColor: '#FFFFFF',
    elevation: 2
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24
  },
  emptyButton: {
    backgroundColor: '#2E7D32'
  },
  classCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  classInfo: {
    flex: 1
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4
  },
  classSection: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2
  },
  classYear: {
    fontSize: 12,
    color: '#666666'
  },
  classActions: {
    flexDirection: 'row'
  },
  studentCount: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0'
  },
  studentCountText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500'
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#2E7D32'
  },
  dialogInput: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF'
  }
});
