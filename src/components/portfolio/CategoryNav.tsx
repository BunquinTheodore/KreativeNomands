import Link from 'next/link';
import { CATEGORIES, type CategoryId } from './categories';

interface CategoryNavProps {
  currentId: CategoryId;
}

/** Glass pills that jump to the other categories. */
export default function CategoryNav({ currentId }: CategoryNavProps) {
  const others = CATEGORIES.filter((category) => category.id !== currentId);

  return (
    <nav aria-label="Other categories" className="flex items-center gap-3">
      <span className="hidden flex-none text-xs font-semibold uppercase tracking-[0.2em] text-cream-500/50 md:inline">
        More work
      </span>
      <ul className="kp-row m-0 min-w-0 flex-1 list-none gap-2 p-0 py-1 [&>*:first-child]:ml-auto [&>*:last-child]:mr-auto">
        {others.map((category) => {
          const Icon = category.icon;
          return (
            <li key={category.id} className="flex-none">
              <Link
                href={`/portfolio/${category.id}`}
                data-sfx-hover=""
                className="kp-pill glass shine"
                aria-label={`${category.label} portfolio`}
              >
                <Icon className="relative z-10 h-3.5 w-3.5 text-secondary-400" aria-hidden="true" />
                <span className="relative z-10">{category.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
