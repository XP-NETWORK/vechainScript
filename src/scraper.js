//contract 0x3473c5282057D7BeDA96C1ce0FE708e890764009

import axios from "axios";

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
      { "metadata.name": "XP.Network Wrapped NFT" },
      { "metadata.name": "" },
      { "metadata.wrapped.attributes": "" },
      { "metadata.description": "" },
      { "metadata.image": "" },
    ],
  });

  if (trxs.length === 0) {
    console.log("did not find anything");
    return;
  }

  console.log({ length: trxs.length });

  for (let item of trxs) {
    try {
      const resp = await axios.get(
        `https://exoworlds.mypinata.cloud/ipfs/Qmf4ouMBiwdg6YyZjzUcCh7iGYq7jve53bqfVFHF1HE5xB/${item.metadata.wrapped.tokenId}.json`
      );
      const { Name, Description, tokenId, Image, attributes } = resp?.data;

      const dbResp = await DB.updateTrx(
        { _id: item._id },
        {
          "metadata.name": `${Name}`,
          "metadata.description": `${Description}`,
          "metadata.image": `${Image}`,
          "metadata.wrapped.tokenId": `${tokenId}`,
          "metadata.wrapped.original_uri": `https://exoworlds.mypinata.cloud/ipfs/Qmf4ouMBiwdg6YyZjzUcCh7iGYq7jve53bqfVFHF1HE5xB/${item.metadata.wrapped.tokenId}.json`,
          "metadata.attributes": `${attributes}`,
        }
      );
      console.log(dbResp.value.metadata.wrapped);
    } catch (error) {
      console.log(error.message);
      continue;
    }
  }
};
