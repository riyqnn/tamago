# TamagoSui

Welcome to **TamagoSui** – a virtual pet game built on Sui, demonstrating the power of dynamic fields, object-centric architecture, and real-time blockchain gaming!

---

## 🚀 Live Demo Flow

### 1. Connect Wallet
- Connect your Sui wallet to testnet.
- Ensure you have test tokens (get from Sui Faucet if needed).

### 2. Adopt Pet
- Enter a pet name.
- Submit the adoption transaction.
- Your pet appears with initial stats.

### 3. Interact with Your Pet

| Action   | Cost/Gain | Stat Changes                                                                 |
|----------|-----------|------------------------------------------------------------------------------|
| **Feed** | -5 coins  | Hunger: +20, XP: +5                                                          |
| **Play** | -15 energy, -15 hunger | Happiness: +25, XP: +10                                 |
| **Work** | -20 energy, -20 happiness, -20 hunger | +10 coins, XP: +15                      |
| **Sleep**| N/A       | Pet sleeps. Recovers energy over time (1/sec).                               |
| **Wake Up** | N/A    | Calculate time-based stat changes.                                           |
| **Level Up** | XP ≥ level × 100 | Level up when XP threshold is met.                         |

- All actions are on-chain, and UI updates reflect real-time changes.

### 4. Observe Dynamic Fields
- Sleep state is stored/removed dynamically.
- Pet image updates based on state and level.
- Real-time UI updates and stat progress bars.

---

## 🎮 Key Gaming Features Demonstrated

### 1. **Dynamic Fields in Action**
- **Sleep System**  
  - *When pet sleeps*:  
    `dynamic_field::add(&mut pet.id, b"sleep_started_at", timestamp);`
  - *When pet wakes*:  
    `let sleep_time = dynamic_field::remove<String, u64>(&mut pet.id, key);`
- **Equipment System**  
  - Store accessory in pet object:  
    `dynamic_field::add(&mut pet.id, b"equipped_item", accessory);`

### 2. **Object-Centric Benefits**
- **True Ownership:** Pet NFT belongs to user.
- **Composability:** Pets can "own" accessories via dynamic fields.
- **Flexibility:** Add features without schema changes.
- **Efficiency:** Only pay for storage you use.

### 3. **Real-time Gaming**
- All stat changes occur in a single transaction.
- No complex state synchronization needed.
- UI updates instantly via React Query.
- Sub-second transaction finality on Sui.

---

## 🏆 Workshop Summary

### What We Built
- ✅ Complete Virtual Pet Game
- ✅ Dynamic Fields Implementation
- ✅ Object-Centric Architecture
- ✅ Real-time Frontend Integration
- ✅ Sui Gaming Best Practices

### Key Takeaways

#### For Developers:
- **Dynamic Fields:** Flexible, efficient storage.
- **Object-Centric Model:** True ownership & composability.
- **Move Language:** Safe, resource-oriented programming.
- **Sui dApp Kit:** Easy blockchain integration.

#### For Gaming:
- **Lower Costs:** Sustainable game economies.
- **Real-time Updates:** Better user experience.
- **True Ownership:** Players own their assets.
- **Extensibility:** Easily add new features.

---

## 🚀 Next Steps

### Immediate Actions
- [ ] Complete the workshop implementation.
- [ ] Deploy your contract to testnet.
- [ ] Test all pet interactions.
- [ ] Explore Sui Explorer for your transactions.

### Advanced Features to Add
- **Breeding System:** Combine pets to create new ones.
- **Marketplace:** Trade pets and accessories.
- **Battles:** Pet vs. pet combat.
- **Quests:** Story-driven gameplay.
- **Guilds:** Multiplayer features.

### Learning Resources
- 📚 [Sui Documentation](https://docs.sui.io/)
- 🎮 [Move Book](https://move-book.com/)
- 💬 [Sui Discord](https://discord.gg/sui)
- 🐦 [Sui Twitter](https://twitter.com/SuiNetwork)
- 🔍 [Sui Explorer](https://explorer.sui.io/)

---

## ❓ Troubleshooting

### Common Issues & Fixes

1. **Package ID Error**
   - Ensure `.env.local` has the correct Package ID:
     ```
     VITE_PACKAGE_ID=0x123abc...
     ```

2. **Build Errors**
   - Clear dependencies and rebuild:
     ```
     rm -rf node_modules package-lock.json
     npm install
     ```

3. **Transaction Failures**
   - Make sure your wallet is on testnet.
   - Check for sufficient gas balance.
   - Verify contract is properly deployed.
   - Ensure your pet has enough energy/coins for actions.

4. **Dynamic Fields Not Working**
   - Confirm the pet exists in your wallet.
   - Verify Package ID matches the deployed contract.
   - Ensure transactions complete successfully.

5. **Missing Hooks**
   - Remember to create all required hook files:
     - `useMutatePlayWithPet.ts`
     - `useMutateWorkForCoins.ts`
     - `useMutateLetPetSleep.ts`
     - `useMutateWakeUpPet.ts`
     - `useMutateCheckLevel.ts`

---

## 🎉 Congratulations!

You've successfully built **TamagoSui** – a complete virtual pet game that showcases Sui's gaming advantages!

You now understand:
- ✅ Dynamic Fields for flexible game data
- ✅ Object-centric architecture for true ownership
- ✅ Move programming for secure smart contracts
- ✅ Real-time blockchain gaming integration

Keep Building! 🚀  
The blockchain gaming industry is just getting started. With Sui's unique features, you're well-equipped to build the next generation of on-chain games.

**Happy Gaming on Sui!** 🎮⚡
