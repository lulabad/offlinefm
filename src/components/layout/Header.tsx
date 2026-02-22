import { useTranslation } from 'react-i18next';
import { SearchInput } from '@/components/common/SearchInput';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useLibraryStore } from '@/stores/libraryStore';
import type { LibraryView } from '@/types';

export function Header() {
  const { t } = useTranslation();
  const searchQuery = useLibraryStore((s) => s.searchQuery);
  const search = useLibraryStore((s) => s.search);
  const view = useLibraryStore((s) => s.view);
  const setView = useLibraryStore((s) => s.setView);

  const views: { key: LibraryView; label: string }[] = [
    { key: 'tracks', label: t('library.tracks') },
    { key: 'albums', label: t('library.albums') },
    { key: 'artists', label: t('library.artists') },
  ];

  return (
    <header className="flex items-center gap-3 px-4 py-3 bg-surface border-b border-app transition-theme">
      {/* View toggle */}
      <div className="flex items-center bg-app rounded-lg p-0.5">
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={`px-3 py-1.5 text-sm font-display rounded-md transition-all ${
              view === v.key
                ? 'bg-accent text-on-accent font-semibold shadow-soft'
                : 'text-secondary hover:text-primary'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <SearchInput value={searchQuery} onChange={search} />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 ml-auto">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </header>
  );
}
