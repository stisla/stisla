import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/slider")({
  component: SliderDocs,
});

function SliderDocs() {
  return (
    <>
      <header>
        <h1>Slider</h1>
        <p className="lead">A filled-track input for picking a value from a continuous span.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          A slider is real DOM — <code>.slider__track</code> wraps <code>.slider__range</code>, plus a{" "}
          <code>.slider__thumb</code> and a hidden <code>.slider__input</code> for form participation.
          Compose the four parts under <code>.slider</code> and tag the root with{" "}
          <code>data-stisla-slider</code>, and the behavior layer owns pointer, keyboard, and ARIA,
          writing <code>--slider-fraction</code> on the host as the value moves. The filled portion
          paints in primary; the thumb sits as a narrow vertical pill at the value's position.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-xl">
  <label for="basicSlider" class="field__label">Brightness</label>
  <div class="slider" id="basicSlider" data-stisla-slider data-value="40">
    <div class="slider__track"><div class="slider__range"></div></div>
    <div class="slider__thumb"></div>
    <input type="hidden" class="slider__input" name="brightness">
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          The slider mirrors a native <code>&lt;input type="range"&gt;</code>. Focus the thumb with{" "}
          <kbd>Tab</kbd>, then step the value with the keys below.
        </p>
        <ul>
          <li><kbd>ArrowLeft</kbd> / <kbd>ArrowDown</kbd>: step down by <code>data-step</code> (default 1)</li>
          <li><kbd>ArrowRight</kbd> / <kbd>ArrowUp</kbd>: step up</li>
          <li><kbd>Shift</kbd> + arrow: jump by ten steps</li>
          <li><kbd>PageDown</kbd> / <kbd>PageUp</kbd>: also jump by ten steps</li>
          <li><kbd>Home</kbd> / <kbd>End</kbd>: jump to <code>data-min</code> / <code>data-max</code></li>
        </ul>
      </section>

      <section>
        <h2>Value display</h2>
        <p>
          Listen for <code>stisla:slider:input</code> to read the current value as the user drags or
          steps. The event's <code>detail.value</code> already reflects step snapping and bounds.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-xl">
  <div class="flex flex-wrap justify-between items-baseline">
    <label for="outputSlider" class="field__label">Opacity</label>
    <output for="outputSlider" class="text-muted-foreground">30</output>
  </div>
  <div class="slider" id="outputSlider" data-stisla-slider data-value="30">
    <div class="slider__track"><div class="slider__range"></div></div>
    <div class="slider__thumb"></div>
    <input type="hidden" class="slider__input" name="opacity">
  </div>
</div>
<script>
  (function () {
    var el = document.getElementById('outputSlider');
    var out = el.parentElement.querySelector('output');
    el.addEventListener('stisla:slider:input', function (e) { out.value = e.detail.value; });
  })();
</script>`}
        />
      </section>

      <section>
        <h2>Min and max</h2>
        <p>
          Set <code>data-min</code> and <code>data-max</code> on the host to bound the slider. Defaults
          to <code>0</code> through <code>100</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-xl">
  <label for="minMaxSlider" class="field__label">Year</label>
  <div class="slider" id="minMaxSlider" data-stisla-slider data-min="2000" data-max="2030" data-value="2026">
    <div class="slider__track"><div class="slider__range"></div></div>
    <div class="slider__thumb"></div>
    <input type="hidden" class="slider__input" name="year">
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Steps</h2>
        <p>
          Add <code>data-step</code> to snap the thumb to fixed increments. Arrow keys step by this
          amount; <kbd>Shift</kbd> + arrow and the Page keys jump by ten steps at a time.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-xl">
  <label for="stepSlider" class="field__label">Rating</label>
  <div class="slider" id="stepSlider" data-stisla-slider data-min="0" data-max="5" data-step="0.5" data-value="3">
    <div class="slider__track"><div class="slider__range"></div></div>
    <div class="slider__thumb"></div>
    <input type="hidden" class="slider__input" name="rating">
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Sizes</h2>
        <p>
          Three sizes match the <code>.input</code> family: <code>.slider--sm</code>, default, and{" "}
          <code>.slider--lg</code>. The thumb is shorter than the track so it reads as a vertical pill,
          and every dimension rides the spacing scale.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field">
  <label for="smSlider" class="field__label">Small</label>
  <div class="slider slider--sm" id="smSlider" data-stisla-slider data-value="40">
    <div class="slider__track"><div class="slider__range"></div></div>
    <div class="slider__thumb"></div>
  </div>
</div>
<div class="field">
  <label for="defaultSlider" class="field__label">Default</label>
  <div class="slider" id="defaultSlider" data-stisla-slider data-value="60">
    <div class="slider__track"><div class="slider__range"></div></div>
    <div class="slider__thumb"></div>
  </div>
</div>
<div class="field">
  <label for="lgSlider" class="field__label">Large</label>
  <div class="slider slider--lg" id="lgSlider" data-stisla-slider data-value="80">
    <div class="slider__track"><div class="slider__range"></div></div>
    <div class="slider__thumb"></div>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Disabled</h2>
        <p>
          Add <code>data-disabled="true"</code> on the host to dim the track and thumb and block pointer
          and keyboard interaction.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-xl">
  <label for="disabledSlider" class="field__label">Playback speed</label>
  <div class="slider" id="disabledSlider" data-stisla-slider data-value="40" data-disabled="true">
    <div class="slider__track"><div class="slider__range"></div></div>
    <div class="slider__thumb"></div>
    <input type="hidden" class="slider__input" name="speed" disabled>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Invalid</h2>
        <p>
          Set <code>aria-invalid="true"</code> on the host from your form library. A danger border paints
          around the track and the focus halo on the thumb flips to danger.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="field max-w-xl">
  <label for="srvSlider" class="field__label">Threshold</label>
  <div class="slider" id="srvSlider" data-stisla-slider data-value="60" aria-invalid="true">
    <div class="slider__track"><div class="slider__range"></div></div>
    <div class="slider__thumb"></div>
    <input type="hidden" class="slider__input" name="threshold">
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Two events fire on the host. Both carry the current value in <code>detail.value</code>, already
          snapped to <code>data-step</code> and clamped to the min/max bounds.
        </p>
        <p>
          <code>stisla:slider:input</code> fires on every value change during a drag or key step. Use it
          for live previews like color or brightness, or to mirror the value into an{" "}
          <code>&lt;output&gt;</code>.
        </p>
        <p>
          <code>stisla:slider:change</code> fires on commit (pointerup at the end of a drag, or after
          each key step). It mirrors the native <code>change</code> event on{" "}
          <code>&lt;input type="range"&gt;</code>. Use it for save or submit triggers.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>
          These variables retune <code>.slider</code> without touching component CSS. Override on the
          element, a parent scope, or <code>:root</code>.
        </p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--slider-height</code></td><td>Track and shell height (matches <code>.input</code>)</td></tr>
            <tr><td><code>--slider-thumb-width</code></td><td>Thumb width (narrow vertical pill)</td></tr>
            <tr><td><code>--slider-thumb-height</code></td><td>Thumb height (centered inside the track)</td></tr>
            <tr><td><code>--slider-thumb-gap</code></td><td>Padding around the thumb; sets the gap to the unfilled track and the inset from the slider's edges so the thumb never kisses the pill curve</td></tr>
            <tr><td><code>--slider-radius</code></td><td>Track and thumb corner radius; pilled by default, override to flatten</td></tr>
            <tr><td><code>--slider-track-bg</code></td><td>Unfilled segment</td></tr>
            <tr><td><code>--slider-fill</code></td><td>Filled segment</td></tr>
            <tr><td><code>--slider-thumb-bg</code></td><td>Thumb fill</td></tr>
            <tr><td><code>--slider-thumb-shadow</code></td><td>Thumb edge definition</td></tr>
            <tr><td><code>--slider-ring</code></td><td>Focus halo color</td></tr>
          </tbody>
        </table>
        <p>
          The track and thumb opt out of the global radius by default; the pill shape carries meaning, so
          it stays fixed. Set <code>--slider-radius</code> at the scope you want softened.
        </p>
      </section>
    </>
  );
}
