// components/HeroSection.tsx
export function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-900">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
          backgroundSize: "50px 50px",
          animation: "gridMove 20s linear infinite",
        }}
      />

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4"
          style={{
            animation: "float1 7s ease-in-out infinite",
          }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-500/30">
            👤
          </div>
        </div>
        <div
          className="absolute top-1/3 right-1/4"
          style={{
            animation: "float2 9s ease-in-out infinite",
            animationDelay: "1.5s",
          }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30">
            💡
          </div>
        </div>
        <div
          className="absolute bottom-1/3 left-1/5"
          style={{
            animation: "float3 6s ease-in-out infinite",
            animationDelay: "3.2s",
          }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-amber-500/30">
            🎯
          </div>
        </div>
        <div
          className="absolute bottom-1/4 right-1/5"
          style={{
            animation: "float4 8s ease-in-out infinite",
            animationDelay: "0.8s",
          }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-rose-500/30">
            🤝
          </div>
        </div>
        <div
          className="absolute top-1/2 left-3/5"
          style={{
            animation: "float5 10s ease-in-out infinite",
            animationDelay: "4.7s",
          }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-violet-500/30">
            💰
          </div>
        </div>
      </div>

      {/* Chart movement effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 w-80 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent"
          style={{
            left: "-320px",
            animation: "chartMove 8s linear infinite",
          }}
        />
        <div
          className="absolute top-3/4 w-64 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent"
          style={{
            left: "-256px",
            animation: "chartMove 8s linear infinite",
            animationDelay: "4s",
          }}
        />
      </div>

      {/* Main content */}
      <div className="text-center z-10 max-w-4xl px-4">
        <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse"></div>
          <span className="text-5xl relative z-10">🧠</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-200 via-white to-blue-200 bg-clip-text text-transparent mb-6 leading-tight">
          Your Personal AI Partner
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed">
          Making smart investing accessible and personal for everyone
        </p>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes chartMove {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 320px));
            opacity: 0;
          }
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-15px) rotate(2deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-25px) rotate(-1deg);
            opacity: 1;
          }
          75% {
            transform: translateY(-10px) rotate(3deg);
            opacity: 0.9;
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-20px) rotate(-3deg);
            opacity: 0.9;
          }
          60% {
            transform: translateY(-30px) rotate(1deg);
            opacity: 1;
          }
          80% {
            transform: translateY(-8px) rotate(-2deg);
            opacity: 0.7;
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          20% {
            transform: translateY(-18px) rotate(4deg);
            opacity: 0.8;
          }
          45% {
            transform: translateY(-28px) rotate(-2deg);
            opacity: 1;
          }
          70% {
            transform: translateY(-12px) rotate(1deg);
            opacity: 0.9;
          }
        }

        @keyframes float4 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          35% {
            transform: translateY(-22px) rotate(-1deg);
            opacity: 0.9;
          }
          55% {
            transform: translateY(-32px) rotate(3deg);
            opacity: 1;
          }
          85% {
            transform: translateY(-5px) rotate(-4deg);
            opacity: 0.8;
          }
        }

        @keyframes float5 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.4;
          }
          40% {
            transform: translateY(-26px) rotate(2deg);
            opacity: 0.8;
          }
          65% {
            transform: translateY(-35px) rotate(-3deg);
            opacity: 1;
          }
          90% {
            transform: translateY(-7px) rotate(1deg);
            opacity: 0.7;
          }
        }
      `}</style>
    </section>
  );
}
