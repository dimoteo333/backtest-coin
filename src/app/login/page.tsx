'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useSignIn, useAuth } from '@clerk/nextjs';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'apple' | null>(null);
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, isAuthLoaded, router]);

  const handleSocialLogin = async (provider: 'oauth_google' | 'oauth_apple') => {
    if (!signIn) return;

    setError('');
    setLoadingProvider(provider === 'oauth_google' ? 'google' : 'apple');

    try {
      // Use signIn for OAuth - it acts as a "Seamless" flow.
      // If the user exists, they log in.
      // If they don't, Clerk (by default configuration) creates the account.
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err) {
      console.error('OAuth error:', err);
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      setLoadingProvider(null);
    }
  };

  if (!isAuthLoaded || !isSignInLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-8 left-8"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>홈으로</span>
          </Link>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/" className="text-3xl font-bold tracking-tighter">
            Backtest<span className="text-blue-400">Coin</span>
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8" hoverEffect={false}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">로그인</h1>
              <p className="text-white/60 text-sm">
                계정에 로그인하여 백테스팅을 시작하세요
              </p>
            </div>

            <div className="space-y-4">
              <Button
                type="button"
                onClick={() => handleSocialLogin('oauth_google')}
                disabled={loadingProvider !== null}
                className="w-full bg-white text-black hover:bg-white/90 font-semibold py-6 flex items-center justify-center gap-3"
              >
                {loadingProvider === 'google' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    연결 중...
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-5 h-5" />
                    Google로 계속하기
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => handleSocialLogin('oauth_apple')}
                disabled={loadingProvider !== null}
                className="w-full bg-black text-white border border-white/20 hover:bg-white/10 font-semibold py-6 flex items-center justify-center gap-3"
              >
                {loadingProvider === 'apple' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    연결 중...
                  </>
                ) : (
                  <>
                    <AppleIcon className="w-5 h-5" />
                    Apple로 계속하기
                  </>
                )}
              </Button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </div>

            <div className="mt-6 text-center text-sm text-white/40">
              <p>
                로그인하면 서비스 이용약관에 동의하게 됩니다
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-sm text-white/40"
        >
          소셜 계정으로 간편하게 시작하세요
        </motion.p>
      </div>
    </main>
  );
}
