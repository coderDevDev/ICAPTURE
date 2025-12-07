import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  DataTable,
  Chip,
  ActivityIndicator,
  Surface,
  Avatar
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getResultsByStudent, getAnswerKeyById } from '../services/database';

const { width } = Dimensions.get('window');

export default function StudentStatsScreen({ navigation, route }) {
  const { student } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    loadStudentResults();
  }, []);

  const loadStudentResults = async () => {
    setLoading(true);
    try {
      const studentResults = await getResultsByStudent(student.id);
      
      // Sort by date (newest first)
      const sortedResults = studentResults.sort((a, b) => 
        new Date(b.examDate) - new Date(a.examDate)
      );

      // Enrich results with answer key names
      const enrichedResults = await Promise.all(
        sortedResults.map(async (result) => {
          if (result.answerKeyId) {
            const answerKey = await getAnswerKeyById(result.answerKeyId);
            return {
              ...result,
              examName: answerKey?.name || result.examName || 'Unknown Exam'
            };
          }
          return result;
        })
      );

      setResults(enrichedResults);
      calculateStatistics(enrichedResults);
    } catch (error) {
      console.error('Error loading student results:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (results) => {
    if (results.length === 0) {
      setStatistics(null);
      return;
    }

    // Filter only graded results
    const gradedResults = results.filter(r => r.percentage !== undefined);

    if (gradedResults.length === 0) {
      setStatistics(null);
      return;
    }

    const totalExams = gradedResults.length;
    const averageScore = gradedResults.reduce((sum, r) => sum + r.percentage, 0) / totalExams;
    const highestScore = Math.max(...gradedResults.map(r => r.percentage));
    const lowestScore = Math.min(...gradedResults.map(r => r.percentage));
    const passedExams = gradedResults.filter(r => r.passed).length;
    const failedExams = totalExams - passedExams;
    const passRate = (passedExams / totalExams) * 100;

    // Grade distribution
    const gradeDistribution = {};
    gradedResults.forEach(r => {
      const grade = r.grade || 'N/A';
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
    });

    // Recent trend (last 5 exams)
    const recentExams = gradedResults.slice(0, 5);
    const recentAverage = recentExams.reduce((sum, r) => sum + r.percentage, 0) / recentExams.length;
    const trend = recentAverage > averageScore ? 'improving' : 
                  recentAverage < averageScore ? 'declining' : 'stable';

    setStatistics({
      totalExams,
      averageScore: averageScore.toFixed(2),
      highestScore: highestScore.toFixed(2),
      lowestScore: lowestScore.toFixed(2),
      passedExams,
      failedExams,
      passRate: passRate.toFixed(2),
      gradeDistribution,
      trend,
      recentAverage: recentAverage.toFixed(2)
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 80) return '#8BC34A';
    if (percentage >= 70) return '#FFC107';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Paragraph style={styles.loadingText}>Loading statistics...</Paragraph>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Student Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.studentHeader}>
              <Avatar.Text 
                size={60} 
                label={getInitials(student.name)}
                style={styles.avatar}
              />
              <View style={styles.studentInfo}>
                <Title style={styles.studentName}>{student.name}</Title>
                <Paragraph style={styles.studentId}>ID: {student.studentId}</Paragraph>
                {student.email && (
                  <Paragraph style={styles.studentEmail}>📧 {student.email}</Paragraph>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Overall Statistics */}
        {statistics ? (
          <>
            <Card style={styles.statsCard}>
              <Card.Content>
                <Title style={styles.sectionTitle}>📊 Overall Performance</Title>
                
                <View style={styles.statsGrid}>
                  <Surface style={styles.statBox}>
                    <Title style={styles.statNumber}>{statistics.totalExams}</Title>
                    <Paragraph style={styles.statLabel}>Total Exams</Paragraph>
                  </Surface>

                  <Surface style={[styles.statBox, { backgroundColor: '#E8F5E8' }]}>
                    <Title style={[styles.statNumber, { color: '#2E7D32' }]}>
                      {statistics.averageScore}%
                    </Title>
                    <Paragraph style={styles.statLabel}>Average Score</Paragraph>
                  </Surface>

                  <Surface style={styles.statBox}>
                    <Title style={[styles.statNumber, { color: '#4CAF50' }]}>
                      {statistics.highestScore}%
                    </Title>
                    <Paragraph style={styles.statLabel}>Highest Score</Paragraph>
                  </Surface>

                  <Surface style={styles.statBox}>
                    <Title style={[styles.statNumber, { color: '#F44336' }]}>
                      {statistics.lowestScore}%
                    </Title>
                    <Paragraph style={styles.statLabel}>Lowest Score</Paragraph>
                  </Surface>
                </View>

                <View style={styles.passFailContainer}>
                  <View style={styles.passFailItem}>
                    <Title style={[styles.passFailNumber, { color: '#4CAF50' }]}>
                      {statistics.passedExams}
                    </Title>
                    <Paragraph style={styles.passFailLabel}>✓ Passed</Paragraph>
                  </View>
                  <View style={styles.passFailItem}>
                    <Title style={[styles.passFailNumber, { color: '#F44336' }]}>
                      {statistics.failedExams}
                    </Title>
                    <Paragraph style={styles.passFailLabel}>✗ Failed</Paragraph>
                  </View>
                  <View style={styles.passFailItem}>
                    <Title style={[styles.passFailNumber, { color: '#2E7D32' }]}>
                      {statistics.passRate}%
                    </Title>
                    <Paragraph style={styles.passFailLabel}>Pass Rate</Paragraph>
                  </View>
                </View>

                <View style={styles.trendContainer}>
                  <Chip 
                    icon={() => <Paragraph>{getTrendIcon(statistics.trend)}</Paragraph>}
                    style={styles.trendChip}>
                    Trend: {statistics.trend.charAt(0).toUpperCase() + statistics.trend.slice(1)}
                  </Chip>
                  <Paragraph style={styles.trendText}>
                    Recent Average: {statistics.recentAverage}%
                  </Paragraph>
                </View>
              </Card.Content>
            </Card>

            {/* Grade Distribution */}
            <Card style={styles.gradeCard}>
              <Card.Content>
                <Title style={styles.sectionTitle}>🎓 Grade Distribution</Title>
                <View style={styles.gradeDistribution}>
                  {Object.entries(statistics.gradeDistribution)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([grade, count]) => (
                      <View key={grade} style={styles.gradeItem}>
                        <Chip style={styles.gradeChip}>{grade}</Chip>
                        <Paragraph style={styles.gradeCount}>
                          {count} exam{count !== 1 ? 's' : ''}
                        </Paragraph>
                      </View>
                    ))}
                </View>
              </Card.Content>
            </Card>
          </>
        ) : (
          <Card style={styles.noStatsCard}>
            <Card.Content>
              <Title style={styles.noStatsTitle}>No Statistics Available</Title>
              <Paragraph style={styles.noStatsText}>
                This student hasn't taken any graded exams yet.
              </Paragraph>
            </Card.Content>
          </Card>
        )}

        {/* Exam History */}
        <Card style={styles.historyCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>📚 Exam History</Title>
            
            {results.length === 0 ? (
              <Paragraph style={styles.noResultsText}>
                No exam results found for this student.
              </Paragraph>
            ) : (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Exam</DataTable.Title>
                  <DataTable.Title numeric>Score</DataTable.Title>
                  <DataTable.Title numeric>Grade</DataTable.Title>
                  <DataTable.Title numeric>Date</DataTable.Title>
                </DataTable.Header>

                {results.map((result, index) => (
                  <DataTable.Row key={result.id || index}>
                    <DataTable.Cell>
                      <Paragraph style={styles.examName} numberOfLines={1}>
                        {result.examName}
                      </Paragraph>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {result.percentage !== undefined ? (
                        <Chip 
                          style={[
                            styles.scoreChip,
                            { backgroundColor: getPerformanceColor(result.percentage) + '20' }
                          ]}
                          textStyle={{ 
                            color: getPerformanceColor(result.percentage),
                            fontWeight: 'bold'
                          }}>
                          {result.percentage}%
                        </Chip>
                      ) : (
                        <Paragraph style={styles.noGradeText}>N/A</Paragraph>
                      )}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {result.grade ? (
                        <Chip style={styles.gradeChipSmall}>{result.grade}</Chip>
                      ) : (
                        <Paragraph style={styles.noGradeText}>-</Paragraph>
                      )}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Paragraph style={styles.dateText}>
                        {new Date(result.examDate).toLocaleDateString()}
                      </Paragraph>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            )}
          </Card.Content>
        </Card>

        {/* Actions */}
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            icon="arrow-left">
            Back to Students
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Template', { selectedStudent: student })}
            style={styles.examButton}
            icon="play">
            Start New Exam
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
    paddingBottom: 32
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32'
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    backgroundColor: '#2E7D32',
    marginRight: 16
  },
  studentInfo: {
    flex: 1
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  studentId: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4
  },
  studentEmail: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2
  },
  statsCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16
  },
  statBox: {
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4
  },
  passFailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16
  },
  passFailItem: {
    alignItems: 'center'
  },
  passFailNumber: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  passFailLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4
  },
  trendContainer: {
    alignItems: 'center'
  },
  trendChip: {
    backgroundColor: '#E3F2FD',
    marginBottom: 8
  },
  trendText: {
    fontSize: 12,
    color: '#666666'
  },
  gradeCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2
  },
  gradeDistribution: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  gradeItem: {
    alignItems: 'center'
  },
  gradeChip: {
    backgroundColor: '#E8F5E8',
    marginBottom: 4
  },
  gradeCount: {
    fontSize: 11,
    color: '#666666'
  },
  noStatsCard: {
    marginBottom: 16,
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800'
  },
  noStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57C00',
    textAlign: 'center'
  },
  noStatsText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8
  },
  historyCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2
  },
  noResultsText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    paddingVertical: 16
  },
  examName: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500'
  },
  scoreChip: {
    height: 24
  },
  gradeChipSmall: {
    backgroundColor: '#E8F5E8',
    height: 24
  },
  noGradeText: {
    fontSize: 12,
    color: '#999999'
  },
  dateText: {
    fontSize: 11,
    color: '#666666'
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12
  },
  backButton: {
    flex: 1,
    borderColor: '#666666',
    borderWidth: 2
  },
  examButton: {
    flex: 1,
    backgroundColor: '#2E7D32'
  }
});
