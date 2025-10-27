import { StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function DocsScreen() {
  const documents = [
    {
      id: 1,
      title: 'Reaearch',
      status: 'Completed',
      lastUpdated: '2025-10-25',
      category: 'Week 3',
      link: 'https://docs.google.com/document/d/1dOvatpYmA299Eyq3zldiLjh0pVMhu-y6mnzBlsXlhx8/edit?tab=t.0'
    },
    {
      id: 2,
      title: 'Swot Analysis',
      status: 'Completed',
      lastUpdated: '2025-10-25',
      category: 'Week 3',
      link: 'https://docs.google.com/document/d/1BOHzxKVc5KJJioJeuc1av_B3c6Ic0vrL1Cl1N2F2DPw/edit?tab=t.m64s5m97g6t5'
    },
    {
      id: 3,
      title: 'Literature Review',
      status: 'Completed',
      lastUpdated: '2025-10-25',
      category: 'Week 3',
      link: 'https://docs.google.com/document/d/16gK1IasgGk4vFdMaSwZKyyYPdIHxRmq4MseNa-MHN9c/edit?tab=t.0#heading=h.sy3lc4uat2ow'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#28a745';
      case 'In Progress': return '#007bff';
      case 'Review': return '#ffc107';
      case 'Draft': return '#6c757d';
      case 'Pending': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.contentWrapper}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Project Documentation
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.docsContainer}>
          <ThemedView style={styles.docsList}>
            {documents.map((doc) => (
              <ThemedView key={doc.id} style={styles.docCard}>
                <ThemedView style={styles.docHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.docTitle}>
                    {doc.title}
                  </ThemedText>
                  <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(doc.status) }]}>
                    <ThemedText style={styles.statusText}>
                      {doc.status}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedView style={styles.docFooter}>
                  <ThemedView style={styles.docMeta}>
                    <ThemedText style={styles.categoryText}>
                      {doc.category}
                    </ThemedText>
                    <ThemedText style={styles.dateText}>
                      Updated: {doc.lastUpdated}
                    </ThemedText>
                  </ThemedView>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => Linking.openURL(doc.link)}
                  >
                    <ThemedText style={styles.viewButtonText}>View Document</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

          <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Need to add a new document? Contact the project manager.
          </ThemedText>
          <TouchableOpacity style={styles.addButton}>
            <ThemedText style={styles.addButtonText}>Add New Document</ThemedText>
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
  docsContainer: {
    padding: 20,
  },
  docsList: {
    gap: 16,
  },
  docCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  docTitle: {
    fontSize: 18,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  docDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    color: '#6c757d',
  },
  docFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docMeta: {
    flex: 1,
  },
  categoryText: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
  },
  viewButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 40,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  footerText: {
    color: '#333',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
