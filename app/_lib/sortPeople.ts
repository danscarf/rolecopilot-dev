import type { Person } from '../_providers/MeetingProvider';

export type SortOrder = 'roster' | 'most' | 'az';

export function sortPeopleBy(
  people: Person[],
  order: SortOrder,
  getCount?: (id: string) => number
): Person[] {
  const sorted = [...people];
  switch (order) {
    case 'az':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'most':
      return sorted.sort((a, b) => (getCount?.(b.id) ?? 0) - (getCount?.(a.id) ?? 0));
    case 'roster':
    default:
      return sorted;
  }
}
