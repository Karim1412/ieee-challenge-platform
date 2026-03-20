import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const signup = async (email, password, name) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;
    const profile = {
      name,
      email,
      totalPoints: 0,
      achievements: [],
      completedChallenges: [],
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', uid), profile);
    setUserProfile(profile);
    return userCred;
  };

  const login = async (email, password) => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserProfile(userCred.user.uid);
    return userCred;
  };

  const logout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully');
  };

  const refreshProfile = async () => {
    if (user) await fetchUserProfile(user.uid);
  };

  const updateProfile = async (data) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, data);
    setUserProfile(prev => ({ ...prev, ...data }));
  };

  const value = {
    user,
    userProfile,
    loading,
    signup,
    login,
    logout,
    refreshProfile,
    updateProfile,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
