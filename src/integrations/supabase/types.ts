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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      driver_documents: {
        Row: {
          admin_note: string | null
          doc_type: Database["public"]["Enums"]["document_type"]
          driver_id: string
          id: string
          public_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["doc_status"]
          storage_path: string
          uploaded_at: string
        }
        Insert: {
          admin_note?: string | null
          doc_type: Database["public"]["Enums"]["document_type"]
          driver_id: string
          id?: string
          public_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["doc_status"]
          storage_path: string
          uploaded_at?: string
        }
        Update: {
          admin_note?: string | null
          doc_type?: Database["public"]["Enums"]["document_type"]
          driver_id?: string
          id?: string
          public_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["doc_status"]
          storage_path?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_earnings: {
        Row: {
          commission_amt: number
          commission_pct: number
          driver_id: string
          earned_at: string
          gross_fare: number
          id: string
          net_earning: number
          trip_id: string
        }
        Insert: {
          commission_amt: number
          commission_pct?: number
          driver_id: string
          earned_at?: string
          gross_fare: number
          id?: string
          net_earning: number
          trip_id: string
        }
        Update: {
          commission_amt?: number
          commission_pct?: number
          driver_id?: string
          earned_at?: string
          gross_fare?: number
          id?: string
          net_earning?: number
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_earnings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_earnings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_locations: {
        Row: {
          accuracy: number | null
          driver_id: string
          heading: number | null
          latitude: number
          longitude: number
          speed: number | null
          updated_at: string
        }
        Insert: {
          accuracy?: number | null
          driver_id: string
          heading?: number | null
          latitude: number
          longitude: number
          speed?: number | null
          updated_at?: string
        }
        Update: {
          accuracy?: number | null
          driver_id?: string
          heading?: number | null
          latitude?: number
          longitude?: number
          speed?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_locations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_wallets: {
        Row: {
          balance: number
          driver_id: string
          total_earned: number
          total_paid: number
          updated_at: string
        }
        Insert: {
          balance?: number
          driver_id: string
          total_earned?: number
          total_paid?: number
          updated_at?: string
        }
        Update: {
          balance?: number
          driver_id?: string
          total_earned?: number
          total_paid?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_wallets_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          accepted_terms: boolean
          approved_at: string | null
          auth_id: string
          avatar_url: string | null
          city: string
          created_at: string
          date_of_birth: string | null
          duty_status: Database["public"]["Enums"]["duty_status"]
          fcm_token: string | null
          gender: string | null
          id: string
          is_active: boolean
          name: string
          phone: string
          rejection_note: string | null
          status: Database["public"]["Enums"]["driver_status"]
          updated_at: string
          upi_id: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          whatsapp_opt_in: boolean
        }
        Insert: {
          accepted_terms?: boolean
          approved_at?: string | null
          auth_id: string
          avatar_url?: string | null
          city: string
          created_at?: string
          date_of_birth?: string | null
          duty_status?: Database["public"]["Enums"]["duty_status"]
          fcm_token?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone: string
          rejection_note?: string | null
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
          upi_id?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          whatsapp_opt_in?: boolean
        }
        Update: {
          accepted_terms?: boolean
          approved_at?: string | null
          auth_id?: string
          avatar_url?: string | null
          city?: string
          created_at?: string
          date_of_birth?: string | null
          duty_status?: Database["public"]["Enums"]["duty_status"]
          fcm_token?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string
          rejection_note?: string | null
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
          upi_id?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          whatsapp_opt_in?: boolean
        }
        Relationships: []
      }
      ride_requests: {
        Row: {
          created_at: string
          distance_km: number | null
          drop_address: string | null
          drop_lat: number
          drop_lng: number
          estimated_fare: number | null
          expires_at: string
          id: string
          pickup_address: string | null
          pickup_lat: number
          pickup_lng: number
          rider_id: string
          status: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          created_at?: string
          distance_km?: number | null
          drop_address?: string | null
          drop_lat: number
          drop_lng: number
          estimated_fare?: number | null
          expires_at?: string
          id?: string
          pickup_address?: string | null
          pickup_lat: number
          pickup_lng: number
          rider_id: string
          status?: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          created_at?: string
          distance_km?: number | null
          drop_address?: string | null
          drop_lat?: number
          drop_lng?: number
          estimated_fare?: number | null
          expires_at?: string
          id?: string
          pickup_address?: string | null
          pickup_lat?: number
          pickup_lng?: number
          rider_id?: string
          status?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: [
          {
            foreignKeyName: "ride_requests_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      riders: {
        Row: {
          auth_id: string
          avatar_url: string | null
          created_at: string
          email: string | null
          fcm_token: string | null
          id: string
          is_active: boolean
          name: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          auth_id: string
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          fcm_token?: string | null
          id?: string
          is_active?: boolean
          name?: string | null
          phone: string
          updated_at?: string
        }
        Update: {
          auth_id?: string
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          fcm_token?: string | null
          id?: string
          is_active?: boolean
          name?: string | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          accepted_at: string | null
          arrived_at: string | null
          cancel_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          completed_at: string | null
          created_at: string
          distance_km: number | null
          driver_id: string
          driver_rating: number | null
          drop_address: string | null
          drop_lat: number
          drop_lng: number
          fare: number | null
          final_fare: number | null
          id: string
          otp: string | null
          payment_method: string | null
          payment_status: string | null
          pickup_address: string | null
          pickup_lat: number
          pickup_lng: number
          request_id: string | null
          rider_id: string
          rider_rating: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["trip_status"]
          surge_multiplier: number | null
          vehicle_id: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          accepted_at?: string | null
          arrived_at?: string | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          completed_at?: string | null
          created_at?: string
          distance_km?: number | null
          driver_id: string
          driver_rating?: number | null
          drop_address?: string | null
          drop_lat: number
          drop_lng: number
          fare?: number | null
          final_fare?: number | null
          id?: string
          otp?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_address?: string | null
          pickup_lat: number
          pickup_lng: number
          request_id?: string | null
          rider_id: string
          rider_rating?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["trip_status"]
          surge_multiplier?: number | null
          vehicle_id?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          accepted_at?: string | null
          arrived_at?: string | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          completed_at?: string | null
          created_at?: string
          distance_km?: number | null
          driver_id?: string
          driver_rating?: number | null
          drop_address?: string | null
          drop_lat?: number
          drop_lng?: number
          fare?: number | null
          final_fare?: number | null
          id?: string
          otp?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_address?: string | null
          pickup_lat?: number
          pickup_lng?: number
          request_id?: string | null
          rider_id?: string
          rider_rating?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["trip_status"]
          surge_multiplier?: number | null
          vehicle_id?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "ride_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string
          driver_id: string
          id: string
          is_verified: boolean
          make: string | null
          model: string | null
          ownership_type: Database["public"]["Enums"]["ownership_type"]
          updated_at: string
          vehicle_number: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          driver_id: string
          id?: string
          is_verified?: boolean
          make?: string | null
          model?: string | null
          ownership_type?: Database["public"]["Enums"]["ownership_type"]
          updated_at?: string
          vehicle_number: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          driver_id?: string
          id?: string
          is_verified?: boolean
          make?: string | null
          model?: string | null
          ownership_type?: Database["public"]["Enums"]["ownership_type"]
          updated_at?: string
          vehicle_number?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          category: Database["public"]["Enums"]["txn_category"]
          created_at: string
          description: string | null
          driver_id: string
          id: string
          trip_id: string | null
          type: Database["public"]["Enums"]["txn_type"]
        }
        Insert: {
          amount: number
          balance_after: number
          category: Database["public"]["Enums"]["txn_category"]
          created_at?: string
          description?: string | null
          driver_id: string
          id?: string
          trip_id?: string | null
          type: Database["public"]["Enums"]["txn_type"]
        }
        Update: {
          amount?: number
          balance_after?: number
          category?: Database["public"]["Enums"]["txn_category"]
          created_at?: string
          description?: string | null
          driver_id?: string
          id?: string
          trip_id?: string | null
          type?: Database["public"]["Enums"]["txn_type"]
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      credit_driver_wallet: {
        Args: { p_amount: number; p_driver_id: string; p_trip_id: string }
        Returns: undefined
      }
      current_driver_id: { Args: never; Returns: string }
      current_rider_id: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      nearby_drivers: {
        Args: {
          lat: number
          lng: number
          radius_km?: number
          v_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Returns: {
          distance_km: number
          driver_id: string
        }[]
      }
    }
    Enums: {
      doc_status: "pending" | "approved" | "rejected"
      document_type:
        | "dl_front"
        | "dl_back"
        | "rc_front"
        | "rc_back"
        | "aadhaar_front"
        | "aadhaar_back"
        | "pan"
      driver_status: "pending" | "approved" | "rejected" | "suspended"
      duty_status: "on_duty" | "off_duty"
      ownership_type: "self" | "rented"
      trip_status:
        | "requested"
        | "accepted"
        | "arrived"
        | "ongoing"
        | "completed"
        | "cancelled"
      txn_category:
        | "trip_earning"
        | "commission"
        | "withdrawal"
        | "bonus"
        | "refund"
      txn_type: "credit" | "debit"
      user_role: "rider" | "driver"
      vehicle_type: "bike" | "auto" | "cab"
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
      doc_status: ["pending", "approved", "rejected"],
      document_type: [
        "dl_front",
        "dl_back",
        "rc_front",
        "rc_back",
        "aadhaar_front",
        "aadhaar_back",
        "pan",
      ],
      driver_status: ["pending", "approved", "rejected", "suspended"],
      duty_status: ["on_duty", "off_duty"],
      ownership_type: ["self", "rented"],
      trip_status: [
        "requested",
        "accepted",
        "arrived",
        "ongoing",
        "completed",
        "cancelled",
      ],
      txn_category: [
        "trip_earning",
        "commission",
        "withdrawal",
        "bonus",
        "refund",
      ],
      txn_type: ["credit", "debit"],
      user_role: ["rider", "driver"],
      vehicle_type: ["bike", "auto", "cab"],
    },
  },
} as const
