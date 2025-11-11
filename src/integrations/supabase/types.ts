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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          created_at: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          deal_id: string
          id: string
          merchant_id: string
          qr_code: string
          redeemed_at: string | null
          special_instructions: string | null
          status: string | null
          time_slot: string | null
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          created_at?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          deal_id: string
          id?: string
          merchant_id: string
          qr_code: string
          redeemed_at?: string | null
          special_instructions?: string | null
          status?: string | null
          time_slot?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          created_at?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          deal_id?: string
          id?: string
          merchant_id?: string
          qr_code?: string
          redeemed_at?: string | null
          special_instructions?: string | null
          status?: string | null
          time_slot?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          age_restriction: string | null
          available_days: string[] | null
          available_time_slots: Json | null
          category: string
          created_at: string | null
          current_price: number | null
          daily_limit: number | null
          deal_end_date: string | null
          deal_images: Json | null
          deal_start_date: string | null
          discount: string
          discount_type: string | null
          expiry_date: string | null
          id: string
          image_url: string
          is_active: boolean | null
          merchant: string
          merchant_id: string | null
          offer: string | null
          original_price: number | null
          requires_booking: boolean | null
          requires_qr_code: boolean | null
          requires_time_slot: boolean | null
          sold_count: number | null
          terms_and_conditions: string | null
          title: string
          updated_at: string | null
          usage_limit: number | null
        }
        Insert: {
          age_restriction?: string | null
          available_days?: string[] | null
          available_time_slots?: Json | null
          category: string
          created_at?: string | null
          current_price?: number | null
          daily_limit?: number | null
          deal_end_date?: string | null
          deal_images?: Json | null
          deal_start_date?: string | null
          discount: string
          discount_type?: string | null
          expiry_date?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          merchant: string
          merchant_id?: string | null
          offer?: string | null
          original_price?: number | null
          requires_booking?: boolean | null
          requires_qr_code?: boolean | null
          requires_time_slot?: boolean | null
          sold_count?: number | null
          terms_and_conditions?: string | null
          title: string
          updated_at?: string | null
          usage_limit?: number | null
        }
        Update: {
          age_restriction?: string | null
          available_days?: string[] | null
          available_time_slots?: Json | null
          category?: string
          created_at?: string | null
          current_price?: number | null
          daily_limit?: number | null
          deal_end_date?: string | null
          deal_images?: Json | null
          deal_start_date?: string | null
          discount?: string
          discount_type?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          merchant?: string
          merchant_id?: string | null
          offer?: string | null
          original_price?: number | null
          requires_booking?: boolean | null
          requires_qr_code?: boolean | null
          requires_time_slot?: boolean | null
          sold_count?: number | null
          terms_and_conditions?: string | null
          title?: string
          updated_at?: string | null
          usage_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_branches: {
        Row: {
          address: string
          branch_name: string
          city: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          lga: string | null
          manager_name: string | null
          manager_phone: string | null
          merchant_id: string
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          branch_name: string
          city?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          lga?: string | null
          manager_name?: string | null
          manager_phone?: string | null
          merchant_id: string
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          branch_name?: string
          city?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          lga?: string | null
          manager_name?: string | null
          manager_phone?: string | null
          merchant_id?: string
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_branches_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_documents: {
        Row: {
          document_type: string
          document_url: string
          id: string
          merchant_id: string
          notes: string | null
          uploaded_at: string | null
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_type: string
          document_url: string
          id?: string
          merchant_id: string
          notes?: string | null
          uploaded_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_type?: string
          document_url?: string
          id?: string
          merchant_id?: string
          notes?: string | null
          uploaded_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_documents_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_messages: {
        Row: {
          attachment_url: string | null
          conversation_id: string
          created_at: string | null
          customer_id: string
          id: string
          is_read: boolean | null
          merchant_id: string
          message_text: string
          order_id: string | null
          sender_type: string
        }
        Insert: {
          attachment_url?: string | null
          conversation_id: string
          created_at?: string | null
          customer_id: string
          id?: string
          is_read?: boolean | null
          merchant_id: string
          message_text: string
          order_id?: string | null
          sender_type: string
        }
        Update: {
          attachment_url?: string | null
          conversation_id?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          is_read?: boolean | null
          merchant_id?: string
          message_text?: string
          order_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_messages_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          account_name: string | null
          account_number: string | null
          address: string | null
          approved_at: string | null
          approved_by_admin_id: string | null
          avg_delivery_time: string | null
          bank_name: string | null
          business_reg_number: string | null
          business_type: string | null
          cac_document_url: string | null
          category: string
          city: string | null
          created_at: string | null
          customer_service_contact: string | null
          delivery_available: boolean | null
          delivery_coverage: string | null
          delivery_method: string | null
          email: string
          escrow_type: string | null
          facebook_url: string | null
          full_description: string | null
          google_business_url: string | null
          id: string
          instagram_handle: string | null
          landmark: string | null
          lga: string | null
          logo_url: string | null
          menu_pdf_url: string | null
          name: string
          online_menu_url: string | null
          other_documents: Json | null
          owner_id_url: string | null
          phone: string | null
          pickup_available: boolean | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          primary_contact_role: string | null
          registered_name: string | null
          rejection_reason: string | null
          secondary_contact_email: string | null
          secondary_contact_name: string | null
          secondary_contact_phone: string | null
          settlement_frequency: string | null
          short_description: string | null
          state: string | null
          status: string | null
          storefront_image_url: string | null
          support_email: string | null
          support_phone: string | null
          support_whatsapp: string | null
          tax_id: string | null
          tiktok_handle: string | null
          twitter_handle: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
          working_days: string[] | null
          working_hours: Json | null
          year_established: number | null
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          address?: string | null
          approved_at?: string | null
          approved_by_admin_id?: string | null
          avg_delivery_time?: string | null
          bank_name?: string | null
          business_reg_number?: string | null
          business_type?: string | null
          cac_document_url?: string | null
          category: string
          city?: string | null
          created_at?: string | null
          customer_service_contact?: string | null
          delivery_available?: boolean | null
          delivery_coverage?: string | null
          delivery_method?: string | null
          email: string
          escrow_type?: string | null
          facebook_url?: string | null
          full_description?: string | null
          google_business_url?: string | null
          id?: string
          instagram_handle?: string | null
          landmark?: string | null
          lga?: string | null
          logo_url?: string | null
          menu_pdf_url?: string | null
          name: string
          online_menu_url?: string | null
          other_documents?: Json | null
          owner_id_url?: string | null
          phone?: string | null
          pickup_available?: boolean | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          primary_contact_role?: string | null
          registered_name?: string | null
          rejection_reason?: string | null
          secondary_contact_email?: string | null
          secondary_contact_name?: string | null
          secondary_contact_phone?: string | null
          settlement_frequency?: string | null
          short_description?: string | null
          state?: string | null
          status?: string | null
          storefront_image_url?: string | null
          support_email?: string | null
          support_phone?: string | null
          support_whatsapp?: string | null
          tax_id?: string | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          working_days?: string[] | null
          working_hours?: Json | null
          year_established?: number | null
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          address?: string | null
          approved_at?: string | null
          approved_by_admin_id?: string | null
          avg_delivery_time?: string | null
          bank_name?: string | null
          business_reg_number?: string | null
          business_type?: string | null
          cac_document_url?: string | null
          category?: string
          city?: string | null
          created_at?: string | null
          customer_service_contact?: string | null
          delivery_available?: boolean | null
          delivery_coverage?: string | null
          delivery_method?: string | null
          email?: string
          escrow_type?: string | null
          facebook_url?: string | null
          full_description?: string | null
          google_business_url?: string | null
          id?: string
          instagram_handle?: string | null
          landmark?: string | null
          lga?: string | null
          logo_url?: string | null
          menu_pdf_url?: string | null
          name?: string
          online_menu_url?: string | null
          other_documents?: Json | null
          owner_id_url?: string | null
          phone?: string | null
          pickup_available?: boolean | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          primary_contact_role?: string | null
          registered_name?: string | null
          rejection_reason?: string | null
          secondary_contact_email?: string | null
          secondary_contact_name?: string | null
          secondary_contact_phone?: string | null
          settlement_frequency?: string | null
          short_description?: string | null
          state?: string | null
          status?: string | null
          storefront_image_url?: string | null
          support_email?: string | null
          support_phone?: string | null
          support_whatsapp?: string | null
          tax_id?: string | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          working_days?: string[] | null
          working_hours?: Json | null
          year_established?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          deal_id: string | null
          id: string
          order_status: string
          payment_status: string
          quantity: number
          total_amount: number
          user_id: string | null
          voucher_code: string
        }
        Insert: {
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          deal_id?: string | null
          id?: string
          order_status?: string
          payment_status?: string
          quantity?: number
          total_amount: number
          user_id?: string | null
          voucher_code: string
        }
        Update: {
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          deal_id?: string | null
          id?: string
          order_status?: string
          payment_status?: string
          quantity?: number
          total_amount?: number
          user_id?: string | null
          voucher_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_redemptions: {
        Row: {
          booking_id: string
          created_at: string | null
          id: string
          location: string | null
          merchant_id: string
          notes: string | null
          redeemed_at: string | null
          redeemed_by_user_id: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          id?: string
          location?: string | null
          merchant_id: string
          notes?: string | null
          redeemed_at?: string | null
          redeemed_by_user_id?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          id?: string
          location?: string | null
          merchant_id?: string
          notes?: string | null
          redeemed_at?: string | null
          redeemed_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_redemptions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_redemptions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      settlements: {
        Row: {
          bank_details: Json | null
          created_at: string | null
          id: string
          merchant_id: string
          notes: string | null
          payout_date: string | null
          payout_status: string | null
          period_end: string
          period_start: string
          total_amount: number
          transaction_reference: string | null
          updated_at: string | null
        }
        Insert: {
          bank_details?: Json | null
          created_at?: string | null
          id?: string
          merchant_id: string
          notes?: string | null
          payout_date?: string | null
          payout_status?: string | null
          period_end: string
          period_start: string
          total_amount: number
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Update: {
          bank_details?: Json | null
          created_at?: string | null
          id?: string
          merchant_id?: string
          notes?: string | null
          payout_date?: string | null
          payout_status?: string | null
          period_end?: string
          period_start?: string
          total_amount?: number
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settlements_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          business_name: string | null
          category: string | null
          created_at: string | null
          email: string
          id: string
          interests: string[] | null
          local_government: string | null
          name: string | null
          phone: string | null
          state: string | null
          type: string
        }
        Insert: {
          business_name?: string | null
          category?: string | null
          created_at?: string | null
          email: string
          id?: string
          interests?: string[] | null
          local_government?: string | null
          name?: string | null
          phone?: string | null
          state?: string | null
          type: string
        }
        Update: {
          business_name?: string | null
          category?: string | null
          created_at?: string | null
          email?: string
          id?: string
          interests?: string[] | null
          local_government?: string | null
          name?: string | null
          phone?: string | null
          state?: string | null
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "merchant"
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
      app_role: ["admin", "moderator", "user", "merchant"],
    },
  },
} as const
