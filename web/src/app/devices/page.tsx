"use client";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { shortAddress } from "@/lib/shortenContent";
import { useRouter } from "next/navigation";
// import heimdall from "../../../../contracts/deployments/localhost/HeimdallProtocol.json"
import { heimdall } from "@/lib/contractDetails"


export default function Home() {
    const router = useRouter()
    const [dataPointCount, setDataPointCount] = useState(0)

    const { data: devicesRegistered, error: devicesRegisteredError } = useReadContract({
        address: heimdall.address as `0x${string}`,
        abi: heimdall.abi,
        functionName: "getAllDevices"
    })

    useEffect(() => {
        const fetchDataPointCount = async () => {
            await supabase.from('proofs').select()
                .then((res) => {
                    setDataPointCount(res.data.length)
                })
        }
        fetchDataPointCount()
    }, []);

    return (
        <main className="container flex min-h-screen flex-col items-center p-10">
            <div className="absolute top-5 right-5 flex gap-4">
                <Button onClick={() => router.push("/")}>Home</Button>
                <Button onClick={() => router.push("/mint")}>Mint Device</Button>
                <ModeToggle />
                <ConnectButton />
            </div>
            <div className="min-w-full mt-10 justify-start flex-col">
                <div className="text-5xl font-bold">Heimdall Protocol</div>
                <div className="text-md mt-3">A Gateway to Decentralized IoT Devices</div>
            </div>

            <section className="lg:w-full mt-10">
                <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-ful">
                    <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
                        <Card className="dark:bg-[#000]">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-md font-medium">Devices</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl my-2 font-bold">+{devicesRegistered ? devicesRegistered.length : 0}</div>
                                <p className="text-xs text-muted-foreground">Unique Devices Registered in Heimdall</p>
                            </CardContent>
                        </Card>
                        <Card className="dark:bg-[#000]">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-md font-medium">Data Points</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl my-2 font-bold">+{dataPointCount}</div>
                                <p className="text-xs text-muted-foreground">Data Points Collected by Heimdall</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex my-6 justify-between">
                        <h3 className="font-bold text-3xl capitalize">View all registered devices</h3>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="dark:hover:bg-[#111111]">
                                <TableHead className="max-w-[#200px]">Device Address</TableHead>
                                <TableHead className="max-w-[#200px]">Device Name</TableHead>
                                <TableHead className="max-w-[#200px]">Organization</TableHead>
                                <TableHead className="max-w-[#200px]">Device Status</TableHead>
                                <TableHead className="text-center w-[200px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {devicesRegistered && devicesRegistered?.map((data: any) => (
                                <TableRow key={data.id} className="dark:hover:bg-[#111111] hover:bg-zinc-200">
                                    <TableCell>{shortAddress(data.deviceAddress)}</TableCell>
                                    <TableCell>{data.name}</TableCell>
                                    <TableCell>{data.organization}</TableCell>
                                    <TableCell>{data.isPublic ? "Public" : "Private"}</TableCell>
                                    <TableCell className="text-right w-[200px]">
                                        <div className="flex-col">
                                            <Button onClick={() => router.push(`/devices/${data.deviceAddress}`)}>View Device Data</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </div>
            </section>
        </main>
    );
}
