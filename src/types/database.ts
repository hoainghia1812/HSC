export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type QuestionOption = {
  id: string
  text: string
  is_correct?: boolean
}

export interface Database {
  public: {
    Tables: {
      // Thêm các table của bạn ở đây
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string
          birth_date: string | null
          password_hash: string
          role: 'admin' | 'user' | 'vip1' | 'vip2' | 'vip3'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone: string
          birth_date?: string | null
          password_hash: string
          role?: 'admin' | 'user' | 'vip1' | 'vip2' | 'vip3'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string
          birth_date?: string | null
          password_hash?: string
          role?: 'admin' | 'user' | 'vip1' | 'vip2' | 'vip3'
          created_at?: string
          updated_at?: string
        }
      }
      question_sets: {
        Row: {
          id: string
          title: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          question_set_id: string
          content: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_option: 'A' | 'B' | 'C' | 'D'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_set_id: string
          content: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_option: 'A' | 'B' | 'C' | 'D'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_set_id?: string
          content?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          correct_option?: 'A' | 'B' | 'C' | 'D'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
