"use client";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract } from "wagmi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react"
// import heimdall from "../../../../contracts/deployments/localhost/HeimdallProtocol.json"
import { heimdall } from "@/lib/contractDetails"



export default function Home() {
    const account = useAccount();
    const router = useRouter()
    const { toast } = useToast()
    const { data: hash, isPending: deviceMinting, writeContractAsync } = useWriteContract()

    const [deviceAddress, setDeviceAddress] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [organization, setOrganization] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [authorizedViewers, setAuthorizedViewers] = useState();


    const handleSubmit = async () => {
        await writeContractAsync({
            address: heimdall.address as `0x${string}`,
            abi: heimdall.abi,
            functionName: 'addDevice',
            args: [
                deviceName,
                organization,
                account.address,
                deviceAddress,
                isPublic,
                authorizedViewers ? authorizedViewers?.split(", ") : []
            ]
        })
        console.log(
            deviceName,
            organization,
            account.address,
            deviceAddress,
            isPublic,
            authorizedViewers ? authorizedViewers?.split(", ") : []
        )
        // console.log(
        //     deviceName,
        //     organization,
        //     account.address,
        //     deviceAddress,
        //     isPublic,
        //     authorizedViewers ? authorizedViewers?.split(", ") : []
        // )
        toast({
            title: "Device minted successfully.",
            description: "Your IoT device has been minted to your wallet on the Base Network.",
        })
    }

    useEffect(() => { }, []);

    return (
        <main className="container flex min-h-screen flex-col items-center p-10">
            <div className="absolute top-5 right-5 flex gap-4">
                <Button onClick={() => router.push("/")}>Home</Button>
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
                    <h3 className="font-bold text-3xl my-4 capitalize">Mint your device</h3>
                    <div className="flex mt-10 gap-20">
                        <div className="grid w-full gap-2">
                            <h1 className="font-bold capitalize">Device address</h1>
                            <Input className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black" placeholder="0x0000000..." onChange={(e) => setDeviceAddress(e.target.value)} />
                        </div>
                        <div className="grid w-full gap-2">
                            <h1 className="font-bold capitalize">Owner Address</h1>
                            <Input className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black" placeholder={account.address} disabled />
                        </div>
                    </div>
                    <div className="grid w-full gap-2 mt-6">
                        <h1 className="font-bold capitalize">Device name</h1>
                        <Input className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black" placeholder="Temprature Monitor" onChange={(e) => setDeviceName(e.target.value)} />
                    </div>
                    <div className="grid w-full gap-2 mt-6">
                        <h1 className="font-bold">Organization</h1>
                        <Input className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black" placeholder="ABC Industries" onChange={(e) => setOrganization(e.target.value)} />
                    </div>
                    <div className="flex w-full gap-3 mt-8">
                        <Checkbox className="mt-1" checked={isPublic} onCheckedChange={(e) => setIsPublic(!isPublic)} />
                        <h1 className="font-bold capitalize">Make device data public</h1>
                        {/* <Input className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black max-w-xl" placeholder="ABC Industries" /> */}
                    </div>
                    <div className="grid w-full gap-2 mt-6">
                        <h1 className="font-bold capitalize">Authorized viewers</h1>
                        <Textarea className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black" placeholder="0x00000..." disabled={isPublic} onChange={(e) => setAuthorizedViewers(e.target.value)} />
                        <p className="text-sm mt-2">Enter authorized users address split by commans ", "</p>
                    </div>
                    <div className="flex justify-end">
                        <Button className="mt-8" onClick={handleSubmit} disabled={deviceMinting}>
                            {deviceMinting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Mint Device</Button>
                    </div>
                </div>
            </section>
        </main>
    );
}
