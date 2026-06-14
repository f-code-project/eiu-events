const NoAccess = () => {
  return (
    <section className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <div className="flex flex-col items-center gap-4 rounded-lg p-6">
        <img src="/no-access.png" alt="No Access" className="max-h-[90%] max-w-[90%]" />
        <span className="font-bold text-red-600">
          [F-CODE] Bạn đang truy cập vào vùng không được phép. Nhật ký đã ghi lại lịch sử truy cập của bạn!
        </span>
      </div>
    </section>
  );
};

export default NoAccess;
