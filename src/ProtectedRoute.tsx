import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./api/supabaseClient";


export default function ProtectedRoute({ children }: any) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!session) {
    return <Navigate to="/login-admin" replace />;
  }

  return children;
}