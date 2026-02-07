"use client";

import "./myJournal.scss";
import DetectiveBoard from "./components/DeteciveBoard/DetectiveBoard";
import { useEffect, useState } from "react";
// import { fetchDiaryMapData } from "./functions";
import { RecordType, ColorTag } from "./types/detectiveTypes";

export default function DiaryMapPage() {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [colorTags, setColorTags] = useState<ColorTag[]>([]);

//   useEffect(() => {
//     fetchDiaryMapData().then(({ records, colorTags }) => {
//       setRecords(records);
//       setColorTags(colorTags);
//     });
//   }, []);

  return (
    <main className="diary-map-page">
      <DetectiveBoard
        records={records}
        allColorTags={colorTags}
      />
    </main>
  );
}
