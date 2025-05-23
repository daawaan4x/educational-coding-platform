import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		// No domains needed for local images, but include for completeness
		domains: [],
		// Optional: Specify formats for optimization
		formats: ['image/webp'],
	  },
};

export default nextConfig;
