import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-serif font-bold text-stone-800 mb-3">
            Aesthetic Memory
          </h1>
          <p className="text-stone-500 text-sm tracking-wide">
            Your personal calendar of moments
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-white shadow-2xl rounded-2xl border border-stone-200',
                headerTitle: 'text-2xl font-serif text-stone-800',
                headerSubtitle: 'text-stone-500',
                socialButtonsBlockButton: 'border-stone-200 hover:bg-stone-50',
                formButtonPrimary: 'bg-stone-800 hover:bg-stone-900',
                footerActionLink: 'text-stone-600 hover:text-stone-800',
                formFieldInput: 'border-stone-200 focus:border-stone-400',
                identityPreviewText: 'text-stone-700',
                identityPreviewEditButton: 'text-stone-600',
              },
            }}
            routing="hash"
            signUpUrl="#/sign-up"
          />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-stone-400 mt-8">
          Capture your memories, one day at a time ✨
        </p>
      </motion.div>
    </div>
  );
};