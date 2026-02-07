'use client'

import ColorTagsUser from "@/app/[locale]/user/components/recentEntries/components/ColorTagsUser";
import ColorText from "@/app/[locale]/user/components/recentEntries/components/colorText";

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

export default function ShowInfoNodetsxtsx(record_info:RecordType) {
    const short_date = new Date(record_info.created_at).toISOString()
  return (
    <div className="text-updater-node">
        <p className="title_record_info">{record_info.title}</p>
        <div className="divine_line_info"></div>
        <ColorTagsUser tags={record_info.color_Tags}/>
        <ColorText highlights={record_info.highlights}/>
        <p>{short_date}</p>


    </div>
  );
}