'use client';

import { useEffect, useState } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processCallback() {
      try {
        // handleRedirectCallback processes the OAuth callback
        // It automatically handles both sign-in and sign-up cases
        // including the "transfer" case when an existing account is detected
        await handleRedirectCallback({
          signInForceRedirectUrl: '/dashboard',
          signUpForceRedirectUrl: '/dashboard',
          signInFallbackRedirectUrl: '/dashboard',
          signUpFallbackRedirectUrl: '/dashboard',
          continueSignUpUrl: '/sso-callback',
          verifyEmailAddressUrl: '/sso-callback',
          verifyPhoneNumberUrl: '/sso-callback',
        });
      } catch (err) {
        console.error('SSO callback error:', err);
        setError('인증 처리 중 오류가 발생했습니다.');
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    }

    processCallback();
  }, [handleRedirectCallback, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-red-400 text-lg">{error}</div>
          <p className="text-white/60 text-sm">로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p className="text-white/60 text-sm">로그인 처리 중...</p>
      </div>
    </div>
  );
}
