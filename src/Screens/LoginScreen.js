
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login } from '../Services/firebase';


export default function LoginScreen({ navigation, onLogin }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const goToSignup = () => navigation.navigate('Signup');
	const handleLogin = async () => {
		try {
			const result = await login(email, password);
			onLogin(result.user);
		} catch (err) {
			Alert.alert('Login Error', err.message);
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#f6f8fc' }}>
			<LinearGradient
				colors={["#4f8cff", "#6f6ee8"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.gradientHeader}
			>
				<View style={styles.logoContainer}>
					{/* Replace with your logo image if available */}
					<View style={styles.logoCircle}>
						<Text style={styles.logoText}>V</Text>
					</View>
					<Text style={styles.logoTitle}>MOFINOW</Text>
				</View>
			</LinearGradient>
			<View style={styles.card}>
				<Text style={styles.welcome}>Welcome back !</Text>
				<TextInput
					placeholder="Username"
					value={email}
					onChangeText={setEmail}
					style={styles.input}
					placeholderTextColor="#aaa"
				/>
				<TextInput
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					style={styles.input}
					placeholderTextColor="#aaa"
				/>
				<TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
					<Text style={styles.loginBtnText}>Login</Text>
				</TouchableOpacity>
				<View style={styles.signupRow}>
					<Text style={styles.signupText}>New user?</Text>
					<TouchableOpacity onPress={goToSignup}>
						<Text style={styles.signupLink}> Sign Up</Text>
							</TouchableOpacity>
						</View>
				</View>
		</View>
	);
}


const styles = StyleSheet.create({
	gradientHeader: {
		height: 200,
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	logoContainer: {
		alignItems: 'center',
		marginTop: 40,
	},
	logoCircle: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	logoText: {
		fontSize: 36,
		fontWeight: 'bold',
		color: '#4f8cff',
	},
	logoTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#fff',
		letterSpacing: 2,
	},
	card: {
		backgroundColor: '#fff',
		marginHorizontal: 20,
		marginTop: -60,
		borderRadius: 24,
		padding: 24,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 16,
		elevation: 8,
	},
	welcome: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#222',
		textAlign: 'center',
		marginBottom: 24,
	},
	input: {
		borderWidth: 1,
		borderColor: '#e0e0e0',
		backgroundColor: '#f6f8fc',
		padding: 14,
		borderRadius: 12,
		marginBottom: 16,
		fontSize: 16,
		color: '#222',
	},
	rowBetween: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	fakeCheckbox: {
		width: 18,
		height: 18,
		borderRadius: 5,
		borderWidth: 1.5,
		borderColor: '#bbb',
		marginRight: 8,
		backgroundColor: '#fff',
	},
	rememberText: {
		color: '#888',
		fontSize: 14,
	},
	forgotText: {
		color: '#4f8cff',
		fontSize: 14,
		fontWeight: 'bold',
	},
	loginBtn: {
		backgroundColor: '#4f8cff',
		borderRadius: 24,
		paddingVertical: 14,
		alignItems: 'center',
		marginBottom: 12,
		marginTop: 8,
		shadowColor: '#4f8cff',
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 2,
	},
	loginBtnText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
		letterSpacing: 1,
	},
	signupRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 8,
	},
	signupText: {
		color: '#888',
		fontSize: 14,
	},
	signupLink: {
		color: '#4f8cff',
		fontWeight: 'bold',
		fontSize: 14,
	},
	orText: {
		textAlign: 'center',
		color: '#bbb',
		marginVertical: 8,
		fontSize: 14,
	},
	socialRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 4,
	},
	socialBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#f6f8fc',
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 6,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 1,
	},
	socialIcon: {
		fontSize: 18,
		color: '#4f8cff',
		fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
	},
});

