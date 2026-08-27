import { useBuilder } from '../lib/BuilderContext.jsx';

export default function Toast() {
  const { toast } = useBuilder();
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111c34] border border-white/10 px-5 py-3 rounded-xl text-sm z-[400] shadow-2xl transition-all duration-200 ${
        toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      {toast}
    </div>
  );
}
