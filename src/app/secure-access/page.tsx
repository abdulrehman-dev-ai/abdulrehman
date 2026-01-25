import React from "react";
import { Metadata } from "next";
import AccessForm from "./AccessForm";

export const metadata: Metadata = {
  title: "Restricted Access",
  description: "Restricted area.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function PrivateAccessPage() {
  return <AccessForm />;
}
