# Turbin3: SPL Tokens and Metaplex Core NFTs

Completed SPL token and NFT assignment for the Turbin3 Builders Cohort. All transactions were performed on Solana devnet.

Based on [ShrinathNR's starter repository](https://github.com/ShrinathNR/turbine-spl-nft-26).

## Completed tasks

- Created an SPL token mint with 6 decimals.
- Minted 1,000 tokens into my wallet's associated token account.
- Transferred 100 tokens to another wallet.
- Added SPL token metadata using Metaplex Token Metadata.
- Uploaded an NFT image and metadata using Irys.
- Created a Metaplex Core NFT.
- Updated the NFT's name and metadata as its update authority.

## Tools

- TypeScript
- Solana Kit and `@solana-program/token` for SPL token operations
- Umi and Metaplex Token Metadata for SPL token metadata
- Umi and Metaplex Core for NFT creation and updates
- Irys devnet uploader for image and JSON uploads

## Setup

Install dependencies:

```bash
npm ci
```

Place your own devnet keypair at the project root as:

```text
devnet-wallet.json
```

Use a wallet funded with devnet SOL.

Place your NFT image at the project root. My example uses:

```text
Turbin3 Warrior.png
```

Review each script's addresses, amounts, filenames, and URIs before running it. The committed values refer to my completed example.

## SPL token workflow

| Script | Command | Purpose |
|---|---|---|
| `src/spl/spl_init.ts` | `npm run spl:init` | Create and initialize a mint |
| `src/spl/spl_mint.ts` | `npm run spl:mint` | Create the sender's ATA and mint 1,000 tokens |
| `src/spl/spl_transfer.ts` | `npm run spl:transfer` | Create the recipient's ATA and transfer 100 tokens |
| `src/spl/spl_metadata.ts` | `npm run spl:metadata` | Add token metadata |

After creating a mint, copy its address into the other SPL scripts. Set the recipient wallet address in the transfer script.

The token uses 6 decimals: one token equals 1,000,000 base units.

These scripts are separate transactions. Each successful initialization creates a new mint. ATA creation instructions expect the accounts not to exist yet.

### Addresses

- Mint: `Hp7KFNPivkxYsVfkDxwevzU3g5fNnBQn7JNLfonCczcV`
- Sender wallet: `3qpgoHaWTYTCXZSTD2SckwTMY82AtbNL45bP8Eo3Ls4d`
- Recipient wallet: `9EUd4VNcjMAysd7zQk3Q1a4tb28BYndLNBAQDiYnHJ64`
- Sender ATA: `6sNBBsJn5ZPwofH2D3BfsnUEjYUMWHpA3nHsdtqy1fCu`
- Recipient ATA: `J5dtj713eUcSzF5GszwhzBzPzB11VPKhkQaV56Rx6P58`

### Transactions

- [Create mint](https://explorer.solana.com/tx/2pKhMZLvwkzrUSb4ZxwVHz59Xoz3YRHGwMiyAvyPiw3zkV3CyykWw5YTri1SuEMEehG6P6VjGGyDjRn9oJKiWGBJ?cluster=devnet)
- [Mint tokens](https://explorer.solana.com/tx/4gz5sFD8Z5Y8iPWtfkr8UTzwUm25Mx44xP5p2qR38RuWTs9N4i5uv98d2bdX11485SzAqxHKQDRZBh6UYmCLm3wJ?cluster=devnet)
- [Transfer tokens](https://explorer.solana.com/tx/4qmdNe2E6x8Xu5EpbXruv6a1aobVFfgU8trk7QVb1TSqwKif3goEHXVKqUXwX4spiofYC5E6cdPrjuFg1xaQm7Vi?cluster=devnet)
- [Create token metadata](https://explorer.solana.com/tx/3tb5FBYpYLBALFYRhGfV77KbJBFcXkkpb5AD51cxM9GbF6YA9XaHrdUKSKC6gmnBG4MLafCebxdmjoa1KgKefHsn?cluster=devnet)

## NFT workflow

| Script | Command | Purpose |
|---|---|---|
| `src/nft/nft_image.ts` | `npm run nft:image` | Upload the image |
| `src/nft/nft_metadata.ts` | `npm run nft:metadata` | Upload metadata JSON |
| `src/nft/nft_mint.ts` | `npm run nft:mint` | Create a Core NFT |
| `src/nft/nft_update.ts` | `npx ts-node src/nft/nft_update.ts` | Update the existing NFT |

Copy the image URI into the metadata script, then copy the metadata URI into the mint script.

To update the NFT, upload revised metadata and supply its new URI and the existing Asset address to the update script. The metadata upload script currently contains the revised metadata.

Each successful run of the mint script creates a separate NFT. The update script changes the existing NFT.

### Turbin3 Warrior

- Asset: `14QusHcREFFFE5roxtMHTeM9BJj9zmuXqNUGN4KX6kHJ`
- Original name: `Turbin3 Warrior`
- Updated name: `Turbin3 Warrior—Level 2`

Resources:

- [Image](https://gateway.irys.xyz/4mCPrPLWaHGRWAzGV3PJpK7oymuzaPqEywX2WquXXXX6)
- [Original metadata](https://gateway.irys.xyz/BihSi8MaY8yKwXU4cK2pgaxyYo7xBsTcLcbAnNWNTGBV)
- [Updated metadata](https://gateway.irys.xyz/DHNmq2uG6NJ3GtnMAYETivM4j498qYUwfSk9wcua4tjR)
- [NFT creation transaction](https://explorer.solana.com/tx/3LFJW557NiGnWWzf9rMAtoWvav8apnNoYRS6oLmrqjt25CfQALJ3XkCx1YShPFdZKaK9oEFmoPbqjTABiDs1rgAW?cluster=devnet)
- [NFT update transaction](https://explorer.solana.com/tx/5P211jsLtzg3R9icAx1ssNuhCECBFymUkn4cENk9CLgEZ5fSwwrj6EcBLxXWXmWS4Mcsa9yrwuuTeu34L6F4ZTao?cluster=devnet)
