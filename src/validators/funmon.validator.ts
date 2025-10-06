import { z } from 'zod';

export const createFunMonSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  nickname: z.string().min(1, 'Nickname is required'),
  name: z.string().min(1, 'Name is required'),
  uniqueImageURL: z.string(),
  imageURL: z.string().min(1, 'Image URL is required'),
  course: z.string().min(1, 'Course is required'),
  professions: z.array(z.string()).min(1, 'At least one profession is required'),
  room: z.number().min(1, 'Room number is required'),
  urls: z.array(z.string()).default([]),
  description: z.string().default(''),
  parameters: z.array(z.string()).default([]),
  comments: z.array(z.string()).default([]),
});

export const getFunMonByNameListSchema = z.object({
  names: z.array(z.string()).min(1, 'At least one name is required'),
});
