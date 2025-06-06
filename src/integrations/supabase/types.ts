export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      movie_reviews: {
        Row: {
          created_at: string | null
          id: number
          movie_title: string
          rating: number | null
          review_content: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          movie_title: string
          rating?: number | null
          review_content: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          movie_title?: string
          rating?: number | null
          review_content?: string
          user_id?: string | null
        }
        Relationships: []
      }
      "previous user reviews of a particular movie": {
        Row: {
          created_at: string
          disliked_by: string[] | null
          liked_by: string[] | null
          "movie id": number
          review: string | null
          "user id": string | null
          user_dislikes: number | null
          user_likes: number | null
          user_sentiment: string | null
          user_stars: number | null
        }
        Insert: {
          created_at?: string
          disliked_by?: string[] | null
          liked_by?: string[] | null
          "movie id"?: number
          review?: string | null
          "user id"?: string | null
          user_dislikes?: number | null
          user_likes?: number | null
          user_sentiment?: string | null
          user_stars?: number | null
        }
        Update: {
          created_at?: string
          disliked_by?: string[] | null
          liked_by?: string[] | null
          "movie id"?: number
          review?: string | null
          "user id"?: string | null
          user_dislikes?: number | null
          user_likes?: number | null
          user_sentiment?: string | null
          user_stars?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          "special keyword": string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          "special keyword"?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          "special keyword"?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          confidence: number | null
          created_at: string
          disliked_by: string[] | null
          id: number
          liked_by: string[] | null
          movie_id: string | null
          review_text: string | null
          sentiment: string | null
          stars: number | null
          user_dislikes: number
          user_id: string | null
          user_likes: number
          username: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          disliked_by?: string[] | null
          id?: number
          liked_by?: string[] | null
          movie_id?: string | null
          review_text?: string | null
          sentiment?: string | null
          stars?: number | null
          user_dislikes?: number
          user_id?: string | null
          user_likes?: number
          username?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          disliked_by?: string[] | null
          id?: number
          liked_by?: string[] | null
          movie_id?: string | null
          review_text?: string | null
          sentiment?: string | null
          stars?: number | null
          user_dislikes?: number
          user_id?: string | null
          user_likes?: number
          username?: string | null
        }
        Relationships: []
      }
      "reviews of users": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          email: string
          id: string
          updated_at: string | null
          user_age: number | null
          user_description: string | null
          user_gender: string | null
          user_preferences: string | null
          username: string
        }
        Insert: {
          email: string
          id: string
          updated_at?: string | null
          user_age?: number | null
          user_description?: string | null
          user_gender?: string | null
          user_preferences?: string | null
          username: string
        }
        Update: {
          email?: string
          id?: string
          updated_at?: string | null
          user_age?: number | null
          user_description?: string | null
          user_gender?: string | null
          user_preferences?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_sentiment: {
        Args: { review_text: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
