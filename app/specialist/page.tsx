"use client";

import React from 'react';
import { SpecialistChat } from '@/components/specialist-chat';

const SpecialistPage = () => {
  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] w-full bg-gray-100 dark:bg-gray-900 overflow-hidden flex flex-col">
      <SpecialistChat />
    </div>
  );
};

export default SpecialistPage;
