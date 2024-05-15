
"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { shortAddress, shortSignature, shortString, shortProof } from "@/lib/shortenContent";
import dayjs from "dayjs"
// import heimdall from "../../../../../contracts/deployments/localhost/HeimdallProtocol.json"
import { heimdall } from "@/lib/contractDetails"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


function VerifyProof({ DeviceAddress, Proof }: { DeviceAddress: string, Proof: string }) {

    const { address } = useAccount()
    const [lowerBound, setLowerBound] = useState<any>("")
    const [upperBound, setUpperBound] = useState<any>("")
    const [proofVerificationPending, setProofVerificationPending] = useState<any>(false)
    const [proofVerificationSuccess, setproofVerificationSuccess] = useState<any>("Initialised")

    const { data: proofData, refetch: proofDataRefetch } = useReadContract({
        address: heimdall.address as `0x${string}`,
        abi: heimdall.abi,
        functionName: "verifyProof",
        account: address,
        args: [
            DeviceAddress,
            `0x${Proof}`,
            lowerBound,
            upperBound
        ]
    })

    const handleSubmit = async () => {
        if (lowerBound == "" || lowerBound == null || upperBound == "" || upperBound == null) {
            return;
        } else {
            setProofVerificationPending(true)
            setproofVerificationSuccess("Initialised")
            console.log([
                DeviceAddress,
                `0x${Proof}`,
                lowerBound,
                upperBound
            ])
            // console.log(Proof, DeviceAddress, valueToCheck)
            const { data } = await proofDataRefetch()
            console.log(data)
            if (data) {
                setproofVerificationSuccess(true)
            } else {
                setproofVerificationSuccess(false)
            }
            setProofVerificationPending(false)
        }
    }



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">Verify Proof</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-[#111111] bg-zinc-200 ring-1 ring-black">
                <DialogHeader>
                    <DialogTitle>Verify Proof</DialogTitle>
                    <DialogDescription>
                        Verify the proof of the data recorded by the device.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex gap-2 flex-col">
                        <Label htmlFor="lowerbound" className="text-left">
                            Lower Bound Value
                        </Label>
                        <Input
                            id="lowerbound"
                            placeholder="Enter your lower bound value here..."
                            onChange={(e) => setLowerBound(e.target.value)}
                            // defaultValue="Pedro Duarte"
                            className="col-span-3 dark:bg-[#111111] bg-zinc-200 ring-1 ring-black"
                        />
                    </div>
                    <div className="flex gap-2 flex-col">
                        <Label htmlFor="upperbound" className="text-left">
                            Upper Bound Value
                        </Label>
                        <Input
                            id="upperbound"
                            placeholder="Enter your upper bound value here..."
                            onChange={(e) => setUpperBound(e.target.value)}
                            // defaultValue="Pedro Duarte"
                            className="col-span-3 dark:bg-[#111111] bg-zinc-200 ring-1 ring-black"
                        />
                    </div>
                </div>

                {proofVerificationSuccess === "Initialised" ? null : proofVerificationSuccess ? (
                    <Alert className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-zinc-700 rounded-xl">
                        {/* <Terminal className="h-4 w-4" /> */}
                        <AlertTitle>Proof verification successfully!</AlertTitle>
                        <AlertDescription>
                            The value you verified matches with recorded value.
                        </AlertDescription>
                    </Alert>
                ) : (<Alert variant="destructive">
                    <AlertTitle>Proof verification failed.</AlertTitle>
                    <AlertDescription>
                        The value you verified doesn't match with recorded value or you might not have permission to verify the proof.
                    </AlertDescription>
                </Alert>
                )}

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={proofVerificationPending}>
                        {proofVerificationPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Verify Proof</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

export default function Home() {
    const router = useRouter()
    const pathname = usePathname()
    const [tableData, setTableData] = useState<any>()

    const { data: deviceDetails, error: deviceDetailsError } = useReadContract({
        address: heimdall.address as `0x${string}`,
        abi: heimdall.abi,
        functionName: "getDevice",
        args: [
            pathname.split("/")[2]
        ]
    })

    const fetchProofData = async () => {
        await supabase.from('proofs').select().eq('address', pathname.split("/")[2]).order('created_at', { ascending: false })
            .then((res) => {
                console.log(res.data)
                setTableData(res.data)
            })
    }

    useEffect(() => {
        fetchProofData()
    }, [deviceDetails]);

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
                <Card className="dark:bg-[#000]">
                    <CardHeader>
                        <CardTitle>Device Details</CardTitle>
                        <CardDescription>Information about the device and its owner.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {typeof deviceDetails === "object" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold">Name</div>
                                    <div>{deviceDetails?.name}</div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold">Organization</div>
                                    <div>{deviceDetails?.organization}</div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold">Device Address</div>
                                    <div>{shortAddress(deviceDetails?.deviceAddress)}</div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold">Owner Address</div>
                                    <div>{shortAddress(deviceDetails?.owner)}</div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold">Type</div>
                                    <div>{deviceDetails?.isPublic ? "Public" : "Private"}</div>
                                </div>
                            </div>
                        )}
                        <div className="grid gap-4">
                            <Card className="dark:bg-[#000] mt-6">
                                <CardHeader>
                                    <CardTitle>Recorded Data</CardTitle>
                                    <CardDescription>Data recorded by the device.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        {/* <TableCaption>A list of public IoT data.</TableCaption> */}
                                        <TableHeader>
                                            <TableRow className="dark:hover:bg-[#111111]">
                                                <TableHead className="w-[100px]">Timestamp</TableHead>
                                                <TableHead>Address</TableHead>
                                                <TableHead>Signature</TableHead>
                                                <TableHead>Encrypted Data</TableHead>
                                                <TableHead>Proof</TableHead>
                                                <TableHead className="text-center w-[200px]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tableData && tableData.map((data: any) => (
                                                <TableRow key={data.id} className="dark:hover:bg-[#111111] hover:bg-zinc-200">
                                                    <TableCell>{dayjs(data.created_at).unix()}</TableCell>
                                                    <TableCell>{shortAddress(data.address)}</TableCell>
                                                    <TableCell>{shortSignature(data.signature)}</TableCell>
                                                    <TableCell>{shortString(data.encrypted_data)}</TableCell>
                                                    <TableCell>{shortProof(data.proof)}</TableCell>
                                                    <TableCell className="text-right w-[200px]">
                                                        {/* <div className="flex-col">

                                                            <Button
                                                            >
                                                                Verify Proof</Button>
                                                        </div> */}
                                                        <VerifyProof DeviceAddress={data.address} Proof={data.proof} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}