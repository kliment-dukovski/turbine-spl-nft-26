import {
  appendTransactionMessageInstruction,
  appendTransactionMessageInstructions,
  assertIsTransactionMessageWithBlockhashLifetime,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  pipe,
  assertIsSendableTransaction,
} from "@solana/kit";
import {
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { getCreateAccountInstruction } from "@solana-program/system";

//import your wallet
import wallet from "../../devnet-wallet.json";
import { sign } from "crypto";

const rpc = createSolanaRpc("https://api.devnet.solana.com");

const rpcSubscriptions = createSolanaRpcSubscriptions(
  "wss://api.devnet.solana.com",
);

async function main() {
  try {

    //Load wallet as a signer and Kit turns them into the format it expects (Unit8Array)
    const signer = await createKeyPairSignerFromBytes(
      new Uint8Array(wallet)
    );

    console.log("Your wallet address:", signer.address);

    //Generate a new token mint's keypair, the account doesn't exist yet, it just generates keys and address locally
    const mint = await generateKeyPairSigner();

    console.log("Your mint address:", mint.address);

    //Calculate storage and funding needed, standard account needs 82 bytes
    const space = getMintSize();

    //Asks Solana "how many lamports must an account hold to be rent-exempt with this amount of storage"
    const rent = await rpc
      .getMinimumBalanceForRentExemption(BigInt(space))
      .send();

    console.log("Mint size (bytes):", space);
    console.log("Required balance (lamports):", rent.toString());

    //Prepare the account creation instruction that will tell Solana's System program to take required lamports from the wallet,
    //create new account at the mint address we made, allocate storage, and assign the account to the Token program
    //programAddress specifies the new account's program owner
    const createAccountIx = getCreateAccountInstruction({
      payer: signer,
      newAccount: mint,
      lamports: rent,
      space: BigInt(space),
      programAddress: TOKEN_PROGRAM_ADDRESS,
    });

    //Prepare the mint initilization instruction that tells the Token Program which account to initilize (mint),
    //how many decimals (6 dec = 1,000,000 base units), the wallet to set as mint and freeze authority
    //initilizes mint with zero supply
    const initializeMintIx = getInitializeMintInstruction({
      mint: mint.address,
      decimals: 6,
      mintAuthority: signer.address,
      freezeAuthority: signer.address,
    });

    console.log("Mint instructions prepared");

    //Fetch recent blockhash and expiry information so the network knows how long it can remain valid
    const { value: latestBlockhash } = await rpc
      .getLatestBlockhash()
      .send();

    // Building the message using Kit's documented pipe pattern => create and empty version-0 tx message,
    //set the wallet as the transaction fee payer, set its lifetime using latest blockhash,
    //add the two instructions in order: create the account, initilize it
    const transactionMessage = pipe(
      createTransactionMessage({ version: 0}),
      (tx) => setTransactionMessageFeePayerSigner(signer, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) =>
        appendTransactionMessageInstructions(
          [createAccountIx, initializeMintIx],
          tx,
        ),
    );

    //Sign with the signers attached to the message
    const signedTransaction = 
    await signTransactionMessageWithSigners(transactionMessage);

    //Check that the message can be sent (checking transaction signatures, fits within size limit, carries a blockhas lifetime)
    assertIsSendableTransaction(signedTransaction);
    assertIsTransactionWithBlockhashLifetime(signedTransaction);

    //Get the transaction signature, which you can use to look up the tx in an explorer
    const transactionSignature = 
    getSignatureFromTransaction(signedTransaction);

    // Send to devnet and wait for confirmation, rpc submits the tx, rpcSubscriptions listens for confirmation updates
    const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
      rpc,
      rpcSubscriptions,
    });

    //Sends the tx and waits for confirmation
    await sendAndConfirmTransaction(signedTransaction, {
      commitment: "confirmed",
    });

    console.log("Mint created:", mint.address);
    console.log("Transaction signature:", transactionSignature);

  } catch (error) {
    console.log(error);
  }
}

main();
