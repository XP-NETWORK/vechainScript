//contract 0x3473c5282057D7BeDA96C1ce0FE708e890764009
//origin 25
export const somthingelse = async (DB) => {
  const trxs = await DB.getTrx({
    "metadata.wrapped.contract": "0x3473c5282057D7BeDA96C1ce0FE708e890764009",
    "metadata.wrapped.origin": "25",
    "metadata.wrapped.original_uri": "",
  });

  if (trxs.length === 0) {
    console.log("did not find anything");
    return;
  }

  for (let item of trxs) {
    const resp = await DB.updateTrx(
      { _id: item._id },
      {
        "metadata.wrapped.original_uri": `https://nfts.vechainstats.com/exoworlds/${item.metadata.wrapped.tokenId}.webp?r=6dc18s1f-ecd243e0`,
      }
    );
    console.log(resp.value.metadata.wrapped);
  }
};
import { Framework } from "@vechain/connex-framework";
import { Driver, SimpleNet } from "@vechain/connex-driver";
import { erc721Abi } from "../erc721Abi.js";

export async function exoworlds(DB) {
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
