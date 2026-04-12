interface AnswerFlashProps {
  answer: string;
  visible: boolean;
}

export function AnswerFlash({ answer, visible }: AnswerFlashProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-green-500 text-black rounded-3xl px-12 py-8 text-center shadow-2xl animate-pulse">
        <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Answer</p>
        <p className="text-4xl font-black uppercase tracking-wide">{answer}</p>
      </div>
    </div>
  );
}
