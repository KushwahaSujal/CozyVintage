import { createClient, type SupabaseClient, type User, type Session } from '@supabase/supabase-js';

// Retrieve keys from environment variables or localStorage overrides
export function getSupabaseConfig(): { url: string; key: string } {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env;
  let url = metaEnv?.VITE_SUPABASE_URL || '';
  let key = metaEnv?.VITE_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('cozy_supabase_url');
    const localKey = localStorage.getItem('cozy_supabase_anon_key');
    if (localUrl) url = localUrl;
    if (localKey) key = localKey;
  }

  return { url: url.trim(), key: key.trim() };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key && url.startsWith('http') && !url.includes('your-project'));
}

export function saveSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cozy_supabase_url', url.trim());
    localStorage.setItem('cozy_supabase_anon_key', key.trim());
    // Force reinitialize
    cachedClient = null;
  }
}

let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { url, key } = getSupabaseConfig();
  if (url && key && url.startsWith('http')) {
    try {
      cachedClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      return cachedClient;
    } catch (e) {
      console.warn('Supabase initialization error:', e);
      return null;
    }
  }
  return null;
}

// Auth Helper Functions
export async function signInWithEmail(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: string | null }> {
  const client = getSupabase();

  if (!client || !isSupabaseConfigured()) {
    // Demo / Offline fallback session until keys are provided
    if (password.length >= 6) {
      const demoUser: User = {
        id: `local_user_${Date.now()}`,
        email,
        app_metadata: {},
        user_metadata: { name: email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem('cozy_demo_auth_user', JSON.stringify(demoUser));
      return { user: demoUser, session: null, error: null };
    }
    return { user: null, session: null, error: 'Password must be at least 6 characters.' };
  }

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  return { user: data.user, session: data.session, error: error ? error.message : null };
}

export async function signUpWithEmail(email: string, password: string, name?: string): Promise<{ user: User | null; session: Session | null; error: string | null }> {
  const client = getSupabase();

  if (!client || !isSupabaseConfigured()) {
    // Demo / Offline fallback session until keys are provided
    if (password.length >= 6) {
      const demoUser: User = {
        id: `local_user_${Date.now()}`,
        email,
        app_metadata: {},
        user_metadata: { name: name || email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem('cozy_demo_auth_user', JSON.stringify(demoUser));
      return { user: demoUser, session: null, error: null };
    }
    return { user: null, session: null, error: 'Password must be at least 6 characters.' };
  }

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split('@')[0],
      },
    },
  });

  return { user: data.user, session: data.session, error: error ? error.message : null };
}

export async function signOutUser(): Promise<{ error: string | null }> {
  const client = getSupabase();
  localStorage.removeItem('cozy_demo_auth_user');

  if (client && isSupabaseConfigured()) {
    const { error } = await client.auth.signOut();
    return { error: error ? error.message : null };
  }
  return { error: null };
}

export async function getActiveSession(): Promise<{ user: User | null }> {
  const client = getSupabase();

  if (client && isSupabaseConfigured()) {
    try {
      const { data } = await client.auth.getSession();
      if (data.session?.user) {
        return { user: data.session.user };
      }
    } catch {
      // Fallback
    }
  }

  // Check demo fallback session
  if (typeof window !== 'undefined') {
    const demo = localStorage.getItem('cozy_demo_auth_user');
    if (demo) {
      try {
        return { user: JSON.parse(demo) };
      } catch {}
    }
  }

  return { user: null };
}
