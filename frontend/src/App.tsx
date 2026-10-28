import React, { useState } from 'react';
import { User, Drive, StudentProfile, NotificationSummary } from './types';
import { api } from './services/api';
import { PersonaType } from './components/Sidebar';
import { LoginView } from './components/LoginView';

// Dedicated Standalone Portals per Personality
import { StudentPortal } from './components/portals/StudentPortal';
import { TpoPortal } from './components/portals/TpoPortal';
import { AdminPortal } from './components/portals/AdminPortal';
import { FacultyPortal } from './components/portals/FacultyPortal';
import { RecruiterPortal } from './components/portals/RecruiterPortal';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePersona, setActivePersona] = useState<PersonaType>('student1');

  const [drives, setDrives] = useState<Drive[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [notifications, setNotifications] = useState<NotificationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (scpeIdOrEmail: string, pass: string, roleHint?: string) => {
    setLoading(true);
    setError(null);

    const cleanInput = scpeIdOrEmail.trim();
    const cleanUpper = cleanInput.toUpperCase();
    const isStudent2 = cleanUpper.includes('STU-002') || cleanUpper.includes('NEHA');

    // Resolve target role
    let resolvedRole = roleHint;
    if (!resolvedRole) {
      if (cleanUpper.includes('ADM')) resolvedRole = 'ADMIN';
      else if (cleanUpper.includes('TPO')) resolvedRole = 'TPO';
      else if (cleanUpper.includes('FAC')) resolvedRole = 'FACULTY';
      else if (cleanUpper.includes('REC')) resolvedRole = 'RECRUITER';
      else resolvedRole = 'STUDENT';
    }

    const persona: PersonaType =
      resolvedRole === 'ADMIN'
        ? 'admin'
        : resolvedRole === 'FACULTY'
        ? 'faculty'
        : resolvedRole === 'TPO'
        ? 'tpo'
        : resolvedRole === 'RECRUITER'
        ? 'recruiter'
        : isStudent2
        ? 'student2'
        : 'student1';

    setActivePersona(persona);

    const derivedScpeId = cleanUpper.startsWith('SCPE-')
      ? cleanUpper
      : resolvedRole === 'ADMIN' ? 'SCPE-ADM-001'
      : resolvedRole === 'TPO' ? 'SCPE-TPO-001'
      : resolvedRole === 'FACULTY' ? 'SCPE-FAC-001'
      : resolvedRole === 'RECRUITER' ? 'SCPE-REC-001'
      : isStudent2 ? 'SCPE-STU-002' : 'SCPE-STU-001';

    // Demo credentials dictionary for offline fallback validation
    const DEMO_USERS: Record<string, { role: string; pass: string; email: string }> = {
      'SCPE-STU-001': { role: 'STUDENT', pass: 'Student@123', email: 'student1@scpes.edu' },
      'SCPE-STU-002': { role: 'STUDENT', pass: 'Student@123', email: 'student2@scpes.edu' },
      'SCPE-STU-003': { role: 'STUDENT', pass: 'Student@123', email: 'student3@scpes.edu' },
      'SCPE-ADM-001': { role: 'ADMIN', pass: 'Admin@123', email: 'admin@scpes.edu' },
      'SCPE-TPO-001': { role: 'TPO', pass: 'Tpo@123', email: 'tpo@scpes.edu' },
      'SCPE-FAC-001': { role: 'FACULTY', pass: 'Faculty@123', email: 'faculty@scpes.edu' },
      'SCPE-REC-001': { role: 'RECRUITER', pass: 'Recruiter@123', email: 'recruiter@google.com' },
    };

    try {
      const authRes = await api.login(cleanInput, pass);
      const role = authRes?.role || resolvedRole;
      const user: User = {
        id: authRes?.userId || cleanInput,
        scpeId: authRes?.scpeId || derivedScpeId,
        userCode: authRes?.userCode || cleanInput,
        email: authRes?.email || (cleanInput.includes('@') ? cleanInput : `${cleanInput.toLowerCase()}@scpes.edu`),
        role,
      };
      setCurrentUser(user);

      // Fetch live data from backend microservices
      try {
        const fetchedDrives = await api.getDrives();
        setDrives(fetchedDrives);
      } catch (e: any) {
        console.warn('[App] Failed to load drives from backend:', e?.response?.data || e.message);
      }

      if (role === 'STUDENT') {
        try {
          const p = await api.getMyProfile();
          setProfile(p);
        } catch (e: any) {
          console.warn('[App] Failed to load student profile from backend:', e?.response?.data || e.message);
        }
      }

      try {
        const notifs = await api.getNotifications();
        setNotifications(notifs);
      } catch (e: any) {
        console.warn('[App] Failed to load notifications from backend:', e?.response?.data || e.message);
      }
    } catch (err: any) {
      console.error('[App:login] Authentication request failed:', {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: err.message,
      });

      // If backend responded with an HTTP error (400, 401, 403, etc.)
      if (err?.response) {
        const reason = err.response?.data?.message || err.response?.data?.error || `Authentication failed (HTTP ${err.response.status})`;
        if (err.response.status === 401 || err.response.status === 400 || err.response.status === 403) {
          setError(reason);
          setLoading(false);
          return;
        }
      }

      // Check offline demo credentials + user customized reset password
      const demoAccount = DEMO_USERS[derivedScpeId];
      const accountEmail = (demoAccount?.email || (cleanInput.includes('@') ? cleanInput : '')).toLowerCase();
      const customResetPwd = accountEmail ? localStorage.getItem(`scpes_mock_pwd_${accountEmail}`) : null;
      const expectedPwd = customResetPwd || demoAccount?.pass;

      if (expectedPwd && expectedPwd !== pass.trim()) {
        setError(`Invalid password for ${derivedScpeId}. Please check credentials.`);
        setLoading(false);
        return;
      }

      if (demoAccount) {
        console.info('[App] Operating in demo fallback mode for:', derivedScpeId);
        setCurrentUser({
          id: cleanInput,
          scpeId: derivedScpeId,
          userCode: cleanInput,
          email: demoAccount?.email || (cleanInput.includes('@') ? cleanInput : `${cleanInput.toLowerCase()}@scpes.edu`),
          role: demoAccount?.role || resolvedRole,
        });
      } else {
        setError(err?.response?.data?.message || err?.message || 'Login failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setError(null);
  };

  const refreshAll = async () => {
    if (currentUser) {
      try {
        const fetchedDrives = await api.getDrives();
        setDrives(fetchedDrives);
      } catch (e: any) {
        console.warn('[App:refreshAll] Failed to refresh drives from backend:', e?.response?.data || e.message);
      }
    }
  };

  // If not logged in, render the Multi-Role Dedicated Login Views
  if (!currentUser) {
    return (
      <LoginView
        onLogin={handleLogin}
        loading={loading}
        error={error}
      />
    );
  }

  // 1. STUDENT DEDICATED DASHBOARD (Restricted Mode: Zero Authority Privileges)
  if (currentUser.role === 'STUDENT') {
    return (
      <StudentPortal
        currentUser={currentUser}
        profile={profile}
        drives={drives}
        notifications={notifications}
        initialVariant={activePersona === 'student2' ? 'student2' : 'student1'}
        onLogout={handleLogout}
        onRefreshDrives={refreshAll}
      />
    );
  }

  // 2. TPO CENTRAL PLACEMENT OFFICER DEDICATED DASHBOARD
  if (currentUser.role === 'TPO') {
    return (
      <TpoPortal
        currentUser={currentUser}
        drives={drives}
        notifications={notifications}
        onLogout={handleLogout}
        onRefreshDrives={refreshAll}
      />
    );
  }

  // 3. SUPER ADMIN CONTROL CENTER DEDICATED DASHBOARD
  if (currentUser.role === 'ADMIN') {
    return (
      <AdminPortal
        currentUser={currentUser}
        drives={drives}
        notifications={notifications}
        onLogout={handleLogout}
        onRefreshDrives={refreshAll}
      />
    );
  }

  // 4. FACULTY COORDINATOR DEDICATED DASHBOARD
  if (currentUser.role === 'FACULTY') {
    return (
      <FacultyPortal
        currentUser={currentUser}
        drives={drives}
        notifications={notifications}
        onLogout={handleLogout}
        onRefreshDrives={refreshAll}
      />
    );
  }

  // 5. CORPORATE RECRUITER DEDICATED DASHBOARD
  if (currentUser.role === 'RECRUITER') {
    return (
      <RecruiterPortal
        currentUser={currentUser}
        drives={drives}
        notifications={notifications}
        onLogout={handleLogout}
        onRefreshDrives={refreshAll}
      />
    );
  }

  // Fallback
  return (
    <LoginView
      onLogin={handleLogin}
      loading={loading}
      error={error}
    />
  );
}

export default App;
