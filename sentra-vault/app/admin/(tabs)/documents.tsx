import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import {
  FileUp,
  File,
  Image as ImageIcon,
  FileText,
  ChevronRight,
  Plus,
} from 'lucide-react-native';

const SAMPLE_DOCUMENTS = {
  pdf: [
    {
      name: 'Annual Report 2024.pdf',
      size: '2.4 MB',
      date: '2024-03-15',
      url: 'https://example.com/annual-report.pdf',
    },
    {
      name: 'Financial Statement Q1.pdf',
      size: '1.8 MB',
      date: '2024-03-10',
      url: 'https://example.com/financial-statement.pdf',
    },
  ],
  docs: [
    {
      name: 'Project Proposal.docx',
      size: '856 KB',
      date: '2024-03-14',
      url: 'https://example.com/proposal.docx',
    },
  ],
  images: [
    {
      name: 'Team Photo.jpg',
      size: '3.2 MB',
      date: '2024-03-13',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&q=80',
    },
    {
      name: 'Office Building.jpg',
      size: '2.8 MB',
      date: '2024-03-12',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&q=80',
    },
  ],
};

type Category = 'pdf' | 'docs' | 'images';

export default function DocumentsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('pdf');

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      });

      if (!result.canceled) {
        // Handle the uploaded files
        console.log('Selected files:', result.assets);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const renderDocumentItem = (doc: any) => {
    const isImage = selectedCategory === 'images';

    return (
      <TouchableOpacity
        key={doc.name}
        style={styles.documentItem}
        onPress={() => console.log('Open document:', doc.url)}>
        <View style={styles.documentInfo}>
          {isImage ? (
            <Image
              source={{ uri: doc.thumbnail }}
              style={styles.thumbnail}
            />
          ) : (
            <View style={styles.iconContainer}>
              {selectedCategory === 'pdf' ? (
                <FileText size={24} color="#D21C1C" />
              ) : (
                <File size={24} color="#162C88" />
              )}
            </View>
          )}
          <View style={styles.documentDetails}>
            <Text style={styles.documentName}>{doc.name}</Text>
            <Text style={styles.documentMeta}>
              {doc.size} • {doc.date}
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color="#6B7280" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <FileUp size={20} color="#FFFFFF" />
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categories}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'pdf' && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory('pdf')}>
            <FileText
              size={20}
              color={selectedCategory === 'pdf' ? '#FFFFFF' : '#162C88'}
            />
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === 'pdf' && styles.categoryButtonTextActive,
              ]}>
              PDF Files
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'docs' && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory('docs')}>
            <File
              size={20}
              color={selectedCategory === 'docs' ? '#FFFFFF' : '#162C88'}
            />
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === 'docs' && styles.categoryButtonTextActive,
              ]}>
              Documents
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'images' && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory('images')}>
            <ImageIcon
              size={20}
              color={selectedCategory === 'images' ? '#FFFFFF' : '#162C88'}
            />
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === 'images' && styles.categoryButtonTextActive,
              ]}>
              Images
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.documentList}>
        {SAMPLE_DOCUMENTS[selectedCategory].map(renderDocumentItem)}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={pickDocument}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#162C88',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F47C26',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  categories: {
    padding: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#162C88',
    borderColor: '#162C88',
  },
  categoryButtonText: {
    color: '#162C88',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  documentList: {
    flex: 1,
    padding: 16,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      },
    }),
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  documentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#F47C26',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      },
    }),
  },
});