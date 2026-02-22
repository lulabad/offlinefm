import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/common/Modal';

const shortcuts = [
  { keys: 'Space', action: 'shortcuts.playPause' },
  { keys: '→', action: 'shortcuts.seekForward' },
  { keys: '←', action: 'shortcuts.seekBackward' },
  { keys: 'Shift + →', action: 'shortcuts.nextTrack' },
  { keys: 'Shift + ←', action: 'shortcuts.prevTrack' },
  { keys: '↑', action: 'shortcuts.volumeUp' },
  { keys: '↓', action: 'shortcuts.volumeDown' },
  { keys: 'M', action: 'shortcuts.mute' },
  { keys: 'S', action: 'shortcuts.shuffle' },
  { keys: 'R', action: 'shortcuts.repeat' },
  { keys: 'Ctrl + F', action: 'shortcuts.search' },
  { keys: 'Ctrl + O', action: 'shortcuts.openFolder' },
  { keys: '?', action: 'shortcuts.showShortcuts' },
];

export function ShortcutsOverlay() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen((o) => !o);
    document.addEventListener('offlinefm:toggle-shortcuts', handler);
    return () => document.removeEventListener('offlinefm:toggle-shortcuts', handler);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('shortcuts.title')}>
      <div className="space-y-2">
        {shortcuts.map((s) => (
          <div key={s.keys} className="flex items-center justify-between py-1">
            <span className="text-sm text-primary">{t(s.action)}</span>
            <kbd className="px-2 py-0.5 bg-surface-hover text-secondary text-xs rounded-md border border-app font-mono shadow-soft">
              {s.keys}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
}
