import { useState } from 'react';
import { colorMap, domainColorKey, domainLabels, letterTypeLabels } from '../data/situationData';
import { useT } from '../i18n';
import LanguageBadge from './LanguageBadge';
import FeedbackBar from './FeedbackBar';

export default function ResponseCard({ data, onGenerateLetter, onLiked }) {
  const { t } = useT();
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const domainColor = domainColorKey[data.domain] || 'gray';
  const c = colorMap[domainColor];

  function toggleStep(idx) {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  return (
    <div className="max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="flex items-center gap-2 flex-wrap px-5 pt-4 pb-2">
        {data.domain && (
          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${c.pill}`}>
            {domainLabels[data.domain] || data.domain}
          </span>
        )}
        <LanguageBadge language={data.detected_language} />
      </div>

      <div className="px-5 pb-5 space-y-4">
        {data.complexity_flag && (
          <div className="flex items-start gap-2 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <svg className="w-5 h-5 text-orange-500 dark:text-orange-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              {t('response.complexityWarning')}
            </p>
          </div>
        )}

        {data.rights_summary && (
          <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
            {data.rights_summary}
          </p>
        )}

        {data.cited_sections?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{t('response.legalCitations')}</h4>
            <div className="flex flex-wrap gap-1.5">
              {data.cited_sections.map((section, i) => (
                <span key={i} className="inline-flex items-center text-xs font-medium bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800 cursor-default">
                  {section}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.action_steps?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{t('response.actionSteps')}</h4>
            <div className="space-y-2">
              {data.action_steps.map((step, i) => {
                const done = completedSteps.has(i);
                return (
                  <button key={i} onClick={() => toggleStep(i)} className={`flex items-start gap-3 w-full text-left group transition-opacity ${done ? 'opacity-60' : ''}`}>
                    <span className={`shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 transition-colors ${done ? 'bg-green-500 text-white' : 'bg-teal-600 text-white group-hover:bg-teal-700'}`}>
                      {done ? '✓' : i + 1}
                    </span>
                    <span className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${done ? 'line-through' : ''}`}>{step}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {data.letter_types?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.letter_types.map((type, i) => (
              <button key={i} onClick={() => onGenerateLetter(type)} className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 dark:text-teal-300 bg-white dark:bg-gray-700 border-2 border-teal-200 dark:border-teal-700 rounded-lg px-3.5 py-2 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-400 dark:hover:border-teal-500 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                {t('response.generate')} {letterTypeLabels[type] || type}
              </button>
            ))}
          </div>
        )}

        {data.dlsa_office && (
          <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-teal-800 dark:text-teal-200 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {data.dlsa_office.name || t('response.nearestOffice')}
              </h4>
              {data.dlsa_office.free && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                  {t('response.free')}
                </span>
              )}
            </div>
            {data.dlsa_office.address && <p className="text-sm text-teal-700 dark:text-teal-300">{data.dlsa_office.address}</p>}
            {data.dlsa_office.phone && (
              <a href={`tel:${data.dlsa_office.phone}`} className="inline-flex items-center gap-1 text-sm font-medium text-teal-800 dark:text-teal-200 underline">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                {data.dlsa_office.phone}
              </a>
            )}
            {data.dlsa_office.timings && <p className="text-xs text-teal-600 dark:text-teal-400">{data.dlsa_office.timings}</p>}
          </div>
        )}

        {data.disclaimer && (
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed pt-1">{data.disclaimer}</p>
        )}

        <FeedbackBar onLiked={onLiked} />
      </div>
    </div>
  );
}
