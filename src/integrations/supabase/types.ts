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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      job_applications: {
        Row: {
          contact: string
          created_at: string
          full_name: string
          id: string
          position_id: string
          status: string
        }
        Insert: {
          contact: string
          created_at?: string
          full_name: string
          id?: string
          position_id: string
          status?: string
        }
        Update: {
          contact?: string
          created_at?: string
          full_name?: string
          id?: string
          position_id?: string
          status?: string
        }
        Relationships: []
      }
      ship_branding: {
        Row: {
          accent_color: string | null
          background_color: string | null
          body_font: string | null
          created_at: string
          favicon: string | null
          heading_font: string | null
          id: string
          logo_dark: string | null
          logo_light: string | null
          logo_mark: string | null
          primary_color: string | null
          secondary_color: string | null
          ship_id: string
          surface_color: string | null
          text_color: string | null
          theme_config: Json
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          background_color?: string | null
          body_font?: string | null
          created_at?: string
          favicon?: string | null
          heading_font?: string | null
          id?: string
          logo_dark?: string | null
          logo_light?: string | null
          logo_mark?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          ship_id: string
          surface_color?: string | null
          text_color?: string | null
          theme_config?: Json
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          background_color?: string | null
          body_font?: string | null
          created_at?: string
          favicon?: string | null
          heading_font?: string | null
          id?: string
          logo_dark?: string | null
          logo_light?: string | null
          logo_mark?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          ship_id?: string
          surface_color?: string | null
          text_color?: string | null
          theme_config?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ship_branding_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: true
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      ship_domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_active: boolean
          is_primary: boolean
          redirect_to: string | null
          ship_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_active?: boolean
          is_primary?: boolean
          redirect_to?: string | null
          ship_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_active?: boolean
          is_primary?: boolean
          redirect_to?: string | null
          ship_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ship_domains_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      ship_seo: {
        Row: {
          created_at: string
          default_description: string | null
          default_title: string | null
          id: string
          og_image: string | null
          schema_name: string | null
          schema_type: string
          ship_id: string
          site_name: string | null
          title_template: string | null
          twitter_handle: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_description?: string | null
          default_title?: string | null
          id?: string
          og_image?: string | null
          schema_name?: string | null
          schema_type?: string
          ship_id: string
          site_name?: string | null
          title_template?: string | null
          twitter_handle?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_description?: string | null
          default_title?: string | null
          id?: string
          og_image?: string | null
          schema_name?: string | null
          schema_type?: string
          ship_id?: string
          site_name?: string | null
          title_template?: string | null
          twitter_handle?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ship_seo_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: true
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      ship_settings: {
        Row: {
          address: string | null
          booking_url: string | null
          checkin_point: string | null
          created_at: string
          email: string | null
          facebook: string | null
          google_maps: string | null
          hotline: string | null
          hotline_display: string | null
          id: string
          instagram: string | null
          recruit_email: string | null
          ship_id: string
          tiktok: string | null
          tripadvisor: string | null
          updated_at: string
          whatsapp: string | null
          youtube: string | null
          zalo: string | null
        }
        Insert: {
          address?: string | null
          booking_url?: string | null
          checkin_point?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          google_maps?: string | null
          hotline?: string | null
          hotline_display?: string | null
          id?: string
          instagram?: string | null
          recruit_email?: string | null
          ship_id: string
          tiktok?: string | null
          tripadvisor?: string | null
          updated_at?: string
          whatsapp?: string | null
          youtube?: string | null
          zalo?: string | null
        }
        Update: {
          address?: string | null
          booking_url?: string | null
          checkin_point?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          google_maps?: string | null
          hotline?: string | null
          hotline_display?: string | null
          id?: string
          instagram?: string | null
          recruit_email?: string | null
          ship_id?: string
          tiktok?: string | null
          tripadvisor?: string | null
          updated_at?: string
          whatsapp?: string | null
          youtube?: string | null
          zalo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ship_settings_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: true
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      ships: {
        Row: {
          created_at: string
          currency: string
          default_language: string
          display_name: string | null
          id: string
          layout: string
          name: string
          slug: string
          sort_order: number
          status: string
          tagline: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          default_language?: string
          display_name?: string | null
          id?: string
          layout?: string
          name: string
          slug: string
          sort_order?: number
          status?: string
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          default_language?: string
          display_name?: string | null
          id?: string
          layout?: string
          name?: string
          slug?: string
          sort_order?: number
          status?: string
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      is_platform_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "owner"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user", "owner"],
    },
  },
} as const
