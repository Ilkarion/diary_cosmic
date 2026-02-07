// types/detectiveTypes.ts
export type ColorTag = {
  name: string;
  color: string;
};

export type Highlight = {
  text: string;
  color: string;
};

export type RecordType = {
  id_record: string;
  title: string;
  created_at: string; // ISO date string
  highlights: Highlight[];
  color_Tags: ColorTag[];
};

// Map of positions: key = record_id, value = {x, y}
export type NodePositions = {
  [key: string]: { x: number; y: number };
};
