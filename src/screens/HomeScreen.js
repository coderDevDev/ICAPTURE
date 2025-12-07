import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import {
  Card,
  Title,
  Paragraph,
  Button,
  IconButton,
  Switch,
  Divider
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { getSettings, saveSettings } from '../services/database';

export default function HomeScreen({ navigation }) {
  const [uploading, setUploading] = useState(false);
  const [skipVerifyDetection, setSkipVerifyDetection] = useState(true);
  const [showDevSettings, setShowDevSettings] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getSettings();
      setSkipVerifyDetection(settings.skipVerifyDetection !== false);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleToggleSkipVerify = async value => {
    setSkipVerifyDetection(value);
    try {
      const settings = await getSettings();
      await saveSettings({
        ...settings,
        skipVerifyDetection: value
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleUploadImage = async () => {
    try {
      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant access to your photos to upload an image.'
        );
        return;
      }

      setUploading(true);

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        base64: false
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('🖼️ Image selected:', imageUri);

        // Navigate to Template selection first
        navigation.navigate('Template', {
          uploadedImageUri: imageUri,
          isUpload: true
        });
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroBackground}>
            <View style={styles.heroPattern} />
            <View style={styles.heroGradient} />
          </View>
          <View style={styles.heroContent}>
            <View style={styles.lottieWrapper}>
              <View style={styles.lottieGlow} />
              <View style={styles.lottieContainer}>
                <WebView
                  source={{
                    html: `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <script src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" type="module"></script>
                          <style>
                            body {
                              margin: 0;
                              padding: 0;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              height: 100vh;
                              width: 100vw;
                              background: transparent;
                            }
                            dotlottie-player {
                              width: 100%;
                              height: 100%;
                            }
                          </style>
                        </head>
                        <body>
                          <dotlottie-player
                            src="https://lottie.host/a97d4db7-cc35-4464-8eaa-2d17ae250f13/cHlZ0rDkKQ.lottie"
                            background="transparent"
                            speed="1"
                            loop
                            autoplay
                          ></dotlottie-player>
                        </body>
                      </html>
                    `
                  }}
                  style={styles.lottieWebView}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  androidLayerType="hardware"
                  originWhitelist={['*']}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              </View>
            </View>
            <View style={styles.heroTextContainer}>
              <Title style={styles.heroTitle}>ICAPTURE</Title>
              <View style={styles.heroDivider} />
              <Paragraph style={styles.heroSubtitle}>
                Mobile Application for Efficient Examination and Analysis
              </Paragraph>
              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <IconButton icon="lightning-bolt" size={16} iconColor="#FFF" style={styles.heroStatIcon} />
                  <Paragraph style={styles.heroStatText}>Fast</Paragraph>
                </View>
                <View style={styles.heroStat}>
                  <IconButton icon="check-circle" size={16} iconColor="#FFF" style={styles.heroStatIcon} />
                  <Paragraph style={styles.heroStatText}>Accurate</Paragraph>
                </View>
                <View style={styles.heroStat}>
                  <IconButton icon="shield-check" size={16} iconColor="#FFF" style={styles.heroStatIcon} />
                  <Paragraph style={styles.heroStatText}>Reliable</Paragraph>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Main Action Card */}
        <Card style={styles.mainActionCard}>
          <Card.Content>
            <View style={styles.actionHeader}>
              <IconButton icon="camera" size={32} iconColor="#2E7D32" />
              <View style={styles.actionHeaderText}>
                <Title style={styles.actionTitle}>Start Scanning</Title>
                <Paragraph style={styles.actionSubtitle}>
                  Scan OMR sheets instantly
                </Paragraph>
              </View>
            </View>
            <Button
              mode="contained"
              style={styles.scanButton}
              onPress={() => navigation.navigate('Template')}
              icon="camera"
              contentStyle={styles.scanButtonContent}>
              Start Camera Scan
            </Button>
          </Card.Content>
        </Card>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard} onPress={() => navigation.navigate('StudentsTab')}>
            <Card.Content style={styles.statContent}>
              <IconButton icon="account-group" size={28} iconColor="#1976D2" />
              <Paragraph style={styles.statLabel}>Students</Paragraph>
              <Title style={styles.statValue}>Manage</Title>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard} onPress={() => navigation.navigate('AnswerKeysTab')}>
            <Card.Content style={styles.statContent}>
              <IconButton icon="key" size={28} iconColor="#F57C00" />
              <Paragraph style={styles.statLabel}>Answer Keys</Paragraph>
              <Title style={styles.statValue}>Create</Title>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard} onPress={() => navigation.navigate('ClassesTab')}>
            <Card.Content style={styles.statContent}>
              <IconButton icon="google-classroom" size={28} iconColor="#7B1FA2" />
              <Paragraph style={styles.statLabel}>Classes</Paragraph>
              <Title style={styles.statValue}>Organize</Title>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <IconButton icon="chart-line" size={28} iconColor="#388E3C" />
              <Paragraph style={styles.statLabel}>Analytics</Paragraph>
              <Title style={styles.statValue}>View Stats</Title>
            </Card.Content>
          </Card>
        </View>

        {/* Features Section */}
        <Card style={styles.featuresCard}>
          <Card.Content>
            <Title style={styles.featuresTitle}>✨ Key Features</Title>
            
            <View style={styles.featureRow}>
              <IconButton icon="lightning-bolt" size={24} iconColor="#2E7D32" />
              <View style={styles.featureTextContainer}>
                <Paragraph style={styles.featureTitle}>Instant Processing</Paragraph>
                <Paragraph style={styles.featureDesc}>Real-time OMR detection and grading</Paragraph>
              </View>
            </View>

            <View style={styles.featureRow}>
              <IconButton icon="target" size={24} iconColor="#2E7D32" />
              <View style={styles.featureTextContainer}>
                <Paragraph style={styles.featureTitle}>High Accuracy</Paragraph>
                <Paragraph style={styles.featureDesc}>Advanced bubble detection algorithm</Paragraph>
              </View>
            </View>

            <View style={styles.featureRow}>
              <IconButton icon="cloud-upload" size={24} iconColor="#2E7D32" />
              <View style={styles.featureTextContainer}>
                <Paragraph style={styles.featureTitle}>Auto Sync</Paragraph>
                <Paragraph style={styles.featureDesc}>Automatic result saving and export</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Developer Settings (Collapsible) */}
        {/* <Card style={styles.devSettingsCard}>
          <Card.Content>
            <View style={styles.devSettingsHeader}>
              <View>
                <Title style={styles.devSettingsTitle}>
                  ⚙️ Developer Settings
                </Title>
                <Paragraph style={styles.devSettingsSubtitle}>
                  Advanced options for development and testing
                </Paragraph>
              </View>
              <IconButton
                icon={showDevSettings ? 'chevron-up' : 'chevron-down'}
                size={24}
                onPress={() => setShowDevSettings(!showDevSettings)}
              />
            </View>

            {showDevSettings && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Paragraph style={styles.settingTitle}>
                      Skip Verify Detection Screen
                    </Paragraph>
                    <Paragraph style={styles.settingDescription}>
                      When enabled, uploaded images go directly to Results
                      screen. Disable to show Verify Detection screen for
                      debugging.
                    </Paragraph>
                  </View>
                  <Switch
                    value={skipVerifyDetection}
                    onValueChange={handleToggleSkipVerify}
                    color="#2E7D32"
                  />
                </View>
              </>
            )}
          </Card.Content>
        </Card> */}

        {/* Features */}
        {/* <Card style={styles.featureCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>✨ Features</Title>

            <View style={styles.featureItem}>
              <IconButton icon="camera-control" size={24} iconColor="#2E7D32" />
              <View style={styles.featureText}>
                <Paragraph style={styles.featureTitle}>
                  Camera Overlay
                </Paragraph>
                <Paragraph style={styles.featureDesc}>
                  Green frame guide with crosshair alignment
                </Paragraph>
              </View>
            </View>

            <View style={styles.featureItem}>
              <IconButton
                icon="format-list-checks"
                size={24}
                iconColor="#2E7D32"
              />
              <View style={styles.featureText}>
                <Paragraph style={styles.featureTitle}>
                  Template Matching
                </Paragraph>
                <Paragraph style={styles.featureDesc}>
                  Dynamic template loading from JSON
                </Paragraph>
              </View>
            </View>

            <View style={styles.featureItem}>
              <IconButton icon="chart-line" size={24} iconColor="#2E7D32" />
              <View style={styles.featureText}>
                <Paragraph style={styles.featureTitle}>
                  Instant Results
                </Paragraph>
                <Paragraph style={styles.featureDesc}>
                  Real-time OMR processing and scoring
                </Paragraph>
              </View>
            </View>

            <View style={styles.featureItem}>
              <IconButton icon="download" size={24} iconColor="#2E7D32" />
              <View style={styles.featureText}>
                <Paragraph style={styles.featureTitle}>
                  Export Results
                </Paragraph>
                <Paragraph style={styles.featureDesc}>
                  CSV export with detailed analysis
                </Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card> */}

        {/* Instructions */}
        {/* <Card style={styles.instructionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>📋 How to Use</Title>
            <Paragraph style={styles.instructionText}>
              1. Select your OMR template{'\n'}
              2. Position sheet within green frame{'\n'}
              3. Align using crosshair guide{'\n'}
              4. Capture high-quality image{'\n'}
              5. View instant results
            </Paragraph>
          </Card.Content>
        </Card> */}
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
  heroCard: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12
  },
  heroBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#2E7D32'
  },
  heroPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.5
  },
  heroGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  heroContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20
  },
  lottieWrapper: {
    position: 'relative',
    marginBottom: 20
  },
  lottieGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: -20,
    left: -20,
    zIndex: 0
  },
  lottieContainer: {
    width: 120,
    height: 120,
    overflow: 'hidden',
    zIndex: 1
  },
  lottieWebView: {
    width: 120,
    height: 120,
    backgroundColor: 'transparent'
  },
  heroTextContainer: {
    alignItems: 'center',
    width: '100%'
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5
  },
  heroDivider: {
    width: 60,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
    marginBottom: 12
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#E8F5E9',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 8
  },
  heroStat: {
    alignItems: 'center'
  },
  heroStatIcon: {
    margin: 0,
    padding: 0
  },
  heroStatText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: -8
  },
  mainActionCard: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    borderRadius: 12
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  actionHeaderText: {
    flex: 1,
    marginLeft: 8
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#666666'
  },
  scanButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    elevation: 2
  },
  scanButtonContent: {
    paddingVertical: 8
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    borderRadius: 12
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 12
  },
  statLabel: {
    fontSize: 11,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center'
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 2
  },
  featuresCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    borderRadius: 12
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 8
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2
  },
  featureDesc: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16
  },
  instructionCard: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800'
  },
  instructionText: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 20
  },
  infoCard: {
    marginBottom: 16,
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
    elevation: 2
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8
  },
  infoSubtext: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic'
  },
  devSettingsCard: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    elevation: 1
  },
  devSettingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  devSettingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666'
  },
  devSettingsSubtitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4
  },
  divider: {
    marginVertical: 12
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  settingInfo: {
    flex: 1,
    marginRight: 16
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4
  },
  settingDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16
  }
});
