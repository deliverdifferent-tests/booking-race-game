# DD Booking Race — Game Production Plan

## Post-Mortem: Why the game "does nothing"

### Problem 1: Detection is fundamentally broken
The Angular scope watching approach fails because:
- The booking page starts on CLIENT SELECTION, not the address form
- Angular scope watchers need specific elements to exist before they can watch
- The iframe's Angular app has its own digest cycle — external watchers are unreliable
- Cross-iframe Angular injection is fragile and often fails silently

### Problem 2: Base speed is imperceptible  
`roadPos += 40 * 16 * 0.002 = 1.28 px/frame` — this is basically nothing on screen.

### Problem 3: No visual connection between booking and racing
Even IF detection worked, the only feedback is a speed boost. There's no visual "this thing I just did on the left caused THAT on the right" moment.

---

## New Architecture: Event Bridge (not DOM polling)

### Solution: Inject a postMessage bridge INTO the booking page itself

Instead of trying to observe the AngularJS app from outside, we **modify the served index.html** to include a bridge script that:
1. Hooks into Angular's `$rootScope` from INSIDE the app
2. Uses `$watch` and `$on` to observe state changes  
3. Posts messages to `window.parent` with step completions
4. This is 100% reliable because it runs in the same context as Angular

### Implementation:
```javascript
// Injected into index.html as last script
angular.element(document).ready(function() {
  var app = angular.element(document.body);
  var $rootScope = app.injector().get('$rootScope');
  
  // Watch for step transitions
  $rootScope.$watch(function() { return $rootScope.step; }, function(n, o) {
    if (n !== o) window.parent.postMessage({ type:'booking-step', step: n, prev: o }, '*');
  });
  
  // Watch for booking model changes
  $rootScope.$on('$stateChangeSuccess', function(e, to) {
    window.parent.postMessage({ type:'booking-nav', state: to.name }, '*');
  });
});
```

---

## Production Team (Sub-agents)

### Agent 1: Detection Engineer
- Implement the postMessage bridge in server.js (inject script into served index.html)
- Map ALL booking states to game events
- Handle client selection → booking form transition
- Add debug overlay showing detection state
- Test every step fires correctly

### Agent 2: Game Engine Developer  
- Rewrite speed/physics so movement is DRAMATIC (not subtle)
- Add acceleration curves (ease-out boost, not instant)
- Implement FOV zoom on nitro
- Make road scroll speed visually obvious at all times
- Add speed lines that scale with velocity
- Screen shake proportional to acceleration

### Agent 3: Visual Artist
- Redesign car sprite (more detail, animation frames)
- Add parallax city skyline layers
- Weather effects (rain mode, night mode)
- Neon glow effects on road edges
- Better color palette — current one is too muted
- DD branding that looks premium, not bolted-on

### Agent 4: Sound Designer
- Continuous engine oscillator that modulates with speed
- Turbo whistle on boost
- Tire screech on hard steering
- Ambient wind noise scaling with speed
- Victory jingle that feels earned
- Error buzz on wrong action

### Agent 5: Game Designer
- Progressive difficulty (Track 1, 2, 3)
- Multiple game modes: Time Trial, Race vs AI, Training
- Tutorial overlay for first-time users
- Achievement system (first sub-30s, perfect combo, etc.)
- Ghost car (race against your best time)
- Difficulty curve that teaches the booking workflow

### Agent 6: UX/Polish Lead
- Loading states and transitions
- Responsive layout (works on tablets)
- Keyboard shortcuts overlay
- Pause functionality
- Help/tutorial modal
- Print certificate of completion

---

## 10 Iteration Plan

### Iteration 1: Fix Detection (Agent 1)
- Inject bridge script into served HTML
- Verify ALL booking states post messages to parent
- Add 'client-selected' as Step 0 (bonus)
- Debug overlay toggleable with Ctrl+D

### Iteration 2: Fix Physics (Agent 2)
- BASE_SPEED visible movement (multiply by 10x)
- Dramatic boost effect (screen-wide flash, speed lines intensify)
- Smooth acceleration with easing curves
- Car wobble at high speed

### Iteration 3: Visual Overhaul (Agent 3)
- Multi-layer parallax background (mountains, city, clouds)
- Gradient sky that shifts with speed
- Neon road edges
- Better car with shadow and headlight beams

### Iteration 4: Sound Overhaul (Agent 4)
- Continuous engine drone (sawtooth → frequency modulation)
- Wind noise layer
- Step completion: ascending arpeggio
- Combo: power chord
- Nitro: whoosh + turbo whistle

### Iteration 5: Game Feel (Agent 2 + 3)
- FOV zoom on nitro (canvas scale transform)
- Speed lines (radial from center)
- Road curvature increase with speed
- Camera sway on steering
- Particle explosion on step complete

### Iteration 6: Game Design (Agent 5)
- 3 tracks with different visual themes
- Progressive difficulty (more traffic, tighter time)
- Ghost car system
- Achievement unlocks

### Iteration 7: Enterprise Polish (Agent 6)
- DD branded loading screen
- Professional start screen with stats
- Certificate generation
- Admin dashboard (/admin) showing team stats

### Iteration 8: Multi-Mode (Agent 5 + 2)
- Time Trial mode
- Training mode (guided, with hints)
- Race mode (vs AI ghost)
- Practice mode (no scoring, just learn)

### Iteration 9: Integration Test (All)
- Full end-to-end playthrough
- All detection states verified
- Sound on all browsers
- Performance profiling
- Mobile/tablet test

### Iteration 10: Final Polish (All)
- Bug fixes from testing
- Performance optimization
- Final visual tweaks
- Leaderboard reset capability
- Documentation for deployment

---

## Priority: Iteration 1 + 2 FIRST

Nothing matters if the game doesn't respond to the booking form. Fix detection, then make movement dramatic. Everything else is polish on top of a working core.
