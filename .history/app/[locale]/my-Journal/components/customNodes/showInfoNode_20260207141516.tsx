'use client'

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
  date: string;      // Display date string
  highlights: Highlight[];
  color_Tags: ColorTag[];
};

export default function ShowInfoNodetsxtsx(record_info:RecordType) {

  return (
    <div className="text-updater-node">
        <p className="title_record_info">{record_info.title}</p>
      
    </div>
  );
}