import { useState, useEffect } from 'react';
import { useT } from './i18n';
import Header from './components/Header';
import SituationCards from './components/SituationCards';
import ChatInterface from './components/ChatInterface';
import LetterModal from './components/LetterModal';

export default function App() {
  const { t } = useT();
  const [situationType, setSituationType] = useState('');
  const [letterModal, setLetterModal] = useState(null);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('justiceai-dark');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('justiceai-dark', String(dark));
  }, [dark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header dark={dark} onToggleDark={() => setDark((d) => !d)} />

      <main className="pb-8">
        <SituationCards onSelectSituation={setSituationType} />

        <ChatInterface
          situationType={situationType}
          onOpenLetterModal={(type) => setLetterModal(type)}
        />
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors px-4">
        {t('footer.disclaimer')}
      </footer>

      {letterModal && (
        <LetterModal
          letterType={letterModal}
          onClose={() => setLetterModal(null)}
        />
      )}
    </div>
  );
}
