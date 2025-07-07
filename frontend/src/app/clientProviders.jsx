"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "react-redux";
import store from "@/store/index.js";

export default function GlobalProviders({ children }) {

  return (
    <Provider store={store}>
      <ClerkProvider>
        {children}
      </ClerkProvider>
    </Provider>
  );
}
