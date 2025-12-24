import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../Services/firebase';
import { addChat, clearAllChats, deleteChat, getChats, saveChats, updateChat } from './ChatStorage';
import { uuidv4 } from './uuid';

const ChatContext = createContext();



export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    (async () => {
      const stored = await getChats();
      setChats(stored);
      if (stored.length > 0) setActiveChatId(stored[0].id);
      else setActiveChatId(null);
    })();
    if (auth && typeof auth.onAuthStateChanged === 'function') {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        const stored = await getChats();
        setChats(stored);
        if (stored.length > 0) setActiveChatId(stored[0].id);
        else setActiveChatId(null);
      });
      return unsubscribe;
    }
    // In dummy mode, return a no-op cleanup function
    return () => {};
  }, []);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  const createNewChat = async () => {
    const newChat = { id: uuidv4(), messages: [] };
    await addChat(newChat);
    const stored = await getChats();
    setChats(stored);
    setActiveChatId(newChat.id);
    return newChat.id;
  };

  const setChatMessages = async (chatId, messages) => {
    await updateChat(chatId, messages);
    const stored = await getChats();
    setChats(stored);
  };

  const removeChat = async (chatId) => {
    await deleteChat(chatId);
    const stored = await getChats();
    setChats(stored);
    if (activeChatId === chatId && stored.length > 0) setActiveChatId(stored[0].id);
    else if (stored.length === 0) setActiveChatId(null);
  };

  const removeAllChats = async () => {
    await clearAllChats();
    setChats([]);
    setActiveChatId(null);
  };

 
  return (
    <ChatContext.Provider value={{ chats, activeChatId, setActiveChatId, createNewChat, setChatMessages, removeChat, removeAllChats }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
