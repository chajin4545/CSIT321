import { StyleSheet, ScrollView, View, TouchableOpacity, Linking } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const features = [
    {
      role: 'Guest',
      icon: '👤',
      items: [
        'Ask simple questions to Chatbot',
        'View upcoming campus events',
        'Access Campus Map & locations'
      ]
    },
    {
      role: 'Student',
      icon: '🎓',
      items: [
        'Admin Chatbot: Check exams & timetables',
        'Knowledge Base: Study help & assignments',
        'Access Professor Announcements'
      ]
    },
    {
      role: 'Professor',
      icon: '👨‍🏫',
      items: [
        'View Teaching Schedule & Class Lists',
        'Upload Documents for Knowledge Base',
        'Post Announcements'
      ]
    },
    {
      role: 'School Admin',
      icon: '🏛️',
      items: [
        'Manage Teaching & Exam Schedules',
        'Create & Edit Campus Events',
        'Manage Accounts (Prof/Student)'
      ]
    },
    {
      role: 'Sys Admin',
      icon: '⚙️',
      items: [
        'View Usage Analytics',
        'View User Feedback',
        'Manage School Admin Accounts'
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.contentWrapper}>
        {/* Hero Section */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Welcome to CampusBuddy
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Your All-in-One University Companion. Bridging distributed systems to help you study smarter and navigate campus life with ease.
          </ThemedText>
          <View style={styles.heroButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => Linking.openURL('/prototype/')}
            >
              <ThemedText style={styles.primaryButtonText}>Try Prototype</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>Learn More</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Features Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Tailored Features for Everyone
          </ThemedText>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <ThemedView key={index} style={styles.featureCard}>
                <View style={styles.cardHeader}>
                  <ThemedText style={styles.featureIcon}>{feature.icon}</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.featureRole}>
                    {feature.role}
                  </ThemedText>
                </View>
                <View style={styles.divider} />
                <View style={styles.featureList}>
                  {feature.items.map((item, idx) => (
                    <ThemedText key={idx} style={styles.featureItem}>
                      • {item}
                    </ThemedText>
                  ))}
                </View>
              </ThemedView>
            ))}
          </View>
        </ThemedView>

        {/* Call to Action Footer */}
        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Ready to transform your university experience?
          </ThemedText>
          <TouchableOpacity style={styles.contactButton}>
            <ThemedText style={styles.contactButtonText}>Contact Us</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentWrapper: {
    maxWidth: 1920,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'white',
    minHeight: 300,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 30,
    maxWidth: 800,
    color: '#666',
    marginBottom: 40,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 2,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#007bff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContainer: {
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
    color: '#333',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  featureRole: {
    fontSize: 24,
    color: '#007bff',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#495057',
  },
  footer: {
    padding: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  footerText: {
    color: '#333',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  contactButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 2,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});