import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth`, {
      credentials: 'include',
    });
    const data = await response.json();
    return { user: data.user, error: data.error };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error: 'Failed to get current user' };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ action: 'signin', email, password }),
    });
    return response.json();
  } catch (error) {
    console.error('Error signing in:', error);
    return { user: null, error: 'Failed to sign in' };
  }
}

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ action: 'signup', email, password }),
    });
    return response.json();
  } catch (error) {
    console.error('Error signing up:', error);
    return { user: null, error: 'Failed to sign up' };
  }
}

export async function signOut(): Promise<void> {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ action: 'signout' }),
    });
  } catch (error) {
    console.error('Error signing out:', error);
  }
} 