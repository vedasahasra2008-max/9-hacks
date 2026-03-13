import { useState, useRef, useEffect } from 'react';
import { postQuery, getDLSA } from '../api';
import { useT } from '../i18n';
import ResponseCard from './ResponseCard';
import LoadingSkeleton from './LoadingSkeleton';
import ClarificationFlow from './ClarificationFlow';

export default function ChatInterface({ situationType, onOpenLetterModal }) {
  const { t } = useT();
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPincode, setShowPincode] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const pincodeInputRef = useRef(null);
  const pendingClarificationRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, showPincode]);

  useEffect(() => {
    if (showPincode) pincodeInputRef.current?.focus();
  }, [showPincode]);

  async function sendQuery(text, extraContext) {
    const fullText = extraContext ? `${text}\n\nAdditional info: ${extraContext}` : text;
    setMessages((prev) => [...prev, { role: 'user', text: fullText }]);
    setLoading(true);

    try {
      const data = await postQuery({ text: fullText, situation_type: situationType || undefined });
      if (data.clarification_needed) {
        pendingClarificationRef.current = fullText;
        setMessages((prev) => [...prev, { role: 'clarification', question: data.clarification_question, data }]);
      } else {
        pendingClarificationRef.current = null;
        setMessages((prev) => [...prev, { role: 'ai', data }]);
      }
    } catch (err) {
      const detail = err.response?.data?.detail || t('chat.errorFallback');
      setMessages((prev) => [...prev, { role: 'error', text: detail }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim() || loading) return;
    const text = query.trim();
    setQuery('');
    setShowPincode(false);
    setPincode('');
    sendQuery(text);
  }

  function handleClarificationAnswer(answer) {
    sendQuery(pendingClarificationRef.current || '', answer);
  }

  async function handlePincodeSubmit(e) {
    e.preventDefault();
    if (!pincode.trim() || pincode.length < 6 || pincodeLoading) return;
    setPincodeLoading(true);
    try {
      const dlsa = await getDLSA(pincode.trim());
      setMessages((prev) => [...prev, { role: 'dlsa', data: dlsa }]);
      setShowPincode(false);
      setPincode('');
    } catch (err) {
      const detail = err.response?.data?.detail || t('chat.pincodeError');
      setMessages((prev) => [...prev, { role: 'error', text: detail }]);
    } finally {
      setPincodeLoading(false);
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 pb-6">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
        <div className="min-h-[200px] max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{t('chat.emptyState')}</p>
            </div>
          )}

          {messages.map((msg, i) => {
            if (msg.role === 'user') return (
              <div key={i} className="flex justify-end">
                <div className="max-w-xs sm:max-w-sm bg-teal-600 text-white rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed shadow-sm">{msg.text}</div>
              </div>
            );
            if (msg.role === 'ai') return (
              <div key={i} className="flex justify-start">
                <ResponseCard data={msg.data} onGenerateLetter={onOpenLetterModal} onLiked={() => setShowPincode(true)} />
              </div>
            );
            if (msg.role === 'clarification') return (
              <div key={i} className="flex justify-start">
                <ClarificationFlow question={msg.question} onSubmit={handleClarificationAnswer} />
              </div>
            );
            if (msg.role === 'dlsa') return (
              <div key={i} className="flex justify-start"><DLSACard data={msg.data} /></div>
            );
            if (msg.role === 'error') return (
              <div key={i} className="flex justify-start">
                <div className="max-w-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl px-4 py-3 text-sm">{msg.text}</div>
              </div>
            );
            return null;
          })}

          {loading && <div className="flex justify-start"><LoadingSkeleton /></div>}
          <div ref={messagesEndRef} />
        </div>

        {showPincode && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-teal-50 dark:bg-teal-900/20 px-3 sm:px-4 py-3 transition-colors">
            <form onSubmit={handlePincodeSubmit} className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                <svg className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <input ref={pincodeInputRef} type="text" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder={t('chat.pincodePlaceholder')} className="flex-1 rounded-xl border border-teal-200 dark:border-teal-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors" disabled={pincodeLoading} />
              </div>
              <button type="submit" disabled={pincode.length < 6 || pincodeLoading} className="bg-teal-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 shrink-0">
                {pincodeLoading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                )}
                {t('chat.findOffice')}
              </button>
              <button type="button" onClick={() => { setShowPincode(false); setPincode(''); }} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Dismiss">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </form>
          </div>
        )}

        <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4 transition-colors">
          <div className="flex gap-2">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('chat.placeholder')} className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors" disabled={loading} />
            <button type="submit" disabled={!query.trim() || loading} className="bg-teal-600 text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shrink-0">
              {loading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
              )}
              {t('chat.send')}
            </button>
          </div>
          {situationType && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 pl-1">
              {t('chat.context')}: <span className="font-medium text-gray-500 dark:text-gray-400">{situationType.replace('_', ' ')}</span>
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function DLSACard({ data }) {
  const { t } = useT();
  const office = data?.office || data;
  const name = office?.name || office?.office_name || t('response.nearestOffice');
  const address = office?.address || '';
  const phone = office?.phone || office?.contact || '';
  const timings = office?.timings || office?.working_hours || '';
  const isFree = office?.free;

  return (
    <div className="max-w-lg bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-2xl p-4 space-y-1.5 transition-colors">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold text-teal-800 dark:text-teal-200 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
          {name}
        </h4>
        {isFree && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">{t('response.free')}</span>
        )}
      </div>
      {address && <p className="text-sm text-teal-700 dark:text-teal-300">{address}</p>}
      {phone && (
        <a href={`tel:${phone}`} className="inline-flex items-center gap-1 text-sm font-medium text-teal-800 dark:text-teal-200 underline">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
          {phone}
        </a>
      )}
      {timings && <p className="text-xs text-teal-600 dark:text-teal-400">{timings}</p>}
    </div>
  );
}
