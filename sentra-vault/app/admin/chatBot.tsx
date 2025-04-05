import { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  Mic,
  Paperclip,
  Plus,
  Send,
  Calendar,
  Mail,
  Download,
  FileText,
  ExternalLink,
} from 'lucide-react-native';
import CalendarPicker from 'react-native-calendar-picker';
import EventSource from "react-native-sse";

export default function ChatScreen() {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [message, setMessage] = useState('');
  const activeStreamRef = useRef<(() => void) | null>(null);
  const [messages, setMessages] = useState<
    Array<{
      type: string;
      content: string | { subject: string; body: string; actions: string[] };
      widget?: string | React.ReactNode;
      source?: string;
      id?: string;
    }>
  >([
    {
      type: 'user',
      content: 'Can you help me schedule a meeting with the team?',
    },
    {
      type: 'assistant',
      content: 'I can help you schedule a meeting. Please select a date:',
      widget: 'calendar',
    },
    {
      type: 'user',
      content: 'Can you draft an email to the team about the project update?',
    },
    {
      type: 'assistant',
      content: {
        subject: 'Project Update - Q1 Progress',
        body: 'Hi team,\n\nI wanted to share a quick update on our Q1 progress...',
        actions: ['Send', 'Edit', 'Copy'],
      },
      widget: 'email',
    },
    {
      type: 'user',
      content: 'Show me the latest sales report',
    },
    {
      type: 'assistant',
      content: "Here's the latest sales report PDF:",
      widget: 'pdf',
      source: 'Sales/Q1_2024_Report.pdf',
    },
  ]);

  useEffect(() => {
    return () => {
      if (activeStreamRef.current) {
        console.log("Component unmounting, cleaning up stream");
        activeStreamRef.current();
        activeStreamRef.current = null;
      }
    };
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newUserMessage = {
      type: 'user',
      content: message,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setMessage("");

    try {
      const botMessageId = `${Date.now() + 1}`;

      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: '',
          id: botMessageId,
        },
      ]);

      // Uncomment this fetch to get actual backend response
      // const response = await fetch('http://192.168.38.55:5000/agent-chat', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ message }),
      // });
      // const data = await response.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                widget: renderWidget("calendar", {}
              ) || "No reply found.",
              }
            : msg
        )
      );

    } catch (err) {
      console.error("fetch error:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "Failed to fetch.",
          id: `${Date.now() + 2}`,
        },
      ]);
    }
  };

  const renderWidget = (widget: any, content: any) => {
    switch (widget) {
      case 'calendar':
        return (
          <View style={styles.widgetContainer}>
            <CalendarPicker
              width={300}
              selectedDayColor="#162C88"
              selectedDayTextColor="#FFFFFF"
            />
            <TouchableOpacity style={styles.actionButton}>
              <Calendar size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Schedule Meeting</Text>
            </TouchableOpacity>
          </View>
        );
      case 'email':
        return (
          <View style={styles.emailCard}>
            <Text style={styles.emailSubject}>{content.subject}</Text>
            <Text style={styles.emailBody}>{content.body}</Text>
            <View style={styles.actionButtonsContainer}>
              {content.actions.map((action: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.actionButton,
                    { backgroundColor: action === 'Send' ? '#F47C26' : '#162C88' },
                  ]}>
                  <Mail size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>{action}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 'pdf':
        return (
          <View style={styles.pdfCard}>
            <View style={styles.pdfPreview}>
              <FileText size={40} color="#162C88" />
              <Text style={styles.pdfTitle}>Q1 2024 Sales Report</Text>
            </View>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Download size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <ExternalLink size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Open</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SentraVault</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageBubble,
                msg.type === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              {typeof msg.content === 'string' ? (
                <Text
                  style={[
                    styles.messageText,
                    msg.type === 'user' ? styles.userText : styles.assistantText,
                  ]}
                >
                  {msg.content}
                </Text>
              ) : null}
              {msg.widget && typeof msg.widget !== 'string' ? msg.widget : renderWidget(msg.widget, msg.content)}
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputBar}>
          <TouchableOpacity>
            <Plus size={24} color="#162C88" />
          </TouchableOpacity>
          <TextInput
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            style={styles.input}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Send size={24} color="#162C88" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    backgroundColor: '#162C88',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: '#E8EAF6',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#000000',
  },
  assistantText: {
    color: '#000000',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#CCCCCC',
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    fontSize: 16,
  },
  widgetContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162C88',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
  },
  emailCard: {
    backgroundColor: '#F7F9FC',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  emailSubject: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  emailBody: {
    fontSize: 14,
    marginBottom: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  pdfCard: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  pdfPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
