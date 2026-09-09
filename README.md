# NEO Solar System Atlas

Single-file Three.js experience that expands the original NEO dashboard into an interactive solar-system atlas.

## Run

Open index.html in a modern browser with internet access. The page loads Three.js and fonts from public CDNs. It opens on the Earth / NEO monitor. If the workflow feed cannot be reached, it displays an unavailable state or retains previously fetched records labelled as cached.

## What the display means

- Planet positions, orbital radii, sizes, belts, and object trajectories are schematic display data, not a real-time ephemeris or a scale model.
- The solar-system view includes the Sun, eight planets, Earth’s Moon, Ceres, Pluto, the asteroid belt, and the Kuiper belt.
- NEO feed values are treated as unverified external input. The interface does not make safety, impact, or mission-critical claims from them.

## Controls

- Drag to orbit, scroll or pinch to zoom, and click a point in the scene or catalog to inspect it.
- Use Solar system and NEO field to change the displayed dataset.
- Reload feed retries the optional external NEO source.
- Clicking Earth in the solar-system view opens the Earth monitor and refreshes the original workflow JSON feed. Selecting a NEO shows velocity, miss distance, diameter, hazard flag, close-approach date when supplied, and the workflow assessment.
- The original public workflow feed is connected. The header shows the feed's supplied update timestamp, rather than treating the time of a page refresh as a new NASA observation.

## Scene-first interface

- Earth and Solar System use compact text navigation. Sky Events opens a city-based solar eclipse explorer.
- The search icon (or slash key) opens a searchable list. Object names are no longer displayed as a permanent wall of buttons.
- Click an object to inspect it. Close the inspector, click empty space, or press Escape to deselect. Dragging the scene does not select an object.
- The desktop inspector reserves its own screen space; on phones it becomes a scrollable bottom sheet. The 3D viewport resizes so it cannot draw behind the inspector.
- Reset view restores the overview. User orbit/zoom input interrupts camera transitions instead of being pulled back to the selection.
- Verified in a browser: NASA feed loading, search filtering, object details, panel dismissal, Earth navigation from the solar-system catalog, and a 390px mobile layout.

## Accessibility and performance

- Keyboard-focusable controls, live selection announcements, semantic buttons, and reduced-motion support are included.
- The renderer caps device pixel ratio at 2, pauses while the page is hidden, and respects prefers-reduced-motion.

## Sky Events: solar eclipse explorer

- Twenty curated cities, with country/city selectors, saved preference and IANA local timezones.
- Searches the next ten years for a solar eclipse with a remaining above-horizon phase at the city centre. Includes ongoing eclipses, skips expired events, and handles sunrise/sunset. Local partial/annular/total classification is not the global eclipse classification.
- Shows contact times, peak obscuration (covered area, not magnitude), solar altitude, a time-scrubbable disc preview and an ICS calendar download. A peak below the horizon is explicitly labelled rather than presented as visible coverage.
- Predictions use Astronomy Engine 2.1.19, loaded from jsDelivr inside a cancellable worker. Internet is required to load the calculation library. No new NASA key or n8n workflow is needed. Failures have an explicit retry state.
- Results are calculated on demand, cached in memory and recalculated when their visible window expires. These are calculated predictions, not live observations or weather forecasts. Coordinates are approximate city centres at sea level; terrain, buildings and clouds are excluded. Horizon crossings use apparent Sun-centre altitude, refined to under a second; displayed times remain approximate.
- NASA NEO data and its existing n8n pipeline are unchanged. Sky Events uses a separate source and labels it accordingly.
- Regression tests: download the pinned package's `astronomy.js`, then run `node tests/sky-events.test.cjs <downloaded-file-path>`. Tests cover all cities, London 2027 and Dallas 2024 NASA reference timings, sunset visibility, ongoing/expired events, timezone conversion and calendar formatting.
- Reference tables: [NASA London](https://eclipse.gsfc.nasa.gov/SEcirc/SEcircEU/LondonGBR1%2B21.html), [NASA Dallas 2024](https://science.nasa.gov/eclipses/future-eclipses/eclipse-2024/where-when/). Always follow [NASA solar viewing guidance](https://science.nasa.gov/eclipses/safety/).
