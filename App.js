


import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { ChatProvider } from './src/Components/ChatContext';
import ChatScreen from './src/Screens/ChatScreen';
import LoginScreen from './src/Screens/LoginScreen';
import { auth } from './src/Services/firebase';

// User context for global user state
const UserContext = createContext();
export function useUser() {
	return useContext(UserContext);
}
const Stack = createStackNavigator();




export default function App() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		(async () => {
			try {
				const storedUser = await AsyncStorage.getItem('DEMO_USER');
				if (isMounted && storedUser) {
					setUser(JSON.parse(storedUser));
					setLoading(false);
					return;
				}
				if (auth && typeof onAuthStateChanged === 'function') {
					const unsubscribe = onAuthStateChanged(auth, (u) => {
						if (isMounted) {
							setUser(u);
							setLoading(false);
						}
					});
					return unsubscribe;
				} else {
					import('./src/Services/firebase').then(({ login }) => {
						login('prajakta@gmail.com', 'Prajakta@123')
							.then(async (result) => {
								if (isMounted) {
									setUser(result.user);
									await AsyncStorage.setItem('DEMO_USER', JSON.stringify(result.user));
									setLoading(false);
								}
							})
							.catch(() => { if (isMounted) setLoading(false); });
					});
				}
			} catch (e) {
				if (isMounted) setLoading(false);
			}
		})();
		return () => { isMounted = false; };
	}, []);

	const handleLogin = async (userObj) => {
		setUser(userObj);
		try {
			await AsyncStorage.setItem('DEMO_USER', JSON.stringify(userObj));
		} catch {}
	};

	const handleLogout = async () => {
		setUser(null);
		try {
			await AsyncStorage.removeItem('DEMO_USER');
		} catch {}
	};

	if (loading) {
		return null;
	}

	return (
		<UserContext.Provider value={{ user, setUser, handleLogout }}>
			<ChatProvider>
				<NavigationContainer>
					<Stack.Navigator screenOptions={{ headerShown: false }}>
						{!user ? (
							<Stack.Screen name="Login">
								{(props) => <LoginScreen {...props} onLogin={handleLogin} />}
							</Stack.Screen>
						) : (
							<Stack.Screen name="Chat" component={ChatScreen} />
						)}
					</Stack.Navigator>
				</NavigationContainer>
			</ChatProvider>
		</UserContext.Provider>
	);
}

