/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Kita hapus bagian 'eslint' karena sudah tidak didukung di sini
}

module.exports = nextConfig