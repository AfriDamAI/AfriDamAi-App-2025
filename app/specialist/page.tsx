"use client";

import React from 'react';
import { SpecialistChat } from '@/components/specialist-chat';

const SpecialistPage = () => {
  return (
    <div className="h-full w-full bg-gray-100 dark:bg-gray-900 overflow-hidden flex flex-col">
      <SpecialistChat />
    </div>
  );
};

export default SpecialistPage;
