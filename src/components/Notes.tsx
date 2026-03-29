import React, { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Trash2, MessageSquare, Send, X } from 'lucide-react';

interface NoteMessage {
  id: string;
  text: string;
  timestamp: number;
}

export default function Notes() {
  const [messages, setMessages] = useLocalStorage<NoteMessage[]>('dosesafe_chat_notes', []);
  const [inputValue, setInputValue] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: NoteMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      timestamp: Date.now(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const confirmClearMessages = () => {
    setMessages([]);
    setShowConfirmDelete(false);
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-2xl text-emerald-500 dark:text-emerald-400">
            <MessageSquare size={24} />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Notes</h2>
        </div>
        {messages.length > 0 && (
          <button 
            onClick={() => setShowConfirmDelete(true)}
            className="text-slate-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 active:scale-95 p-3 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 transition-all"
            title="Effacer tout"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 space-y-6 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-zinc-500 space-y-4 opacity-50 mt-20">
            <MessageSquare size={48} />
            <p className="text-center text-sm font-medium max-w-[250px]">
              Envoyez-vous des messages pour garder une trace de vos constantes, transmissions, etc.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex flex-col items-end w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-emerald-500 text-white px-5 py-4 rounded-3xl rounded-tr-sm shadow-[0_0_20px_rgba(16,185,129,0.15)] max-w-[85%]">
                <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed font-medium">{msg.text}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-2 mr-2">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Fixed Input Area */}
      <div 
        className="fixed left-0 right-0 px-4 pt-4 bg-gradient-to-t from-slate-50 via-slate-50/95 dark:from-black dark:via-black/95 to-transparent z-40"
        style={{ bottom: 'calc(6.5rem + env(safe-area-inset-bottom))' }}
      >
        <form onSubmit={handleSend} className="flex items-end space-x-2 pb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Écrire une note..."
            className="flex-1 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-slate-200 dark:border-white/10 placeholder-slate-400 dark:placeholder-zinc-500 shadow-inner transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-4 bg-emerald-500 text-white rounded-full disabled:opacity-50 disabled:bg-slate-200 dark:disabled:bg-zinc-800 transition-all flex-shrink-0 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 dark:bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Effacer les notes</h3>
              <button onClick={() => setShowConfirmDelete(false)} className="text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white active:scale-95 transition-all bg-slate-100 dark:bg-black p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 mb-8 text-sm leading-relaxed">
              Êtes-vous sûr de vouloir effacer toutes vos notes ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-4 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white rounded-2xl font-bold active:scale-95 transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={confirmClearMessages}
                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold active:scale-95 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                Effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
