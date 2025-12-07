import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  IconButton,
  Divider
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreditsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={styles.schoolLogo}
                resizeMode="contain"
              />
              <Title style={styles.headerTitle}>ICAPTURE</Title>
              <Paragraph style={styles.headerSubtitle}>
                Mobile Application for Efficient Examination and Analysis
              </Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Development Team Section */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <IconButton icon="account-group" size={28} iconColor="#2E7D32" />
              <Title style={styles.sectionTitle}>Development Team</Title>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.teamMembersList}>
              <View style={styles.teamMember}>
                <IconButton icon="account" size={24} iconColor="#2E7D32" style={styles.memberIcon} />
                <View style={styles.memberInfo}>
                  <Paragraph style={styles.memberName}>Dela Cruz, Jhon Levy C.</Paragraph>
                  <Paragraph style={styles.memberRole}>Developer</Paragraph>
                </View>
              </View>
              
              <View style={styles.teamMember}>
                <IconButton icon="account" size={24} iconColor="#2E7D32" style={styles.memberIcon} />
                <View style={styles.memberInfo}>
                  <Paragraph style={styles.memberName}>Limos, James Vincent G.</Paragraph>
                  <Paragraph style={styles.memberRole}>Developer</Paragraph>
                </View>
              </View>
              
              <View style={styles.teamMember}>
                <IconButton icon="account" size={24} iconColor="#2E7D32" style={styles.memberIcon} />
                <View style={styles.memberInfo}>
                  <Paragraph style={styles.memberName}>Aguilinia, Mark David S.</Paragraph>
                  <Paragraph style={styles.memberRole}>Developer</Paragraph>
                </View>
              </View>
              
              <View style={styles.teamMember}>
                <IconButton icon="account" size={24} iconColor="#2E7D32" style={styles.memberIcon} />
                <View style={styles.memberInfo}>
                  <Paragraph style={styles.memberName}>Gano, Janver Joshua K.</Paragraph>
                  <Paragraph style={styles.memberRole}>Developer</Paragraph>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Academic Information Section */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <IconButton icon="school" size={28} iconColor="#2E7D32" />
              <Title style={styles.sectionTitle}>Academic Information</Title>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <IconButton icon="calendar" size={20} iconColor="#666" />
              <View style={styles.infoContent}>
                <Paragraph style={styles.infoLabel}>Academic Year</Paragraph>
                <Paragraph style={styles.infoValue}>Batch 2024–2025</Paragraph>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <IconButton icon="book-open-variant" size={20} iconColor="#666" />
              <View style={styles.infoContent}>
                <Paragraph style={styles.infoLabel}>Project Type</Paragraph>
                <Paragraph style={styles.infoValue}>Capstone Project</Paragraph>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <IconButton icon="domain" size={20} iconColor="#666" />
              <View style={styles.infoContent}>
                <Paragraph style={styles.infoLabel}>Institution</Paragraph>
                <Paragraph style={styles.infoValue}>Panpacific University</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Features Section */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <IconButton icon="star" size={28} iconColor="#2E7D32" />
              <Title style={styles.sectionTitle}>Key Features</Title>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <IconButton icon="camera" size={20} iconColor="#2E7D32" />
                <Paragraph style={styles.featureText}>Camera-based OMR scanning</Paragraph>
              </View>
              
              <View style={styles.featureItem}>
                <IconButton icon="lightning-bolt" size={20} iconColor="#2E7D32" />
                <Paragraph style={styles.featureText}>Real-time processing</Paragraph>
              </View>
              
              <View style={styles.featureItem}>
                <IconButton icon="check-circle" size={20} iconColor="#2E7D32" />
                <Paragraph style={styles.featureText}>High accuracy detection</Paragraph>
              </View>
              
              <View style={styles.featureItem}>
                <IconButton icon="account-group" size={20} iconColor="#2E7D32" />
                <Paragraph style={styles.featureText}>Student management</Paragraph>
              </View>
              
              <View style={styles.featureItem}>
                <IconButton icon="key" size={20} iconColor="#2E7D32" />
                <Paragraph style={styles.featureText}>Answer key creation</Paragraph>
              </View>
              
              <View style={styles.featureItem}>
                <IconButton icon="chart-line" size={20} iconColor="#2E7D32" />
                <Paragraph style={styles.featureText}>Analytics and reporting</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Paragraph style={styles.footerText}>
            © 2024-2025 Panpacific University
          </Paragraph>
          <Paragraph style={styles.footerSubtext}>
            All rights reserved
          </Paragraph>
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
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 4,
    borderTopWidth: 4,
    borderTopColor: '#2E7D32'
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 16
  },
  schoolLogo: {
    width: 120,
    height: 120,
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center'
  },
  sectionCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 8
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#E0E0E0'
  },
  teamMembersList: {
    gap: 12
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D32'
  },
  memberIcon: {
    margin: 0,
    marginRight: 8
  },
  memberInfo: {
    flex: 1
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2
  },
  memberRole: {
    fontSize: 12,
    color: '#666666'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  infoContent: {
    flex: 1,
    marginLeft: 8
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32'
  },
  featuresList: {
    gap: 8
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6
  },
  featureText: {
    fontSize: 14,
    color: '#555555',
    marginLeft: 8,
    flex: 1
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 20
  },
  footerText: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 4
  },
  footerSubtext: {
    fontSize: 11,
    color: '#999999',
    textAlign: 'center'
  }
});
