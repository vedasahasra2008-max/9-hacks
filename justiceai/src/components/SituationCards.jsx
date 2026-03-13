import { useState } from 'react';
import { colorMap } from '../data/situationData';
import { useT } from '../i18n';

const situationKeys = ['labour', 'domestic_violence', 'land_property', 'sc_st'];
const situationTypeMap = {
  labour: 'labour',
  domestic_violence: 'family_dv',
  land_property: 'civil',
  sc_st: 'scst',
};
const colorKeys = {
  labour: 'green',
  domestic_violence: 'red',
  land_property: 'amber',
  sc_st: 'purple',
};

const icons = {
  labour: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.025 1.193-.14 1.743" />
    </svg>
  ),
  domestic_violence: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  land_property: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21" />
    </svg>
  ),
  sc_st: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
    </svg>
  ),
};

export default function SituationCards({ onSelectSituation }) {
  const { t } = useT();
  const [expanded, setExpanded] = useState(null);

  function handleClick(key) {
    const isExpanding = expanded !== key;
    setExpanded(isExpanding ? key : null);
    if (isExpanding) {
      onSelectSituation(situationTypeMap[key]);
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
        {t('cards.heading')}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {t('cards.subheading')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {situationKeys.map((key) => {
          const c = colorMap[colorKeys[key]];
          const isOpen = expanded === key;
          const title = t(`situations.${key}.title`);
          const titleHi = t(`situations.${key}.titleHi`);
          const description = t(`situations.${key}.description`);
          const rights = t(`situations.${key}.rights`);
          return (
            <button
              key={key}
              onClick={() => handleClick(key)}
              className={`text-left w-full rounded-xl border-2 p-4 transition-all duration-200 ${c.bg} ${c.border} ${c.hover} ${
                isOpen ? 'shadow-lg' : 'shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${c.accent} text-white shrink-0`}>
                  {icons[key]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold ${c.text}`}>{title}</h3>
                      {title !== titleHi && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{titleHi}</p>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
                </div>
              </div>

              {isOpen && Array.isArray(rights) && (
                <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 space-y-2">
                  {rights.map((right, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={`shrink-0 w-5 h-5 rounded-full ${c.accent} text-white text-xs font-bold flex items-center justify-center mt-0.5`}>
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{right}</p>
                    </div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
