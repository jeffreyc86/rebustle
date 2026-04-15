interface AnswerFlashProps {
  answer: string;
  visible: boolean;
}

export function AnswerFlash({ answer, visible }: AnswerFlashProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none transition-opacity ease-in-out ${
        visible ? 'opacity-100 duration-150' : 'opacity-0 duration-500'
      }`}
    >
      <div
        className={`bg-white rounded-3xl px-14 py-10 text-center shadow-2xl transition-transform ease-in-out ${
          visible ? 'scale-100 duration-200' : 'scale-95 duration-500'
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-stone-400">Answer</p>
        <p className="text-4xl font-black uppercase tracking-wide" style={{ color: '#00A878' }}>{answer}</p>
      </div>
    </div>
  );
}
