
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { LeaderboardEntry } from './types.ts';
import { INITIAL_DATA } from './constants.tsx';
import { Header } from './components/Header.tsx';
import { PyramidLayout } from './components/PyramidLayout.tsx';
import { Plus, X, Camera, MessageSquare, ShieldCheck, Loader2, Trophy, CreditCard, Lock, AlertTriangle } from 'lucide-react';

type ModalState = 'FORM' | 'PAYPAL_GATEWAY' | 'PROCESSING' | 'CONFIRMED' | 'ERROR';

const App: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('peak_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });

  const [showPayModal, setShowPayModal] = useState(false);
  const [modalState, setModalState] = useState<ModalState>('FORM');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [editMediaUrl, setEditMediaUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('peak_entries', JSON.stringify(entries));
  }, [entries]);

  const sortedEntries = [...entries].sort((a,b) => b.amount - a.amount);
  const selectedEntry = entries.find(e => e.id === selectedEntryId);
  const selectedRank = sortedEntries.findIndex(e => e.id === selectedEntryId);

  const currentAmount = parseFloat(newAmount || '0');
  const projectedRank = sortedEntries.findIndex(e => e.amount < currentAmount) + 1;
  const finalProjectedRank = projectedRank === 0 ? sortedEntries.length + 1 : projectedRank;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || isNaN(currentAmount) || currentAmount <= 0) return;
    setModalState('PAYPAL_GATEWAY');
  };

  const closePaymentModal = () => {
    setShowPayModal(false);
    setTimeout(() => {
      setModalState('FORM');
      setNewName('');
      setNewAmount('');
      setErrorMessage('');
    }, 300);
  };

  const handleUpdateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntryId) return;

    setEntries(prev => prev.map(entry => 
      entry.id === selectedEntryId 
        ? { ...entry, message: editMessage, mediaUrl: editMediaUrl } 
        : entry
    ));
    setEditMode(false);
  };

  const openDetail = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setEditMessage(entry.message || '');
      setEditMediaUrl(entry.mediaUrl || '');
    }
    setSelectedEntryId(id);
    setEditMode(false);
  };

  const getRankStyles = (rank: number) => {
    if (rank === 0) return { border: 'border-yellow-500', text: 'text-yellow-500' };
    if (rank === 1) return { border: 'border-zinc-300', text: 'text-zinc-300' };
    if (rank === 2) return { border: 'border-orange-800', text: 'text-orange-700' };
    return { border: 'border-white/20', text: 'text-white' };
  };

  // Initial options for PayPal provider
  const initialOptions = {
    clientId: "test", // Replace with real Client ID in production
    currency: "GBP",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="min-h-screen relative bg-black text-white selection:bg-white selection:text-black">
        <Header />

        <main className="mx-auto w-full relative z-10 px-4">
          <PyramidLayout entries={entries} onSelectItem={openDetail} />
        </main>

        <div className="fixed bottom-12 left-0 right-0 flex justify-center z-50 px-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPayModal(true)}
            className="bg-white text-black px-10 py-4 rounded-none font-bold text-sm tracking-widest flex items-center gap-2 hover:bg-zinc-200 transition-colors uppercase shadow-2xl shadow-white/10"
          >
            <Plus className="w-4 h-4" />
            Join the Peak
          </motion.button>
        </div>

        <AnimatePresence>
          {selectedEntry && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedEntryId(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              />
              
              <motion.div
                layoutId={`box-${selectedEntry.id}`}
                className={`relative w-full max-w-2xl bg-zinc-950 border ${getRankStyles(selectedRank).border} overflow-hidden flex flex-col md:flex-row shadow-2xl`}
                style={{ minHeight: '400px' }}
              >
                <button onClick={() => setSelectedEntryId(null)} className="absolute top-4 right-4 z-10 p-2 text-zinc-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>

                <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative border-b md:border-b-0 md:border-r border-zinc-900 overflow-hidden">
                  {selectedEntry.mediaUrl ? (
                    <img src={selectedEntry.mediaUrl} alt={selectedEntry.name} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="flex flex-col items-center text-zinc-800 opacity-20">
                      <Camera className="w-16 h-16 mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">NO MEDIA</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${getRankStyles(selectedRank).text}`}>
                      POSITION {(selectedRank + 1).toString().padStart(3, '0')}
                    </span>
                    <h2 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none ${getRankStyles(selectedRank).text}`}>
                      {selectedRank < 28 ? selectedEntry.name : `P${(selectedRank + 1).toString().padStart(3, '0')}`}
                    </h2>
                    <div className="mb-8">
                      <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest block mb-1">CONTRIBUTION</span>
                      <span className="text-2xl font-black">£{selectedEntry.amount.toFixed(2)}</span>
                    </div>

                    {!editMode ? (
                      <div className="space-y-4">
                        {selectedEntry.message ? (
                          <div>
                            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest block mb-2">BROADCAST</span>
                            <p className="text-zinc-300 text-lg font-medium leading-tight italic">"{selectedEntry.message}"</p>
                          </div>
                        ) : (
                          <p className="text-zinc-700 text-sm italic">Silence is for those who cannot afford a voice.</p>
                        )}
                        <button onClick={() => setEditMode(true)} className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                          <MessageSquare className="w-3 h-3" /> Update Status
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleUpdateEntry} className="space-y-6">
                        <input autoFocus value={editMessage} onChange={(e) => setEditMessage(e.target.value)} placeholder="Message..." className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-sm" />
                        <input value={editMediaUrl} onChange={(e) => setEditMediaUrl(e.target.value)} placeholder="Image URL..." className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-sm" />
                        <div className="flex gap-4">
                          <button type="submit" className="flex-1 bg-white text-black py-3 font-bold uppercase tracking-widest text-[10px]">Save</button>
                          <button type="button" onClick={() => setEditMode(false)} className="flex-1 border border-zinc-800 text-zinc-500 py-3 font-bold uppercase tracking-widest text-[10px]">Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                  <div className="mt-8 pt-8 border-t border-zinc-900">
                     <p className="text-[9px] text-zinc-700 uppercase tracking-widest font-black">ESTABLISHED {new Date(selectedEntry.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {showPayModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={modalState !== 'PROCESSING' ? closePaymentModal : undefined} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
              
              <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 p-10 shadow-2xl overflow-hidden">
                <AnimatePresence mode="wait">
                  {modalState === 'FORM' && (
                    <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <h2 className="text-3xl font-black mb-1 uppercase tracking-tighter text-white">Ascend</h2>
                      <p className="text-zinc-500 mb-8 text-[10px] font-bold uppercase tracking-[0.3em]">The Peak awaits payment</p>
                      
                      <form onSubmit={handleProceedToPayment} className="space-y-8">
                        <div>
                          <label className="block text-zinc-600 text-[10px] uppercase tracking-[0.2em] mb-2 font-black">Identification</label>
                          <input autoFocus required type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full Name" className="w-full bg-black border border-zinc-800 rounded-none px-4 py-4 text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-900 font-bold" />
                        </div>
                        <div>
                          <label className="block text-zinc-600 text-[10px] uppercase tracking-[0.2em] mb-2 font-black">Investment (£)</label>
                          <input required type="number" step="0.01" min="0.01" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="0.00" className="w-full bg-black border border-zinc-800 rounded-none px-4 py-4 text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-900 font-bold text-xl" />
                          {newAmount && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-[10px] text-yellow-500 uppercase font-black tracking-widest">
                              Projected Rank: #{finalProjectedRank}
                            </motion.p>
                          )}
                        </div>
                        <div className="pt-4">
                          <button type="submit" className="w-full bg-white text-black py-5 font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                            <CreditCard className="w-4 h-4" /> Secure My Place
                          </button>
                          <button type="button" onClick={closePaymentModal} className="w-full text-zinc-600 hover:text-zinc-400 py-4 text-[10px] uppercase tracking-[0.3em] transition-colors font-black">Abort</button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {modalState === 'PAYPAL_GATEWAY' && (
                    <motion.div key="gateway" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex flex-col items-center">
                      <h3 className="text-xl font-black uppercase tracking-widest mb-2">Final Step</h3>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-8 text-center">Checkout via Secure PayPal Gateway</p>
                      
                      <div className="w-full min-h-[150px]">
                        <PayPalButtons
                          style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              intent: "CAPTURE",
                              purchase_units: [{
                                amount: { currency_code: "GBP", value: newAmount },
                                description: `Ascension to Peak Rank #${finalProjectedRank}`
                              }]
                            });
                          }}
                          onApprove={async (data, actions) => {
                            if (actions.order) {
                              setModalState('PROCESSING');
                              try {
                                const details = await actions.order.capture();
                                const id = details.id || Math.random().toString(36).substr(2, 9);
                                const newEntry: LeaderboardEntry = {
                                  id,
                                  name: newName,
                                  amount: currentAmount,
                                  timestamp: Date.now(),
                                };
                                setEntries(prev => [...prev, newEntry]);
                                setModalState('CONFIRMED');
                              } catch (err) {
                                setErrorMessage('Capture failed. Please try again.');
                                setModalState('ERROR');
                              }
                            }
                          }}
                          onError={(err) => {
                            console.error("PayPal Error:", err);
                            setErrorMessage('The PayPal host refused the connection. This usually happens in restricted sandbox environments. Try in a standard browser tab.');
                            setModalState('ERROR');
                          }}
                        />
                      </div>

                      <div className="mt-8 flex items-center gap-2 text-zinc-700 text-[9px] font-bold uppercase tracking-widest">
                        <Lock className="w-3 h-3" /> Encrypted Transaction
                      </div>
                      <button onClick={() => setModalState('FORM')} className="mt-8 text-zinc-600 hover:text-white text-[10px] uppercase tracking-widest font-black transition-colors">Go Back</button>
                    </motion.div>
                  )}

                  {modalState === 'PROCESSING' && (
                    <motion.div key="processing" className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="relative mb-8">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-20 h-20 border-t-2 border-yellow-500 rounded-full" />
                        <Loader2 className="w-8 h-8 text-yellow-500 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-widest mb-2">Capturing Payment</h3>
                      <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em]">Updating the Peak records...</p>
                    </motion.div>
                  )}

                  {modalState === 'CONFIRMED' && (
                    <motion.div key="confirmed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500 flex items-center justify-center mb-8"><Trophy className="w-10 h-10 text-yellow-500" /></div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-yellow-500">Transaction Finalised</h3>
                      <p className="text-zinc-400 mb-8 text-sm font-medium">Welcome, <span className="text-white font-bold">{newName}</span>. The world is watching.</p>
                      <button onClick={closePaymentModal} className="w-full border border-white text-white py-5 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">Claim Rank #{finalProjectedRank}</button>
                    </motion.div>
                  )}

                  {modalState === 'ERROR' && (
                    <motion.div key="error" className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-16 h-16 border border-red-500 flex items-center justify-center mb-6 text-red-500">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-widest mb-4">Ascension Failed</h3>
                      <p className="text-zinc-500 text-[10px] leading-relaxed mb-8 uppercase tracking-widest font-bold">{errorMessage}</p>
                      <button onClick={() => setModalState('FORM')} className="w-full bg-white text-black py-4 font-black uppercase tracking-widest text-[10px]">Retry Ascension</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PayPalScriptProvider>
  );
};

export default App;
