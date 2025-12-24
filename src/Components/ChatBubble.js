import { StyleSheet, Text, View } from 'react-native';

export default function ChatBubble({ message, isDark }) {
  const isUser = message.role === 'user';
  const themedStyles = getThemedStyles(isDark);
  return (
    <View style={[themedStyles.bubble, isUser ? themedStyles.user : themedStyles.ai]}>
      <Text style={themedStyles.text}>{message.content}</Text>
    </View>
  );
}

function getThemedStyles(isDark) {
  return StyleSheet.create({
    bubble: {
      marginVertical: 6,
      marginHorizontal: 2,
      paddingVertical: 12,
      paddingHorizontal: 20,
      maxWidth: '80%',
      minHeight: 36,
    },
    user: {
      backgroundColor: isDark ? '#7c3aed' : '#4f8cff',
      alignSelf: 'flex-end',
      borderRadius: 24,
      borderTopRightRadius: 32,
      borderBottomRightRadius: 32,
      borderTopLeftRadius: 24,
      borderBottomLeftRadius: 24,
      shadowColor: '#b3c6e0',
      shadowOpacity: 0.10,
      shadowRadius: 8,
      elevation: 2,
    },
    ai: {
      backgroundColor: isDark ? '#232136' : '#f2f3f7',
      alignSelf: 'flex-start',
      borderRadius: 24,
      borderTopLeftRadius: 32,
      borderBottomLeftRadius: 32,
      borderTopRightRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: '#b3c6e0',
      shadowOpacity: 0.10,
      shadowRadius: 8,
      elevation: 2,
    },
    text: {
      color: isDark ? '#fff' : '#222',
      fontSize: 16,
    },
  });
}