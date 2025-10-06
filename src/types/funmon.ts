export interface FunMon {
  id: string;
  nickname: string;
  name: string;
  uniqueImageURL: string;
  imageURL: string;
  course: string;
  professions: string[];
  room: number;
  urls: string[];
  description: string;
  parameters: string[];
  comments: string[];
}

export interface CreateFunMonRequest {
  id: string;
  nickname: string;
  name: string;
  uniqueImageURL: string;
  imageURL: string;
  course: string;
  professions: string[];
  room: number;
  urls: string[];
  description: string;
  parameters: string[];
  comments: string[];
}
