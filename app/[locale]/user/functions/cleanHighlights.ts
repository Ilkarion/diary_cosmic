import { AllTags_Records } from "../../allTypes/typesTS";

const normalize = (c: string) => c.toLowerCase().replace(/\s/g, "");

const hexToRgba = (hex: string, alpha = 0.6) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function cleanDiaryByGlobalColorsAndTags(data: AllTags_Records): AllTags_Records {
  // 🔹 Разрешённые цвета
  const allowedColors = new Set(
    data.diaryAllTags.all_Color_Tags.map(t => normalize(t.color))
  );

  const allowedAllColors = new Set(
    data.diaryAllTags.all_Color_Tags.flatMap(t => [
      normalize(t.color),
      normalize(hexToRgba(t.color, 0.6)),
      normalize(hexToRgba(t.color, 0.7)),
    ])
  );

  // 🔹 Разрешённые глобальные теги
  const allowedTags = new Set(data.diaryAllTags.all_Tags.map(t => t.toLowerCase()));

  return {
    ...data,

    // 🔹 обновляем записи
    diaryRecords: (data.diaryRecords ?? []).map(record => ({
      ...record,

      // highlights
      highlights: (record.highlights ?? []).map(h => {
        if (!h.color) return h;
        const ok = allowedAllColors.has(normalize(h.color));
        return { ...h, color: ok ? h.color : "" };
      }),

      // color_Tags
      color_Tags: (record.color_Tags ?? []).filter(tag =>
        allowedColors.has(normalize(tag.color))
      ),

      // tags записи
      tags: (record.tags ?? []).filter(tag =>
        allowedTags.has(tag.toLowerCase())
      ),
    })),

    // 🔹 обновляем глобальные теги в diaryAllTags
    diaryAllTags: {
      ...data.diaryAllTags,
      all_Tags: (data.diaryAllTags.all_Tags ?? []).filter(tag =>
        allowedTags.has(tag.toLowerCase())
      ),
    },
  };
}

