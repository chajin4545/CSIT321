import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function DocsScreen() {
  const documents = [
    {
      id: 1,
      title: 'Project Requirements',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'In Progress',
      lastUpdated: '2024-01-15',
      category: 'Planning'
    },
    {
      id: 2,
      title: 'Technical Architecture',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      status: 'Completed',
      lastUpdated: '2024-01-10',
      category: 'Technical'
    },
    {
      id: 3,
      title: 'User Interface Design',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      status: 'Review',
      lastUpdated: '2024-01-12',
      category: 'Design'
    },
    {
      id: 4,
      title: 'API Documentation',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      status: 'Draft',
      lastUpdated: '2024-01-08',
      category: 'Technical'
    },
    {
      id: 5,
      title: 'Testing Strategy',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      status: 'In Progress',
      lastUpdated: '2024-01-14',
      category: 'Quality'
    },
    {
      id: 6,
      title: 'Deployment Guide',
      description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.',
      status: 'Pending',
      lastUpdated: '2024-01-05',
      category: 'Operations'
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
        <ThemedView style={styles.filterSection}>
          <ThemedText type="subtitle" style={styles.filterTitle}>
            Filter by Category
          </ThemedText>
          <ThemedView style={styles.filterButtons}>
            <TouchableOpacity style={styles.filterButton}>
              <ThemedText style={styles.filterButtonText}>All</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <ThemedText style={styles.filterButtonText}>Planning</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <ThemedText style={styles.filterButtonText}>Technical</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <ThemedText style={styles.filterButtonText}>Design</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

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
              
              <ThemedText style={styles.docDescription}>
                {doc.description}
              </ThemedText>
              
              <ThemedView style={styles.docFooter}>
                <ThemedView style={styles.docMeta}>
                  <ThemedText style={styles.categoryText}>
                    {doc.category}
                  </ThemedText>
                  <ThemedText style={styles.dateText}>
                    Updated: {doc.lastUpdated}
                  </ThemedText>
                </ThemedView>
                <TouchableOpacity style={styles.viewButton}>
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
  docsContainer: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#495057',
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
    backgroundColor: '#343a40',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
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
