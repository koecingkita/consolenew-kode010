import { createSignal } from "solid-js";

function Login() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      console.log("Sign in:", { email: email(), password: password() });
      alert("Sign in successful!");
      setLoading(false);
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    alert("Sign in with Google clicked!");
  };


  return (
  <div class="min-h-screen bg-gradient-to-br from-violet-100 via-indigo-50 to-purple-100 relative overflow-hidden flex items-center justify-end px-4 md:pr-20">

    <div class="absolute top-8 left-8 z-20">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
        Clearfreight<span class="text-indigo-600">.</span>
      </h1>
    </div>


    <div class="absolute inset-0 overflow-hidden pointer-events-none">

      <svg
        class="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Continents - Simplified shapes */}
        <g opacity="0.15" fill="#8b9dc3">
          {/* Europe */}
          <ellipse cx="500" cy="200" rx="120" ry="80" />
          {/* Africa */}
          <ellipse cx="520" cy="350" rx="100" ry="140" />
          {/* Asia */}
          <ellipse cx="700" cy="250" rx="180" ry="120" />
          {/* Americas */}
          <ellipse cx="250" cy="300" rx="90" ry="160" />
          {/* Australia */}
          <ellipse cx="800" cy="500" rx="70" ry="50" />
        </g>

        {/* Shipping Routes - Curved lines */}
        <g stroke="#6366f1" stroke-width="3" fill="none" opacity="0.3">
          <path d="M 200 300 Q 400 250 600 280" stroke-dasharray="8,8">
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-16"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M 350 400 Q 500 380 650 350" stroke-dasharray="8,8">
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-16"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M 600 280 Q 750 300 850 320" stroke-dasharray="8,8">
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-16"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>

      {/* Location Pins */}
      <div
        class="absolute top-20 left-1/4 animate-bounce"
        style={{ animationduration: "3s" }}
      >
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
          <path
            d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20c0-6.6-5.4-12-12-12z"
            fill="#5b21b6"
          />
          <circle cx="12" cy="12" r="4" fill="white" />
        </svg>
      </div>

      <div
        class="absolute top-32 right-1/3 animate-bounce"
        style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
      >
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
          <path
            d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20c0-6.6-5.4-12-12-12z"
            fill="#5b21b6"
          />
          <circle cx="12" cy="12" r="4" fill="white" />
        </svg>
      </div>

      <div
        class="absolute bottom-1/3 left-1/3 animate-bounce"
        style={{ animationduration: "4s", animationDelay: "1s" }}
      >
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
          <path
            d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20c0-6.6-5.4-12-12-12z"
            fill="#5b21b6"
          />
          <circle cx="12" cy="12" r="4" fill="white" />
        </svg>
      </div>

      <div
        class="absolute bottom-1/4 right-1/4 animate-bounce"
        style={{ animationduration: "3.2s", animationDelay: "1.5s" }}
      >
        <svg width="20" height="28" viewBox="0 0 24 32" fill="none">
          <path
            d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20c0-6.6-5.4-12-12-12z"
            fill="#7c3aed"
          />
          <circle cx="12" cy="12" r="4" fill="white" />
        </svg>
      </div>

      {/* Cargo Ship Illustration */}
      <div class="absolute bottom-1/4 left-1/4 transform -translate-x-1/2">
        <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
          {/* Ship Body */}
          <path
            d="M 40 80 L 20 100 L 160 100 L 140 80 Z"
            fill="#1e293b"
            stroke="#0f172a"
            stroke-width="2"
          />

          {/* Containers */}
          <rect
            x="45"
            y="60"
            width="25"
            height="20"
            fill="#ef4444"
            stroke="#991b1b"
            stroke-width="1.5"
          />
          <rect
            x="72"
            y="60"
            width="25"
            height="20"
            fill="#3b82f6"
            stroke="#1e40af"
            stroke-width="1.5"
          />
          <rect
            x="99"
            y="60"
            width="25"
            height="20"
            fill="#10b981"
            stroke="#047857"
            stroke-width="1.5"
          />

          <rect
            x="58"
            y="38"
            width="25"
            height="20"
            fill="#f59e0b"
            stroke="#b45309"
            stroke-width="1.5"
          />
          <rect
            x="85"
            y="38"
            width="25"
            height="20"
            fill="#8b5cf6"
            stroke="#5b21b6"
            stroke-width="1.5"
          />

          {/* Ship Cabin */}
          <rect
            x="120"
            y="50"
            width="20"
            height="30"
            fill="#475569"
            stroke="#1e293b"
            stroke-width="1.5"
          />
          <rect x="123" y="53" width="5" height="5" fill="#fbbf24" />
          <rect x="132" y="53" width="5" height="5" fill="#fbbf24" />

          {/* Smoke/Steam */}
          <circle cx="145" cy="40" r="4" fill="#94a3b8" opacity="0.6">
            <animate
              attributeName="cy"
              values="40;25;40"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0.2;0.6"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="150" cy="45" r="3" fill="#cbd5e1" opacity="0.5">
            <animate
              attributeName="cy"
              values="45;30;45"
              dur="3.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.1;0.5"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {/* Additional small pins */}
      <div class="absolute top-1/4 left-1/2 w-3 h-3 bg-violet-600 rounded-full shadow-lg animate-pulse"></div>
      <div
        class="absolute bottom-1/2 right-1/3 w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-lg animate-pulse"
        style={{ animationDelay: "0.7s" }}
      ></div>
      <div
        class="absolute top-2/3 left-1/5 w-2 h-2 bg-purple-600 rounded-full shadow-lg animate-pulse"
        style={{ animationDelay: "1.2s" }}
      ></div>
    </div>

    <div class="relative z-10 bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md">
      <div class="mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Sign in to Clearfreight.
        </h2>
        <p class="text-sm text-gray-600">
          New here?{" "}
          <button class="text-indigo-600 hover:text-indigo-700 font-medium">
            Create an account
          </button>
        </p>
      </div>

      <div class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            placeholder="Email address"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Password Input */}
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <button class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            placeholder="Password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          disabled={loading()}
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading() ? "Signing in..." : "Sign in"}
        </button>

        {/* Divider */}
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500 font-medium">OR</span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
              fill="#4285F4"
            />
            <path
              d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
              fill="#34A853"
            />
            <path
              d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
              fill="#FBBC05"
            />
            <path
              d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.955.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>

  </div>)
}

export default Login;
