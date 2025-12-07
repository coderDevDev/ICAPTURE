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
  FAB,
  Chip,
  IconButton,
  Searchbar,
  ActivityIndicator,
  Avatar
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllStudents, deleteStudent, getAllClasses } from '../services/database';

export default function StudentsScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    filterStudents();
  }, [searchQuery, students]);

  const loadData = async () => {
    setLoading(true);
    const [studentsData, classesData] = await Promise.all([
      getAllStudents(),
      getAllClasses()
    ]);
    setStudents(studentsData);
    setClasses(classesData);
    setLoading(false);
  };

  const filterStudents = () => {
    if (!searchQuery) {
      setFilteredStudents(students);
      return;
    }
    
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const getClassName = (classId) => {
    const classData = classes.find(c => c.id === classId);
    return classData ? classData.name : 'No Class';
  };

  const handleDelete = (student) => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete "${student.name}"? This will also delete all their exam results.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteStudent(student.id);
            loadData();
          }
        }
      ]
    );
  };

  const handleEdit = (student) => {
    navigation.navigate('CreateStudent', { student });
  };

  const handleViewStats = (student) => {
    navigation.navigate('StudentStats', { student });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Paragraph style={styles.loadingText}>Loading students...</Paragraph>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>👨‍🎓 Students</Title>
        <Paragraph style={styles.headerSubtitle}>
          Manage students and view their performance
        </Paragraph>
        <View style={styles.statsRow}>
          <Chip icon="account-group" style={styles.statsChip}>
            {students.length} Students
          </Chip>
          <Chip icon="google-classroom" style={styles.statsChip}>
            {classes.length} Classes
          </Chip>
        </View>
      </View>

      <Searchbar
        placeholder="Search students..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredStudents.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title style={styles.emptyTitle}>No Students Yet</Title>
              <Paragraph style={styles.emptyText}>
                Add your first student to start tracking their exam performance.
              </Paragraph>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('CreateStudent')}
                style={styles.emptyButton}
                icon="plus">
                Add Student
              </Button>
            </Card.Content>
          </Card>
        ) : (
          filteredStudents.map(student => (
            <Card key={student.id} style={styles.studentCard}>
              <Card.Content>
                <View style={styles.studentHeader}>
                  <View style={styles.studentLeft}>
                    <Avatar.Text 
                      size={50} 
                      label={getInitials(student.name)}
                      style={styles.avatar}
                    />
                    <View style={styles.studentInfo}>
                      <Title style={styles.studentName}>{student.name}</Title>
                      <Paragraph style={styles.studentId}>
                        ID: {student.studentId || 'N/A'}
                      </Paragraph>
                      {student.classId && (
                        <Chip icon="google-classroom" style={styles.classChip}>
                          {getClassName(student.classId)}
                        </Chip>
                      )}
                    </View>
                  </View>
                  <View style={styles.studentActions}>
                    <IconButton
                      icon="chart-line"
                      size={20}
                      iconColor="#2E7D32"
                      onPress={() => handleViewStats(student)}
                    />
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => handleEdit(student)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      iconColor="#D32F2F"
                      onPress={() => handleDelete(student)}
                    />
                  </View>
                </View>

                {student.email && (
                  <View style={styles.contactInfo}>
                    <Paragraph style={styles.contactText}>
                      📧 {student.email}
                    </Paragraph>
                  </View>
                )}
              </Card.Content>

              <Card.Actions>
                <Button
                  mode="outlined"
                  onPress={() => handleViewStats(student)}
                  icon="chart-line">
                  View Statistics
                </Button>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Template', { selectedStudent: student })}
                  icon="play">
                  Start Exam
                </Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Student"
        onPress={() => navigation.navigate('CreateStudent')}
      />
    </SafeAreaView>
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
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8
  },
  statsChip: {
    backgroundColor: '#E8F5E8'
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
  studentCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  studentLeft: {
    flexDirection: 'row',
    flex: 1
  },
  avatar: {
    backgroundColor: '#2E7D32',
    marginRight: 12
  },
  studentInfo: {
    flex: 1
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4
  },
  studentId: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8
  },
  classChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    height: 28
  },
  studentActions: {
    flexDirection: 'row'
  },
  contactInfo: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0'
  },
  contactText: {
    fontSize: 12,
    color: '#666666'
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#2E7D32'
  }
});
