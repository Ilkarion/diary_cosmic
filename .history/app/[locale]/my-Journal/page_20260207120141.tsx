"use client";

import "./myJournal.scss";
import DetectiveBoard from "./components/DeteciveBoard/DetectiveBoard";
import { useEffect, useState } from "react";

import { RecordType, ColorTag } from "./types/detectiveTypes";
import { fetchDiary } from "../new-entry/logicNewEntry/functions";

export default function DiaryMapPage() {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [colorTags, setColorTags] = useState<ColorTag[]>([]);

  useEffect(() => {
    fetchDiary().then(({ diaryRecords, diaryAllTags }) => {
      setRecords(diaryRecords);
      setColorTags(diaryAllTags.all_Color_Tags);
    });
  }, []);

  return (
    <main className="diary-map-page">
      <DetectiveBoard
        records={records}
        allColorTags={colorTags}
      />
    </main>
  );
}
