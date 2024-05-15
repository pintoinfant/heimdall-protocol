/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  BaseUltraVerifier,
  BaseUltraVerifierInterface,
} from "../BaseUltraVerifier";

const _abi = [
  {
    inputs: [],
    name: "INVALID_VERIFICATION_KEY",
    type: "error",
  },
  {
    inputs: [],
    name: "MOD_EXP_FAILURE",
    type: "error",
  },
  {
    inputs: [],
    name: "OPENING_COMMITMENT_FAILED",
    type: "error",
  },
  {
    inputs: [],
    name: "PAIRING_FAILED",
    type: "error",
  },
  {
    inputs: [],
    name: "PAIRING_PREAMBLE_FAILED",
    type: "error",
  },
  {
    inputs: [],
    name: "POINT_NOT_ON_CURVE",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actual",
        type: "uint256",
      },
    ],
    name: "PUBLIC_INPUT_COUNT_INVALID",
    type: "error",
  },
  {
    inputs: [],
    name: "PUBLIC_INPUT_GE_P",
    type: "error",
  },
  {
    inputs: [],
    name: "PUBLIC_INPUT_INVALID_BN128_G1_POINT",
    type: "error",
  },
  {
    inputs: [],
    name: "getVerificationKeyHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_proof",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "_publicInputs",
        type: "bytes32[]",
      },
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class BaseUltraVerifier__factory {
  static readonly abi = _abi;
  static createInterface(): BaseUltraVerifierInterface {
    return new utils.Interface(_abi) as BaseUltraVerifierInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BaseUltraVerifier {
    return new Contract(address, _abi, signerOrProvider) as BaseUltraVerifier;
  }
}
