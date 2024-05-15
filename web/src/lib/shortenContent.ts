export const shortAddress = (addr: string): string =>
    addr.length > 10 && addr.startsWith("0x")
        ? `${addr.substring(0, 8)}......${addr.substring(addr.length - 8)}`
        : addr;

export const shortSignature = (addr: string): string =>
    // addr.length > 10 && addr.startsWith("0x")
    //     ? `${addr.substring(0, 15)}...${addr.substring(addr.length - 12)}`
    //     : addr;
    addr.length > 10 && addr.startsWith("0x")
        ? `${addr.substring(0, 24)}...`
        : addr;


export const shortString = (data: string): string =>
    // data.length > 10
    //     ? `${data.substring(0, 24)}...${data.substring(data.length - 24)}`
    //     : data;
    data.length > 10
        ? `${data.substring(0, 20)}...`
        : data;

export const shortProof = (data: string): string =>
    data.length > 10
        ? `${data.substring(0, 40)}...`
        : data;