module Klash::market {
    use std::signer;
    use std::option::{Self, Option};
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::event;

    // Errors
    const E_NOT_ADMIN: u64 = 1;
    const E_MARKET_NOT_FOUND: u64 = 2;
    const E_SESSION_FULL: u64 = 3;
    const E_INVALID_SIDE: u64 = 4;
    const E_ALREADY_RESOLVED: u64 = 5;
    const E_NOT_ENOUGH_PLAYERS: u64 = 6;
    const E_CONFIG_NOT_INITIALIZED: u64 = 7;
    const E_INVALID_AMOUNT: u64 = 8;
    const E_PLAYER_ALREADY_JOINED: u64 = 9;

    struct GlobalConfig has key {
        admin: address,
        treasury: address,
        fee_bps: u64,
    }

    struct MarketController has key {
        signer_cap: SignerCapability,
    }

    struct TwoPlayerSession has key {
        player1: address,
        player2: Option<address>,
        bet1_side: u8,
        bet1_amount: u64,
        bet2_side: Option<u8>,
        bet2_amount: u64,
        resolved: bool,
        winner: Option<address>,
    }

    #[event]
    struct MarketCreated has drop, store {
        market_id: address,
        creator: address,
    }

    #[event]
    struct BetPlaced has drop, store {
        market_id: address,
        player: address,
        side: u8,
        amount: u64,
        is_player1: bool,
    }

    #[event]
    struct MarketResolved has drop, store {
        market_id: address,
        winner: address,
        winning_side: u8,
        total_payout: u64,
        fee: u64,
    }

    public entry fun init_config(admin: &signer, treasury: address, fee_bps: u64) {
        let admin_addr = signer::address_of(admin);
        if (!exists<GlobalConfig>(@Klash)) {
            move_to(admin, GlobalConfig {
                admin: admin_addr,
                treasury,
                fee_bps,
            });
        }
    }

    /// Create a new market resource account.
    /// `seed` is used to derive the address.
    public entry fun init_market(admin: &signer, seed: vector<u8>) acquires GlobalConfig {
        let admin_addr = signer::address_of(admin);
        let config = borrow_global<GlobalConfig>(@Klash); 
        assert!(config.admin == admin_addr, E_NOT_ADMIN);

        let (market_signer, market_cap) = account::create_resource_account(admin, seed);
        let market_addr = signer::address_of(&market_signer);

        move_to(&market_signer, MarketController {
            signer_cap: market_cap,
        });

        move_to(&market_signer, TwoPlayerSession {
            player1: @0x0, // Placeholder, indicates empty
            player2: option::none(),
            bet1_side: 0, 
            bet1_amount: 0,
            bet2_side: option::none(),
            bet2_amount: 0,
            resolved: false,
            winner: option::none(),
        });

        event::emit(MarketCreated {
            market_id: market_addr,
            creator: admin_addr,
        });
    }

    public entry fun place_bet_two_player(
        user: &signer,
        market_id: address,
        side: u8,
        amount: u64
    ) acquires TwoPlayerSession {
        assert!(exists<TwoPlayerSession>(market_id), E_MARKET_NOT_FOUND);
        let user_addr = signer::address_of(user);
        assert!(amount > 0, E_INVALID_AMOUNT);
        
        let session = borrow_global_mut<TwoPlayerSession>(market_id);
        
        if (session.bet1_amount == 0) {
            // Player 1 joining
            coin::transfer<AptosCoin>(user, market_id, amount);
            
            session.player1 = user_addr;
            session.bet1_side = side;
            session.bet1_amount = amount;

             event::emit(BetPlaced {
                market_id,
                player: user_addr,
                side,
                amount,
                is_player1: true
            });
            
        } else if (option::is_none(&session.player2)) {
            // Player 2 joining
            assert!(user_addr != session.player1, E_PLAYER_ALREADY_JOINED);
            // Optionally enforce side mismatch: assert!(side != session.bet1_side, E_INVALID_SIDE);
            
            coin::transfer<AptosCoin>(user, market_id, amount);
            
            session.player2 = option::some(user_addr);
            session.bet2_side = option::some(side);
            session.bet2_amount = amount;

            event::emit(BetPlaced {
                market_id,
                player: user_addr,
                side,
                amount,
                is_player1: false
            });
            
        } else {
            abort E_SESSION_FULL
        };
    }

    public entry fun resolve_two_player(
        admin: &signer, 
        market_id: address, 
        winning_side: u8
    ) acquires TwoPlayerSession, GlobalConfig, MarketController {
        let admin_addr = signer::address_of(admin);
        let config = borrow_global<GlobalConfig>(@Klash);
        assert!(config.admin == admin_addr, E_NOT_ADMIN);
        
        let session = borrow_global_mut<TwoPlayerSession>(market_id);
        assert!(!session.resolved, E_ALREADY_RESOLVED);
        assert!(option::is_some(&session.player2), E_NOT_ENOUGH_PLAYERS);
        
        let total_pool = session.bet1_amount + session.bet2_amount;
        let fee = (total_pool * config.fee_bps) / 10000;
        let payout = total_pool - fee;
        
        // Determine winner
        let winner_addr_opt = if (session.bet1_side == winning_side) {
            option::some(session.player1)
        } else if (option::contains(&session.bet2_side, &winning_side)) {
            session.player2
        } else {
            // Handle draw or invalid side: refund both?
            // For MVP, if side matches neither, we treat it as HOUSE WIN or locked.
            // Let's abort to be safe, admin must pass valid side.
            abort E_INVALID_SIDE 
        };
        
        let winner = *option::borrow(&winner_addr_opt);
        session.winner = winner_addr_opt;
        session.resolved = true;
        
        // Payout
        let controller = borrow_global<MarketController>(market_id);
        let market_signer = account::create_signer_with_capability(&controller.signer_cap);
        
        coin::transfer<AptosCoin>(&market_signer, winner, payout);
        coin::transfer<AptosCoin>(&market_signer, config.treasury, fee);

        event::emit(MarketResolved {
            market_id,
            winner,
            winning_side,
            total_payout: payout,
            fee
        });
    }
}
