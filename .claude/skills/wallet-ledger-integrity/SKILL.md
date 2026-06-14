---
name: wallet-ledger-integrity
description: Use when reading, writing, or reviewing any code that changes a user's balance/wallet (deposits, purchases, refunds, admin adjustments, affiliate payouts, spin rewards) - covers locking, transactions, and the Transaction ledger
---

# Wallet Ledger Integrity

## Overview

`User.balance` is real money. Every change to it MUST be atomic, race-safe, and recorded as a `Transaction` row. Getting this wrong causes lost/duplicated funds or a balance that doesn't match its audit trail.

## The Pattern (every balance mutation)

```php
DB::transaction(function () use (...) {
    // 1. Lock the user row - re-fetch, don't reuse a model loaded earlier
    $user = User::where('id', $userId)->lockForUpdate()->first();

    // 2. Validate against the freshly-locked balance (not a stale value)
    if ($user->balance < $amount) {
        throw ValidationException::withMessages([...]);
    }

    $balanceBefore = $user->balance;
    $user->balance += $delta; // or -= $delta
    $user->save();

    // 3. Always write the ledger entry in the SAME transaction
    Transaction::create([
        'user_id' => $user->id,
        'amount' => $amount,
        'type' => 'in' | 'out',
        'action' => '...', // see Transaction::getActionLabelAttribute() for valid values
        'balance_before' => $balanceBefore,
        'balance_after' => $user->balance,
        'description' => '...',
        'reference_id' => '...', // see "reference_id" below
    ]);
});
```

Reference: `app/Http/Controllers/AccountController.php::buy` is the canonical example (lock account row + lock user row + transaction + ledger, all inside `DB::transaction`).

## Rules

- **Always wrap in `DB::transaction()`** (closure form preferred for new code; `DB::beginTransaction()`/`commit()`/`rollBack()` is the older style still used in some controllers/commands - match the surrounding file).
- **Always `lockForUpdate()` the `User` row** before reading/mutating `balance`. Re-fetch it locked - don't trust a `$user` instance that was loaded before the transaction started.
- **Never** update `balance` without creating a matching `Transaction` row in the same DB transaction.
- `type` is `'in'` for credits, `'out'` for debits.
- `action` must be one of the values handled in `Transaction::getActionLabelAttribute()`. Adding a new action? Add its Vietnamese label there too.
- `reference_id` should point to the related entity that caused this transaction (e.g. account ID for `buy_account`, bank transaction reference for `deposit_bank`) - so the ledger entry is traceable back to its source.

## Idempotency for external triggers

Anything driven by an external event (bank webhook/poll, payment callback) must check for an existing record by its unique external reference **before** crediting, to avoid double-crediting on retries. See `FetchBankTransactions::processTransactions` - it checks `BankDeposit::where('reference_number', $referenceNumber)->exists()` before calling `BankDepositCreditService::credit`.

## Known gap to be aware of

`BankDepositCreditService::credit()` does **not** `lockForUpdate()` the user row itself - it relies on the caller's transaction and the fact that deposits are processed serially by a single scheduled command. If you reuse this service from a new concurrent entry point (e.g. a webhook endpoint), add the lock yourself or flag this to the user before assuming it's safe.

## If Unclear

If a requested change touches balance/`Transaction` and you're not sure which `action` value, lock scope, or idempotency key to use, ask the user rather than guessing - mistakes here mean real money discrepancies.
