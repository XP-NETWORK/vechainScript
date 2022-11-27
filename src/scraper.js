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
        `https://exoworlds.mypinata.cloud/ipfs/Qmf4ouMBiwdg6YyZjzUcCh7iGYq7jve53bqfVFHF1HE5xB/${item?.metadata?.wrapped?.tokenId}.json`
      );
      const { Name, Description, tokenId, Image, attributes } = resp?.data;

      const dbResp = await DB.updateTrx(
        { _id: item._id },
        {
          "metadata.name": `${Name || item.metadata.name}`,
          "metadata.description": `${Description || item.metadata.description}`,
          "metadata.image": `${Image || item.metadata.image}`,
          "metadata.wrapped.tokenId": `${tokenId || item.metadata.wrapped.tokenId}`,
          "metadata.wrapped.original_uri": `https://exoworlds.mypinata.cloud/ipfs/Qmf4ouMBiwdg6YyZjzUcCh7iGYq7jve53bqfVFHF1HE5xB/${item.metadata.wrapped.tokenId}.json`,
          "metadata.attributes": attributes || item.metadata.attributes,
        }
      );
      console.log(dbResp.value.metadata.wrapped);
    } catch (error) {
      console.log(error.message);
      continue;
    }
  }
};

//origin 33
export const fantase = async (DB) => {
  const trxs = await DB.getTrx({
    "metadata.wrapped.contract": "0xed0972f76e837D637c534329708077e5Aa8c50E7",
    "metadata.wrapped.origin": "33",
    $or: [
      { "metadata.wrapped.original_uri": "" },
      { "metadata.wrapped.original_uri": undefined },
      { "metadata.wrapped.original_uri": null },
      { "metadata.wrapped.original_uri": { $exists: false } },
      { "metadata.name": "XP.Network Wrapped NFT" },
      { "metadata.name": "" },
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
        `https://metadata.fantase.io/0xed0972f76e837d637c534329708077e5aa8c50e7/${item?.metadata?.wrapped?.tokenId}.json`
      );
      const { name, image, description } = resp?.data;

      const dbResp = await DB.updateTrx(
        { _id: item._id },
        {
          "metadata.name": `${name || item.metadata.name}`,
          "metadata.description": `${description || item.metadata.description}`,
          "metadata.image": `${image || item.metadata.image}`,
          "metadata.wrapped.original_uri": `https://metadata.fantase.io/0xed0972f76e837d637c534329708077e5aa8c50e7/${item?.metadata?.wrapped?.tokenId}.json`,
        }
      );
      console.log(dbResp.value.metadata.wrapped);
    } catch (error) {
      console.log(error.message);
      continue;
    }
  }
};
