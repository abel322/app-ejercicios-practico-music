import { Instrument } from './auth.types';

export interface Book {
  id: string;
  name: string;
  instrument: Instrument;
  description: string;
  fileUrl: string;
  fileKey: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookFormData {
  name: string;
  instrument: Instrument;
  description: string;
  file: File | null;
}

export interface BookUpdateData {
  name?: string;
  instrument?: Instrument;
  description?: string;
}
