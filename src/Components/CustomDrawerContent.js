import { MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../Services/firebase';
import { useChat } from './ChatContext';
import { useTheme } from './ThemeContext';

function CustomDrawerContent(props) {
  const { isDark, toggleTheme } = useTheme();
  const { chats, activeChatId, setActiveChatId, createNewChat, removeChat, removeAllChats } = useChat();
  const user = auth && auth.currentUser;
  const themedStyles = getThemedStyles(isDark);

  const [deleteModal, setDeleteModal] = useState({ visible: false, chatId: null });

  const handleNewChat = async () => {
    const id = await createNewChat();
    props.navigation.navigate('Chat', { chatId: id });
  };

  const handleOpenChat = (id) => {
    setActiveChatId(id);
    props.navigation.navigate('Chat', { chatId: id });
  };

  const handleDeleteChat = (id) => {
    setDeleteModal({ visible: true, chatId: id });
  };

  const confirmDeleteChat = () => {
    if (deleteModal.chatId) removeChat(deleteModal.chatId);
    setDeleteModal({ visible: false, chatId: null });
  };

  const handleClearAll = () => {
    removeAllChats();
  };

  return (
    <>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: isDark ? '#000' : themedStyles.backgroundColor, paddingBottom: 0 }}>
        <View style={{ flex: 1 }}>
          <View style={themedStyles.header}>
            <Text style={themedStyles.title}>AstraMind</Text>
          </View>
          <TouchableOpacity
            onPress={handleNewChat}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              marginHorizontal: 8,
              marginTop: 4,
              marginBottom: 8,
              backgroundColor: isDark ? '#18181b' : '#fff', 
              borderWidth: 1,
              borderColor: isDark ? '#27272a' : '#d1d5db',
              shadowColor: '#000',
              shadowOpacity: 0.04,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <MaterialIcons name="edit" size={22} color={isDark ? '#fff' : '#232136'} style={{ marginRight: 8 }} />
            <Text style={{ color: isDark ? '#fff' : '#232136', fontSize: 16, fontWeight: '500' }}>New chat</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, minHeight: 0, borderRadius: 16, overflow: 'hidden' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              {chats.length === 0 && (
                <Text style={{ color: themedStyles.themeText.color, textAlign: 'center', marginVertical: 10 }}>No chats yet</Text>
              )}
              {chats.map((chat, idx) => {
                let preview = 'New Chat';
                if (chat.messages && chat.messages.length > 0) {
                  const firstUserMsg = chat.messages.find(m => m.role === 'user');
                  if (firstUserMsg && firstUserMsg.content) {
                    preview = firstUserMsg.content.length > 32
                      ? firstUserMsg.content.slice(0, 32) + '...'
                      : firstUserMsg.content;
                  }
                }
                return (
                  <View key={chat.id} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 2,
                    backgroundColor: chat.id === activeChatId
                      ? (isDark ? '#333' : '#e0e0e0')
                      : (isDark ? '#18181b' : 'transparent'),
                    borderRadius: 8
                  }}>
                    <TouchableOpacity style={{ flex: 1, padding: 10 }} onPress={() => handleOpenChat(chat.id)}>
                      <Text numberOfLines={1} style={{ color: themedStyles.themeText.color, fontWeight: chat.id === activeChatId ? 'bold' : 'normal' }}>
                        {preview}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteChat(chat.id)} style={{ padding: 8 }}>
                      <MaterialIcons name="delete" size={18} color={isDark ? '#ff6666' : '#d9534f'} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
            {chats.length > 0 && (
              <TouchableOpacity onPress={handleClearAll} style={{ alignSelf: 'center', marginTop: 8 }}>
                <Text style={{ color: '#d9534f', fontWeight: 'bold' }}>Clear All Chats</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={themedStyles.bottomArea}>
          <TouchableOpacity
            style={themedStyles.themeBtn}
            onPress={toggleTheme}
          >
            <MaterialIcons name={isDark ? 'light-mode' : 'dark-mode'} size={20} color={themedStyles.iconColor} />
            <Text style={themedStyles.logoutText}>{isDark ? 'Light Mode' : 'Dark Mode'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={themedStyles.logoutBtn} onPress={async () => { await auth.signOut(); }}>
            <MaterialIcons name="logout" size={20} color={themedStyles.iconColor} />
            <Text style={themedStyles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
      {/* Custom Delete Modal */}
      <Modal
        visible={deleteModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModal({ visible: false, chatId: null })}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            backgroundColor: isDark ? '#232136' : '#fff',
            borderRadius: 20,
            padding: 24,
            minWidth: 260,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
          }}>
            <Text style={{ color: isDark ? '#fff' : '#232136', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Delete Chat</Text>
            <Text style={{ color: isDark ? '#fff' : '#232136', fontSize: 15, marginBottom: 20, textAlign: 'center' }}>
              Are you sure you want to delete this chat?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity
                onPress={() => setDeleteModal({ visible: false, chatId: null })}
                style={{ flex: 1, marginRight: 8, backgroundColor: isDark ? '#18181b' : '#eee', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}
              >
                <Text style={{ color: isDark ? '#fff' : '#232136', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDeleteChat}
                style={{ flex: 1, marginLeft: 8, backgroundColor: '#d9534f', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const getThemedStyles = (isDark) => {
  return StyleSheet.create({
    header: {
      padding: 16,
      backgroundColor: isDark ? '#18181b' : '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#27272a' : '#dee2e6',
    },
    title: {
      color: isDark ? '#fff' : '#000',
      fontSize: 20,
      fontWeight: 'bold',
    },
    themeText: {
      color: isDark ? '#fff' : '#222',
      marginLeft: 8,
      fontWeight: 'bold',
      fontSize: 16,
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#d9534f',
      padding: 15,
      justifyContent: 'center',
      marginHorizontal: 20,
      marginTop: 8,
      marginBottom: 8,
      borderRadius: 8,
    },
    themeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#7c3aed' : '#007bff',
      padding: 15,
      justifyContent: 'center',
      marginHorizontal: 20,
      marginTop: 8,
      marginBottom: 0,
      borderRadius: 8,
    },
    logoutText: {
      color: '#fff',
      marginLeft: 10,
      fontWeight: 'bold',
      fontSize: 16,
    },
    iconColor: isDark ? '#fff' : '#fff',
    newChatBtnCorner: {
      position: 'absolute',
      right: 20,
      bottom: 70,
      backgroundColor: isDark ? '#2196f3' : '#007bff',
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      zIndex: 10,
      borderWidth: 1,
      borderColor: isDark ? '#fff' : '#007bff',
    },
    newChatBtnRect: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#2196f3' : '#007bff',
      paddingVertical: 10,
      paddingHorizontal: 22,
      borderRadius: 8,
      marginRight: 24,
      borderWidth: 1,
      borderColor: isDark ? '#fff' : '#007bff',
      height: 40,
      marginBottom: 8,
    },
  });
}

export default CustomDrawerContent;