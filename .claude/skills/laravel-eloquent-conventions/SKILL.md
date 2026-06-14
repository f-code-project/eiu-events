---
name: laravel-eloquent-conventions
description: Use when creating or editing Eloquent models, relationships, casts, or accessors in this project - covers this codebase's specific conventions for return types, casts, and relationship style
---

# Laravel Eloquent Conventions (this project)

## Overview

This codebase has two generations of model style. **Newer models follow stricter conventions matching CLAUDE.md** - follow the newer style for any new code. Only match the older style when editing an old file in place (don't rewrite unrelated methods).

## Newer convention (use this for new models/methods)

Reference: `app/Models/BankDeposit.php`, `app/Models/AdminTrustedDevice.php`

```php
protected function casts(): array
{
    return [
        'amount' => 'integer',
        'response' => 'array',
    ];
}

public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

public function bankAccount(): BelongsTo
{
    return $this->belongsTo(BankAccount::class);
}
```

- `casts()` method (not `protected $casts` array)
- Explicit return types on every relationship: `BelongsTo`, `HasMany`, `HasOne`, `BelongsToMany`, `MorphMany`, etc. - import from `Illuminate\Database\Eloquent\Relations\*`
- Accessors use `get{Name}Attribute(): {type}` with explicit return type

## Older style (still present, e.g. `app/Models/Account.php`, `app/Models/Transaction.php`)

```php
protected $casts = [...];

public function group()
{
    return $this->belongsTo(AccountGroup::class, 'group_id');
}
```

If you're adding ONE new relationship/method to an old-style file, match the file's existing style for consistency rather than mixing both - but mention to the user that the newer convention exists, in case they want the whole file modernized separately.

## General Rules

- Always use `HasFactory` + create/update the matching factory when adding a new model (per CLAUDE.md "Model Creation").
- PHPDoc comments on relationships explaining the Vietnamese business meaning are common (e.g. `/** Thuộc về một người dùng */`) - keep this pattern for non-obvious relationships.
- Eager-load relationships used in views/loops (`->with(...)`) to avoid N+1 - check the controller for `->with()` chains before adding a new relationship access in a loop.
- Custom query logic belongs in scopes (`scopeXxx(Builder $query): Builder`) on the model, not raw `DB::` queries (per CLAUDE.md "Avoid `DB::`; prefer `Model::query()`").

## If Unclear

If a model mixes conventions and it's not clear whether to modernize it as part of your change, ask the user - don't do a drive-by rewrite of unrelated methods.
