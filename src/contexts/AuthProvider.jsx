import React, { createContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup, // Added for Google Sign-In
    GoogleAuthProvider, // Added for Google Sign-In
    signOut,
    updateProfile
} from "firebase/auth";
import { auth } from '../firebase/firebase.config'; // Import the initialized auth instance

export const AuthContext = createContext(null);

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // State to track initial loading

    // Firebase Auth methods (wrap them to manage loading state)
    const createUser = useCallback((email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }, []); // auth and setLoading are stable

    // Renamed to signInUser to match usage in LoginPage and previous instructions
    const signInUser = useCallback((email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }, []); // auth and setLoading are stable

    const signInWithGoogle = useCallback(() => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }, []); // auth, googleProvider, and setLoading are stable

    const logOut = useCallback(() => {
        setLoading(true);
        return signOut(auth);
    }, []); // auth and setLoading are stable

    const updateUserProfile = useCallback((name, photo) => {
        // Note: updateProfile updates the current user's profile
        // Ensure auth.currentUser exists before calling updateProfile if there's any doubt
        if (auth.currentUser) {
            return updateProfile(auth.currentUser, {
                displayName: name, photoURL: photo
            });
        }
        return Promise.reject(new Error("No user currently signed in to update profile."));
    }, []); // auth is stable, auth.currentUser is accessed internally

    // Effect to listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            console.log('Current user in AuthProvider:', currentUser); // Log for debugging
            setLoading(false); // Set loading to false once auth state is determined
        });
        return () => unsubscribe(); // Cleanup subscription on component unmount
    }, []); // Empty dependency array means this runs once on mount

    // Auth information to be provided via context
    const authInfo = useMemo(() => ({
        user,
        loading,
        createUser,
        signInUser,
        signInWithGoogle,
        logOut,
        updateUserProfile
    }), [user, loading, createUser, signInUser, signInWithGoogle, logOut, updateUserProfile]);

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
