import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fav-grad" x1="0" y1="0" x2="32" y2="32">
            <stop stopColor="#7c3aed" />
            <stop offset="0.5" stopColor="#6366f1" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="#0a0a0a" />
        <path
          d="M24 4H10C8.89543 4 8 4.89543 8 6V10C8 11.1046 8.89543 12 10 12H22C23.1046 12 24 12.8954 24 14V18C24 19.1046 23.1046 20 22 20H10C8.89543 20 8 20.8954 8 22V26C8 27.1046 8.89543 28 10 28H24"
          stroke="url(#fav-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 8L26 16L18 24"
          stroke="url(#fav-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 14L28 16L26 18L24 16L26 14Z"
          fill="url(#fav-grad)"
        />
      </svg>
    ),
    { ...size },
  );
}
