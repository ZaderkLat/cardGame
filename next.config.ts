import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Aquí van tus otras opciones de configuración si las tenías */
  
  // Ponlo directamente en la raíz, NO dentro de experimental:
  allowedDevOrigins: ['192.168.40.53'],
};

export default nextConfig;