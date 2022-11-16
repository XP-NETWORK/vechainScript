import { Framework } from "@vechain/connex-framework";
import { Driver, SimpleNet } from "@vechain/connex-driver";
import { erc721Abi } from "../erc721Abi.js";

//contract 0x3473c5282057D7BeDA96C1ce0FE708e890764009
//origin 25
export const exoworldsIpfs = async (DB) => {
  const trxs = await DB.getTrx({
    "metadata.wrapped.contract": "0x3473c5282057D7BeDA96C1ce0FE708e890764009",
    "metadata.wrapped.origin": "25",
    $or: [
      { "metadata.wrapped.original_uri": "" },
      { "metadata.wrapped.original_uri": undefined },
      { "metadata.wrapped.original_uri": null },
      { "metadata.wrapped.original_uri": { $exists: false } },
    ],
  });

  if (trxs.length === 0) {
    console.log("did not find anything");
    return;
  }

  for (let item of trxs) {
    const resp = await DB.updateTrx(
      { _id: item._id },
      {
        "metadata.wrapped.original_uri": `https://exoworlds.mypinata.cloud/ipfs/Qmf4ouMBiwdg6YyZjzUcCh7iGYq7jve53bqfVFHF1HE5xB/${item.metadata.wrapped.tokenId}.json`,
      }
    );
    console.log(resp.value.metadata.wrapped);
  }
};


export async function exoworldsContract(DB) {
  try {
    const trxs = await DB.getTrx({
      "metadata.wrapped.contract": "0x3473c5282057D7BeDA96C1ce0FE708e890764009",
      "metadata.wrapped.origin": "25",
    });

    if (trxs.length === 0) {
      console.log("did not find anything");
      return;
    }

    console.log("trxs.length:", trxs.length);
    const driver = await Driver.connect(new SimpleNet("https://mainnet.veblocks.net"));
    const connex = new Framework(driver);

    const abi = erc721Abi;
    const abiTokenURI = abi.find(({ name }) => name === "tokenURI");

    for (let item of trxs) {
      try {
        const {
          decoded: { 0: tokenURI },
        } = await connex.thor
          .account("0x3473c5282057D7BeDA96C1ce0FE708e890764009")
          .method(abiTokenURI)
          .call(Number(item.metadata.wrapped.tokenId));

        console.log({ tokenURI });
        const resp = await DB.updateTrx(
          { _id: item._id },
          { "metadata.wrapped.original_uri": tokenURI }
        );
        console.log(resp.value.metadata.wrapped.tokenId);
      } catch (error) {
        console.log(error.message);
        continue;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
