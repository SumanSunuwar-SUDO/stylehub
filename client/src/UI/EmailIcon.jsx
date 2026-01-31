import React from "react";

const EmailIcon = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" fillOpacity="0" d="M12 11l-8 -5h16l-8 5Z">
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="0.9s"
            dur="0.4s"
            to="1"
          />
        </path>

        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path
            strokeDasharray="66"
            d="M4 5h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-12c0 -0.55 0.45 -1 1 -1Z"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              dur="0.6s"
              values="66;0"
            />
          </path>

          <path
            strokeDasharray="24"
            strokeDashoffset="24"
            d="M3 6.5l9 5.5l9 -5.5"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.6s"
              dur="0.3s"
              to="0"
            />
          </path>
        </g>
      </svg>
    </div>
  );
};

export default EmailIcon;
