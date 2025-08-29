'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface SearchParamsHandlerProps {
  onPrefilledMessage: (message: string) => void;
}

function SearchParamsLogic({ onPrefilledMessage }: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt) {
      onPrefilledMessage(decodeURIComponent(prompt));
    }
  }, [searchParams, onPrefilledMessage]);

  return null;
}

export default function SearchParamsHandler({ onPrefilledMessage }: SearchParamsHandlerProps) {
  return (
    <Suspense fallback={null}>
      <SearchParamsLogic onPrefilledMessage={onPrefilledMessage} />
    </Suspense>
  );
}