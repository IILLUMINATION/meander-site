"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface GoogleSignInButtonProps {
  onSuccess: (response: CredentialResponse) => void;
  onError?: () => void;
  variant?: "compact" | "wide";
  label?: string;
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  variant = "compact",
  label,
}: GoogleSignInButtonProps) {
  const buttonText = label ?? "Войти с Google";
  const widthDesktop = 170;
  const widthMobile = 160;
  const heightDesktop = 40;
  const heightMobile = 38;

  return (
    <>
      <style>{`
        .m3-gsi-v2 {
          position: relative;
          display: inline-block;
          width: ${widthDesktop}px;
          height: ${heightDesktop}px;
        }
        .m3-gsi-v2__surface {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 12px;
          background: var(--m3-surface-container, #1f1d24);
          color: var(--m3-on-surface, #e6e1e5);
          border-radius: ${heightDesktop / 2}px;
          font-family: var(--font-geist-sans), system-ui, -apple-system, sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1px;
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.35),
            0 2px 6px rgba(0, 0, 0, 0.18);
          cursor: pointer;
          transition:
            background 220ms cubic-bezier(0.2, 0, 0, 1),
            box-shadow 220ms cubic-bezier(0.2, 0, 0, 1),
            transform 220ms cubic-bezier(0.2, 0, 0, 1);
          user-select: none;
          white-space: nowrap;
          pointer-events: none;
          overflow: hidden;
        }
        .m3-gsi-v2__surface::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--m3-on-surface, #e6e1e5);
          opacity: 0;
          transition: opacity 200ms ease;
          pointer-events: none;
          border-radius: inherit;
        }
        .m3-gsi-v2:hover .m3-gsi-v2__surface {
          box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.4),
            0 4px 12px rgba(0, 0, 0, 0.25);
          transform: translateY(-1px);
        }
        .m3-gsi-v2:hover .m3-gsi-v2__surface::before {
          opacity: 0.08;
        }
        .m3-gsi-v2:active .m3-gsi-v2__surface {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        .m3-gsi-v2:active .m3-gsi-v2__surface::before {
          opacity: 0.12;
        }
        .m3-gsi-v2__bubble {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
          position: relative;
          z-index: 1;
        }
        .m3-gsi-v2__icon {
          width: 14px;
          height: 14px;
          display: block;
        }
        .m3-gsi-v2__text {
          position: relative;
          z-index: 1;
          line-height: 1;
        }
        .m3-gsi-v2__real {
          position: absolute;
          inset: 0;
          opacity: 0;
          z-index: 5;
          overflow: hidden;
          border-radius: ${heightDesktop / 2}px;
        }
        .m3-gsi-v2__real > div,
        .m3-gsi-v2__real iframe {
          width: 100% !important;
          height: 100% !important;
          min-width: 100% !important;
          max-width: 100% !important;
        }
        @media (max-width: 480px) {
          .m3-gsi-v2 {
            width: ${widthMobile}px;
            height: ${heightMobile}px;
          }
          .m3-gsi-v2__surface {
            font-size: 12px;
            gap: 8px;
            padding: 0 10px;
            border-radius: ${heightMobile / 2}px;
          }
          .m3-gsi-v2__bubble {
            width: 22px;
            height: 22px;
          }
          .m3-gsi-v2__icon {
            width: 13px;
            height: 13px;
          }
          .m3-gsi-v2__real {
            border-radius: ${heightMobile / 2}px;
          }
        }
      `}</style>

      <div className="m3-gsi-v2" data-variant={variant}>
        <div className="m3-gsi-v2__surface" aria-hidden="true">
          <div className="m3-gsi-v2__bubble">
            <svg
              className="m3-gsi-v2__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <span className="m3-gsi-v2__text">{buttonText}</span>
        </div>

        <div className="m3-gsi-v2__real">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError ?? (() => alert("Ошибка входа через Google"))}
            text="signin_with"
            theme="filled_black"
            size="large"
            shape="rectangular"
            width={widthDesktop}
          />
        </div>
      </div>
    </>
  );
}