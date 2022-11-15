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

export async function exoworlds() {
  try {
    const driver = await Driver.connect(new SimpleNet("https://mainnet.veblocks.net"));
    const connex = new Framework(driver);

    const abi = erc721Abi;
    const abiTokenURI = abi.find(({ name }) => name === "tokenURI");
      try {
        const {
          decoded: { 0: tokenURI },
        } = await connex.thor
          .account("0x32CB972cA073d253651172aa8b86C086AA21683f")
          .method(abiTokenURI)
          .call(10);

        console.log({ tokenURI });
 
      } catch (error) {
        console.log(error.message);
      }

  } catch (error) {
    console.log(error);
  }
}
