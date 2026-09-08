export default function Logo({ className = "w-20 h-20 md:w-24 md:h-24" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/favicon.svg"
        alt=""
        width="100"
        height="100"
        decoding="async"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
