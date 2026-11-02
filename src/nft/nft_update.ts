import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet-wallet.json";
import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { update, mplCore, fetchAsset, } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

umi.use(mplCore());

(async () => {
  try {
    const assetAddress = publicKey(
      "14QusHcREFFFE5roxtMHTeM9BJj9zmuXqNUGN4KX6kHJ"
    );

    const asset = await fetchAsset(umi, assetAddress);
    const tx = await update(umi, {
      asset,
      name: "Turbin3 Warrior — Level 2",
      uri: "https://gateway.irys.xyz/DHNmq2uG6NJ3GtnMAYETivM4j498qYUwfSk9wcua4tjR",
    }).sendAndConfirm(umi);

    const signature = base58.deserialize(tx.signature)[0];

    console.log("Update signature:", signature);
    console.log("Updated asset:", asset.publicKey);
  } catch (error) {
    console.log("error", error);
  }
})();