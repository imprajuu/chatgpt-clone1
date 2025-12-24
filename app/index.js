

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { ChatProvider } from '../src/Components/ChatContext';
import CustomDrawerContent from '../src/Components/CustomDrawerContent';
import { ThemeProvider, useTheme } from '../src/Components/ThemeContext';
import ChatScreen from '../src/Screens/ChatScreen';
import LoginScreen from '../src/Screens/LoginScreen';
import SignupScreen from '../src/Screens/SignupScreen';
import { auth } from '../src/Services/firebase';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();



function AppWithTheme() {
	const [user, setUser] = useState(null);
	const [authLoading, setAuthLoading] = useState(true);
	const { isDark } = useTheme();
	const [modalVisible, setModalVisible] = useState(false);
	const [editName, setEditName] = useState('');
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		let isMounted = true;
		(async () => {
			try {
				// First, try to restore a previously logged-in (dummy) user
				const storedUser = await AsyncStorage.getItem('DEMO_USER');
				if (isMounted && storedUser) {
					setUser(JSON.parse(storedUser));
					setAuthLoading(false);
					return;
				}
				// If real Firebase auth is configured, fall back to onAuthStateChanged
				if (auth && typeof onAuthStateChanged === 'function') {
					const unsubscribe = onAuthStateChanged(auth, (u) => {
						if (!isMounted) return;
						setUser(u);
						setAuthLoading(false);
					});
					return unsubscribe;
				}
				// Demo mode, no stored user: show Login
				if (isMounted) setAuthLoading(false);
			} catch (_e) {
				if (isMounted) setAuthLoading(false);
			}
		})();
		return () => {
			isMounted = false;
		};
	}, []);

	const openProfileModal = () => {
		setEditName((auth && auth.currentUser?.displayName) || user?.displayName || '');
		setEditing(false);
		setModalVisible(true);
	};
	const handleSave = async () => {
		setSaving(true);
		setError('');
		try {
			if (auth && auth.currentUser) {
				await updateProfile(auth.currentUser, { displayName: editName });
				setUser({ ...auth.currentUser, displayName: editName });
			} else {
				setUser((prev) => ({ ...prev, displayName: editName }));
			}
			setEditing(false);
		} catch (_e) {
			setError('Failed to update name');
		}
		setSaving(false);
	};

	if (authLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#181818' : '#fff' }}>
				<Text style={{ color: isDark ? '#fff' : '#232136', fontSize: 18 }}>Loading...</Text>
			</View>
		);
	}
	return (
		<ChatProvider>
			{!user ? (
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name="Login">
						{(props) => (
							<LoginScreen
								{...props}
								onLogin={async (userObj) => {
									setUser(userObj);
									try {
										await AsyncStorage.setItem('DEMO_USER', JSON.stringify(userObj));
									} catch {}
								}}
							/>
						)} 
					</Stack.Screen>
					<Stack.Screen name="Signup" component={SignupScreen} />
				</Stack.Navigator>
			) : (
				<>
				<Drawer.Navigator
					screenOptions={{
						headerShown: true,
						headerTitle: 'AstraMind',
						headerStyle: { backgroundColor: isDark ? '#7c3aed' : '#007bff' },
						headerTintColor: '#fff',
						headerTitleAlign: 'center',
						headerRight: () => {
							const React = require('react');
							const { TouchableOpacity } = require('react-native');
							const { MaterialIcons } = require('@expo/vector-icons');
							return React.createElement(TouchableOpacity, {
								onPress: openProfileModal,
								style: {
									marginRight: 16,
									backgroundColor: isDark ? '#7c3aed' : '#007bff',
									borderRadius: 20,
									width: 40,
									height: 40,
									alignItems: 'center',
									justifyContent: 'center',
									elevation: 4,
								}
							},
								React.createElement(MaterialIcons, { name: 'person', size: 26, color: '#fff' })
							);
						}
					}}
					drawerContent={(props) => <CustomDrawerContent {...props} />}
				>
					<Drawer.Screen name="Chat" component={ChatScreen} />
				</Drawer.Navigator>
				{modalVisible && (
					(() => {
						const React = require('react');
						const { Modal, View, Text } = require('react-native');
						const { MaterialIcons } = require('@expo/vector-icons');
						return React.createElement(Modal, {
							visible: modalVisible,
							transparent: true,
							animationType: 'fade',
							onRequestClose: () => setModalVisible(false)
						},
							React.createElement(View, {
								style: {
									flex: 1,
									backgroundColor: 'rgba(0,0,0,0.3)',
									justifyContent: 'center',
									alignItems: 'center'
								}
							},
								React.createElement(View, {
									style: {
										backgroundColor: isDark ? '#fff' : '#fff',
										paddingVertical: 8,
										paddingHorizontal: 10,
										borderRadius: 10,
										alignItems: 'center',
										minWidth: 150,
										maxWidth: 220,
										shadowColor: '#000',
										shadowOpacity: 0.10,
										shadowRadius: 4,
										elevation: 3,
									}
								},
									React.createElement(MaterialIcons, { name: 'person', size: 32, color: isDark ? '#7c3aed' : '#007bff', style: { marginBottom: 6 } }),
									React.createElement(Text, { style: { fontSize: 16, fontWeight: 'bold', color: '#232136', marginBottom: 10 } }, 'Profile'),
									React.createElement(View, { style: { width: '100%', marginBottom: 12 } },
										React.createElement(Text, { style: { fontWeight: 'bold', marginBottom: 2, color: '#232136', fontSize: 13 } }, 'Name'),
										React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 } },
											React.createElement(Text, { style: { color: '#555', fontSize: 13, marginRight: 4 } }, user?.displayName || 'Not set'),
											React.createElement(require('@expo/vector-icons').MaterialIcons, {
												name: 'edit',
												size: 16,
												color: '#7c3aed',
												style: { marginLeft: 2 },
												onPress: () => {
													setEditName(user?.displayName || '');
													setEditing(true);
												}
											})
										),
										editing && React.createElement(require('react-native').TextInput, {
											value: editName,
											onChangeText: setEditName,
											style: {
												borderWidth: 1,
												borderColor: '#bbb',
												borderRadius: 6,
												padding: 6,
												fontSize: 13,
												backgroundColor: '#f7fafd',
												color: '#232136',
												marginBottom: 2
											},
											placeholder: 'Enter your name',
											placeholderTextColor: '#aaa',
										}),
										editing && React.createElement(require('react-native').TouchableOpacity, {
											onPress: handleSave,
											disabled: saving || !editName.trim(),
											style: { padding: 6, borderRadius: 6, backgroundColor: saving || !editName.trim() ? '#b5e5c7' : '#22c55e', minWidth: 60, alignItems: 'center', marginTop: 2 }
										},
											React.createElement(Text, { style: { color: '#fff', fontWeight: 'bold', fontSize: 13 } }, saving ? 'Saving...' : 'Save')
										)
									),
									error && React.createElement(Text, { style: { color: 'red', marginBottom: 8 } }, error),
									React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: 4 } },
										React.createElement(require('react-native').TouchableOpacity, {
											onPress: () => { setModalVisible(false); setEditing(false); },
											style: { padding: 6, borderRadius: 6, backgroundColor: '#eee', minWidth: 60, alignItems: 'center' }
										},
											React.createElement(Text, { style: { color: '#232136', fontWeight: 'bold', fontSize: 13 } }, 'Close')
										)
									)
								)
							)
						);
					})()
				)}
				</>
			)}
		</ChatProvider>
	);
}


export default function App() {
	return (
		<ChatProvider>
			<ThemeProvider>
				<AppWithTheme />
			</ThemeProvider>
		</ChatProvider>
	);
}



