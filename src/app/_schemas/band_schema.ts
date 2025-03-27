import { z } from "zod";

export const bandSchema = z.object({
  artist: z.string(),
  albums: z.array(
    z.object({
      name: z.string(),
      year_released: z.number(),
      tracks: z.number(),
      length: z.string(),
      cover_image_path: z.string(),
      cover_image_id: z.number(),
    }),
  ),
});

export type Band = z.infer<typeof bandSchema>;
