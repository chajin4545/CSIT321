import { Image } from 'expo-image';
import { Platform, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <ThemedView style={styles.heroSection}>
        <ThemedText type="title" style={styles.heroTitle}>
          Welcome to Our Platform
        </ThemedText>
        <ThemedText style={styles.heroSubtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
          exercitation ullamco laboris.
        </ThemedText>
        <ThemedView style={styles.ctaButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <ThemedText style={styles.buttonText}>Start Free Trial</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <ThemedText style={styles.secondaryButtonText}>Request Demo</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* Features Section */}
      <ThemedView style={styles.featuresSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Why Choose Us?
        </ThemedText>
        <ThemedView style={styles.featureGrid}>
          <ThemedView style={styles.featureCard}>
            <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
              Feature One
            </ThemedText>
            <ThemedText style={styles.featureDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureCard}>
            <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
              Feature Two
            </ThemedText>
            <ThemedText style={styles.featureDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureCard}>
            <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
              Feature Three
            </ThemedText>
            <ThemedText style={styles.featureDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Pricing Section */}
      <ThemedView style={styles.pricingSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Choose Your Plan
        </ThemedText>
        <ThemedView style={styles.pricingGrid}>
          <ThemedView style={styles.pricingCard}>
            <ThemedText type="defaultSemiBold" style={styles.pricingTitle}>
              Free Plan
            </ThemedText>
            <ThemedText style={styles.pricingPrice}>$0/month</ThemedText>
            <ThemedText style={styles.pricingDescription}>
              Perfect for getting started with basic features.
            </ThemedText>
            <TouchableOpacity style={styles.pricingButton}>
              <ThemedText style={styles.pricingButtonText}>Sign Up Free</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView style={[styles.pricingCard, styles.premiumCard]}>
            <ThemedText type="defaultSemiBold" style={styles.pricingTitle}>
              Premium Plan
            </ThemedText>
            <ThemedText style={styles.pricingPrice}>$29/month</ThemedText>
            <ThemedText style={styles.pricingDescription}>
              Advanced features for growing businesses.
            </ThemedText>
            <TouchableOpacity style={styles.premiumButton}>
              <ThemedText style={styles.premiumButtonText}>Subscribe Now</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Footer */}
      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Ready to get started? Contact us today!
        </ThemedText>
        <TouchableOpacity style={styles.contactButton}>
          <ThemedText style={styles.contactButtonText}>Contact Us</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    minHeight: 400,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    maxWidth: 600,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 150,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007bff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 150,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresSection: {
    padding: 20,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  featureGrid: {
    gap: 20,
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  featureTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  pricingSection: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  pricingGrid: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  pricingCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 250,
    alignItems: 'center',
  },
  premiumCard: {
    borderColor: '#007bff',
    borderWidth: 2,
  },
  pricingTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 16,
  },
  pricingDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  pricingButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    width: '100%',
  },
  premiumButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    width: '100%',
  },
  pricingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  premiumButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    padding: 40,
    backgroundColor: '#343a40',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
