import { Overlay } from './Overlay';

interface AnswerFlashProps {
  answer: string;
  visible: boolean;
}

export function AnswerFlash({ answer, visible }: AnswerFlashProps) {
  return (
    <Overlay visible={visible} zIndex="z-50">
      <p className="text-xs font-bold uppercase tracking-widest mb-2 text-stone-400">Answer</p>
      <p className="text-4xl font-black uppercase tracking-wide" style={{ color: '#00A878' }}>{answer}</p>
    </Overlay>
  );
}
