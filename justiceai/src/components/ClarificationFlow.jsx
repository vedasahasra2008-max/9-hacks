import { useState } from 'react';
import { useT } from '../i18n';

export default function ClarificationFlow({ question, onSubmit }) {
  const { t } = useT();
  const [answer, setAnswer] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!answer.trim()) return;
    onSubmit(answer.trim());
    setAnswer('');
  }

  return (
    <div className="max-w-lg space-y-3">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 px-5 py-4 transition-colors">
        <div className="flex items-start gap-2 mb-2">
          <span className="inline-flex items-center text-xs font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full">
            {t('clarification.badge')}
          </span>
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{question}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t('clarification.placeholder')}
          className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!answer.trim()}
          className="bg-teal-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {t('chat.send')}
        </button>
      </form>
    </div>
  );
}
