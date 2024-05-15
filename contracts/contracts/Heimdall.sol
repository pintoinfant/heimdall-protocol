// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.9;
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC721/IERC721.sol";

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import {UltraVerifier} from "./plonk_vk.sol";

/**
 * @title Heimdall Protocol
 * @dev Contract for managing the Heimdall Protocol and device registration.
 * @author Pinto Infant
 */
contract HeimdallProtocol is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;

    struct Device {
        string name;
        string organization;
        address owner;
        address deviceAddress;
        bool isPublic;
        address[] authorizedUsers;
        bytes32 salt;
        bool exists;
    }

    mapping(address => Device) private deviceAddressToDevice;
    Device[] private devices;
    Counters.Counter private _tokenIdCounter;

    UltraVerifier verifier;

    event DeviceAdded(
        string name,
        string organization,
        address owner,
        address deviceAddress,
        bool isPublic,
        address[] authorizedUsers
    );

    constructor(address _verifierAddress) ERC721("Heimdall Protocol", "HP") {
        verifier = UltraVerifier(_verifierAddress);
    }

    /**
     * @dev Modifier to check if the device is minted.
     * @param _deviceAddress The device address to check.
     */
    modifier checkIfDeviceIsMinted(address _deviceAddress) {
        require(isDeviceMinted(_deviceAddress), "Device not minted.");
        _;
    }

    /**
     * @dev Public function to add a new device.
     * @param _name The name of the device.
     * @param _organization The organization of the device.
     * @param _owner The owner of the device.
     * @param _deviceAddress The address of the device.
     * @param _isPublic A boolean indicating if the device is public.
     * @param _authorizedUsers The authorized users for the device if device is private.
     */
    function addDevice(
        string memory _name,
        string memory _organization,
        address _owner,
        address _deviceAddress,
        bool _isPublic,
        address[] memory _authorizedUsers
    ) public {
        bytes32 salt = keccak256(
            abi.encodePacked(block.timestamp, block.difficulty, _owner)
        );
        Device memory newDevice = Device(
            _name,
            _organization,
            _owner,
            _deviceAddress,
            _isPublic,
            _authorizedUsers,
            salt,
            true
        );
        deviceAddressToDevice[_deviceAddress] = newDevice;
        devices.push(newDevice);
        _safeMint(_owner, _tokenIdCounter._value);
        _tokenIdCounter.increment();
        emit DeviceAdded(
            _name,
            _organization,
            _owner,
            _deviceAddress,
            _isPublic,
            _authorizedUsers
        );
    }

    /**
     * @dev Public function to verify a proof.
     * @param _deviceAddress The address of the device.
     * @param _proof The proof to verify.
     * @param _lowerBound The lower bound value to check in the proof.
    * @param _upperBound The upper bound value to check in the proof.
     * @return A boolean indicating if the proof is valid.
     */
    function verifyProof(
        address _deviceAddress,
        bytes calldata _proof,
        uint256 _lowerBound,
        uint256 _upperBound
    ) public view returns (bool) {
        address userAddress = msg.sender;

        if (!deviceAddressToDevice[_deviceAddress].isPublic) {
            // Check if userAddress is in authorizedUsers array
            bool isAuthorized = false;
            for (
                uint256 i = 0;
                i <
                deviceAddressToDevice[_deviceAddress].authorizedUsers.length;
                i++
            ) {
                if (
                    deviceAddressToDevice[_deviceAddress].authorizedUsers[i] ==
                    userAddress
                ) {
                    isAuthorized = true;
                    break;
                }
            }

            require(isAuthorized, "User not authorized.");
        }

        bytes32[] memory publicInputs = new bytes32[](2);
        publicInputs[0] = bytes32(_lowerBound);
        publicInputs[1] = bytes32(_upperBound);
        require(verifier.verify(_proof, publicInputs), "Invalid proof");
        return true;
    }

    /**
     * @dev Returns the count of registered devices.
     * @return The number of registered devices.
     */
    function getDevicesCount() public view returns (uint256) {
        return _tokenIdCounter._value;
    }

    /**
     * @dev Returns the Device struct for a given device address.
     * @param _deviceAddress The device Address.
     * @return The Device struct.
     */
    function getDevice(address _deviceAddress)
        public
        view
        returns (Device memory)
    {
        return deviceAddressToDevice[_deviceAddress];
    }

    /**
     * @dev Checks if a device is minted.
     * @param _deviceAddress The device Address.
     * @return A boolean indicating if the device is minted.
     */
    function isDeviceMinted(address _deviceAddress) public view returns (bool) {
        return deviceAddressToDevice[_deviceAddress].exists;
    }

    /**
     * @dev Returns all registered devices
     * @return An array of Device structs.
     */
    function getAllDevices() public view returns (Device[] memory) {
        return devices;
    }

    // Overrides
    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
