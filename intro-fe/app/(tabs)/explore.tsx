import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TeamScreen() {
  const teamMembers = [
    {
      id: 1,
      name: 'CHA HAJIN',
      role: 'Team Lead, Software Developer',
      description: 'Team Lead of the project, responsible for the overall project and the team. Will contribute in developement, documentation and review',
      email: 'chahajin@mymail.sim.edu.sg'
    },
    {
      id: 2,
      name: 'NG YI JIE',
      role: 'Software Developer',
      description: 'Software Developer of the project, responsible for the development of the project. Will contribute in developement and documentation',
      email: 'yjng025@mymail.sim.edu.sg'
    },
    {
      id: 3,
      name: 'KOTTAITHAMBI HARINI',
      role: 'Software Developer',
      description: 'Software Developer of the project, responsible for the development of the project. Will contribute in developement and documentation',
      email: 'kottaith001@mymail.sim.edu.sg'
    },
    {
      id: 4,
      name: 'TAN YONGJIE, GLENN',
      role: 'Software Developer',
      description: 'Software Developer of the project, responsible for the development of the project. Will contribute in developement and documentation',
      email: 'ygtan005@mymail.sim.edu.sg'
    },
    {
      id: 5,
      name: 'LEOW JING XUE',
      role: 'Software Developer',
      description: 'Software Developer of the project, responsible for the development of the project. Will contribute in developement and documentation',
      email: 'jxleow003@mymail.sim.edu.sg'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.contentWrapper}>
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
              <ThemedText style={styles.memberEmail}>
                Email: {member.email}
              </ThemedText>
            </ThemedView>
          ))}
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
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
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
    marginBottom: 12,
  },
  memberEmail: {
    fontSize: 14,
    color: '#007bff',
    textAlign: 'center',
    fontWeight: '500',
  },
});
