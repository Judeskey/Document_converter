/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // ----------------------------
      // OCR PDF to Word (slash -> hyphen)
      // ----------------------------
      {
        source: "/pdf/ocr-to-word",
        destination: "/pdf-ocr-to-word/ocr-pdf-to-word",
        permanent: true,
      },
      {
        source: "/pdf/ocr-to-word/:slug*",
        destination: "/pdf-ocr-to-word/:slug*",
        permanent: true,
      },

      // ----------------------------
      // PDF to Word (slash -> hyphen)
      // ----------------------------
      {
        source: "/pdf/to-word",
        destination: "/pdf-to-word/pdf-to-word-online",
        permanent: true,
      },
      {
        source: "/pdf/to-word/:slug*",
        destination: "/pdf-to-word/:slug*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
