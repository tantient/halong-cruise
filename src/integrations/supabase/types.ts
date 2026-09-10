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
      cabin_details: {
        Row: {
          cabin_id: string
          content_type: string
          created_at: string
          group_name: string | null
          id: string
          label: string
          ship_id: string
          sort_order: number
          translations: Json
          updated_at: string
          value: string | null
        }
        Insert: {
          cabin_id: string
          content_type?: string
          created_at?: string
          group_name?: string | null
          id?: string
          label: string
          ship_id: string
          sort_order?: number
          translations?: Json
          updated_at?: string
          value?: string | null
        }
        Update: {
          cabin_id?: string
          content_type?: string
          created_at?: string
          group_name?: string | null
          id?: string
          label?: string
          ship_id?: string
          sort_order?: number
          translations?: Json
          updated_at?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cabin_details_cabin_ship_fkey"
            columns: ["cabin_id", "ship_id"]
            isOneToOne: false
            referencedRelation: "cabins"
            referencedColumns: ["id", "ship_id"]
          },
          {
            foreignKeyName: "cabin_details_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      cabins: {
        Row: {
          bed_config: string | null
          category: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          deck: string | null
          description: string | null
          id: string
          max_guests: number | null
          name: string
          price_from: number | null
          published_at: string | null
          ship_id: string
          size_sqm: number | null
          slug: string
          sort_order: number
          status: string
          summary: string | null
          translations: Json
          updated_at: string
          updated_by: string | null
          view_type: string | null
        }
        Insert: {
          bed_config?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deck?: string | null
          description?: string | null
          id?: string
          max_guests?: number | null
          name: string
          price_from?: number | null
          published_at?: string | null
          ship_id: string
          size_sqm?: number | null
          slug: string
          sort_order?: number
          status?: string
          summary?: string | null
          translations?: Json
          updated_at?: string
          updated_by?: string | null
          view_type?: string | null
        }
        Update: {
          bed_config?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deck?: string | null
          description?: string | null
          id?: string
          max_guests?: number | null
          name?: string
          price_from?: number | null
          published_at?: string | null
          ship_id?: string
          size_sqm?: number | null
          slug?: string
          sort_order?: number
          status?: string
          summary?: string | null
          translations?: Json
          updated_at?: string
          updated_by?: string | null
          view_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cabins_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_media: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          media_id: string
          ship_id: string
          sort_order: number
          updated_at: string
          usage: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          media_id: string
          ship_id: string
          sort_order?: number
          updated_at?: string
          usage?: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          media_id?: string
          ship_id?: string
          sort_order?: number
          updated_at?: string
          usage?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_media_media_ship_fkey"
            columns: ["media_id", "ship_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id", "ship_id"]
          },
          {
            foreignKeyName: "entity_media_ship_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_sections: {
        Row: {
          configuration: Json
          created_at: string
          created_by: string | null
          enabled: boolean
          id: string
          position: number
          published_at: string | null
          section_type: string
          ship_id: string
          status: string
          translations: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          configuration?: Json
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          id?: string
          position?: number
          published_at?: string | null
          section_type: string
          ship_id: string
          status?: string
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          id?: string
          position?: number
          published_at?: string | null
          section_type?: string
          ship_id?: string
          status?: string
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "homepage_sections_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      itineraries: {
        Row: {
          created_at: string
          created_by: string | null
          currency: string | null
          days: number | null
          departure_point: string | null
          description: string | null
          highlights: Json
          id: string
          name: string
          nights: number | null
          price_from: number | null
          published_at: string | null
          ship_id: string
          slug: string
          sort_order: number
          status: string
          summary: string | null
          translations: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency?: string | null
          days?: number | null
          departure_point?: string | null
          description?: string | null
          highlights?: Json
          id?: string
          name: string
          nights?: number | null
          price_from?: number | null
          published_at?: string | null
          ship_id: string
          slug: string
          sort_order?: number
          status?: string
          summary?: string | null
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency?: string | null
          days?: number | null
          departure_point?: string | null
          description?: string | null
          highlights?: Json
          id?: string
          name?: string
          nights?: number | null
          price_from?: number | null
          published_at?: string | null
          ship_id?: string
          slug?: string
          sort_order?: number
          status?: string
          summary?: string | null
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itineraries_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_days: {
        Row: {
          created_at: string
          day_number: number
          description: string | null
          id: string
          itinerary_id: string
          meals: string | null
          ship_id: string
          sort_order: number
          timeline: Json
          title: string | null
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_number: number
          description?: string | null
          id?: string
          itinerary_id: string
          meals?: string | null
          ship_id: string
          sort_order?: number
          timeline?: Json
          title?: string | null
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_number?: number
          description?: string | null
          id?: string
          itinerary_id?: string
          meals?: string | null
          ship_id?: string
          sort_order?: number
          timeline?: Json
          title?: string | null
          translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_days_itinerary_ship_fkey"
            columns: ["itinerary_id", "ship_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id", "ship_id"]
          },
          {
            foreignKeyName: "itinerary_days_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          contact: string
          created_at: string
          full_name: string
          id: string
          position_id: string
          ship_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          contact: string
          created_at?: string
          full_name: string
          id?: string
          position_id: string
          ship_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          contact?: string
          created_at?: string
          full_name?: string
          id?: string
          position_id?: string
          ship_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      job_positions: {
        Row: {
          benefits: Json
          created_at: string
          created_by: string | null
          department: string | null
          description: string | null
          employment_type: string | null
          headcount: number | null
          id: string
          published_at: string | null
          requirements: Json
          ship_id: string
          slug: string
          sort_order: number
          status: string
          title: string
          title_vi: string | null
          translations: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          benefits?: Json
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          employment_type?: string | null
          headcount?: number | null
          id?: string
          published_at?: string | null
          requirements?: Json
          ship_id: string
          slug: string
          sort_order?: number
          status?: string
          title: string
          title_vi?: string | null
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          benefits?: Json
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          employment_type?: string | null
          headcount?: number | null
          id?: string
          published_at?: string | null
          requirements?: Json
          ship_id?: string
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          title_vi?: string | null
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_positions_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string | null
          name: string
          nationality: string | null
          phone: string | null
          ship_id: string
          source: string | null
          status: string
          type: string
          updated_at: string
          utm_campaign: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name: string
          nationality?: string | null
          phone?: string | null
          ship_id: string
          source?: string | null
          status?: string
          type?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          nationality?: string | null
          phone?: string | null
          ship_id?: string
          source?: string | null
          status?: string
          type?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt: string | null
          caption: string | null
          category: string
          created_at: string
          created_by: string | null
          height: number | null
          id: string
          is_featured: boolean
          mime_type: string | null
          ship_id: string
          sort_order: number
          storage_path: string
          translations: Json
          updated_at: string
          updated_by: string | null
          width: number | null
        }
        Insert: {
          alt?: string | null
          caption?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          height?: number | null
          id?: string
          is_featured?: boolean
          mime_type?: string | null
          ship_id: string
          sort_order?: number
          storage_path: string
          translations?: Json
          updated_at?: string
          updated_by?: string | null
          width?: number | null
        }
        Update: {
          alt?: string | null
          caption?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          height?: number | null
          id?: string
          is_featured?: boolean
          mime_type?: string | null
          ship_id?: string
          sort_order?: number
          storage_path?: string
          translations?: Json
          updated_at?: string
          updated_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          badge: string | null
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          highlights: Json
          id: string
          name: string
          offer_type: string | null
          published_at: string | null
          ship_id: string
          slug: string
          sort_order: number
          starts_at: string | null
          status: string
          terms: string | null
          translations: Json
          updated_at: string
          updated_by: string | null
          value_text: string | null
        }
        Insert: {
          badge?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          highlights?: Json
          id?: string
          name: string
          offer_type?: string | null
          published_at?: string | null
          ship_id: string
          slug: string
          sort_order?: number
          starts_at?: string | null
          status?: string
          terms?: string | null
          translations?: Json
          updated_at?: string
          updated_by?: string | null
          value_text?: string | null
        }
        Update: {
          badge?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          highlights?: Json
          id?: string
          name?: string
          offer_type?: string | null
          published_at?: string | null
          ship_id?: string
          slug?: string
          sort_order?: number
          starts_at?: string | null
          status?: string
          terms?: string | null
          translations?: Json
          updated_at?: string
          updated_by?: string | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          highlights: Json
          id: string
          name: string
          opening_hours: string | null
          price_note: string | null
          published_at: string | null
          ship_id: string
          slug: string
          sort_order: number
          status: string
          summary: string | null
          translations: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          highlights?: Json
          id?: string
          name: string
          opening_hours?: string | null
          price_note?: string | null
          published_at?: string | null
          ship_id: string
          slug: string
          sort_order?: number
          status?: string
          summary?: string | null
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          highlights?: Json
          id?: string
          name?: string
          opening_hours?: string | null
          price_note?: string | null
          published_at?: string | null
          ship_id?: string
          slug?: string
          sort_order?: number
          status?: string
          summary?: string | null
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
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
      ship_pages: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          id: string
          intro: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          ship_id: string
          slug: string
          sort_order: number
          status: string
          title: string
          translations: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          intro?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          ship_id: string
          slug: string
          sort_order?: number
          status?: string
          title: string
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          intro?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          ship_id?: string
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ship_pages_ship_id_fkey"
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
          translations: Json
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
          translations?: Json
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
          translations?: Json
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
          recruit_zalo: string | null
          ship_id: string
          tiktok: string | null
          translations: Json
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
          recruit_zalo?: string | null
          ship_id: string
          tiktok?: string | null
          translations?: Json
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
          recruit_zalo?: string | null
          ship_id?: string
          tiktok?: string | null
          translations?: Json
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
          enabled_languages: string[]
          id: string
          layout: string
          name: string
          slug: string
          sort_order: number
          status: string
          tagline: string | null
          total_cabins: number | null
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          default_language?: string
          display_name?: string | null
          enabled_languages?: string[]
          id?: string
          layout?: string
          name: string
          slug: string
          sort_order?: number
          status?: string
          tagline?: string | null
          total_cabins?: number | null
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          default_language?: string
          display_name?: string | null
          enabled_languages?: string[]
          id?: string
          layout?: string
          name?: string
          slug?: string
          sort_order?: number
          status?: string
          tagline?: string | null
          total_cabins?: number | null
          translations?: Json
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
      venues: {
        Row: {
          access_type: string | null
          area_sqm: number | null
          capacity: number | null
          capacity_unit: string
          category: string
          commercial_name: string | null
          created_at: string
          created_by: string | null
          description: string | null
          function_text: string | null
          functional_name: string
          id: string
          location: string | null
          parent_key: string | null
          published_at: string | null
          ship_id: string
          show_area: boolean
          show_capacity: boolean
          show_public: boolean
          sort_order: number
          spec_note: string | null
          stable_key: string
          status: string
          summary: string | null
          translations: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          access_type?: string | null
          area_sqm?: number | null
          capacity?: number | null
          capacity_unit?: string
          category: string
          commercial_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          function_text?: string | null
          functional_name: string
          id?: string
          location?: string | null
          parent_key?: string | null
          published_at?: string | null
          ship_id: string
          show_area?: boolean
          show_capacity?: boolean
          show_public?: boolean
          sort_order?: number
          spec_note?: string | null
          stable_key: string
          status?: string
          summary?: string | null
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          access_type?: string | null
          area_sqm?: number | null
          capacity?: number | null
          capacity_unit?: string
          category?: string
          commercial_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          function_text?: string | null
          functional_name?: string
          id?: string
          location?: string | null
          parent_key?: string | null
          published_at?: string | null
          ship_id?: string
          show_area?: boolean
          show_capacity?: boolean
          show_public?: boolean
          sort_order?: number
          spec_note?: string | null
          stable_key?: string
          status?: string
          summary?: string | null
          translations?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_ship_id_fkey"
            columns: ["ship_id"]
            isOneToOne: false
            referencedRelation: "ships"
            referencedColumns: ["id"]
          },
        ]
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
