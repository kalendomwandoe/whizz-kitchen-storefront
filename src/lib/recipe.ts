export interface IngredientGroup {
  heading: string | null;
  items: string[];
}

// A line like "— Buns —" is a section heading, not an ingredient
const HEADING = /^—\s*(.+?)\s*—$/;

export function groupIngredients(lines: string[]): IngredientGroup[] {
  const groups: IngredientGroup[] = [];
  let current: IngredientGroup | null = null;

  for (const line of lines) {
    const heading = line.trim().match(HEADING)?.[1];

    if (heading) {
      current = { heading, items: [] };
      groups.push(current);
    } else {
      if (!current) {
        current = { heading: null, items: [] };
        groups.push(current);
      }
      current.items.push(line);
    }
  }

  return groups.filter((group) => group.items.length > 0);
}

// Splits the numbered method from the chef's "Tip: ..." notes
export function splitSteps(steps: string[]): { method: string[]; tips: string[] } {
  const method: string[] = [];
  const tips: string[] = [];

  for (const step of steps) {
    const tip = step.match(/^tip:\s*(.+)$/i)?.[1];
    if (tip) tips.push(tip);
    else method.push(step);
  }

  return { method, tips };
}