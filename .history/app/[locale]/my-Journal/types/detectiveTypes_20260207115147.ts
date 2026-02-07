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
  created_at: string;
  highlights: Highlight[];
  color_Tags: ColorTag[];
};
