// Generated from Supabase project vlkkokjbtmdeoxewsbiy after IAM-2.3 migrations.
export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.15" };
  public: {
    Tables: {
      identities: {
        Row: { id: string; email: string; created_at: string; updated_at: string };
        Insert: { id: string; email: string; created_at?: string; updated_at?: string };
        Update: { id?: string; email?: string; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      organizations: {
        Row: { id: string; name: string; created_at: string };
        Insert: { id?: string; name: string; created_at?: string };
        Update: { id?: string; name?: string; created_at?: string };
        Relationships: [];
      };
      memberships: {
        Row: { id: string; identity_id: string; organization_id: string; role: "owner" | "member"; status: "active" | "revoked"; created_at: string; updated_at: string };
        Insert: { id?: string; identity_id: string; organization_id: string; role: "owner" | "member"; status?: "active" | "revoked"; created_at?: string; updated_at?: string };
        Update: { id?: string; identity_id?: string; organization_id?: string; role?: "owner" | "member"; status?: "active" | "revoked"; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      invitations: {
        Row: { id: string; organization_id: string; email: string; role: "owner" | "member"; status: "pending" | "accepted" | "revoked" | "expired"; invited_by: string; expires_at: string; created_at: string; accepted_at: string | null };
        Insert: { id?: string; organization_id: string; email: string; role?: "owner" | "member"; status?: "pending" | "accepted" | "revoked" | "expired"; invited_by: string; expires_at?: string; created_at?: string; accepted_at?: string | null };
        Update: { id?: string; organization_id?: string; email?: string; role?: "owner" | "member"; status?: "pending" | "accepted" | "revoked" | "expired"; invited_by?: string; expires_at?: string; created_at?: string; accepted_at?: string | null };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      invitation_status: "pending" | "accepted" | "revoked" | "expired";
      membership_role: "owner" | "member";
      membership_status: "active" | "revoked";
    };
    CompositeTypes: { [_ in never]: never };
  };
};
