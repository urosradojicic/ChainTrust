

## Plan: Make "Create Proposal" Button Functional

The "Create Proposal" button (line 126-128) is a plain button with no dialog or handler attached. Need to add a proposal creation modal similar to the existing pledge modal.

### Changes

**`src/pages/Governance.tsx`**

1. Add state variables for the proposal modal: `proposalModalOpen`, `proposalTitle`, `proposalDesc`
2. Replace the plain `<button>` with a `<Dialog>` wrapping a `<DialogTrigger>` and `<DialogContent>` containing:
   - Title input
   - Description textarea
   - Proposer address (auto-filled from wallet or placeholder)
   - End date picker (default 7 days from now)
   - Cancel / Create Proposal buttons
3. Add `handleCreateProposal` function that inserts into the `proposals` table via Supabase (status: "Active", votes all 0, ends_at 7 days out) and refreshes the local list
4. Fetch proposals from Supabase on mount instead of relying solely on `PROPOSALS` mock data (or keep mock data as fallback and append new ones locally for demo purposes)

### Result
Clicking "Create Proposal" opens a modal form. Submitting adds the proposal to the list with "Active" status and visible vote bars.

