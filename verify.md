# Filter & Sort Feature — Verification Checklist

Run `npm run dev` and start the backend before testing.

## Setup
- [ ] Open `/shop` in the browser
- [ ] "Filters" button appears to the right of the search bar with no badge

## Popover opens correctly
- [ ] Click "Filters" — popover opens with four controls: Sort By, Price Range, Status, Category

## Sort By
- [ ] Select "Price: Low → High" — cheapest product is first (uses sale price when on sale)
- [ ] Select "Price: High → Low" — most expensive product is first
- [ ] Select "Name: A → Z" — products in alphabetical order
- [ ] Select "Name: Z → A" — products in reverse alphabetical order
- [ ] Select "Rating: High → Low" — highest-rated product is first

## Price Range
- [ ] Select "Under $25" — only products priced below $25 are shown
- [ ] Select "$25 – $50" — only products in that range are shown
- [ ] Select "$50 – $100" — only products in that range are shown
- [ ] Select "$100+" — only expensive products are shown
- [ ] Select "All Prices" — all products return

## Status
- [ ] Select "In Stock Only" — no out-of-stock products (stock = 0) are shown
- [ ] Select "On Sale" — only products with `is_on_sale = true` are shown
- [ ] Select "All" — all products return

## Category
- [ ] Category dropdown shows dynamically loaded categories from the API
- [ ] Select a specific category — only products in that category are shown
- [ ] Select "All Categories" — all products return

## Combined filters
- [ ] Search text + any filter applied simultaneously — both constraints respected
- [ ] Sort + Status + Category all active at once — all constraints respected

## Badge & Clear All
- [ ] Filters badge shows correct count when one or more non-default filters are active (e.g. "Filters · 2")
- [ ] "Clear All" button appears only when at least one filter is active
- [ ] Clicking "Clear All" resets all controls to default; badge disappears

## Regression
- [ ] Search bar alone (no filters active) still works as before
- [ ] Other pages (Cart, Favorites, Order History) are unaffected
