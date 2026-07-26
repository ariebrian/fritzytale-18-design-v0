/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Lets the Next.js dev server serve JS/RSC payloads when the app is reached
  // through a tunnel (ngrok, etc.) instead of localhost — otherwise dev mode
  // blocks cross-origin asset requests and the page never hydrates past the
  // server-rendered first paint.
  allowedDevOrigins: [
    '*.ngrok-free.app',
    '*.ngrok-free.dev',
    '*.ngrok.app',
    '*.ngrok.dev',
    '*.ngrok.io',
  ],
}

export default nextConfig
