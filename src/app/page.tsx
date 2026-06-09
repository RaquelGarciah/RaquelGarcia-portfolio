"use client";

import { useCallback, useState } from "react";
import TopNav from "@/components/TopNav";
import Hero from "@/components/Hero";
import VideoReveal from "@/components/VideoReveal";
import ChatCV from "@/components/ChatCV";
import { ContactModal } from "@/components/ContactCard";

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  return (
    <>
      <TopNav onContact={openContact} />
      <main>
        <Hero onContact={openContact} />
        <VideoReveal />
        <ChatCV />
      </main>
      <ContactModal open={contactOpen} onClose={closeContact} />
    </>
  );
}
