import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const language = useSettingsStore((s) => s.language);

  const toggleLanguage = () => {
    const next = language === 'en' ? 'de' : 'en';
    setLanguage(next);
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-2 py-1 rounded-lg text-xs font-semibold text-secondary hover:text-accent 
                 hover:bg-surface-hover transition-all uppercase tracking-wide"
      title={language === 'en' ? 'Deutsch' : 'English'}
    >
      {language === 'en' ? 'DE' : 'EN'}
    </button>
  );
}
