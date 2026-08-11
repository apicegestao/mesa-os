export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      cycles: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string
          created_by: string
          ends_on: string
          id: string
          methodology_revision_id: string
          methodology_stage_id: string | null
          organization_id: string
          priority_id: string
          sequence_number: number
          starts_on: string
          status: string
          title: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          created_by: string
          ends_on: string
          id?: string
          methodology_revision_id: string
          methodology_stage_id?: string | null
          organization_id: string
          priority_id: string
          sequence_number: number
          starts_on?: string
          status?: string
          title: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          created_by?: string
          ends_on?: string
          id?: string
          methodology_revision_id?: string
          methodology_stage_id?: string | null
          organization_id?: string
          priority_id?: string
          sequence_number?: number
          starts_on?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cycles_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cycles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cycles_methodology_revision_id_fkey"
            columns: ["methodology_revision_id"]
            isOneToOne: false
            referencedRelation: "methodology_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cycles_methodology_stage_revision_fkey"
            columns: ["methodology_stage_id", "methodology_revision_id"]
            isOneToOne: false
            referencedRelation: "methodology_stages"
            referencedColumns: ["id", "revision_id"]
          },
          {
            foreignKeyName: "cycles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cycles_priority_id_fkey"
            columns: ["priority_id"]
            isOneToOne: true
            referencedRelation: "priorities"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_events: {
        Row: { actor_identity_id: string; capability_code: string; created_at: string; estimated_cost_usd_micros: number; id: string; input_tokens: number; model_route_code: string; organization_id: string; output_tokens: number; resolution: Database["public"]["Enums"]["ai_usage_resolution"] }
        Insert: { actor_identity_id: string; capability_code: string; created_at?: string; estimated_cost_usd_micros?: number; id?: string; input_tokens?: number; model_route_code: string; organization_id: string; output_tokens?: number; resolution: Database["public"]["Enums"]["ai_usage_resolution"] }
        Update: { actor_identity_id?: string; capability_code?: string; created_at?: string; estimated_cost_usd_micros?: number; id?: string; input_tokens?: number; model_route_code?: string; organization_id?: string; output_tokens?: number; resolution?: Database["public"]["Enums"]["ai_usage_resolution"] }
        Relationships: []
      }
      development_outcomes: {
        Row: {
          code: string
          created_at: string
          id: string
          pillar_id: string
          position: number
          revision_id: string
          stage_id: string
          title: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          pillar_id: string
          position: number
          revision_id: string
          stage_id: string
          title: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          pillar_id?: string
          position?: number
          revision_id?: string
          stage_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "development_outcomes_pillar_id_revision_id_fkey"
            columns: ["pillar_id", "revision_id"]
            isOneToOne: false
            referencedRelation: "methodology_pillars"
            referencedColumns: ["id", "revision_id"]
          },
          {
            foreignKeyName: "development_outcomes_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "methodology_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "development_outcomes_stage_id_revision_id_fkey"
            columns: ["stage_id", "revision_id"]
            isOneToOne: false
            referencedRelation: "methodology_stages"
            referencedColumns: ["id", "revision_id"]
          },
        ]
      }
      diagnostic_definitions: {
        Row: {
          code: string
          created_at: string
          description: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          id: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      diagnostic_dimensions: {
        Row: {
          code: string
          id: string
          label: string
          position: number
          revision_id: string
        }
        Insert: {
          code: string
          id: string
          label: string
          position: number
          revision_id: string
        }
        Update: {
          code?: string
          id?: string
          label?: string
          position?: number
          revision_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_dimensions_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_revisions"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_executions: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          cycle_id: string | null
          effective_on: string
          episode_sequence: number
          episode_type: string
          id: string
          ime_score: number | null
          organization_id: string
          period_code: string
          result_snapshot: Json | null
          revision_id: string
          stage_code: string | null
          stage_label: string | null
          started_at: string
          started_by: string
          status: Database["public"]["Enums"]["diagnostic_execution_status"]
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          cycle_id?: string | null
          effective_on: string
          episode_sequence: number
          episode_type: string
          id?: string
          ime_score?: number | null
          organization_id: string
          period_code: string
          result_snapshot?: Json | null
          revision_id: string
          stage_code?: string | null
          stage_label?: string | null
          started_at?: string
          started_by: string
          status?: Database["public"]["Enums"]["diagnostic_execution_status"]
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          cycle_id?: string | null
          effective_on?: string
          episode_sequence?: number
          episode_type?: string
          id?: string
          ime_score?: number | null
          organization_id?: string
          period_code?: string
          result_snapshot?: Json | null
          revision_id?: string
          stage_code?: string | null
          stage_label?: string | null
          started_at?: string
          started_by?: string
          status?: Database["public"]["Enums"]["diagnostic_execution_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_executions_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_executions_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_executions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_executions_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_executions_started_by_fkey"
            columns: ["started_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_options: {
        Row: {
          id: string
          label: string
          position: number
          revision_id: string
          value: number
        }
        Insert: {
          id: string
          label: string
          position: number
          revision_id: string
          value: number
        }
        Update: {
          id?: string
          label?: string
          position?: number
          revision_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_options_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_revisions"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_questions: {
        Row: {
          code: string
          dimension_id: string
          id: string
          position: number
          prompt: string
          required: boolean
          revision_id: string
        }
        Insert: {
          code: string
          dimension_id: string
          id: string
          position: number
          prompt: string
          required?: boolean
          revision_id: string
        }
        Update: {
          code?: string
          dimension_id?: string
          id?: string
          position?: number
          prompt?: string
          required?: boolean
          revision_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_questions_dimension_id_revision_id_fkey"
            columns: ["dimension_id", "revision_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_dimensions"
            referencedColumns: ["id", "revision_id"]
          },
          {
            foreignKeyName: "diagnostic_questions_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_revisions"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_responses: {
        Row: {
          answered_by: string
          execution_id: string
          question_id: string
          updated_at: string
          value: number
        }
        Insert: {
          answered_by: string
          execution_id: string
          question_id: string
          updated_at?: string
          value: number
        }
        Update: {
          answered_by?: string
          execution_id?: string
          question_id?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_responses_answered_by_fkey"
            columns: ["answered_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_responses_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_revisions: {
        Row: {
          created_at: string
          definition_id: string
          id: string
          period_code: string
          published_at: string | null
          status: Database["public"]["Enums"]["diagnostic_revision_status"]
          version: number
        }
        Insert: {
          created_at?: string
          definition_id: string
          id: string
          period_code: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["diagnostic_revision_status"]
          version: number
        }
        Update: {
          created_at?: string
          definition_id?: string
          id?: string
          period_code?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["diagnostic_revision_status"]
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_revisions_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_reviews: {
        Row: {
          confidence: number | null
          created_at: string
          escalation_reason: string | null
          evidence_id: string
          id: string
          model_reference: string | null
          organization_id: string
          outcome: string
          policy_code: string
          rationale: string
          review_sequence: number
          reviewer_identity_id: string | null
          reviewer_kind: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          escalation_reason?: string | null
          evidence_id: string
          id?: string
          model_reference?: string | null
          organization_id: string
          outcome: string
          policy_code: string
          rationale: string
          review_sequence: number
          reviewer_identity_id?: string | null
          reviewer_kind: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          escalation_reason?: string | null
          evidence_id?: string
          id?: string
          model_reference?: string | null
          organization_id?: string
          outcome?: string
          policy_code?: string
          rationale?: string
          review_sequence?: number
          reviewer_identity_id?: string | null
          reviewer_kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_reviews_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "current_evidence_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_reviews_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "mission_evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_reviews_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_reviews_reviewer_identity_id_fkey"
            columns: ["reviewer_identity_id"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
        ]
      }
      identities: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          organization_id: string
          role: Database["public"]["Enums"]["membership_role"]
          status: Database["public"]["Enums"]["invitation_status"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          organization_id: string
          role?: Database["public"]["Enums"]["membership_role"]
          status?: Database["public"]["Enums"]["invitation_status"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["membership_role"]
          status?: Database["public"]["Enums"]["invitation_status"]
        }
        Relationships: [
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          id: string
          identity_id: string
          organization_id: string
          role: Database["public"]["Enums"]["membership_role"]
          status: Database["public"]["Enums"]["membership_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          identity_id: string
          organization_id: string
          role: Database["public"]["Enums"]["membership_role"]
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          identity_id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["membership_role"]
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_identity_id_fkey"
            columns: ["identity_id"]
            isOneToOne: true
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      methodology_definitions: {
        Row: {
          code: string
          created_at: string
          description: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      methodology_pillars: {
        Row: {
          code: string
          color_token: string
          id: string
          label: string
          position: number
          revision_id: string
        }
        Insert: {
          code: string
          color_token: string
          id?: string
          label: string
          position: number
          revision_id: string
        }
        Update: {
          code?: string
          color_token?: string
          id?: string
          label?: string
          position?: number
          revision_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "methodology_pillars_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "methodology_revisions"
            referencedColumns: ["id"]
          },
        ]
      }
      methodology_revisions: {
        Row: {
          created_at: string
          definition_id: string
          id: string
          published_at: string | null
          status: string
          version: number
        }
        Insert: {
          created_at?: string
          definition_id: string
          id?: string
          published_at?: string | null
          status?: string
          version: number
        }
        Update: {
          created_at?: string
          definition_id?: string
          id?: string
          published_at?: string | null
          status?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "methodology_revisions_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "methodology_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      methodology_stages: {
        Row: {
          code: string
          id: string
          label: string
          position: number
          recommended_days: number
          revision_id: string
        }
        Insert: {
          code: string
          id?: string
          label: string
          position: number
          recommended_days?: number
          revision_id: string
        }
        Update: {
          code?: string
          id?: string
          label?: string
          position?: number
          recommended_days?: number
          revision_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "methodology_stages_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "methodology_revisions"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_definitions: {
        Row: {
          aggregation: string
          code: string
          created_at: string
          description: string
          desired_direction: string
          id: string
          maximum_value: number | null
          methodology_revision_id: string
          minimum_value: number | null
          name: string
          outcome_id: string | null
          pillar_id: string | null
          published_at: string | null
          status: string
          unit_code: string
          value_kind: string
          version: number
        }
        Insert: {
          aggregation: string
          code: string
          created_at?: string
          description: string
          desired_direction: string
          id?: string
          maximum_value?: number | null
          methodology_revision_id: string
          minimum_value?: number | null
          name: string
          outcome_id?: string | null
          pillar_id?: string | null
          published_at?: string | null
          status: string
          unit_code: string
          value_kind: string
          version: number
        }
        Update: {
          aggregation?: string
          code?: string
          created_at?: string
          description?: string
          desired_direction?: string
          id?: string
          maximum_value?: number | null
          methodology_revision_id?: string
          minimum_value?: number | null
          name?: string
          outcome_id?: string | null
          pillar_id?: string | null
          published_at?: string | null
          status?: string
          unit_code?: string
          value_kind?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "metric_definitions_methodology_revision_id_fkey"
            columns: ["methodology_revision_id"]
            isOneToOne: false
            referencedRelation: "methodology_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_definitions_outcome_id_methodology_revision_id_fkey"
            columns: ["outcome_id", "methodology_revision_id"]
            isOneToOne: false
            referencedRelation: "development_outcomes"
            referencedColumns: ["id", "revision_id"]
          },
          {
            foreignKeyName: "metric_definitions_pillar_id_methodology_revision_id_fkey"
            columns: ["pillar_id", "methodology_revision_id"]
            isOneToOne: false
            referencedRelation: "methodology_pillars"
            referencedColumns: ["id", "revision_id"]
          },
        ]
      }
      metric_observations: {
        Row: {
          boolean_value: boolean | null
          confidence: number
          created_at: string
          cycle_id: string | null
          definition_id: string
          diagnostic_execution_id: string | null
          effective_on: string
          id: string
          idempotency_key: string
          json_value: Json | null
          mission_evidence_id: string | null
          numeric_value: number | null
          observed_at: string
          organization_id: string
          provenance: string
          recorded_by: string
          source_reference: string | null
          source_type: string
          text_value: string | null
          tool_instance_id: string | null
          validation_status: string
        }
        Insert: {
          boolean_value?: boolean | null
          confidence: number
          created_at?: string
          cycle_id?: string | null
          definition_id: string
          diagnostic_execution_id?: string | null
          effective_on: string
          id?: string
          idempotency_key: string
          json_value?: Json | null
          mission_evidence_id?: string | null
          numeric_value?: number | null
          observed_at?: string
          organization_id: string
          provenance: string
          recorded_by: string
          source_reference?: string | null
          source_type: string
          text_value?: string | null
          tool_instance_id?: string | null
          validation_status: string
        }
        Update: {
          boolean_value?: boolean | null
          confidence?: number
          created_at?: string
          cycle_id?: string | null
          definition_id?: string
          diagnostic_execution_id?: string | null
          effective_on?: string
          id?: string
          idempotency_key?: string
          json_value?: Json | null
          mission_evidence_id?: string | null
          numeric_value?: number | null
          observed_at?: string
          organization_id?: string
          provenance?: string
          recorded_by?: string
          source_reference?: string | null
          source_type?: string
          text_value?: string | null
          tool_instance_id?: string | null
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "metric_observations_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_observations_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "metric_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_observations_diagnostic_execution_id_fkey"
            columns: ["diagnostic_execution_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_observations_mission_evidence_id_fkey"
            columns: ["mission_evidence_id"]
            isOneToOne: false
            referencedRelation: "current_evidence_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_observations_mission_evidence_id_fkey"
            columns: ["mission_evidence_id"]
            isOneToOne: false
            referencedRelation: "mission_evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_observations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_observations_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_observations_tool_instance_id_fkey"
            columns: ["tool_instance_id"]
            isOneToOne: false
            referencedRelation: "tool_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_targets: {
        Row: {
          boolean_value: boolean | null
          created_at: string
          cycle_id: string | null
          definition_id: string
          effective_from: string
          effective_until: string | null
          id: string
          json_value: Json | null
          numeric_value: number | null
          organization_id: string
          retired_at: string | null
          set_by: string
          status: string
          text_value: string | null
        }
        Insert: {
          boolean_value?: boolean | null
          created_at?: string
          cycle_id?: string | null
          definition_id: string
          effective_from: string
          effective_until?: string | null
          id?: string
          json_value?: Json | null
          numeric_value?: number | null
          organization_id: string
          retired_at?: string | null
          set_by: string
          status: string
          text_value?: string | null
        }
        Update: {
          boolean_value?: boolean | null
          created_at?: string
          cycle_id?: string | null
          definition_id?: string
          effective_from?: string
          effective_until?: string | null
          id?: string
          json_value?: Json | null
          numeric_value?: number | null
          organization_id?: string
          retired_at?: string | null
          set_by?: string
          status?: string
          text_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metric_targets_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_targets_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "metric_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_targets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_targets_set_by_fkey"
            columns: ["set_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_definition_revisions: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          status: string
          version: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          status: string
          version: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          status?: string
          version?: number
        }
        Relationships: []
      }
      mission_definitions: {
        Row: {
          dimension_code: string
          id: string
          objective: string
          position: number
          rationale: string
          revision_id: string
          title: string
        }
        Insert: {
          dimension_code: string
          id?: string
          objective: string
          position: number
          rationale: string
          revision_id: string
          title: string
        }
        Update: {
          dimension_code?: string
          id?: string
          objective?: string
          position?: number
          rationale?: string
          revision_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_definitions_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "mission_definition_revisions"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_evidence: {
        Row: {
          description: string
          evidence_type: string
          id: string
          implementation_id: string
          mission_id: string
          occurred_on: string
          organization_id: string
          revision_number: number
          root_evidence_id: string
          submitted_at: string
          submitted_by: string
          supersedes_evidence_id: string | null
        }
        Insert: {
          description: string
          evidence_type: string
          id?: string
          implementation_id: string
          mission_id: string
          occurred_on: string
          organization_id: string
          revision_number: number
          root_evidence_id: string
          submitted_at?: string
          submitted_by: string
          supersedes_evidence_id?: string | null
        }
        Update: {
          description?: string
          evidence_type?: string
          id?: string
          implementation_id?: string
          mission_id?: string
          occurred_on?: string
          organization_id?: string
          revision_number?: number
          root_evidence_id?: string
          submitted_at?: string
          submitted_by?: string
          supersedes_evidence_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mission_evidence_implementation_id_fkey"
            columns: ["implementation_id"]
            isOneToOne: false
            referencedRelation: "mission_implementations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_evidence_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_evidence_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_evidence_root_fkey"
            columns: ["root_evidence_id"]
            isOneToOne: false
            referencedRelation: "current_evidence_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_evidence_root_fkey"
            columns: ["root_evidence_id"]
            isOneToOne: false
            referencedRelation: "mission_evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_evidence_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_evidence_supersedes_evidence_id_fkey"
            columns: ["supersedes_evidence_id"]
            isOneToOne: false
            referencedRelation: "current_evidence_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_evidence_supersedes_evidence_id_fkey"
            columns: ["supersedes_evidence_id"]
            isOneToOne: false
            referencedRelation: "mission_evidence"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_implementations: {
        Row: {
          confirmed_at: string | null
          created_at: string
          created_by: string
          id: string
          implemented_on: string
          mission_id: string
          organization_id: string
          status: string
          summary: string
          tool_instance_id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string
          created_by: string
          id?: string
          implemented_on: string
          mission_id: string
          organization_id: string
          status: string
          summary: string
          tool_instance_id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string
          created_by?: string
          id?: string
          implemented_on?: string
          mission_id?: string
          organization_id?: string
          status?: string
          summary?: string
          tool_instance_id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_implementations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_implementations_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: true
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_implementations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_implementations_tool_instance_id_fkey"
            columns: ["tool_instance_id"]
            isOneToOne: true
            referencedRelation: "tool_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_implementations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_tool_bindings: {
        Row: {
          created_at: string
          id: string
          mission_definition_id: string
          tool_revision_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mission_definition_id: string
          tool_revision_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mission_definition_id?: string
          tool_revision_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_tool_bindings_mission_definition_id_fkey"
            columns: ["mission_definition_id"]
            isOneToOne: true
            referencedRelation: "mission_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_tool_bindings_tool_revision_id_fkey"
            columns: ["tool_revision_id"]
            isOneToOne: false
            referencedRelation: "tool_definition_revisions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string
          created_by: string
          cycle_id: string
          definition_id: string
          id: string
          objective: string
          organization_id: string
          position: number
          rationale: string
          status: string
          title: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          created_by: string
          cycle_id: string
          definition_id: string
          id?: string
          objective: string
          organization_id: string
          position: number
          rationale: string
          status: string
          title: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          created_by?: string
          cycle_id?: string
          definition_id?: string
          id?: string
          objective?: string
          organization_id?: string
          position?: number
          rationale?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "mission_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      priorities: {
        Row: {
          confirmed_at: string
          confirmed_by: string
          diagnostic_dimension_id: string
          diagnostic_execution_id: string
          dimension_code: string
          dimension_label: string
          id: string
          organization_id: string
          rationale: string
          source_score: number
        }
        Insert: {
          confirmed_at?: string
          confirmed_by: string
          diagnostic_dimension_id: string
          diagnostic_execution_id: string
          dimension_code: string
          dimension_label: string
          id?: string
          organization_id: string
          rationale: string
          source_score: number
        }
        Update: {
          confirmed_at?: string
          confirmed_by?: string
          diagnostic_dimension_id?: string
          diagnostic_execution_id?: string
          dimension_code?: string
          dimension_label?: string
          id?: string
          organization_id?: string
          rationale?: string
          source_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "priorities_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "priorities_diagnostic_dimension_id_fkey"
            columns: ["diagnostic_dimension_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_dimensions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "priorities_diagnostic_execution_id_fkey"
            columns: ["diagnostic_execution_id"]
            isOneToOne: true
            referencedRelation: "diagnostic_executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "priorities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_definition_revisions: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          schema: Json
          status: string
          version: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          schema: Json
          status: string
          version: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          schema?: Json
          status?: string
          version?: number
        }
        Relationships: []
      }
      tool_instances: {
        Row: {
          created_at: string
          created_by: string
          id: string
          mission_id: string
          organization_id: string
          payload: Json
          status: string
          tool_revision_id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          mission_id: string
          organization_id: string
          payload: Json
          status?: string
          tool_revision_id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          mission_id?: string
          organization_id?: string
          payload?: Json
          status?: string
          tool_revision_id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_instances_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_instances_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: true
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_instances_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_instances_tool_revision_id_fkey"
            columns: ["tool_revision_id"]
            isOneToOne: false
            referencedRelation: "tool_definition_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_instances_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
        ]
      }
      tutoria_context_audits: {
        Row: { absent_fields: string[]; actor_identity_id: string; created_at: string; id: string; organization_id: string; purpose: Database["public"]["Enums"]["tutoria_context_purpose"]; source_codes: string[] }
        Insert: { absent_fields?: string[]; actor_identity_id: string; created_at?: string; id?: string; organization_id: string; purpose: Database["public"]["Enums"]["tutoria_context_purpose"]; source_codes?: string[] }
        Update: { absent_fields?: string[]; actor_identity_id?: string; created_at?: string; id?: string; organization_id?: string; purpose?: Database["public"]["Enums"]["tutoria_context_purpose"]; source_codes?: string[] }
        Relationships: []
      }
      tutoria_orientation_audits: {
        Row: { actor_identity_id: string; created_at: string; duration_ms: number; event_kind: string; failure_code: string | null; id: string; input_token_estimate: number | null; model_code: string | null; objective: Database["public"]["Enums"]["tutoria_orientation_objective"]; organization_id: string; outcome: Database["public"]["Enums"]["tutoria_orientation_outcome"]; output_token_estimate: number | null; policy_decision_id: string | null; provider_code: string; response_schema_valid: boolean }
        Insert: { actor_identity_id: string; created_at?: string; duration_ms?: number; event_kind?: string; failure_code?: string | null; id?: string; input_token_estimate?: number | null; model_code?: string | null; objective: Database["public"]["Enums"]["tutoria_orientation_objective"]; organization_id: string; outcome: Database["public"]["Enums"]["tutoria_orientation_outcome"]; output_token_estimate?: number | null; policy_decision_id?: string | null; provider_code: string; response_schema_valid?: boolean }
        Update: { actor_identity_id?: string; created_at?: string; duration_ms?: number; event_kind?: string; failure_code?: string | null; id?: string; input_token_estimate?: number | null; model_code?: string | null; objective?: Database["public"]["Enums"]["tutoria_orientation_objective"]; organization_id?: string; outcome?: Database["public"]["Enums"]["tutoria_orientation_outcome"]; output_token_estimate?: number | null; policy_decision_id?: string | null; provider_code?: string; response_schema_valid?: boolean }
        Relationships: []
      }
      tutoria_policy_decisions: {
        Row: { actor_identity_id: string; context_audit_id: string; created_at: string; id: string; organization_id: string; outcome: Database["public"]["Enums"]["tutoria_policy_outcome"]; reason_code: string; requested_tool: Database["public"]["Enums"]["tutoria_tool_name"] }
        Insert: { actor_identity_id: string; context_audit_id: string; created_at?: string; id?: string; organization_id: string; outcome: Database["public"]["Enums"]["tutoria_policy_outcome"]; reason_code: string; requested_tool: Database["public"]["Enums"]["tutoria_tool_name"] }
        Update: { actor_identity_id?: string; context_audit_id?: string; created_at?: string; id?: string; organization_id?: string; outcome?: Database["public"]["Enums"]["tutoria_policy_outcome"]; reason_code?: string; requested_tool?: Database["public"]["Enums"]["tutoria_tool_name"] }
        Relationships: []
      }
      tutoria_tool_audits: {
        Row: { actor_identity_id: string; created_at: string; duration_ms: number; id: string; organization_id: string; outcome: Database["public"]["Enums"]["tutoria_tool_outcome"]; policy_decision_id: string; result_codes: string[]; tool_name: Database["public"]["Enums"]["tutoria_tool_name"] }
        Insert: { actor_identity_id: string; created_at?: string; duration_ms: number; id?: string; organization_id: string; outcome: Database["public"]["Enums"]["tutoria_tool_outcome"]; policy_decision_id: string; result_codes?: string[]; tool_name: Database["public"]["Enums"]["tutoria_tool_name"] }
        Update: { actor_identity_id?: string; created_at?: string; duration_ms?: number; id?: string; organization_id?: string; outcome?: Database["public"]["Enums"]["tutoria_tool_outcome"]; policy_decision_id?: string; result_codes?: string[]; tool_name?: Database["public"]["Enums"]["tutoria_tool_name"] }
        Relationships: []
      }
    }
    Views: {
      current_evidence_status: {
        Row: {
          confidence: number | null
          description: string | null
          evidence_type: string | null
          id: string | null
          implementation_id: string | null
          mission_id: string | null
          occurred_on: string | null
          organization_id: string | null
          review_rationale: string | null
          review_status: string | null
          reviewed_at: string | null
          reviewer_kind: string | null
          revision_number: number | null
          root_evidence_id: string | null
          submitted_at: string | null
          submitted_by: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mission_evidence_implementation_id_fkey"
            columns: ["implementation_id"]
            isOneToOne: false
            referencedRelation: "mission_implementations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_evidence_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_evidence_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_evidence_root_fkey"
            columns: ["root_evidence_id"]
            isOneToOne: false
            referencedRelation: "current_evidence_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_evidence_root_fkey"
            columns: ["root_evidence_id"]
            isOneToOne: false
            referencedRelation: "mission_evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_evidence_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "identities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      reserve_tutoria_member_budget: {
        Args: { maximum_cost_usd_micros: number; requested_capability_code: string }
        Returns: { allowed: boolean; denial_code: string | null; reservation_id: string | null }[]
      }
      confirm_priority: {
        Args: { priority_rationale: string; target_execution_id: string }
        Returns: string
      }
      provision_cycle_missions: {
        Args: { target_cycle_id: string }
        Returns: number
      }
      save_diagnostic_responses: {
        Args: { submitted_answers: Json; target_execution_id: string }
        Returns: undefined
      }
      settle_tutoria_member_budget: {
        Args: { observed_cost_usd_micros: number; target_reservation_id: string }
        Returns: boolean
      }
      save_mission_implementation: {
        Args: {
          confirm_implementation?: boolean
          implementation_date: string
          implementation_summary: string
          target_mission_id: string
        }
        Returns: string
      }
      save_mission_tool_draft: {
        Args: { submitted_payload: Json; target_mission_id: string }
        Returns: string
      }
      start_cycle: { Args: { target_priority_id: string }; Returns: string }
      start_diagnostic: {
        Args: { target_revision_id: string }
        Returns: string
      }
      start_diagnostic_episode: {
        Args: {
          target_cycle_id?: string
          target_effective_on?: string
          target_episode_type: string
          target_revision_id: string
        }
        Returns: string
      }
      submit_diagnostic: {
        Args: { target_execution_id: string }
        Returns: Json
      }
      submit_evidence_revision: {
        Args: {
          evidence_date: string
          evidence_description: string
          submitted_evidence_type: string
          target_evidence_id: string
        }
        Returns: string
      }
      submit_mission_evidence_and_advance: {
        Args: {
          evidence_date: string
          evidence_description: string
          submitted_evidence_type: string
          target_mission_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      ai_budget_reservation_status: "reserved" | "settled" | "released"
      ai_usage_resolution: "served" | "unavailable" | "escalated"
      diagnostic_execution_status: "draft" | "completed"
      diagnostic_revision_status: "draft" | "published" | "retired"
      invitation_status: "pending" | "accepted" | "revoked" | "expired"
      membership_role: "owner" | "member"
      membership_status: "active" | "revoked"
      tutoria_context_purpose: "screen_presence" | "read_member_state" | "read_methodology"
      tutoria_orientation_objective: "understand_next_step" | "understand_methodology"
      tutoria_orientation_outcome: "served" | "unavailable" | "escalated"
      tutoria_policy_outcome: "allow" | "deny" | "escalate"
      tutoria_tool_name: "read_member_state" | "read_methodology_map"
      tutoria_tool_outcome: "success" | "denied" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ai_usage_resolution: ["served", "unavailable", "escalated"],
      diagnostic_execution_status: ["draft", "completed"],
      diagnostic_revision_status: ["draft", "published", "retired"],
      invitation_status: ["pending", "accepted", "revoked", "expired"],
      membership_role: ["owner", "member"],
      membership_status: ["active", "revoked"],
      tutoria_context_purpose: ["screen_presence", "read_member_state", "read_methodology"],
      tutoria_orientation_objective: ["understand_next_step", "understand_methodology"],
      tutoria_orientation_outcome: ["served", "unavailable", "escalated"],
      tutoria_policy_outcome: ["allow", "deny", "escalate"],
      tutoria_tool_name: ["read_member_state", "read_methodology_map"],
      tutoria_tool_outcome: ["success", "denied", "failed"],
    },
  },
} as const
