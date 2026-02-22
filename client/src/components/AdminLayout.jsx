import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminLayout() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div className="admin-loading">Caricamento in corso...</div>;
    }

    // If we are not on the login page and don't have a session, redirect
    if (!session && window.location.pathname !== '/admin/login') {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="admin-layout">
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}
