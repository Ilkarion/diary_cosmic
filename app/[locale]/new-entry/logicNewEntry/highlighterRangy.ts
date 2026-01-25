// // const rangy: any = require("rangy");
// // require("rangy/lib/rangy-classapplier");
// import "rangy/lib/rangy-classapplier";

// export type HighlightBlock = {
//   text: string;
//   color: string | null;
// };

// interface RangyClassApplier {
//   applyToSelection(options?: { elementProperties?: Record<string, string> }): void;
//   undoToSelection(): void;
// }

// interface RangyWithClassApplier {
//   createClassApplier(className: string, options?: {
//     elementTagName?: string;
//     normalize?: boolean;
//     elementProperties?: (el: HTMLElement) => Record<string, string>;
//   }): RangyClassApplier;
// }

// rangy.init();

// /**
//  * ClassApplier для подсветки
//  * цвет мы будем задавать через data атрибут
//  */



// /**
//  * Обернуть выделение в span с цветом
//  */
// const highlightApplier: RangyClassApplier = (rangy as unknown as RangyWithClassApplier)
//   .createClassApplier("rangy-highlight", {
//     elementTagName: "span",
//     normalize: true,
//     elementProperties: (el: HTMLElement) => ({
//       style: `background-color: ${el.getAttribute("data-color") || "yellow"}`,
//     }),
//   });

// /**
//  * Очистить выделение цвета
//  */
// export function applyHighlight(color: string) {
//   const sel = rangy.getSelection();
//   if (sel.isCollapsed) return;
//   highlightApplier.applyToSelection({
//     elementProperties: { "data-color": color },
//   });
// }

// export function removeHighlight() {
//   const sel = rangy.getSelection();
//   if (sel.isCollapsed) return;
//   highlightApplier.undoToSelection();
// }

// /**
//  * Извлечь структуру текста с цветами
//  */
// export function getRangyBlocks(container: HTMLElement): HighlightBlock[] {
//   const result: HighlightBlock[] = [];

//   container.childNodes.forEach(node => {
//     if (node.nodeType === Node.TEXT_NODE) {
//       const text = node.textContent?.trim();
//       if (text) result.push({ text, color: null });
//     } else if (node.nodeType === Node.ELEMENT_NODE) {
//       const el = node as HTMLElement;
//       if (el.classList.contains("rangy-highlight")) {
//         const text = el.textContent?.trim() || "";
//         const color = el.dataset.color ?? null;
//         if (text) result.push({ text, color });
//       } else {
//         // рекурсивно пробегаем детей
//         result.push(...getRangyBlocks(el));
//       }
//     }
//   });

//   return result;
// }
