import { AllTags_Records } from "../../new-entry/entry-types/types";

const normalize = (c: string) => c.toLowerCase().replace(/\s/g, "");

const hexToRgba = (hex: string, alpha = 0.6) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function cleanDiaryByGlobalColors(data: AllTags_Records): AllTags_Records {
  const allowed = new Set(
    data.diaryAllTags.all_Color_Tags.flatMap(t => [
      normalize(t.color),
      normalize(hexToRgba(t.color, 0.6)),
      normalize(hexToRgba(t.color, 0.7)),
    ])
  );

  return {
    ...data,
    diaryRecords: data.diaryRecords.map(record => ({
      ...record,
      highlights: record.highlights.map(h => {
        if (!h.color) return h;
        const ok = allowed.has(normalize(h.color));
        return { ...h, color: ok ? h.color : "" };
      }),
    })),
  };
}
