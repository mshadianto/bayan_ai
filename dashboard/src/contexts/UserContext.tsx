import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'ceo' | 'cfo' | 'hr_manager' | 'legal_counsel' | 'staff';

export interface User {
  name: string;
  role: UserRole;
  roleLabel: string;
  avatar?: string;
}

const ROLE_CONFIG: Record<UserRole, { label: string; name: string }> = {
  ceo: { label: 'General Manager', name: 'Sidiq Haryono' },
  cfo: { label: 'Accountant', name: 'Mujiburahman Yaqub' },
  hr_manager: { label: 'Admin Assistant', name: 'Effat Fuad Minkabau' },
  legal_counsel: { label: 'Operations Manager', name: 'Zoehelmy Husen' },
  staff: { label: 'Data Entry Clerk', name: 'Myar Mahdi Qorut' },
};

// Define which modules each role can access
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ceo: ['finance', 'hcms', 'lcrms'], // Full access
  cfo: ['finance', 'lcrms'], // Finance + Legal/Compliance
  hr_manager: ['hcms'], // HCMS only
  legal_counsel: ['lcrms'], // LCRMS only
  staff: ['hcms'], // Limited HCMS (view own data)
};

interface UserContextType {
  user: User;
  setRole: (role: UserRole) => void;
  canAccess: (module: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('ceo');

  const user: User = {
    name: ROLE_CONFIG[role].name,
    role: role,
    roleLabel: ROLE_CONFIG[role].label,
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const canAccess = (module: string): boolean => {
    return ROLE_PERMISSIONS[role].includes(module);
  };

  return (
    <UserContext.Provider value={{ user, setRole, canAccess }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export { ROLE_CONFIG };
