
import { createClient } from '@supabase/supabase-js';
import { UserProfile, UserRole, Investment, Order, Transaction } from '../types';

// --- CONFIGURATION ---
// Helper to safely access env vars with fallback
const getEnv = (key: string, fallback: string) => {
  try {
    // @ts-ignore
    return (import.meta.env && import.meta.env[key]) ? import.meta.env[key] : fallback;
  } catch (e) {
    return fallback;
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'https://eksjajpcbiuvxcqnxxlx.supabase.co');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrc2phanBjYml1dnhjcW54eGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NDU1MDAsImV4cCI6MjA3OTUyMTUwMH0.tL08QW3dWc03CRISX52F9c_wpRJinbLkDA-YgyMJSrU');

// Check if we have valid keys to run in "Real Mode"
const isRealMode = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined';

// --- REAL SUPABASE CLIENT ---
const realSupabase = isRealMode 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// --- MOCK STORAGE KEYS ---
const SESSION_KEY = 'propertydex-session';
const DB_PROFILES_KEY = 'propertydex-db-profiles';
const DB_ROLES_KEY = 'propertydex-db-roles';
const DB_INVESTMENTS_KEY = 'propertydex-db-investments';
const DB_ORDERS_KEY = 'propertydex-db-orders';
const DB_TRANSACTIONS_KEY = 'propertydex-db-transactions';

// Helper to get DB from local storage (Mock Mode)
const getDb = () => {
  const profilesStr = localStorage.getItem(DB_PROFILES_KEY);
  const rolesStr = localStorage.getItem(DB_ROLES_KEY);
  const investmentsStr = localStorage.getItem(DB_INVESTMENTS_KEY);
  const ordersStr = localStorage.getItem(DB_ORDERS_KEY);
  const transactionsStr = localStorage.getItem(DB_TRANSACTIONS_KEY);

  return {
    profiles: profilesStr ? JSON.parse(profilesStr) as UserProfile[] : [],
    roles: rolesStr ? JSON.parse(rolesStr) as UserRole[] : [],
    investments: investmentsStr ? JSON.parse(investmentsStr) as Investment[] : [],
    orders: ordersStr ? JSON.parse(ordersStr) as Order[] : [],
    transactions: transactionsStr ? JSON.parse(transactionsStr) as Transaction[] : [],
  };
};

// Helper to save DB (Mock Mode)
const saveDb = (
    profiles: UserProfile[], 
    roles: UserRole[], 
    investments: Investment[] = [],
    orders: Order[] = [],
    transactions: Transaction[] = []
) => {
  localStorage.setItem(DB_PROFILES_KEY, JSON.stringify(profiles));
  localStorage.setItem(DB_ROLES_KEY, JSON.stringify(roles));
  if (investments.length > 0) localStorage.setItem(DB_INVESTMENTS_KEY, JSON.stringify(investments));
  if (orders.length > 0) localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(orders));
  if (transactions.length > 0) localStorage.setItem(DB_TRANSACTIONS_KEY, JSON.stringify(transactions));
};

// --- EXPORTED CLIENT ---
export const supabase: any = isRealMode && realSupabase ? realSupabase : {
  auth: {
    getSession: async () => {
      try {
        const sessionStr = localStorage.getItem(SESSION_KEY);
        const session = sessionStr ? JSON.parse(sessionStr) : null;
        return { data: { session }, error: null };
      } catch (e) {
        return { data: { session: null }, error: null };
      }
    },
    
    signInWithPassword: async ({ email, password }: { email: string; password?: string }) => {
      const db = getDb();
      const userProfile = db.profiles.find(p => p.email === email);

      if (!userProfile) {
         // Fallback for "demo" users not in DB yet
         const session = {
            user: { email, id: 'demo-user-' + Math.random().toString(36).substr(2,9), aud: 'authenticated' },
            access_token: 'mock-token-' + Math.random().toString(36),
            expires_at: Math.floor(Date.now() / 1000) + 3600
         };
         localStorage.setItem(SESSION_KEY, JSON.stringify(session));
         window.dispatchEvent(new Event('storage'));
         return { data: { session }, error: null };
      }

      const session = {
        user: { 
            email: userProfile.email, 
            id: userProfile.id, 
            user_metadata: { full_name: userProfile.full_name },
            aud: 'authenticated' 
        },
        access_token: 'mock-token-' + Math.random().toString(36),
        expires_at: Math.floor(Date.now() / 1000) + 3600
      };
      
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event('storage'));
      
      return { data: { session }, error: null };
    },

    signUp: async ({ email, password, options }: { email: string; password?: string, options?: { data: any } }) => {
      const db = getDb();
      
      if (db.profiles.find(p => p.email === email)) {
          return { data: { session: null }, error: { message: "User already exists" } };
      }

      const newUserId = 'user-' + Math.random().toString(36).substr(2, 9);
      const now = new Date().toISOString();

      const newProfile: UserProfile = {
          id: newUserId,
          email: email,
          full_name: options?.data?.full_name || '',
          country: options?.data?.country || '',
          kyc_verified: false,
          avatar_url: options?.data?.avatar_url || '',
          created_at: now,
          updated_at: now
      };

      const newRole: UserRole = {
          user_id: newUserId,
          role: 'user',
          kyc_status: 'pending',
          accreditation_status: 'none',
          updated_at: now
      };

      db.profiles.push(newProfile);
      db.roles.push(newRole);
      saveDb(db.profiles, db.roles, db.investments, db.orders, db.transactions);

      const session = {
        user: { 
            email, 
            id: newUserId, 
            user_metadata: options?.data,
            aud: 'authenticated' 
        },
        access_token: 'mock-token-' + Math.random().toString(36),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event('storage'));

      return { data: { session }, error: null };
    },

    signOut: async () => {
      localStorage.removeItem(SESSION_KEY);
      window.dispatchEvent(new Event('storage'));
      return { error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      if (sessionStr) {
        callback('SIGNED_IN', JSON.parse(sessionStr));
      }

      const storageHandler = () => {
         const s = localStorage.getItem(SESSION_KEY);
         if (s) callback('SIGNED_IN', JSON.parse(s));
         else callback('SIGNED_OUT', null);
      };
      
      window.addEventListener('storage', storageHandler);

      return { 
        data: { 
          subscription: { 
            unsubscribe: () => window.removeEventListener('storage', storageHandler) 
          } 
        } 
      };
    }
  },
  from: (table: string) => {
      return {
          select: async (query?: string) => {
              const db = getDb();
              if (table === 'profiles') return { data: db.profiles, error: null };
              if (table === 'user_roles') return { data: db.roles, error: null };
              if (table === 'investments') return { data: db.investments, error: null };
              if (table === 'orders') return { data: db.orders, error: null };
              if (table === 'transactions') return { data: db.transactions, error: null };
              return { data: [], error: null };
          },
          insert: async (data: any) => {
              const db = getDb();
              let inserted: any = null;
              const inputData = Array.isArray(data) ? data[0] : data;
              
              if (table === 'orders') {
                  inserted = { 
                      ...inputData, 
                      id: 'ord-' + Math.random().toString(36).substr(2,9), 
                      created_at: new Date().toISOString() 
                  };
                  db.orders.push(inserted);
                  
                  // Mock Order Matching Logic for Instant Execution
                  if (inserted.tx_type === 'buy') {
                      // Create/Update Investment
                      const existingInvIndex = db.investments.findIndex(i => i.user_id === inserted.user_id && i.property_id === inserted.property_id);
                      
                      if (existingInvIndex >= 0) {
                          const existing = db.investments[existingInvIndex];
                          const totalTokens = existing.tokens_owned + inserted.tokens;
                          const totalCost = (existing.investment_amount * 100) + inserted.gross_amount_cents; // roughly
                          // Update
                          db.investments[existingInvIndex] = {
                              ...existing,
                              tokens_owned: totalTokens,
                              investment_amount: existing.investment_amount + (inserted.gross_amount_cents / 100)
                          };
                      } else {
                          db.investments.push({
                              id: 'inv-' + Math.random().toString(36).substr(2,9),
                              user_id: inserted.user_id,
                              property_id: inserted.property_id,
                              tokens_owned: inserted.tokens,
                              investment_amount: inserted.gross_amount_cents / 100,
                              avg_purchase_price: inserted.unit_price_cents / 100,
                              purchase_date: new Date().toISOString()
                          });
                      }
                  } else if (inserted.tx_type === 'sell') {
                      // Reduce Investment
                      const existingInvIndex = db.investments.findIndex(i => i.user_id === inserted.user_id && i.property_id === inserted.property_id);
                      if (existingInvIndex >= 0) {
                          const existing = db.investments[existingInvIndex];
                          const newTotal = existing.tokens_owned - inserted.tokens;
                          if (newTotal <= 0) {
                              db.investments.splice(existingInvIndex, 1);
                          } else {
                              db.investments[existingInvIndex] = { ...existing, tokens_owned: newTotal };
                          }
                      }
                  }

                  saveDb(db.profiles, db.roles, db.investments, db.orders, db.transactions);
              }
              
              return { data: [inserted], error: null };
          }
      }
  }
};
