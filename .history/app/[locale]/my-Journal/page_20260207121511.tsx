"use client";

import { useEffect, useState } from "react";
import DetectiveBoard from "./components/DeteciveBoard/DetectiveBoard";
import { RecordType, ColorTag } from "./types/detectiveTypes";
import { fetchDiary } from "../new-entry/logicNewEntry/functions";
// import { fetchDiary } from "../new-entry/logicNewEntry/functions"; 
// Assuming this import works for you, otherwise use the mock below.

// Mock data if fetch is unavailable
const MOCK_RECORDS: RecordType[] = [
    {
        id_record: "1",
        title: "Mystery of the Code",
        created_at: new Date().toISOString(),
        highlights: [{ text: "Bug found", color: "#ff0000" }],
        color_Tags: [{ name: "bug", color: "#ff0000" }]
    },
    {
        id_record: "2",
        title: "Next.js Migration",
        created_at: new Date().toISOString(),
        highlights: [{ text: "Success", color: "#00ff00" }],
        color_Tags: [{ name: "feat", color: "#00ff00" }]
    }
];

export default function DiaryMapPage() {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [colorTags, setColorTags] = useState<ColorTag[]>([]);

  useEffect(() => {
    fetchDiary().then(({ diaryRecords, diaryAllTags }) => {
        console.log(diaryRecords, diaryAllTags)
      setRecords(diaryRecords);
      setColorTags(diaryAllTags.all_Color_Tags);
    });
  }, []);

  return (
    <main className="w-screen h-screen">
      <DetectiveBoard
        records={records}
        allColorTags={colorTags}
      />
    </main>
  );
}
