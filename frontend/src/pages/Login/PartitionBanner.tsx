const PartitionBanner = () => {
  return (
    <section className="relative hidden h-full w-full overflow-hidden sm:block">
      <img
        src="https://i.ibb.co/0VnHwBJt/608846807-1398511675005631-8131168065788372364-n.jpg"
        alt="F-Code Banner"
        className="h-full w-full rounded-l-lg object-cover object-center transition-transform duration-300 hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-gray-900/70 via-gray-900/30 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8">
        <div className="space-y-2">
          <h2 className="text-2xl leading-tight font-bold drop-shadow-lg sm:text-3xl">CLB F-Code!</h2>
          <p className="text-xs font-normal text-white/85 drop-shadow-md sm:text-sm">
            Exploring IT Universe — Chào mừng bạn đến với sự kiện!
          </p>
        </div>
      </div>
      <div className="bg-primary/20 absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"></div>
    </section>
  );
};

export default PartitionBanner;
