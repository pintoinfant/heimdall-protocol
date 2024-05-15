"use client";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation";

export default function Home() {
  const account = useAccount();
  const router = useRouter()

  useEffect(() => { }, []);

  return (
    <main className="container flex min-h-screen flex-col items-center p-10">
      <div className="absolute top-5 right-5 flex gap-4">
        <Button onClick={() => router.push("/mint")}>Mint Device</Button>
        <Button onClick={() => router.push("/devices")}>Devices</Button>
        <ModeToggle />
        <ConnectButton />
      </div>
      <div className="min-w-full mt-10 justify-start flex-col">
        <div className="text-5xl font-bold">Heimdall Protocol</div>
        <div className="text-md mt-3">A Gateway to Decentralized IoT Devices</div>
      </div>
      <section className="lg:w-full mt-10">
        <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-ful">
          {/* <h3 className="font-bold text-3xl my-4">How Heimdall Works?</h3> */}
          <p>WIP</p>
        </div>
      </section>
    </main>


  );
}
