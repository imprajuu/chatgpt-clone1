

import { LinearGradient } from 'expo-linear-gradient';
import { updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, signup } from '../Services/firebase';


export default function SignupScreen({ navigation, onSignup }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const goToLogin = () => navigation.navigate('Login');

  const handleSignup = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Validation Error', 'Please enter your first and last name.');
      return;
    }
    try {
      await signup(email, password);
      if (auth && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: `${firstName.trim()} ${lastName.trim()}`
        });
      }
      Alert.alert(
        'Signup Successful',
        'Your account has been created. Please log in.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (onSignup) onSignup();
              if (navigation) navigation.navigate('Login');
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert('Signup Error', err.message);
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
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>V</Text>
          </View>
          <Text style={styles.logoTitle}>MOFINOW</Text>
        </View>
      </LinearGradient>
      <View style={styles.card}>
        <Text style={styles.welcome}>Create a New Account</Text>
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Email"
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
        <TouchableOpacity style={styles.loginBtn} onPress={handleSignup}>
          <Text style={styles.loginBtnText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>
            Already have an account?
            <Text style={styles.signupLink} onPress={goToLogin}> Login</Text>
          </Text>
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
});
