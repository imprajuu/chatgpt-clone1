import AsyncStorage from '@react-native-async-storage/async-storage';

const CHATS_KEY = 'CHAT_SESSIONS';

export async function getChats() {
  const data = await AsyncStorage.getItem(CHATS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveChats(chats) {
  await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

export async function addChat(chat) {
  const chats = await getChats();
  chats.unshift(chat);
  await saveChats(chats);
}

export async function updateChat(chatId, messages) {
  const chats = await getChats();
  const idx = chats.findIndex(c => c.id === chatId);
  if (idx !== -1) {
    chats[idx].messages = messages;
    await saveChats(chats);
  }
}

export async function deleteChat(chatId) {
  const chats = await getChats();
  const filtered = chats.filter(c => c.id !== chatId);
  await saveChats(filtered);
}

export async function clearAllChats() {
  await AsyncStorage.removeItem(CHATS_KEY);
}
