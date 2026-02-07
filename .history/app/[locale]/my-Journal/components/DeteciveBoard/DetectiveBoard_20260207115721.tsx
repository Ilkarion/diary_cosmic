"use client";

import "./detectiveBoard.scss";
import DetectiveNode from "../DetectiveNode/DetectiveNode";
import { RecordType, ColorTag } from "../../types/detectiveTypes";

export default function DetectiveBoard({
  records,
  allColorTags,
}: {
  records: RecordType[];
  allColorTags: ColorTag[];
}) {
  return (
    <div className="detective-board">
      <div className="detective-toolbar">
        {allColorTags.map((tag) => (
          <button key={tag.name} style={{ borderColor: tag.color }}>
            {tag.name}
          </button>
        ))}
      </div>

      <div className="detective-canvas">
        {records.map((rec) => (
          <DetectiveNode
            key={rec.id_record}
            record={rec}
            position={{ x: 100, y: 100 }}
            onMouseDown={() => {}}
            activeTag={null}
          />
        ))}
      </div>
    </div>
  );
}
