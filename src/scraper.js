//contract 0x3473c5282057D7BeDA96C1ce0FE708e890764009
//origin 25
export const exoworlds = async (DB) => {
  const trxs = await DB.getTrx({
    "metadata.wrapped.contract": "0x3473c5282057D7BeDA96C1ce0FE708e890764009",
    "metadata.wrapped.origin": "25",
    "metadata.wrapped.original_uri": "",
  });

  if (trxs.length === 0) {
    console.log("did not find anything");
    return
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
