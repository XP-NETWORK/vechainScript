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