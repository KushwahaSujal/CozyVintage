import {
  createClient,
  type AuthChangeEvent,
  type Session,
  type SupabaseClient,
  type User,
} from '@supabase/supabase-js';

export interface AuthUserSummary {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

// Retrieve Supabase credentials strictly from Vite environment variables
export function getSupabaseConfig(): { url: string; key: string } {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return { url: url.trim(), key: key.trim() };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key && url.startsWith('http') && !url.includes('your-project'));
}

let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { url, key } = getSupabaseConfig();
  if (url && key && url.startsWith('http')) {
    try {
      cachedClient = createClient(url, key, {
        auth: {
          flowType: 'pkce',
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      return cachedClient;
    } catch {
      return null;
    }
  }
  return null;
}

export const supabase = getSupabase();

// Map OAuth and session errors to safe, user-friendly messages without exposing internals
export function formatAuthError(rawError?: string | null): string {
  const normalized = (rawError || '').toLowerCase();

  if (
    normalized.includes('access_denied') ||
    normalized.includes('cancel') ||
    normalized.includes('denied') ||
    normalized.includes('popup_closed')
  ) {
    return 'Google sign-in was cancelled. You can try again whenever you are ready.';
  }

  if (
    normalized.includes('provider is not enabled') ||
    normalized.includes('unsupported provider') ||
    normalized.includes('invalid_client') ||
    normalized.includes('redirect_uri_mismatch') ||
    normalized.includes('oauth')
  ) {
    return 'Google sign-in is not configured correctly yet. Please check your Google provider settings and try again.';
  }

  if (
    normalized.includes('failed to fetch') ||
    normalized.includes('network') ||
    normalized.includes('offline')
  ) {
    return 'Unable to reach the sign-in service. Please check your internet connection and try again.';
  }

  if (normalized.includes('exchange') || normalized.includes('code verifier') || normalized.includes('pkce')) {
    return 'Your sign-in session expired before completion. Please try signing in with Google again.';
  }

  return 'Google sign-in could not be completed. Please try again.';
}

// Extract normalized user details including user ID for application-wide access
export function extractAuthUser(user: User): AuthUserSummary {
  const meta = user.user_metadata || {};
  const email = user.email || '';
  const displayName =
    (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
    (typeof meta.name === 'string' && meta.name.trim()) ||
    (email ? email.split('@')[0] : 'Explorer');
  const avatarUrl =
    (typeof meta.avatar_url === 'string' && meta.avatar_url) ||
    (typeof meta.picture === 'string' && meta.picture) ||
    undefined;

  return {
    id: user.id,
    email,
    name: displayName,
    avatarUrl,
  };
}

let cachedOAuthCallbackError: string | null = null;
let hasCheckedOAuthCallbackError = false;

// Check URL query/hash for OAuth redirect errors (e.g., user cancelled or misconfigured provider)
export function extractOAuthCallbackError(): string | null {
  if (typeof window === 'undefined') return null;

  if (hasCheckedOAuthCallbackError) {
    return cachedOAuthCallbackError;
  }
  hasCheckedOAuthCallbackError = true;

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  const errorCode = searchParams.get('error') || hashParams.get('error');
  const errorDescription =
    searchParams.get('error_description') || hashParams.get('error_description');

  if (!errorCode && !errorDescription) {
    cachedOAuthCallbackError = null;
    return null;
  }

  // Clean error parameters from URL so refreshes don't replay stale errors
  try {
    window.history.replaceState({}, document.title, window.location.pathname);
  } catch {
    // Ignore history replace failures in restricted environments
  }

  cachedOAuthCallbackError = formatAuthError(`${errorCode || ''} ${errorDescription || ''}`);
  return cachedOAuthCallbackError;
}

// Clean OAuth callback tokens/codes from the address bar after session exchange
export function cleanOAuthUrlParams(): void {
  if (typeof window === 'undefined') return;

  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash;

  const hasOAuthSearch = searchParams.has('code') || searchParams.has('state');
  const hasOAuthHash =
    hash.includes('access_token=') ||
    hash.includes('refresh_token=') ||
    hash.includes('provider_token=');

  if (hasOAuthSearch || hasOAuthHash) {
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch {
      // Ignore history replace failures
    }
  }
}

// Google OAuth Sign-In via Supabase
export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const client = getSupabase();

  if (!client || !isSupabaseConfigured()) {
    return {
      error: 'Sign-in service is not configured properly. Please check your setup and try again.',
    };
  }

  try {
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      return { error: formatAuthError(error.message) };
    }

    return { error: null };
  } catch {
    return {
      error: 'Unable to start Google sign-in. Please check your internet connection and try again.',
    };
  }
}

// Sign Out
export async function signOutUser(): Promise<{ error: string | null }> {
  const client = getSupabase();

  if (typeof window !== 'undefined') {
    localStorage.removeItem('cozy_demo_auth_user');
  }

  if (client && isSupabaseConfigured()) {
    try {
      const { error } = await client.auth.signOut();
      return { error: error ? formatAuthError(error.message) : null };
    } catch {
      return { error: 'Sign-out encountered an issue. Please try again.' };
    }
  }
  return { error: null };
}

// Retrieve Active Session
export async function getActiveSession(): Promise<{
  user: User | null;
  session: Session | null;
  error: string | null;
}> {
  const client = getSupabase();

  if (!client || !isSupabaseConfigured()) {
    return { user: null, session: null, error: null };
  }

  try {
    const { data, error } = await client.auth.getSession();
    if (error) {
      return { user: null, session: null, error: formatAuthError(error.message) };
    }
    return {
      user: data.session?.user ?? null,
      session: data.session ?? null,
      error: null,
    };
  } catch {
    return {
      user: null,
      session: null,
      error: 'Could not restore your previous session. Please sign in with Google.',
    };
  }
}

// Subscribe to Supabase Auth State Changes
export function subscribeToAuthChanges(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): () => void {
  const client = getSupabase();

  if (!client || !isSupabaseConfigured()) {
    return () => {};
  }

  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return () => {
    subscription.unsubscribe();
  };
}
