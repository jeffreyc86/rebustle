interface AnswerFlashProps {
  answer: string;
  visible: boolean;
}

export function AnswerFlash({ answer, visible }: AnswerFlashProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 pointer-events-none ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-white rounded-3xl px-12 py-8 text-center shadow-2xl transition-transform duration-300 ${
          visible ? 'scale-100' : 'scale-95'
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-stone-400">Answer</p>
        <p className="text-4xl font-black uppercase tracking-wide" style={{ color: '#00A878' }}>{answer}</p>
      </div>
    </div>
  );
}
