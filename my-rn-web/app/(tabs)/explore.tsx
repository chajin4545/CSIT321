import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TeamScreen() {
  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Project Manager',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      email: 'john.doe@example.com'
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Lead Developer',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      email: 'jane.smith@example.com'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'UI/UX Designer',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      email: 'mike.johnson@example.com'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      role: 'Backend Developer',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      email: 'sarah.wilson@example.com'
    },
    {
      id: 5,
      name: 'David Brown',
      role: 'DevOps Engineer',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      email: 'david.brown@example.com'
    },
    {
      id: 6,
      name: 'Lisa Davis',
      role: 'Quality Assurance',
      description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.',
      email: 'lisa.davis@example.com'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Meet Our Team
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.teamGrid}>
        {teamMembers.map((member) => (
          <ThemedView key={member.id} style={styles.memberCard}>
            <ThemedView style={styles.avatarContainer}>
              <ThemedText style={styles.avatarText}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </ThemedText>
            </ThemedView>
            <ThemedText type="defaultSemiBold" style={styles.memberName}>
              {member.name}
            </ThemedText>
            <ThemedText style={styles.memberRole}>
              {member.role}
            </ThemedText>
            <ThemedText style={styles.memberDescription}>
              {member.description}
            </ThemedText>
            <TouchableOpacity style={styles.contactButton}>
              <ThemedText style={styles.contactButtonText}>
                Contact {member.name.split(' ')[0]}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Want to join our team? We're always looking for talented individuals!
        </ThemedText>
        <TouchableOpacity style={styles.joinButton}>
          <ThemedText style={styles.joinButtonText}>View Open Positions</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    minHeight: 200,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  headerSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 600,
  },
  teamGrid: {
    padding: 20,
    gap: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  memberCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  memberName: {
    fontSize: 20,
    marginBottom: 4,
    textAlign: 'center',
  },
  memberRole: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 12,
    textAlign: 'center',
  },
  memberDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  joinButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
