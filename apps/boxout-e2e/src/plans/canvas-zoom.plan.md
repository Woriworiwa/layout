# Canvas Zoom and Pan Functionality Test Plan

## Application Overview

This test plan covers comprehensive testing of the canvas zoom and pan functionality in the layout application. The zoom feature allows users to zoom in/out of the canvas using multiple methods (toolbar buttons, menu options, mouse wheel with Ctrl, keyboard shortcuts) with zoom levels ranging from 30% to 1000%. The pan feature enables users to navigate around the canvas when zoomed in using Space key + drag, pan mode button, or mouse wheel scrolling. The tests verify zoom controls, pan interactions, boundary conditions, zoom level persistence, and interaction between zoom and other canvas features.

## Test Scenarios

### 1. Zoom Controls

**Seed:** `apps/boxout-e2e/src/seed.spec.ts`

#### 1.1. should zoom in using Zoom In menu option

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-controls/zoom-in-menu.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Note the initial zoom level (should be 100%)
  3. Click the zoom percentage button in the toolbar
  4. Click 'Zoom In' from the dropdown menu
  5. Verify the zoom percentage increases by 3% (to 103%)

**Expected Results:**
  - Zoom percentage button displays the updated zoom level
  - Canvas content appears larger
  - Zoom level is accurately reflected in the toolbar

#### 1.2. should zoom out using Zoom Out menu option

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-controls/zoom-out-menu.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Set zoom to 150% using the zoom menu
  3. Click the zoom percentage button in the toolbar
  4. Click 'Zoom Out' from the dropdown menu
  5. Verify the zoom percentage decreases by 3% (to 147%)

**Expected Results:**
  - Zoom percentage button displays the updated zoom level
  - Canvas content appears smaller
  - Zoom level is accurately reflected in the toolbar

#### 1.3. should set zoom to specific percentage from menu

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-controls/zoom-preset-levels.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Click the zoom percentage button in the toolbar
  3. Test each preset zoom level: 50%, 75%, 100%, 125%, 150%, 200%
  4. For each level: Click the option and verify the zoom percentage updates correctly
  5. Verify canvas content scales appropriately for each zoom level

**Expected Results:**
  - Each preset zoom level applies correctly
  - Zoom percentage button displays the exact selected percentage
  - Canvas content scales proportionally for each zoom level
  - Menu closes after selecting a zoom level

#### 1.4. should zoom to 100% using Zoom to 100% option

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-controls/zoom-to-100.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Set zoom to 200% using the zoom menu
  3. Click the zoom percentage button in the toolbar
  4. Click 'Zoom to 100%' from the dropdown menu
  5. Verify the zoom level resets to exactly 100%

**Expected Results:**
  - Zoom percentage button displays 100%
  - Canvas content returns to default size
  - Pan offset is maintained (canvas position doesn't reset)

#### 1.5. should reset zoom and pan using Zoom to Fit option

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-controls/zoom-to-fit.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Set zoom to 150%
  3. Pan the canvas to a different position using Space + drag
  4. Click the zoom percentage button in the toolbar
  5. Click 'Zoom to Fit' from the dropdown menu
  6. Verify both zoom and pan are reset

**Expected Results:**
  - Zoom percentage button displays 100%
  - Canvas position resets to center (pan offset is 0,0)
  - Canvas content is at default size and position

#### 1.6. should zoom in using mouse wheel with Ctrl key

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-controls/zoom-mouse-wheel-in.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Note the initial zoom level (100%)
  3. Hover mouse over the canvas
  4. Hold Ctrl key and scroll mouse wheel up (negative deltaY)
  5. Verify zoom increases by 3%
  6. Repeat scrolling up and verify continuous zoom increase

**Expected Results:**
  - Zoom level increases by 3% per scroll step
  - Zoom percentage updates in toolbar
  - Canvas content scales up smoothly
  - Page doesn't scroll while Ctrl is held

#### 1.7. should zoom out using mouse wheel with Ctrl key

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-controls/zoom-mouse-wheel-out.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Set zoom to 150%
  3. Hover mouse over the canvas
  4. Hold Ctrl key and scroll mouse wheel down (positive deltaY)
  5. Verify zoom decreases by 3%
  6. Repeat scrolling down and verify continuous zoom decrease

**Expected Results:**
  - Zoom level decreases by 3% per scroll step
  - Zoom percentage updates in toolbar
  - Canvas content scales down smoothly
  - Page doesn't scroll while Ctrl is held

#### 1.8. should display current zoom percentage in toolbar

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-controls/zoom-percentage-display.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Verify initial zoom percentage displays as 100%
  3. Zoom in to 150% using the menu
  4. Verify the toolbar button shows 150%
  5. Zoom out to 75% using the menu
  6. Verify the toolbar button shows 75%
  7. Use mouse wheel to zoom and verify percentage updates in real-time

**Expected Results:**
  - Zoom percentage is always visible in the toolbar
  - Percentage updates immediately when zoom changes
  - Percentage is rounded to nearest whole number
  - Button is clickable to open zoom menu

### 2. Zoom Boundaries

**Seed:** `apps/boxout-e2e/src/seed.spec.ts`

#### 2.1. should not zoom below minimum zoom level (30%)

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-boundaries/minimum-zoom.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Set zoom to 50% using the menu
  3. Continuously zoom out using Ctrl + mouse wheel down
  4. Continue zooming out for multiple scroll attempts
  5. Verify zoom stops at 30% and doesn't go lower

**Expected Results:**
  - Zoom level stops at 30%
  - Further zoom out attempts have no effect
  - No errors or warnings appear
  - Canvas remains functional at minimum zoom

#### 2.2. should not zoom above maximum zoom level (1000%)

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-boundaries/maximum-zoom.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Set zoom to 200% using the menu
  3. Continuously zoom in using Ctrl + mouse wheel up
  4. Continue zooming in for multiple scroll attempts beyond 1000%
  5. Verify zoom stops at 1000% and doesn't go higher

**Expected Results:**
  - Zoom level stops at 1000%
  - Further zoom in attempts have no effect
  - No errors or warnings appear
  - Canvas remains functional at maximum zoom

#### 2.3. should clamp zoom level when using zoomTo with out-of-range values

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-boundaries/zoom-clamping.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Open browser console to execute JavaScript
  3. Get reference to PanZoomService
  4. Call panZoomService.zoomTo(0.1) (below minimum)
  5. Verify zoom is clamped to 30%
  6. Call panZoomService.zoomTo(15) (above maximum)
  7. Verify zoom is clamped to 1000%

**Expected Results:**
  - Values below 0.3 are clamped to 30%
  - Values above 10 are clamped to 1000%
  - Zoom percentage displays clamped value
  - No errors occur from out-of-range values

### 3. Pan Functionality

**Seed:** `apps/boxout-e2e/src/seed.spec.ts`

#### 3.1. should pan canvas using Space key and mouse drag

**File:** `apps/boxout-e2e/src/tests/canvas/pan-functionality/pan-space-drag.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Zoom to 150% to enable panning
  3. Get initial canvas transform position
  4. Press and hold Space key
  5. Verify overlay becomes visible with 'grab' cursor
  6. Click and drag mouse to the right and down
  7. Release mouse and Space key
  8. Verify canvas position has changed in the drag direction

**Expected Results:**
  - Space key activates pan mode (overlay visible)
  - Cursor changes to 'grab' when Space is held
  - Cursor changes to 'grabbing' while dragging
  - Canvas pans smoothly in the drag direction
  - Pan overlay disappears when Space is released
  - Canvas position is updated correctly

#### 3.2. should pan canvas using Pan mode button

**File:** `apps/boxout-e2e/src/tests/canvas/pan-functionality/pan-mode-button.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Zoom to 150%
  3. Click the Pan button in the toolbar
  4. Verify the Pan button appears active/pressed
  5. Get initial canvas transform position
  6. Click and drag anywhere on the canvas
  7. Verify canvas pans in the drag direction
  8. Click the Select button to deactivate pan mode
  9. Verify Pan button returns to normal state

**Expected Results:**
  - Pan button shows active state when clicked
  - Pan overlay becomes visible
  - Canvas pans while dragging without holding Space
  - Select button deactivates pan mode
  - Pan overlay disappears when pan mode is deactivated

#### 3.3. should pan vertically using mouse wheel without Ctrl

**File:** `apps/boxout-e2e/src/tests/canvas/pan-functionality/pan-vertical-scroll.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Zoom to 150%
  3. Get initial canvas transform position
  4. Scroll mouse wheel down (without Ctrl key)
  5. Verify canvas pans vertically downward
  6. Scroll mouse wheel up
  7. Verify canvas pans vertically upward

**Expected Results:**
  - Mouse wheel down pans canvas down
  - Mouse wheel up pans canvas up
  - Zoom level doesn't change
  - Pan amount corresponds to scroll deltaY value

#### 3.4. should pan horizontally using Shift + mouse wheel

**File:** `apps/boxout-e2e/src/tests/canvas/pan-functionality/pan-horizontal-scroll.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Zoom to 150%
  3. Get initial canvas transform position
  4. Hold Shift key and scroll mouse wheel down
  5. Verify canvas pans horizontally to the right
  6. Hold Shift key and scroll mouse wheel up
  7. Verify canvas pans horizontally to the left

**Expected Results:**
  - Shift + wheel down pans canvas right
  - Shift + wheel up pans canvas left
  - Zoom level doesn't change
  - Pan amount corresponds to scroll deltaY value

#### 3.5. should stop panning when mouse leaves canvas overlay

**File:** `apps/boxout-e2e/src/tests/canvas/pan-functionality/pan-mouse-leave.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Zoom to 150%
  3. Press and hold Space key
  4. Click and start dragging on the canvas
  5. While still holding mouse button, move cursor outside canvas area
  6. Verify panning stops
  7. Release mouse button outside canvas
  8. Move mouse back over canvas
  9. Verify no panning occurs until mouse is clicked again

**Expected Results:**
  - isPanning is set to false when mouse leaves overlay
  - Canvas stops panning when mouse exits
  - Pan mode remains active (overlay still visible)
  - Panning can resume when mouse returns and clicks again

#### 3.6. should pan over selected canvas items without interference

**File:** `apps/boxout-e2e/src/tests/canvas/pan-functionality/pan-over-selected-items.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Drag a Text preset onto the canvas
  3. Click the text item to select it
  4. Zoom to 150%
  5. Get initial canvas transform position
  6. Press and hold Space key while hovering over the selected text
  7. Drag the mouse
  8. Verify canvas pans instead of moving the selected item

**Expected Results:**
  - Pan overlay appears over selected items when Space is held
  - Canvas pans normally over selected items
  - Selected item doesn't move or lose selection
  - Pan overlay prevents click events from reaching canvas items

### 4. Zoom and Pan Integration

**Seed:** `apps/boxout-e2e/src/seed.spec.ts`

#### 4.1. should maintain pan position when zooming in/out

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-pan-integration/pan-position-during-zoom.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Zoom to 150%
  3. Pan the canvas to a specific position
  4. Note the pan offset values (translateX, translateY)
  5. Zoom in to 200%
  6. Verify pan offset values remain the same
  7. Zoom out to 100%
  8. Verify pan offset values still remain the same

**Expected Results:**
  - Pan offset (translateX, translateY) is independent of zoom level
  - Canvas center point remains in the same position when zooming
  - Only scale changes, not translation values

#### 4.2. should allow panning only when zoomed in beyond 100%

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-pan-integration/pan-availability.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Verify zoom is at 100%
  3. Press Space key and try to pan
  4. Note whether panning has an effect at 100% zoom
  5. Zoom to 125%
  6. Press Space key and pan
  7. Verify panning works when zoomed in

**Expected Results:**
  - Pan functionality is available at all zoom levels (no restriction)
  - Pan overlay appears when Space is pressed regardless of zoom level
  - Panning may have limited or no visible effect at 100% or below if content fits in viewport

#### 4.3. should handle rapid zoom and pan operations

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-pan-integration/rapid-zoom-pan.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Perform rapid Ctrl + mouse wheel to zoom in and out multiple times
  3. Immediately start panning with Space + drag
  4. Quickly zoom again while panning
  5. Perform rapid scroll (without Ctrl) for vertical panning
  6. Verify all operations complete without errors

**Expected Results:**
  - Rapid zoom changes are handled smoothly
  - Transform updates don't conflict between zoom and pan
  - No visual glitches or transform calculation errors
  - Canvas remains responsive throughout rapid interactions

#### 4.4. should apply correct transform composition for zoom and pan

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-pan-integration/transform-composition.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Zoom to 150% (scale: 1.5)
  3. Pan to position (100, 50)
  4. Get computed transform style from canvas root element
  5. Verify transform contains both scale and translate values
  6. Verify transform format: 'scale(1.5) translateY(50px) translateX(100px)'

**Expected Results:**
  - Transform correctly combines scale and translate
  - Transform order is: scale() translateY() translateX()
  - Values match the current zoom and pan state
  - Transform is applied via afterRenderEffect in PanZoomService

### 5. Zoom with Canvas Content

**Seed:** `apps/boxout-e2e/src/seed.spec.ts`

#### 5.1. should scale canvas items proportionally when zooming

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-content/scale-items-proportionally.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Drag a Flex rows preset onto the canvas
  3. Measure the bounding box dimensions of the container at 100% zoom
  4. Zoom to 150%
  5. Measure the bounding box dimensions again
  6. Verify dimensions have scaled by 1.5x
  7. Zoom to 50%
  8. Verify dimensions have scaled by 0.5x relative to original

**Expected Results:**
  - All canvas items scale proportionally with zoom level
  - Aspect ratios are maintained
  - Text, containers, and all elements scale uniformly
  - Layout relationships between items are preserved

#### 5.2. should maintain selection visibility when zoomed in

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-content/selection-visibility-zoomed.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Drag a Text preset onto the canvas
  3. Select the text item
  4. Verify selection border/highlight is visible at 100%
  5. Zoom to 200%
  6. Verify selection remains visible and properly scaled
  7. Zoom to 50%
  8. Verify selection remains visible at small zoom level

**Expected Results:**
  - Selection border/highlight scales with zoom level
  - Selection remains clearly visible at all zoom levels
  - Selection visual feedback doesn't break at extreme zooms
  - Hover effects work correctly at all zoom levels

#### 5.3. should allow interaction with canvas items at all zoom levels

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-content/interaction-at-zoom-levels.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Drag a container preset onto the canvas
  3. Zoom to 200%
  4. Click on the container to select it
  5. Verify selection works correctly
  6. Zoom to 50%
  7. Click on the container
  8. Verify selection still works
  9. Right-click to open context menu
  10. Verify context menu appears correctly

**Expected Results:**
  - Items can be selected at any zoom level
  - Click hit detection works correctly with zoom applied
  - Context menus appear at appropriate positions
  - All item interactions (select, hover, right-click) work regardless of zoom

#### 5.4. should preserve text editing capability when zoomed

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-content/text-editing-zoomed.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Drag a Text preset onto the canvas
  3. Zoom to 150%
  4. Double-click the text item to enter edit mode
  5. Verify text becomes editable
  6. Type new content
  7. Click outside to exit edit mode
  8. Verify text content is updated
  9. Zoom to 50% and repeat the editing process
  10. Verify text editing works at smaller zoom level

**Expected Results:**
  - Text items can be edited at any zoom level
  - Text cursor appears at correct position
  - Text input scales visually with zoom
  - Edited content is saved correctly regardless of zoom level

#### 5.5. should handle drag-and-drop of presets at different zoom levels

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-content/drag-drop-at-zoom.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Zoom to 150%
  3. Drag an Empty Container preset from the preset panel
  4. Drop it onto the canvas
  5. Verify the container appears at the correct drop position
  6. Zoom to 75%
  7. Drag a Text preset onto the canvas
  8. Verify it appears at the correct position despite zoom

**Expected Results:**
  - Drop zone coordinates are calculated correctly at any zoom level
  - Items appear where user drops them visually
  - Zoom level doesn't affect drop accuracy
  - Drop zone highlighting works correctly when zoomed

### 6. Zoom State Persistence

**Seed:** `apps/boxout-e2e/src/seed.spec.ts`

#### 6.1. should reset zoom and pan when clearing canvas

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-persistence/reset-on-clear.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Add some items to the canvas
  3. Zoom to 150% and pan to a specific position
  4. Clear the canvas (remove all items)
  5. Verify zoom remains at 150% (or check if it resets to 100%)
  6. Verify pan position (check if it resets or persists)

**Expected Results:**
  - Document current behavior for zoom/pan state when canvas is cleared
  - Behavior is consistent and predictable
  - No errors occur during canvas clear with active zoom/pan

#### 6.2. should maintain zoom level when adding/removing items

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-persistence/maintain-zoom-on-canvas-changes.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Zoom to 150%
  3. Drag a preset onto the canvas
  4. Verify zoom remains at 150%
  5. Select and delete the item
  6. Verify zoom still remains at 150%
  7. Add multiple items
  8. Verify zoom doesn't change

**Expected Results:**
  - Zoom level persists when canvas items are added
  - Zoom level persists when canvas items are removed
  - Zoom is independent of canvas content changes
  - Pan position also remains stable during item operations

#### 6.3. should maintain zoom when switching between Select and Pan modes

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-persistence/zoom-during-mode-switch.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Zoom to 125%
  3. Click the Pan mode button
  4. Verify zoom remains at 125%
  5. Click the Select mode button
  6. Verify zoom still remains at 125%
  7. Toggle between modes several times
  8. Verify zoom is stable throughout

**Expected Results:**
  - Zoom level persists when switching to Pan mode
  - Zoom level persists when switching back to Select mode
  - Mode switching doesn't affect zoom state
  - Pan offset is also maintained during mode switches

### 7. Zoom Edge Cases

**Seed:** `apps/boxout-e2e/src/seed.spec.ts`

#### 7.1. should handle Space key press during text editing

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-edge-cases/space-during-text-edit.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Drag a Text preset onto the canvas
  3. Double-click to enter text edit mode
  4. Press Space key while editing text
  5. Verify Space character is inserted in text (pan mode should NOT activate)
  6. Exit text edit mode
  7. Press Space key again
  8. Verify pan mode activates normally

**Expected Results:**
  - Space key inserts space character when editing text
  - Pan mode does NOT activate during text editing
  - Pan mode activates normally when not editing text
  - Focus state is properly managed

#### 7.2. should handle multiple rapid zoom direction changes

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-edge-cases/rapid-zoom-direction-change.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Start at 100% zoom
  3. Rapidly zoom in (Ctrl + wheel up) 10 times
  4. Immediately zoom out (Ctrl + wheel down) 10 times
  5. Repeat this pattern several times
  6. Verify zoom level updates correctly after all operations
  7. Verify no transform calculation errors occur

**Expected Results:**
  - Zoom changes are processed correctly despite rapid direction changes
  - Final zoom level is mathematically correct
  - No race conditions or state inconsistencies
  - Canvas remains responsive and functional

#### 7.3. should handle zoom with empty canvas

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-edge-cases/zoom-empty-canvas.spec.ts`

**Steps:**
  1. Navigate to the application with empty canvas
  2. Verify no items are on the canvas
  3. Zoom in to 200%
  4. Verify zoom applies correctly despite empty canvas
  5. Zoom out to 50%
  6. Verify zoom still works
  7. Pan the empty canvas
  8. Verify panning works on empty canvas

**Expected Results:**
  - Zoom functionality works on empty canvas
  - Pan functionality works on empty canvas
  - No errors occur with empty canvas state
  - Zoom percentage displays correctly

#### 7.4. should handle simultaneous zoom and undo/redo operations

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-edge-cases/zoom-with-undo-redo.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Add an item to the canvas
  3. Zoom to 150%
  4. Delete the item
  5. Click Undo to restore the item
  6. Verify zoom remains at 150%
  7. Click Redo to delete again
  8. Verify zoom still remains at 150%
  9. Zoom to 200% and perform undo/redo
  10. Verify zoom is independent of undo/redo stack

**Expected Results:**
  - Zoom level is NOT affected by undo operations
  - Zoom level is NOT affected by redo operations
  - Undo/redo only affects canvas content, not zoom/pan state
  - Zoom and undo/redo can be used together without conflicts

#### 7.5. should prevent page scroll when using zoom controls

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-edge-cases/prevent-page-scroll.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Note the initial page scroll position
  3. Hover over the canvas
  4. Hold Ctrl and scroll mouse wheel (to zoom)
  5. Verify page doesn't scroll vertically
  6. Release Ctrl and scroll mouse wheel (to pan vertically)
  7. Verify canvas pans but page doesn't scroll
  8. Hold Shift and scroll (to pan horizontally)
  9. Verify page doesn't scroll

**Expected Results:**
  - Ctrl + wheel zooms canvas without scrolling page
  - Wheel alone pans canvas without scrolling page
  - Shift + wheel pans horizontally without scrolling page
  - Event propagation is stopped for zoom/pan events
  - preventDefault is called appropriately

#### 7.6. should handle zoom menu interaction while pan mode is active

**File:** `apps/boxout-e2e/src/tests/canvas/zoom-edge-cases/zoom-menu-in-pan-mode.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Activate Pan mode using the toolbar button
  3. Click the zoom percentage button
  4. Verify zoom menu opens correctly
  5. Select a zoom level from the menu
  6. Verify zoom changes and menu closes
  7. Verify pan mode remains active
  8. Test panning to confirm pan mode is still functional

**Expected Results:**
  - Zoom menu can be opened while in pan mode
  - Zoom changes apply correctly in pan mode
  - Pan mode state is preserved after changing zoom
  - No conflicts between pan mode and zoom menu

### 8. Accessibility and Usability

**Seed:** `apps/boxout-e2e/src/seed.spec.ts`

#### 8.1. should provide visual feedback for pan mode activation

**File:** `apps/boxout-e2e/src/tests/canvas/accessibility/pan-mode-visual-feedback.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Press and hold Space key
  3. Verify canvas overlay becomes visible
  4. Verify cursor changes to 'grab'
  5. Click and hold mouse button
  6. Verify cursor changes to 'grabbing'
  7. Release Space key
  8. Verify overlay disappears and cursor returns to normal

**Expected Results:**
  - Overlay provides clear visual indication of pan mode
  - Cursor changes communicate interaction state (grab/grabbing)
  - Visual feedback is immediate and consistent
  - Users can clearly tell when pan mode is active

#### 8.2. should show appropriate cursor states during pan operations

**File:** `apps/boxout-e2e/src/tests/canvas/accessibility/pan-cursor-states.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Activate pan mode via toolbar button
  3. Verify cursor is 'grab' when hovering over canvas
  4. Click and drag
  5. Verify cursor is 'grabbing' while dragging
  6. Release mouse
  7. Verify cursor returns to 'grab'
  8. Deactivate pan mode
  9. Verify cursor returns to default

**Expected Results:**
  - grab cursor indicates pan mode is ready
  - grabbing cursor indicates active panning
  - Cursor states match user expectations
  - Cursor provides intuitive visual feedback

#### 8.3. should display zoom percentage rounded to whole numbers

**File:** `apps/boxout-e2e/src/tests/canvas/accessibility/zoom-percentage-rounding.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Use Ctrl + mouse wheel to zoom in gradually
  3. Observe the zoom percentage display after each scroll
  4. Verify percentages are displayed as whole numbers (e.g., 103%, 106%, not 103.5%)
  5. Verify Math.round() is applied to the scale value

**Expected Results:**
  - Zoom percentage is always rounded to nearest integer
  - Display is clean and professional (no decimals)
  - Rounding matches the computed() function: Math.round(scale * 100)
  - Users see clear, unambiguous zoom levels

#### 8.4. should have accessible labels for zoom and pan controls

**File:** `apps/boxout-e2e/src/tests/canvas/accessibility/control-labels.spec.ts`

**Steps:**
  1. Navigate to the application
  2. Inspect the Pan button for aria-label attribute
  3. Verify Pan button has aria-label='Pan'
  4. Inspect zoom controls for proper labeling
  5. Verify menu items have descriptive text
  6. Use keyboard to navigate zoom menu
  7. Verify menu is keyboard accessible

**Expected Results:**
  - All interactive controls have appropriate labels
  - Screen readers can identify zoom and pan controls
  - ARIA attributes are correctly applied
  - Keyboard navigation works for all zoom controls
