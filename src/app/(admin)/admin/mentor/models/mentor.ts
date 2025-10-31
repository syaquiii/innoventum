// types/mentor.ts

export type MentorStatus = "aktif" | "nonaktif";

export interface Mentor {
  mentor_id: number;
  nama: string;
  bio: string;
  keahlian: string;
  foto?: string | null;
  email_kontak: string;
  linkedin?: string | null;
  status: MentorStatus;
  created_by?: number;
}

export interface MentorFormData {
  nama: string;
  bio: string;
  keahlian: string;
  foto?: string;
  email_kontak: string;
  linkedin?: string;
  status: MentorStatus;
}

export interface MentorWithCreator {
  created_by: {
    id: number;
    nama: string;
    email: string;
  };
}

export interface MentorListResponse {
  success: boolean;
  data: MentorWithCreator[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
  filters: {
    search: string;
    status: string;
    keahlian: string;
  };
}

export interface MentorFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}
