import { test, expect } from "@playwright/test";

test.describe("Lipi Malayalam Learning App E2E Tests", () => {
  
  test.beforeEach(async ({ page }) => {
    // Capture browser console logs and errors
    page.on('console', msg => console.log(`[BROWSER LOG] ${msg.text()}`));
    page.on('pageerror', err => console.log(`[BROWSER ERROR] ${err.stack || err.message}`));

    // Navigate to the local dev instance
    await page.goto("/");
    // Reset state before each test to ensure a clean benchmark
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Log in on clean load (guaranteed because localStorage is cleared)
    const nameInput = page.locator("#userNameInput");
    await expect(nameInput).toBeVisible();
    await nameInput.fill("Rahul");
    await page.locator(".avatar-option").first().click(); // pick first avatar (🐘)
    await page.locator("#startJourneyBtn").click();

    // Wait for the main app sidebar to mount and be visible before proceeding
    await expect(page.locator("aside.sidebar")).toBeVisible();
  });

  test("1. Dashboard loads stats header, progress nodes, and welcome card", async ({ page }) => {
    // Verify Brand
    await expect(page.locator("aside.sidebar .brand-name")).toHaveText("Lipi");

    // Verify Stats Panel Initial State
    await expect(page.locator("#heartsValue")).toHaveText("5");
    await expect(page.locator("#xpValue")).toHaveText("0 XP");
    await expect(page.locator("#levelValue")).toHaveText("Lvl 1");

    // Verify Custom greeting
    await expect(page.locator(".welcome-text h1")).toContainText("നമസ്കാരം, Rahul! 🐘");

    // Verify Progress Nodes
    await expect(page.locator(".path-node >> text=Alphabet Tracing")).toBeVisible();
    await expect(page.locator(".path-node >> text=Match Grid & Time Attack")).toBeVisible();
    await expect(page.locator(".path-node >> text=Sentence Builder")).toBeVisible();
    await expect(page.locator(".path-node >> text=Dialogue Chat with Appu")).toBeVisible();
    await expect(page.locator(".path-node >> text=Cultural Quests")).toBeVisible();
  });

  test("2. Navigation sidebar routes correctly to different screens", async ({ page }) => {
    // Tracing
    await page.locator("aside.sidebar .nav-item[data-target='tracing']").click();
    await expect(page.locator(".tracing-container h2")).toHaveText("Character Tracing");

    // Match Grid
    await page.locator("aside.sidebar .nav-item[data-target='matchgrid']").click();
    await expect(page.locator(".matchgrid-container h2")).toHaveText("Vocabulary Match Grid");

    // Sentence Assembler
    await page.locator("aside.sidebar .nav-item[data-target='assembler']").click();
    await expect(page.locator(".assembler-container h2")).toHaveText("Sentence Builder");

    // Flashcards
    await page.locator("aside.sidebar .nav-item[data-target='flashcards']").click();
    await expect(page.locator(".flashcards-container h2")).toHaveText("Spaced Repetition Flashcards");

    // Speaking Dialogues
    await page.locator("aside.sidebar .nav-item[data-target='speaking']").click();
    await expect(page.locator(".speaking-container h2")).toHaveText("Branching Dialogues");

    // Cultural Quests
    await page.locator("aside.sidebar .nav-item[data-target='cultural']").click();
    await expect(page.locator(".cultural-container h2")).toHaveText("Kerala Cultural Discovery");

    // Profile & Settings
    await page.locator("aside.sidebar .nav-item[data-target='profile']").click();
    await expect(page.locator(".profile-container h2")).toHaveText("Profile & Personalization");
  });

  test("3. Match Grid renders standard cards and toggles Time Attack", async ({ page }) => {
    await page.locator("aside.sidebar .nav-item[data-target='matchgrid']").click();

    // Renders 8 cards in standard match grid
    const cards = page.locator(".match-grid .match-card");
    await expect(cards).toHaveCount(8);

    // Toggle Time Attack
    await page.locator("#timeAttackModeBtn").click();
    await expect(page.locator(".time-attack-header")).toBeVisible();
    await expect(page.locator("#timerBar")).toBeVisible();

    // Toggle back to Standard
    await page.locator("#stdModeBtn").click();
    await expect(page.locator(".time-attack-header")).not.toBeVisible();
  });

  test("4. Sentence Builder moves chips and resets correctly", async ({ page }) => {
    await page.locator("aside.sidebar .nav-item[data-target='assembler']").click();

    // Verify word pool has elements
    const poolChips = page.locator("#wordPool .word-chip");
    const count = await poolChips.count();
    expect(count).toBeGreaterThan(0);

    // Get text of first chip
    const firstChipText = await poolChips.first().innerText();

    // Tap first chip
    await poolChips.first().click();

    // Verify chip was placed in the build area
    const placedChips = page.locator("#placedChipsArea .word-chip");
    await expect(placedChips).toHaveCount(1);
    await expect(placedChips.first()).toHaveText(firstChipText);

    // Click Reset
    await page.locator("#resetAssemblerBtn").click();

    // Placed area should empty back to placeholder message
    await expect(page.locator("#placedChipsArea")).toContainText("Tap words to insert...");
  });

  test("5. Spaced Repetition Flashcards flips and submits ratings", async ({ page }) => {
    await page.locator("aside.sidebar .nav-item[data-target='flashcards']").click();

    const card = page.locator("#flashcard");
    
    // Front face initially visible, back face hidden
    await expect(card).not.toHaveClass(/is-flipped/);

    // Click card to flip it
    await card.click();
    await expect(card).toHaveClass(/is-flipped/);

    // Rating buttons appear
    const ratingControls = page.locator("#ratingControls");
    await expect(ratingControls).toBeVisible();

    // Tap 'I Know It'
    await page.locator("#knowBtn").click();

    // XP header increments (+2 XP)
    await expect(page.locator("#xpValue")).toHaveText("2 XP");
  });

  test("6. Speaking Dialogues starts chat conversation logs", async ({ page }) => {
    await page.locator("aside.sidebar .nav-item[data-target='speaking']").click();

    // Verify initial chat bubble from Appu
    const chatBubbles = page.locator(".chat-window .chat-bubble");
    await expect(chatBubbles).toHaveCount(1);
    await expect(chatBubbles.first()).toContainText("🐘 Appu");

    // Verify dialogue options are rendered
    const options = page.locator("#dialogControls .dialog-option-btn");
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
  });

  test("7. Cultural Quests lock overlay displays heritage status", async ({ page }) => {
    await page.locator("aside.sidebar .nav-item[data-target='cultural']").click();

    // Verify facts list contains locked cards on clean state
    const lockedCards = page.locator(".cultural-card.locked");
    const count = await lockedCards.count();
    expect(count).toBeGreaterThan(0);
    await expect(lockedCards.first().locator(".lock-overlay")).toBeVisible();
  });

  test("8. Profile screen saves custom user name and switches theme", async ({ page }) => {
    await page.locator("aside.sidebar .nav-item[data-target='profile']").click();
    
    // Check initial name preview
    await expect(page.locator("#namePreviewLarge")).toHaveText("Rahul");

    // Update name input
    const input = page.locator("#profileNameInput");
    await input.fill("Amal");
    await expect(page.locator("#namePreviewLarge")).toHaveText("Amal");

    // Switch theme to Indigo
    await page.locator(".theme-select-btn[data-theme='indigo']").click();
    await expect(page.locator("body")).toHaveClass(/theme-indigo/);

    // Save profile configurations
    await page.locator("#saveProfileSettingsBtn").click();

    // Header updates dynamically
    await expect(page.locator("#headerName")).toHaveText("Amal");
  });

  test("9. AI Dictionary widget searches and adds custom cards", async ({ page }) => {
    // Search is located on the Dashboard
    await page.locator("aside.sidebar .nav-item[data-target='dashboard']").click();

    const searchInput = page.locator("#dictSearchInput");
    await expect(searchInput).toBeVisible();

    // Search a new word
    await searchInput.fill("computer");
    await page.locator("#dictSearchBtn").click();

    // Result card appears
    const resultCard = page.locator(".dict-result-card");
    await expect(resultCard).toBeVisible({ timeout: 5000 });
    
    // Add custom word to study deck
    const addBtn = resultCard.locator("#addCustomWordBtn");
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await expect(addBtn).toHaveText("Added to Deck ✓");

    // Verify that the custom card is now appended inside the Flashcards deck!
    await page.locator("aside.sidebar .nav-item[data-target='flashcards']").click();
    
    // The new card should be visible (we can navigate to the last card)
    // For simplicity, verify pagination reflects the new count (2500 original + 1 custom = 2501 cards total!)
    const paginationText = page.locator(".pagination-info");
    await expect(paginationText).toContainText("of 2501");
  });

  test("10. Character Tracing loads all 56 alphabets", async ({ page }) => {
    await page.locator("aside.sidebar .nav-item[data-target='tracing']").click();
    await expect(page.locator(".tracing-container h2")).toHaveText("Character Tracing");

    // Verify select dropdown has exactly 56 options
    const selectOptions = page.locator("#letterSelect option");
    await expect(selectOptions).toHaveCount(56);

    // Verify a few key characters are present in the dropdown options
    const optionsText = await selectOptions.allTextContents();
    expect(optionsText[0]).toContain("അ"); // First vowel (Swaram)
    expect(optionsText[15]).toContain("ക"); // First consonant (Vyanjanam)
    expect(optionsText[55]).toContain("ൺ"); // Last chillu letter
  });

  test("11. Cultural Quests unlocks card and opens detail modal", async ({ page }) => {
    // Inject a badge in localStorage before going to cultural tab
    await page.evaluate(() => {
      const stateObj = {
        xp: 150,
        level: 1,
        hearts: 5,
        streak: 3,
        badges: ["badge_first_strokes"], // unlocked!
        user: {
          name: "Rahul",
          avatar: "🐘"
        }
      };
      localStorage.setItem("lipi_game_state", JSON.stringify(stateObj));
    });
    await page.reload();

    await page.locator("aside.sidebar .nav-item[data-target='cultural']").click();

    // Verify unlocked card is visible
    const unlockedCard = page.locator(".cultural-card.unlocked-card").first();
    await expect(unlockedCard).toBeVisible();

    // Click to open detail modal
    await unlockedCard.click();

    // Verify modal overlay is open and details are shown
    const modal = page.locator(".cultural-modal-backdrop");
    await expect(modal).toBeVisible();
    await expect(modal.locator("h2")).toContainText("Kathakali");
    await expect(modal.locator(".cultural-modal-body")).toContainText("literature (Sahithyam)");

    // Click close button
    await modal.locator("#closeDocBtn").click();
    await expect(modal).not.toBeAttached(); // should be removed from DOM
  });

  test("12. Developer API Docs tab loads playground and updates sandbox url", async ({ page }) => {
    const apiLink = page.locator("aside.sidebar .nav-item[data-target='api-docs']");
    await apiLink.scrollIntoViewIfNeeded();
    await apiLink.click();
    await expect(page.locator(".apidocs-container h2")).toHaveText("Lipi Malayalam Dictionary API");

    // Verify sandbox default input and url preview
    const input = page.locator("#sandboxInput");
    await expect(input).toHaveValue("coconut");
    
    const urlPreview = page.locator("pre").first();
    await expect(urlPreview).toContainText("api/lipi/dictionary?word=coconut");

    // Modify input and check url updates
    await input.fill("tea");
    await expect(urlPreview).toContainText("api/lipi/dictionary?word=tea");
  });
});

