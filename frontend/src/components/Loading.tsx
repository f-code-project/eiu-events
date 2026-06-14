import { Commet } from 'react-loading-indicators';
const Loading = () => {
  return (
    <section className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="flex flex-col items-center gap-5 rounded-lg bg-white/10 p-8 shadow-2xl">
        <Commet color="#4ade80" size="medium" text="" textColor="" />
        <span className="text-base font-semibold text-white">Đang xử lý...</span>
      </div>
    </section>
  );
};

export default Loading;
