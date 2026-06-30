/**
 * Playwright verification script for the AI Interior Consultant assistant.
 *
 * Usage:
 *   1. npm run build && npm run start -- -p 4800   (in one terminal)
 *   2. node scripts/verify-ai-assistant.mjs          (in another terminal)
 *
 * Optional env vars:
 *   BASE_URL                — defaults to http://localhost:4800
 *   PLAYWRIGHT_CHROMIUM_PATH — path to a Chromium binary, if Playwright's
 *                              own browser download isn't available in your
 *                              environment (e.g. a sandboxed CI runner).
 *                              If unset, Playwright's bundled Chromium is used.
 *
 * Covers: desktop/tablet/mobile viewports, console errors, hydration
 * warnings, open/close (button, ESC, click-outside, mobile full-screen
 * sheet), quick actions, product-suggestion chips, typing indicator, body
 * scroll lock, and localStorage chat persistence across reload.
 */
import { chromium } from "playwright";
import fs from "fs";

const EXECUTABLE = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;
const BASE_URL = process.env.BASE_URL || "http://localhost:4800";
const SCREENSHOT_DIR = "./pw-screenshots";

if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR);

const viewports = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 834, height: 1194 },
  mobile: { width: 390, height: 844 },
};

const results = { errors: [], warnings: [], passes: [] };

function logError(scope, msg) {
  results.errors.push(`[${scope}] ${msg}`);
  console.log(`❌ [${scope}] ${msg}`);
}
function logWarning(scope, msg) {
  results.warnings.push(`[${scope}] ${msg}`);
  console.log(`⚠️  [${scope}] ${msg}`);
}
function logPass(scope, msg) {
  results.passes.push(`[${scope}] ${msg}`);
  console.log(`✅ [${scope}] ${msg}`);
}

function attachConsoleCapture(page, scope) {
  const consoleErrors = [];
  const consoleWarnings = [];
  page.on("console", (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === "error") {
      consoleErrors.push(text);
    } else if (type === "warning") {
      consoleWarnings.push(text);
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(`PAGE ERROR: ${err.message}`);
  });
  return { consoleErrors, consoleWarnings };
}

function isHydrationWarning(text) {
  return /hydration|did not match|Text content does not match|server rendered HTML|Hydration failed/i.test(
    text
  );
}

async function runViewportSuite(browser, viewportName, viewport) {
  console.log(`\n========== VIEWPORT: ${viewportName} (${viewport.width}x${viewport.height}) ==========`);
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const { consoleErrors, consoleWarnings } = attachConsoleCapture(page, viewportName);

  // 1. Load homepage
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${viewportName}-01-homepage.png` });

  const hydrationIssues = consoleErrors.filter(isHydrationWarning).concat(
    consoleWarnings.filter(isHydrationWarning)
  );
  if (hydrationIssues.length > 0) {
    hydrationIssues.forEach((h) => logError(viewportName, `Hydration issue: ${h}`));
  } else {
    logPass(viewportName, "No hydration warnings on initial load");
  }

  // 2. Locate the trigger button
  const triggerButton = page.getByRole("button", { name: /open ai interior consultant chat/i });
  const triggerVisible = await triggerButton.isVisible().catch(() => false);
  if (!triggerVisible) {
    logError(viewportName, "Chat trigger button not visible");
    await context.close();
    return;
  }
  logPass(viewportName, "Chat trigger button is visible");

  // 3. Open the chat
  await triggerButton.click();
  await page.waitForTimeout(700);
  const dialog = page.getByRole("dialog", { name: /ai interior consultant chat/i });
  const dialogVisible = await dialog.isVisible().catch(() => false);
  if (!dialogVisible) {
    logError(viewportName, "Chat dialog did not open");
    await context.close();
    return;
  }
  logPass(viewportName, "Chat dialog opened successfully");
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${viewportName}-02-chat-open.png` });

  // 4. Check empty state (scoped to dialog to avoid matching anything on the page behind it)
  const emptyStateVisible = await dialog.getByText("Welcome to Aurelian.").isVisible().catch(() => false);
  if (emptyStateVisible) {
    logPass(viewportName, "Empty state welcome message visible");
  } else {
    logWarning(viewportName, "Empty state welcome message not found (may have prior chat history)");
  }

  // 5. Check quick action chips (scoped to dialog)
  const chipsCount = await dialog.getByRole("button", { name: "Living Room" }).count();
  if (chipsCount > 0) {
    logPass(viewportName, "Quick action chips rendered");
  } else {
    logError(viewportName, "Quick action chips not found");
  }

  // 6. Send a message via typing + Enter
  const textarea = dialog.getByLabel("Message the AI Interior Consultant");
  await textarea.click();
  await textarea.fill("Tell me about the Aurelian Lounge Sofa");
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${viewportName}-03-typed-message.png` });
  await textarea.press("Enter");

  // 7. Check typing indicator appears
  await page.waitForTimeout(150);
  const typingVisible = await dialog
    .getByLabel("AI Interior Consultant is typing")
    .isVisible()
    .catch(() => false);
  if (typingVisible) {
    logPass(viewportName, "Typing indicator appeared after sending message");
  } else {
    logWarning(viewportName, "Typing indicator not observed (response may have been too fast)");
  }

  // 8. Wait for assistant reply
  await page.waitForTimeout(1800);
  const replyVisible = await dialog.getByText("Aurelian Lounge Sofa", { exact: false }).count();
  if (replyVisible > 0) {
    logPass(viewportName, "Assistant replied with product information");
  } else {
    logError(viewportName, "Assistant did not reply with expected product info");
  }
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${viewportName}-04-after-reply.png` });

  // 9. Check product suggestion chip link rendered (scoped to dialog — the homepage
  // behind the modal also has a card link with the same accessible name, so an
  // unscoped query is ambiguous in strict mode).
  const suggestionLink = dialog.getByRole("link", { name: "The Aurelian Lounge Sofa" });
  const suggestionVisible = await suggestionLink.isVisible().catch(() => false);
  if (suggestionVisible) {
    logPass(viewportName, "Product suggestion chip rendered with link");
  } else {
    logError(viewportName, "Product suggestion chip not found");
  }

  // 10. Test a quick action chip click
  const deliveryChip = dialog.getByRole("button", { name: "Delivery" });
  if (await deliveryChip.isVisible().catch(() => false)) {
    await deliveryChip.click();
    await page.waitForTimeout(1500);
    const deliveryReply = await dialog.getByText("white glove delivery", { exact: false }).count();
    if (deliveryReply > 0) {
      logPass(viewportName, "Quick action chip (Delivery) triggered correct reply");
    } else {
      logError(viewportName, "Delivery quick action did not produce expected reply");
    }
  }
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${viewportName}-05-after-quick-action.png` });

  // 11. Test ESC closes the dialog
  await page.keyboard.press("Escape");
  const dialogClosedAfterEsc = await dialog
    .waitFor({ state: "hidden", timeout: 4000 })
    .then(() => true)
    .catch(() => false);
  if (dialogClosedAfterEsc) {
    logPass(viewportName, "ESC key closes the chat dialog");
  } else {
    logError(viewportName, "ESC key did not close the chat dialog");
  }

  // 12. Reopen and test click-outside-to-close. On mobile the panel is an
  // intentional full-screen sheet (matches native iOS/Android sheet
  // patterns), so there is no overlay pixel exposed to click outside —
  // closing there is done via the X button instead, which we verify here.
  await triggerButton.click();
  await page.waitForTimeout(700);
  await dialog.waitFor({ state: "visible", timeout: 5000 });

  if (viewportName === "mobile") {
    const panelBox = await dialog.boundingBox();
    const coversFullViewport =
      panelBox && panelBox.width === viewport.width && panelBox.height === viewport.height;
    if (coversFullViewport) {
      logPass(
        viewportName,
        "Panel is a full-screen sheet on mobile (no overlay area exposed) — click-outside intentionally unavailable; verifying X button closes instead"
      );
      const closeButtonMobile = dialog.getByRole("button", { name: "Close chat" });
      await closeButtonMobile.click();
      const closedViaButton = await dialog
        .waitFor({ state: "hidden", timeout: 4000 })
        .then(() => true)
        .catch(() => false);
      if (closedViaButton) {
        logPass(viewportName, "Close (X) button closes the full-screen mobile sheet");
      } else {
        logError(viewportName, "Close (X) button did not close the mobile sheet");
      }
      // Dialog is now closed, matching the end-state of the desktop/tablet
      // branch below, so step 13 can uniformly reopen it via the trigger.
    } else {
      logWarning(
        viewportName,
        `Expected full-screen panel on mobile but got ${panelBox?.width}x${panelBox?.height} vs viewport ${viewport.width}x${viewport.height}`
      );
    }
  } else {
    // Click far in the top-left corner, outside the panel
    await page.mouse.click(10, 10);
    const dialogClosedAfterOutsideClick = await dialog
      .waitFor({ state: "hidden", timeout: 4000 })
      .then(() => true)
      .catch(() => false);
    if (dialogClosedAfterOutsideClick) {
      logPass(viewportName, "Click-outside closes the chat dialog");
    } else {
      logError(viewportName, "Click-outside did not close the chat dialog");
    }
  }

  // 13. Reopen, send another message, then test persistence via reload
  await triggerButton.click();
  await page.waitForTimeout(700);
  await dialog.waitFor({ state: "visible", timeout: 5000 });
  const textarea2 = dialog.getByLabel("Message the AI Interior Consultant");
  await textarea2.fill("What warranty do you provide?");
  await textarea2.press("Enter");
  await page.waitForTimeout(1800);

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const postReloadHydrationIssues = consoleErrors.filter(isHydrationWarning);
  if (postReloadHydrationIssues.length === 0) {
    logPass(viewportName, "No hydration warnings after reload");
  }
  // Re-open chat after reload to check persistence
  const triggerAfterReload = page.getByRole("button", { name: /open ai interior consultant chat/i });
  await triggerAfterReload.click();
  await page.waitForTimeout(700);
  const dialogAfterReload = page.getByRole("dialog", { name: /ai interior consultant chat/i });
  await dialogAfterReload.waitFor({ state: "visible", timeout: 5000 });
  const persistedMessage = await dialogAfterReload.getByText("What warranty do you provide?").count();
  if (persistedMessage > 0) {
    logPass(viewportName, "Chat history persisted across page reload (localStorage)");
  } else {
    logError(viewportName, "Chat history did NOT persist across reload");
  }
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${viewportName}-06-after-reload-persistence.png` });

  // 14. Body scroll lock check
  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
  if (bodyOverflow === "hidden") {
    logPass(viewportName, "Body scroll lock active while chat is open");
  } else {
    logError(viewportName, `Body scroll lock not active (overflow: "${bodyOverflow}")`);
  }

  // Close chat, check scroll unlocked
  const closeBtn = dialogAfterReload.getByRole("button", { name: "Close chat" });
  await closeBtn.click();
  await page.waitForTimeout(500);
  const bodyOverflowAfterClose = await page.evaluate(() => document.body.style.overflow);
  if (bodyOverflowAfterClose === "") {
    logPass(viewportName, "Body scroll lock released after closing chat");
  } else {
    logError(viewportName, `Body scroll lock not released (overflow: "${bodyOverflowAfterClose}")`);
  }

  // Final console error/warning summary for this viewport
  const realErrors = consoleErrors.filter((e) => !isHydrationWarning(e));
  if (realErrors.length > 0) {
    realErrors.forEach((e) => logError(viewportName, `Console error: ${e}`));
  } else {
    logPass(viewportName, "Zero non-hydration console errors");
  }

  await context.close();
}

const browser = await chromium.launch(EXECUTABLE ? { executablePath: EXECUTABLE } : {});

for (const [name, vp] of Object.entries(viewports)) {
  try {
    await runViewportSuite(browser, name, vp);
  } catch (err) {
    logError(name, `Uncaught test exception: ${err.message}`);
  }
}

await browser.close();

console.log("\n\n========== SUMMARY ==========");
console.log(`Passes: ${results.passes.length}`);
console.log(`Warnings: ${results.warnings.length}`);
console.log(`Errors: ${results.errors.length}`);
if (results.errors.length > 0) {
  console.log("\nERRORS:");
  results.errors.forEach((e) => console.log("  - " + e));
}
if (results.warnings.length > 0) {
  console.log("\nWARNINGS:");
  results.warnings.forEach((w) => console.log("  - " + w));
}

fs.writeFileSync("./pw-results.json", JSON.stringify(results, null, 2));
process.exit(results.errors.length > 0 ? 1 : 0);
