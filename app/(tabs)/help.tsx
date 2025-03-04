import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User } from 'lucide-react-native';

// Types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Predefined responses for the help bot
const botResponses: { [key: string]: string } = {
  'exchange rate': 'Exchange rates are updated daily from reliable financial data sources. The rates shown are mid-market rates and may differ slightly from what banks or money transfer services offer.',
  'currency': 'Our app supports over 150 currencies from around the world. You can convert between any two currencies instantly.',
  'convert': 'To convert currency, simply enter the amount, select your source currency and target currency, and the conversion will happen automatically.',
  'update': 'Exchange rates are updated once per day, typically around midnight UTC.',
  'accurate': 'Our exchange rates come from reliable financial data providers and are updated daily. However, they are mid-market rates and actual rates from banks or money transfer services may vary.',
  'offline': 'Currently, our app requires an internet connection to fetch the latest exchange rates. We\'re working on an offline mode for future updates.',
  'historical': 'We don\'t currently support historical exchange rates in the free version. This feature may be available in future updates.',
  'fee': 'Our app doesn\'t charge any fees for currency conversions. However, if you\'re making actual money transfers, your bank or transfer service will likely charge fees.',
  'save': 'You can save your favorite currency pairs by tapping the star icon next to a conversion. Access your saved conversions from the Favorites tab.',
  'notification': 'You can set rate alerts to be notified when a currency pair reaches a specific exchange rate. Go to Settings > Rate Alerts to set this up.',
  'help': 'I\'m your currency assistant! Ask me anything about currencies, exchange rates, or how to use this app.',
};

// Function to generate bot response
const generateBotResponse = (userMessage: string): string => {
  const lowercaseMessage = userMessage.toLowerCase();
  
  // Check for greetings
  if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
    return 'Hello! I\'m your currency assistant. How can I help you today?';
  }
  
  // Check for thank you
  if (lowercaseMessage.includes('thank') || lowercaseMessage.includes('thanks')) {
    return 'You\'re welcome! Is there anything else I can help you with?';
  }
  
  // Check for predefined responses
  for (const keyword in botResponses) {
    if (lowercaseMessage.includes(keyword)) {
      return botResponses[keyword];
    }
  }
  
  // Default response
  return "I'm not sure I understand. You can ask me about exchange rates, how to use the app, or specific currencies. Try phrases like 'How accurate are the exchange rates?' or 'How do I convert currencies?'";
};

export default function HelpScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your currency assistant. Ask me anything about currencies, exchange rates, or how to use this app.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Send message
  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    
    // Simulate bot typing
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  // Format time
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render message item
  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userMessageBubble : styles.botMessageBubble
      ]}>
        <View style={styles.messageHeader}>
          {item.sender === 'bot' ? (
            <Bot size={16} color="#3B82F6" style={styles.messageIcon} />
          ) : (
            <User size={16} color="#FFFFFF" style={styles.messageIcon} />
          )}
          <Text style={[
            styles.messageSender,
            item.sender === 'user' ? styles.userMessageSender : styles.botMessageSender
          ]}>
            {item.sender === 'user' ? 'You' : 'Currency Assistant'}
          </Text>
        </View>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userMessageText : styles.botMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          item.sender === 'user' ? styles.userMessageTime : styles.botMessageTime
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Help Bot</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your question here..."
            placeholderTextColor="#94A3B8"
            multiline
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() ? styles.sendButtonDisabled : null
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={!inputText.trim() ? '#94A3B8' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1E293B',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    elevation: 1,
  },
  userMessageBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  botMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageIcon: {
    marginRight: 4,
  },
  messageSender: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  userMessageSender: {
    color: '#FFFFFF',
  },
  botMessageSender: {
    color: '#3B82F6',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#1E293B',
  },
  messageTime: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    alignSelf: 'flex-end',
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  botMessageTime: {
    color: '#94A3B8',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
});