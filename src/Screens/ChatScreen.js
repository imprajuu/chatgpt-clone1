import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useEffect as useEffectRN, useRef, useState } from 'react';
// Animated typewriter greeting component with fade and color effect
import { Animated, Dimensions, Easing, FlatList, KeyboardAvoidingView, Platform, Animated as RNAnimated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatBubble from '../Components/ChatBubble';



import { useChat } from '../Components/ChatContext';
import { useTheme } from '../Components/ThemeContext';
import { fetchGroqResponse } from '../Services/sanity';
function AnimatedGreeting({ text, isDark, visible }) {
	// Prevent undefined text
	const safeText = typeof text === 'string' ? text : '';
	const [displayed, setDisplayed] = useState('');
	const [show, setShow] = useState(true);
	// Filter out empty/undefined words and trim
	const words = safeText.split(' ').map(w => (w && w !== 'undefined' ? w : '')).filter(w => w && w !== 'undefined');
	const wordIndex = useRef(0);
	const fadeAnim = useRef(new RNAnimated.Value(1)).current;

	useEffect(() => {
		if (!visible || !safeText) {
			setShow(false);
			return;
		}
		setDisplayed('');
		setShow(true);
		wordIndex.current = 0;
		let timeout;
		function showNextWord() {
			if (wordIndex.current < words.length) {
				const nextWord = words[wordIndex.current];
				if (nextWord && nextWord !== 'undefined') {
					setDisplayed(prev => prev + (prev ? ' ' : '') + nextWord);
				}
				wordIndex.current++;
				timeout = setTimeout(showNextWord, 300);
			}
		}
		fadeAnim.setValue(1);
		showNextWord();
		return () => clearTimeout(timeout);
	}, [safeText, visible]);

	if (!show || !safeText) return null;
	return (
		<RNAnimated.View style={{
			alignItems: 'center',
			justifyContent: 'center',
			position: 'absolute',
			top: '40%',
			left: 0,
			right: 0,
			zIndex: 10,
			opacity: fadeAnim,
		}}>
			<Text style={{
				fontSize: 24,
				fontWeight: 'bold',
				color: isDark ? '#fff' : '#232136',
				textAlign: 'center',
				letterSpacing: 1.2,
				   backgroundColor: isDark ? 'rgba(217,83,79,0.12)' : 'rgba(76,140,255,0.10)',
				   paddingHorizontal: 18,
				   paddingVertical: 10,
				   borderRadius: 18,
				   shadowColor: isDark ? '#d9534f' : '#4f8cff',
				   shadowOpacity: 0.18,
				   shadowRadius: 12,
				   elevation: 6,
			}}>{displayed}</Text>
		</RNAnimated.View>
	);
}

function LoaderBubble({ isDark }) {
	// Animated loader with three dots
	const anim = useRef(new Animated.Value(0)).current;
	useEffectRN(() => {
		const loop = Animated.loop(
			Animated.timing(anim, {
				toValue: 1,
				duration: 1200,
				easing: Easing.linear,
				useNativeDriver: false,
			})
		);
		loop.start();
		return () => loop.stop();
	}, [anim]);

	// Interpolate opacity for three dots
	const dot1Opacity = anim.interpolate({
		inputRange: [0, 0.2, 0.4, 1],
		outputRange: [1, 0.2, 0.2, 1],
	});
	const dot2Opacity = anim.interpolate({
		inputRange: [0, 0.2, 0.4, 0.6, 1],
		outputRange: [0.2, 1, 0.2, 0.2, 0.2],
	});
	const dot3Opacity = anim.interpolate({
		inputRange: [0, 0.4, 0.6, 0.8, 1],
		outputRange: [0.2, 0.2, 1, 0.2, 0.2],
	});

	return (
		<View style={{ flexDirection: 'row', alignSelf: 'flex-start', margin: 4, padding: 10, borderRadius: 10, backgroundColor: isDark ? '#18181b' : '#eee', maxWidth: '80%' }}>
			<Animated.View style={[loaderStyles.dot, { backgroundColor: isDark ? '#fff' : '#000', opacity: dot1Opacity }]} />
			<View style={{ width: 8 }} />
			<Animated.View style={[loaderStyles.dot, { backgroundColor: isDark ? '#fff' : '#000', opacity: dot2Opacity }]} />
			<View style={{ width: 8 }} />
			<Animated.View style={[loaderStyles.dot, { backgroundColor: isDark ? '#fff' : '#000', opacity: dot3Opacity }]} />
		</View>
	);
}

const loaderStyles = StyleSheet.create({
	dot: {
		width: 15,
		height: 15,
		borderRadius: 50,
		marginHorizontal: 0,
	},
});

function ChatScreen({ route }) {
	const { chats, activeChatId, setActiveChatId, createNewChat, setChatMessages } = useChat();
	const [currentChatId, setCurrentChatId] = useState(route?.params?.chatId || null);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	// Load Groq API key from environment or config instead of hardcoding secrets
	const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
	const { isDark } = useTheme();
	const themedStyles = getThemedStyles(isDark);
	const flatListRef = useRef(null);

	// Ensure we always have a chat id: reuse activeChatId or create a new chat
	useEffect(() => {
		if (!currentChatId) {
			if (activeChatId) {
				setCurrentChatId(activeChatId);
				return;
			}
			(async () => {
				const id = await createNewChat();
				setCurrentChatId(id);
				setActiveChatId(id);
			})();
		}
	}, [currentChatId, activeChatId, createNewChat, setActiveChatId]);

	// Update currentChatId when navigation param changes (e.g., from drawer)
	useEffect(() => {
		if (route?.params?.chatId && route.params.chatId !== currentChatId) {
			setCurrentChatId(route.params.chatId);
			setActiveChatId(route.params.chatId);
		}
	}, [route?.params?.chatId, currentChatId, setActiveChatId]);

	// Load messages for the current chat
	useEffect(() => {
		if (!currentChatId) return;
		const chat = chats.find(c => c.id === currentChatId);
		setMessages(chat ? chat.messages : []);
	}, [currentChatId, chats]);

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		if (flatListRef.current) {
			flatListRef.current.scrollToEnd({ animated: true });
		}
	}, [messages, loading]);

	// Remove automatic clear; only clear via explicit user action

	const sendMessage = async () => {
		if (!input.trim()) return;
		const newMessages = [...messages, { role: 'user', content: input }];
		setMessages(newMessages);
		setInput('');
		setLoading(true);
		try {
			const aiReply = await fetchGroqResponse(newMessages, apiKey);
			const updatedMessages = [...newMessages, { role: 'assistant', content: aiReply }];
			setMessages(updatedMessages);
			if (currentChatId) {
				await setChatMessages(currentChatId, updatedMessages);
			}
		} catch (e) {
			const updatedMessages = [...newMessages, { role: 'assistant', content: 'Error: ' + e.message }];
			setMessages(updatedMessages);
			if (currentChatId) {
				await setChatMessages(currentChatId, updatedMessages);
			}
		}
		setLoading(false);
	};

	// If loading, add a loader bubble after the last user message
	const displayMessages = loading
		? [...messages, { role: 'loader', content: '' }]
		: messages;

	// Dynamically set offset for Android/iOS
	const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 100;
	// Profile icon/modal removed (now handled in header)
	// Hide greeting only after user actually types (not on programmatic input set)
	const [greetingVisible, setGreetingVisible] = useState(true);
	// Show greeting on new chat, hide only after user sends a message
	const handleInputChange = (text) => {
		setInput(text);
	};
	// Hide greeting after first message is actually sent (successfully added to chat)
	const handleSendMessage = async () => {
		if (!input.trim()) return;
		// Hide greeting after message is actually added
		const newMessages = [...messages, { role: 'user', content: input }];
		setMessages(newMessages);
		setInput('');
		setGreetingVisible(false);
		setLoading(true);
		try {
			const aiReply = await fetchGroqResponse(newMessages, apiKey);
			const updatedMessages = [...newMessages, { role: 'assistant', content: aiReply }];
			setMessages(updatedMessages);
			if (currentChatId) {
				await setChatMessages(currentChatId, updatedMessages);
			}
		} catch (e) {
			const updatedMessages = [...newMessages, { role: 'assistant', content: 'Error: ' + e.message }];
			setMessages(updatedMessages);
			if (currentChatId) {
				await setChatMessages(currentChatId, updatedMessages);
			}
		}
		setLoading(false);
	};
	// Reset greeting if current chat changes (new chat)
	useEffect(() => {
		setInput('');
		setGreetingVisible(true);
	}, [currentChatId]);

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={keyboardVerticalOffset}
		>
			<LinearGradient
				colors={isDark
					? ['#18122B', '#251749', '#010003']
					: ['#e3f0ff', '#ffffff', '#e3f0ff']}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{ flex: 1 }}
			>
				<SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
					<View style={{ flex: 1 }}>
						<FlatList
							ref={flatListRef}
							data={displayMessages}
							renderItem={({ item }) =>
								item.role === 'loader' ? (
									<LoaderBubble isDark={isDark} />
								) : (
									<ChatBubble message={item} isDark={isDark} />
								)
							}
							keyExtractor={(_, i) => i.toString()}
							style={{ flex: 1 }}
							contentContainerStyle={{ padding: 10, paddingBottom: 10 }}
							keyboardShouldPersistTaps="handled"
						/>
					</View>
					<SafeAreaView edges={['bottom']} style={{ backgroundColor: 'transparent' }}>
						<View style={themedStyles.inputContainer}>
							<TextInput
								style={themedStyles.input}
								value={input}
								onChangeText={handleInputChange}
								placeholder='Write a message...'
								placeholderTextColor={isDark ? '#b9b9c3' : '#888'}
								returnKeyType='send'
								onSubmitEditing={sendMessage}
							/>
							<TouchableOpacity
								onPress={handleSendMessage}
								disabled={loading || !input.trim()}
								style={themedStyles.sendBtn}
							>
								<Text style={themedStyles.sendBtnText}>➤</Text>
							</TouchableOpacity>
						</View>
					</SafeAreaView>
				</SafeAreaView>
			</LinearGradient>
		</KeyboardAvoidingView>
	);
}


function getThemedStyles(isDark) {
	const { width } = Dimensions.get('window');
	return StyleSheet.create({
		container: {
			flex: 1,
			paddingHorizontal: width < 350 ? 4 : 10,
			paddingTop: 10,
			backgroundColor: isDark ? '#000' : '#fff',
		},
		inputContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: isDark ? '#232136' : '#f7fafd',
			paddingHorizontal: width < 350 ? 8 : 16,
			paddingVertical: width < 350 ? 6 : 12,
			borderRadius: 24,
			margin: 10,
			borderWidth: isDark ? 0 : 1,
			borderColor: isDark ? 'transparent' : '#e3e6ee',
			shadowColor: isDark ? '#000' : '#b3c6e0',
			shadowOpacity: 0.10,
			shadowRadius: 8,
			elevation: 4,
		},
		input: {
			flex: 1,
			borderWidth: 0,
			backgroundColor: 'transparent',
			color: isDark ? '#fff' : '#000',
			paddingVertical: width < 350 ? 10 : 14,
			paddingHorizontal: width < 350 ? 10 : 16,
			marginRight: 8,
			borderRadius: 16,
			fontSize: width < 350 ? 15 : 17,
			minHeight: 40,
			maxHeight: 100,
		},
		sendBtn: {
			backgroundColor: isDark ? '#7c3aed' : '#4f8cff',
			borderRadius: 16,
			paddingHorizontal: 18,
			paddingVertical: 10,
			justifyContent: 'center',
			alignItems: 'center',
			opacity: 1,
			shadowColor: isDark ? 'transparent' : '#b3c6e0',
			shadowOpacity: isDark ? 0 : 0.10,
			shadowRadius: isDark ? 0 : 6,
			elevation: isDark ? 0 : 2,
		},
		sendBtnText: {
			color: '#fff',
			fontSize: 20,
		},
	});
}

export default ChatScreen;

