---
name: payment-provider-integration
description: Use when adding or modifying a bank/payment gateway integration (Sepay, ThueApiBank, card deposits, or any new provider) - covers fetch/normalize/dedup/credit flow conventions
---

# Payment Provider Integration

## Overview

Bank deposit providers (Sepay, ThueApiBank, ...) follow a consistent fetch → normalize → dedup → credit pipeline. New providers should slot into this pipeline rather than inventing a new flow.

## The Pipeline

1. **Provider service** (`app/Services/{Provider}Service.php`) - talks to the external API only. Returns a normalized array, never throws:
   ```php
   /**
    * @return array{success: bool, transactions: array<int, array{type: string, amount: int, content: string, reference: string}>, message: string}
    */
   public static function fetchTransactions(BankAccount $bankAccount): array
   ```
   - `type`: `'IN'` or `'OUT'` (only `'IN'` with `amount > 0` gets processed downstream)
   - `reference`: a string unique enough to dedupe on (combine with bank account ID if the provider's IDs aren't globally unique - see comment in `FetchBankTransactions` about ThueApiBank)
   - Wrap the HTTP call in try/catch; on any failure return `success: false` with a `message`, never let exceptions bubble up to the scheduler.

2. **Dispatcher** (`FetchBankTransactions` command) - picks the provider by `$bankAccount->api_provider`, calls `fetchTransactions`, then `processTransactions`.

3. **Dedup check** - before doing anything else, check `BankDeposit::where('reference_number', $referenceNumber)->exists()`. If true, skip. This is the idempotency guard against re-processing the same external transaction on the next poll.

4. **Record + credit** - inside `DB::beginTransaction()` / `DB::commit()` / `DB::rollBack()`:
   - Create a `BankDeposit` row first (the dedup record)
   - Then call `BankDepositCreditService::credit(...)` to update balance + write `Transaction` (see [[wallet-ledger-integrity]])
   - On any exception, `DB::rollBack()` and `continue` to the next transaction - don't let one bad record stop the whole batch.

5. **Audit + notify** - after commit, `SystemLog::add(...)` for the admin activity log, and `BankDepositCreditService::credit` already sends a `NotificationService::send(NotificationType::DepositBank, ...)`.

## Adding a New Provider

- New file: `app/Services/{Provider}Service.php`, static `fetchTransactions(BankAccount $bankAccount): array` returning the shape above.
- Add a branch in `FetchBankTransactions::handle()` keyed on `$bankAccount->api_provider`.
- On config errors (missing credentials/codes), set `api_error` / `api_error_message` on the `BankAccount` and `continue` - don't throw.
- Map provider-specific transaction IDs to `reference` carefully - if they can collide across accounts, prefix with the bank account ID (existing pattern for ThueApiBank).

## Common Mistakes

- Forgetting the dedup check → double-crediting on retry/re-poll.
- Throwing from `fetchTransactions` instead of returning `success: false` → crashes the whole scheduled command for all bank accounts.
- Crediting before creating the `BankDeposit` dedup record (or outside the same transaction) → a crash between the two leaves the system either un-deduped or credited-without-record.

## If Unclear

If the provider's API doesn't map cleanly onto `type`/`amount`/`content`/`reference`, or dedup uniqueness is unclear, ask the user before guessing - this directly affects whether users get double-credited.
