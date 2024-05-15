import {
  GovernorContract,
  TimeLock,
  ElectraToken,
  StationRegistry,
  VehicleLedger,
} from "../../typechain-types"
import { deployments, ethers } from "hardhat"
import { assert, expect } from "chai"
import {
  FUNC,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
  VOTING_DELAY,
  VOTING_PERIOD,
  MIN_DELAY,
} from "../../helper-hardhat-config"
import { moveBlocks } from "../../utils/move-blocks"
import { moveTime } from "../../utils/move-time"
import { parseEther } from "ethers/lib/utils"

describe("Electra Flow", async () => {
  let governor: GovernorContract
  let electraToken: ElectraToken
  let timeLock: TimeLock
  let stationRegistry: StationRegistry
  let vehicleLedger: VehicleLedger
  const voteWay = 1 // for
  const reason = "I lika do da cha cha"
  beforeEach(async () => {
    await deployments.fixture(["all"])
    governor = await ethers.getContract("GovernorContract")
    timeLock = await ethers.getContract("TimeLock")
    electraToken = await ethers.getContract("ElectraToken")
    stationRegistry = await ethers.getContract("StationRegistry")
    vehicleLedger = await ethers.getContract("VehicleLedger")
  })

  it("Vehicle Register, Top up", async () => {
    const res0 = await stationRegistry.addChargingStation(
      "0x64574dDbe98813b23364704e0B00E2e71fC5aD17",
      "Test Station",
      "72717954333540611756786175956265140173770013197142303418405113536997480868098",
      '{"firstName":"Richard","lastName":"Hendricks","address":"Central Street, Kilpauk Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India","latitude":13.0849401,"longitude":80.2339489,"chargerCapacity":"200","title":"New Charging Station At Central Street, Kilpauk Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India"}',
      1000000,
      {
        value: ethers.utils.parseEther("0.0001"),
      }
    )
    const tx0 = await res0.wait(1)
    const stationId = tx0.events![0].args!.stationId

    const res = await vehicleLedger.registerVehicle(
      "1C4RJFAG0FC625797",
      '{"name":"Richard","make":"Tesla","model":"Model 3","wattage":"200"}'
    )
    const tx = await res.wait(1)
    const vehicleId = tx.events![0].args!.vin
    console.log(`Vehicle ID: ${vehicleId}`)

    let latestVehicle = await vehicleLedger.getVehicle(vehicleId)

    console.log(latestVehicle.toString())

    const res2 = await vehicleLedger.topUpBalance(vehicleId, {
      value: parseEther("0.0001"),
    })
    const tx2 = await res2.wait(1)
    console.log(`Top Up ID: ${tx2}`)

    let latestTopUp = await vehicleLedger.getBalance(vehicleId)
    console.log(latestTopUp.toString())

    const res3 = await vehicleLedger.chargeVehicle(72836282, vehicleId)
    const tx3 = await res3.wait(1)
    console.log(`Charge ID:`, tx3)

    latestTopUp = await vehicleLedger.getBalance(vehicleId)
    console.log("Updated Balance: ", latestTopUp.toString())
  })

  // it("can only be changed through governance", async () => {
  //   await expect(
  //     // Call contract with ether:
  //     stationRegistry.addChargingStation(
  //       "0x64574dDbe98813b23364704e0B00E2e71fC5aD17",
  //       "Test Station",
  //       "72717954333540611756786175956265140173770013197142303418405113536997480868098",
  //       '{"firstName":"Gavin","lastName":"Belson","address":"Central Street, Kilpauk Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India","latitude":13.0849401,"longitude":80.2339489,"chargerCapacity":"200","title":"New Charging Station At Central Street, Kilpauk Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India"}',
  //       1000000
  //       // {
  //       //   value: ethers.utils.parseEther("0.0001"),
  //       // }
  //     )
  //   ).to.be.revertedWith("Ownable: caller is not the owner")

  //   // await expect(
  //   //   vehicleLedger.registerVehicle(
  //   //     "1C4RJFAG0FC625797",
  //   //     '{"name":"Richard","make":"Tesla","model":"Model 3","wattage":"200"}'
  //   //   )
  //   // ).to.be.revertedWith("Ownable: caller is not the owner")
  // })

  // it("adding entry to stationRegistry", async () => {
  //   const res = await stationRegistry.addChargingStation(
  //     "0x64574dDbe98813b23364704e0B00E2e71fC5aD17",
  //     "Test Station",
  //     "72717954333540611756786175956265140173770013197142303418405113536997480868098",
  //     '{"firstName":"Richard","lastName":"Hendricks","address":"Central Street, Kilpauk Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India","latitude":13.0849401,"longitude":80.2339489,"chargerCapacity":"200","title":"New Charging Station At Central Street, Kilpauk Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India"}',
  //     1000000,
  //     {
  //       value: ethers.utils.parseEther("0.0001"),
  //     }
  //   )
  //   const tx = await res.wait(1)
  //   const stationId = tx.events![0].args!.stationId
  //   console.log(`Station ID: ${stationId}`)

  //   let latestStation = await stationRegistry.getStation(stationId)

  //   console.log(latestStation.toString())
  // })

  // it("proposes, votes, waits, queues, and then executes", async () => {
  //   // propose
  //   const encodedFunctionCall = stationRegistry.interface.encodeFunctionData("addChargingStation", [
  //     "0x64574dDbe98813b23364704e0B00E2e71fC5aD17",
  //     "Test Station",
  //     "72717954333540611756786175956265140173770013197142303418405113536997480868098",
  //     '{"firstName":"Richard","lastName":"Hendricks","address":"Central Street, Kilpauk Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India","latitude":13.0849401,"longitude":80.2339489,"chargerCapacity":"200","title":"New Charging Station At Central Street, Kilpauk Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India"}',
  //     1000000,
  //   ])

  //   const proposeTx = await governor.propose(
  //     [stationRegistry.address],
  //     [0],
  //     [encodedFunctionCall],
  //     "Add Charging Station: Test Station... really long stringified JSON"
  //   )

  //   const proposeReceipt = await proposeTx.wait(1)
  //   const proposalId = proposeReceipt.events![0].args!.proposalId
  //   let proposalState = await governor.state(proposalId)
  //   console.log(`Current Proposal State: ${proposalState}`)

  //   await moveBlocks(VOTING_DELAY + 1)
  //   // vote
  //   const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason)
  //   await voteTx.wait(1)
  //   proposalState = await governor.state(proposalId)
  //   assert.equal(proposalState.toString(), "1")
  //   console.log(`Current Proposal State: ${proposalState}`)
  //   await moveBlocks(VOTING_PERIOD + 1)

  //   // queue & execute
  //   // const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
  //   const descriptionHash = ethers.utils.id(
  //     "Add Charging Station: Test Station... really long stringified JSON"
  //   )
  //   const queueTx = await governor.queue(
  //     [stationRegistry.address],
  //     [0],
  //     [encodedFunctionCall],
  //     descriptionHash
  //   )
  //   await queueTx.wait(1)
  //   await moveTime(MIN_DELAY + 1)
  //   await moveBlocks(1)

  //   proposalState = await governor.state(proposalId)
  //   console.log(`Current Proposal State: ${proposalState}`)

  //   console.log("Executing...")
  //   console.log
  //   const exTx = await governor.execute(
  //     [stationRegistry.address],
  //     [0],
  //     [encodedFunctionCall],
  //     descriptionHash
  //   )
  //   await exTx.wait(1)
  //   console.log("Executed!")
  //   let latestStationId = await stationRegistry._stationIdCounter()
  //   console.log(`Latest Station ID: ${latestStationId}`)
  //   console.log((await stationRegistry.getStation(latestStationId)).toString())
  // })
})
