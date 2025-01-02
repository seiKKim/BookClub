"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/context/AuthContext";
import React from "react";

const queryClient = new QueryClient();

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </QueryClientProvider>
);
