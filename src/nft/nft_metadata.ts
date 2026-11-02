import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import wallet from "../../devnet-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(
  irysUploader({
    address: "https://devnet.irys.xyz/",
  }),
);

umi.use(signerIdentity(signer));

async function main() {
  try {
    //change the image uri to your image uri obtained from nft_image.ts
    const image =
      "https://gateway.irys.xyz/4mCPrPLWaHGRWAzGV3PJpK7oymuzaPqEywX2WquXXXX6";

   const metadata = {
    name: "Turbin3 Warrior 2",
    description: "An upgraded cyberpunk Turbin3 warrior.",
    image,
    category: "image",
   };

   const myUri = await umi.uploader.uploadJson(metadata);
   console.log(`metadata uri: ${myUri} `);
  } catch (error) {
    console.log("error", error);
  }
};

main();
