const LoadingSpin = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50 md:ml-60 lg:ml-60">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpin;
