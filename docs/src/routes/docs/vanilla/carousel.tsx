import { createFileRoute } from "@tanstack/react-router";
import { Demo } from "~/demo/Demo";

export const Route = createFileRoute("/docs/vanilla/carousel")({
  component: CarouselDocs,
});

function CarouselDocs() {
  return (
    <>
      <header>
        <h1>Carousel</h1>
        <p className="lead">A swipeable slideshow with edge controls and indicator dots.</p>
      </header>

      <section>
        <h2>Basic</h2>
        <p>
          The <code>.carousel</code> region wraps a <code>.carousel__viewport</code> that clips a{" "}
          <code>.carousel__track</code> of <code>.carousel__slide</code> children, with optional
          prev/next <code>.carousel__control</code> chips, a <code>.carousel__indicators</code> row,
          and per-slide <code>.carousel__caption</code> overlays. The slide motion (Embla, which
          writes a transform on the track) ships with the JS layer. The overlay chrome reads the
          theme-independent overlay tokens so it stays legible over any imagery in light or dark. This
          basic example is a 16:9 viewport with controls on the slide edges, a dot row at the bottom
          (the active dot stretches to a pill), and a caption gradient on the first slide.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="carousel" data-stisla-carousel tabindex="0" role="region" aria-label="Gallery">
  <div class="carousel__viewport">
    <div class="carousel__track">
      <div class="carousel__slide" role="group" aria-label="1 of 3">
        <div class="h-full w-full bg-sky-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 1</div>
        <div class="carousel__caption">
          <strong>Mountain vista</strong>
          <p class="m-0">A wide alpine panorama at first light.</p>
        </div>
      </div>
      <div class="carousel__slide" role="group" aria-label="2 of 3">
        <div class="h-full w-full bg-violet-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 2</div>
      </div>
      <div class="carousel__slide" role="group" aria-label="3 of 3">
        <div class="h-full w-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 3</div>
      </div>
    </div>
  </div>
  <button class="carousel__control carousel__control--prev" aria-label="Previous slide"><i data-lucide="chevron-left"></i></button>
  <button class="carousel__control carousel__control--next" aria-label="Next slide"><i data-lucide="chevron-right"></i></button>
  <ul class="carousel__indicators">
    <li><button class="carousel__indicator" aria-label="Slide 1"></button></li>
    <li><button class="carousel__indicator" aria-label="Slide 2"></button></li>
    <li><button class="carousel__indicator" aria-label="Slide 3"></button></li>
  </ul>
</div>`}
        />
      </section>

      <section>
        <h2>Without a fixed ratio</h2>
        <p>
          Add <code>.carousel--no-aspect</code> so the viewport sizes to the slide content instead of
          locking to 16:9 — useful for text cards of varying height.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="carousel carousel--no-aspect" data-stisla-carousel tabindex="0" role="region" aria-label="Quotes">
  <div class="carousel__viewport">
    <div class="carousel__track">
      <div class="carousel__slide" role="group" aria-label="1 of 2">
        <div class="p-8 bg-[var(--color-surface)]">
          <p class="mt-0 text-lg">"It is the framework I reach for first."</p>
          <p class="mb-0 text-muted-foreground">— A happy developer</p>
        </div>
      </div>
      <div class="carousel__slide" role="group" aria-label="2 of 2">
        <div class="p-8 bg-[var(--color-surface)]">
          <p class="mt-0 text-lg">"Tokens all the way down."</p>
          <p class="mb-0 text-muted-foreground">— Another one</p>
        </div>
      </div>
    </div>
  </div>
  <button class="carousel__control carousel__control--prev" aria-label="Previous"><i data-lucide="chevron-left"></i></button>
  <button class="carousel__control carousel__control--next" aria-label="Next"><i data-lucide="chevron-right"></i></button>
</div>`}
        />
      </section>

      <section>
        <h2>Keyboard</h2>
        <p>
          The root is focusable. Once focus lands on the carousel itself (not on a slide child),
          these keys move the track.
        </p>
        <ul>
          <li><kbd>ArrowLeft</kbd>: previous slide</li>
          <li><kbd>ArrowRight</kbd>: next slide</li>
          <li><kbd>Home</kbd>: first slide</li>
          <li><kbd>End</kbd>: last slide</li>
        </ul>
      </section>

      <section>
        <h2>With controls</h2>
        <p>
          Add <code>.carousel__control--prev</code> and <code>.carousel__control--next</code> as
          direct children of the root. The wrapper auto-disables the chip at the end of the track
          unless <code>loop</code> is on.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="carousel" data-stisla-carousel tabindex="0" role="region" aria-roledescription="carousel" aria-label="Travel destinations">
  <div class="carousel__viewport">
    <div class="carousel__track">
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="h-full w-full bg-sky-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 1</div>
      </div>
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="2 of 3">
        <div class="h-full w-full bg-violet-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 2</div>
      </div>
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="3 of 3">
        <div class="h-full w-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 3</div>
      </div>
    </div>
  </div>
  <button type="button" class="carousel__control carousel__control--prev" aria-label="Previous slide"><i data-lucide="chevron-left"></i></button>
  <button type="button" class="carousel__control carousel__control--next" aria-label="Next slide"><i data-lucide="chevron-right"></i></button>
</div>`}
        />
      </section>

      <section>
        <h2>With indicators</h2>
        <p>
          One <code>.carousel__indicator</code> button per slide inside{" "}
          <code>.carousel__indicators</code>. The wrapper paints the active chip via{" "}
          <code>[data-state="active"]</code> and <code>aria-current="true"</code>.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="carousel" data-stisla-carousel tabindex="0" role="region" aria-roledescription="carousel" aria-label="Travel destinations">
  <div class="carousel__viewport">
    <div class="carousel__track">
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="h-full w-full bg-sky-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 1</div>
      </div>
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="2 of 3">
        <div class="h-full w-full bg-violet-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 2</div>
      </div>
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="3 of 3">
        <div class="h-full w-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 3</div>
      </div>
    </div>
  </div>
  <button type="button" class="carousel__control carousel__control--prev" aria-label="Previous slide"><i data-lucide="chevron-left"></i></button>
  <button type="button" class="carousel__control carousel__control--next" aria-label="Next slide"><i data-lucide="chevron-right"></i></button>
  <div class="carousel__indicators" role="tablist" aria-label="Slides">
    <button type="button" class="carousel__indicator" data-state="active" aria-current="true" aria-label="Go to slide 1"></button>
    <button type="button" class="carousel__indicator" aria-label="Go to slide 2"></button>
    <button type="button" class="carousel__indicator" aria-label="Go to slide 3"></button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>With captions</h2>
        <p>
          Drop a <code>.carousel__caption</code> inside any <code>.carousel__slide</code>. It pins to
          the bottom edge with a gradient overlay.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="carousel" data-stisla-carousel tabindex="0" role="region" aria-roledescription="carousel" aria-label="Travel destinations">
  <div class="carousel__viewport">
    <div class="carousel__track">
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="h-full w-full bg-sky-500"></div>
        <div class="carousel__caption">
          <h3 class="m-0 mb-1 text-lg font-semibold">Above the clouds</h3>
          <p class="m-0 text-sm">A break in the weather over the eastern alps.</p>
        </div>
      </div>
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="2 of 3">
        <div class="h-full w-full bg-violet-500"></div>
        <div class="carousel__caption">
          <h3 class="m-0 mb-1 text-lg font-semibold">City after dark</h3>
          <p class="m-0 text-sm">Lights up just as the last of the day fades out.</p>
        </div>
      </div>
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="3 of 3">
        <div class="h-full w-full bg-emerald-500"></div>
        <div class="carousel__caption">
          <h3 class="m-0 mb-1 text-lg font-semibold">Iron lattice</h3>
          <p class="m-0 text-sm">Paris in the gold hour from the Trocadero.</p>
        </div>
      </div>
    </div>
  </div>
  <button type="button" class="carousel__control carousel__control--prev" aria-label="Previous slide"><i data-lucide="chevron-left"></i></button>
  <button type="button" class="carousel__control carousel__control--next" aria-label="Next slide"><i data-lucide="chevron-right"></i></button>
  <div class="carousel__indicators" role="tablist" aria-label="Slides">
    <button type="button" class="carousel__indicator" data-state="active" aria-current="true" aria-label="Go to slide 1"></button>
    <button type="button" class="carousel__indicator" aria-label="Go to slide 2"></button>
    <button type="button" class="carousel__indicator" aria-label="Go to slide 3"></button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Card content</h2>
        <p>
          Slides aren't limited to images. Add <code>.carousel--no-aspect</code> on the root and the
          viewport sizes to its tallest slide instead of locking to 16:9. The chrome tokens can be
          retuned to track theme surfaces so the controls and indicators read on both light and dark.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="carousel carousel--no-aspect" data-stisla-carousel data-stisla-carousel-loop="true" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Customer stories"
     style="--carousel-control-bg: var(--color-surface); --carousel-control-bg-hover: var(--color-accent); --carousel-control-color: var(--color-foreground); --carousel-indicator-bg: var(--color-border); --carousel-indicator-bg-active: var(--color-primary); --carousel-indicators-inset: -1rem;">
  <div class="carousel__viewport">
    <div class="carousel__track">
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="card m-0">
          <div class="card__body">
            <p class="m-0 text-lg leading-relaxed">"Stisla took the headache out of rebuilding our internal admin tool. The token system meant we could ship a brand refresh in a single PR, with no per-component overrides."</p>
            <div class="mt-5">
              <strong>Maya Tanaka</strong>
              <div class="text-muted-foreground text-sm">Engineering Lead, Northwind Labs</div>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="2 of 3">
        <div class="card m-0">
          <div class="card__body">
            <p class="m-0 text-lg leading-relaxed">"We bought into the older version for a client project two years ago. The rewrite kept everything we liked and dropped the bits we were already hacking around."</p>
            <div class="mt-5">
              <strong>Diego Romero</strong>
              <div class="text-muted-foreground text-sm">Design Engineer, Forge and Tide</div>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="3 of 3">
        <div class="card m-0">
          <div class="card__body">
            <p class="m-0 text-lg leading-relaxed">"Dark mode used to be a quarterly bug ticket. Now it's a single data-theme flip on the root element and we don't think about it again."</p>
            <div class="mt-5">
              <strong>Priya Reddy</strong>
              <div class="text-muted-foreground text-sm">Product Engineer, Helix Health</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button type="button" class="carousel__control carousel__control--prev" aria-label="Previous testimonial"><i data-lucide="chevron-left"></i></button>
  <button type="button" class="carousel__control carousel__control--next" aria-label="Next testimonial"><i data-lucide="chevron-right"></i></button>
  <div class="carousel__indicators" role="tablist" aria-label="Testimonials">
    <button type="button" class="carousel__indicator" data-state="active" aria-current="true" aria-label="Testimonial 1"></button>
    <button type="button" class="carousel__indicator" aria-label="Testimonial 2"></button>
    <button type="button" class="carousel__indicator" aria-label="Testimonial 3"></button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Autoplay</h2>
        <p>
          Pass <code>data-stisla-carousel-autoplay="true"</code> for a 4s tick. Autoplay pauses on
          hover, on focus, while dragging, and while the tab is hidden. Reduced motion turns it off
          entirely.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="carousel" data-stisla-carousel data-stisla-carousel-autoplay="true" data-stisla-carousel-loop="true" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Travel destinations">
  <div class="carousel__viewport">
    <div class="carousel__track">
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="h-full w-full bg-sky-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 1</div>
      </div>
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="2 of 3">
        <div class="h-full w-full bg-violet-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 2</div>
      </div>
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="3 of 3">
        <div class="h-full w-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 3</div>
      </div>
    </div>
  </div>
  <div class="carousel__indicators" role="tablist" aria-label="Slides">
    <button type="button" class="carousel__indicator" data-state="active" aria-current="true" aria-label="Go to slide 1"></button>
    <button type="button" class="carousel__indicator" aria-label="Go to slide 2"></button>
    <button type="button" class="carousel__indicator" aria-label="Go to slide 3"></button>
  </div>
</div>`}
        />
      </section>

      <section>
        <h2>Loop</h2>
        <p>
          <code>data-stisla-carousel-loop="true"</code> wraps past the last slide back to the first.
          The prev / next chips stay enabled at the ends.
        </p>
        <Demo
          layout="stack"
          html={`
<div class="carousel" data-stisla-carousel data-stisla-carousel-loop="true" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Travel destinations">
  <div class="carousel__viewport">
    <div class="carousel__track">
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="h-full w-full bg-sky-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 1</div>
      </div>
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="2 of 3">
        <div class="h-full w-full bg-violet-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 2</div>
      </div>
      <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="3 of 3">
        <div class="h-full w-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-semibold">Slide 3</div>
      </div>
    </div>
  </div>
  <button type="button" class="carousel__control carousel__control--prev" aria-label="Previous slide"><i data-lucide="chevron-left"></i></button>
  <button type="button" class="carousel__control carousel__control--next" aria-label="Next slide"><i data-lucide="chevron-right"></i></button>
</div>`}
        />
      </section>

      <section>
        <h2>Events</h2>
        <p>
          Four events fire on the carousel root. None are cancelable; they report state after the
          change has already landed.
        </p>
        <p>
          <code>stisla:carousel:selected</code> fires when the highlighted slide changes (drag,
          click, key, or autoplay). The <code>detail</code> object carries the new <code>index</code>{" "}
          and the <code>previousIndex</code>. Use it for highlight sync.
        </p>
        <p>
          <code>stisla:carousel:settled</code> fires after the slide transition ends and the track is
          at rest at the new <code>index</code>. Use it for work that should wait until motion is
          done, like lazy-loading the visible slide.
        </p>
        <p>
          <code>stisla:carousel:autoplay-paused</code> fires when autoplay pauses; the{" "}
          <code>detail.reason</code> is one of <code>"hover"</code>, <code>"focus"</code>,{" "}
          <code>"drag"</code>, or <code>"visibility"</code>.
        </p>
        <p>
          <code>stisla:carousel:autoplay-resumed</code> fires when autoplay resumes, with the same{" "}
          <code>detail.reason</code> field.
        </p>
      </section>

      <section>
        <h2>Customization</h2>
        <p>These variables retune the carousel. Override on the root or any wrapper.</p>
        <table>
          <thead>
            <tr><th>Variable</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td><code>--carousel-radius</code></td><td>Viewport corner radius</td></tr>
            <tr><td><code>--carousel-aspect-ratio</code></td><td>Viewport ratio (default 16/9; ignored under --no-aspect)</td></tr>
            <tr><td><code>--carousel-slide-gap</code></td><td>Inline gap between slides</td></tr>
            <tr><td><code>--carousel-control-size</code> / <code>-control-inset</code></td><td>Control chip size and edge inset</td></tr>
            <tr><td><code>--carousel-control-bg</code> / <code>-control-bg-hover</code> / <code>-control-color</code></td><td>Control chip paint</td></tr>
            <tr><td><code>--carousel-indicators-inset</code> / <code>-indicator-gap</code></td><td>Indicator row position and spacing</td></tr>
            <tr><td><code>--carousel-indicator-size</code> / <code>-indicator-width-active</code></td><td>Dot size and active pill width</td></tr>
            <tr><td><code>--carousel-indicator-bg</code> / <code>-indicator-bg-active</code></td><td>Dot color, resting and active</td></tr>
            <tr><td><code>--carousel-caption-padding-block</code> / <code>-caption-padding-inline</code></td><td>Caption padding</td></tr>
            <tr><td><code>--carousel-caption-bg</code> / <code>-caption-color</code></td><td>Caption gradient and text</td></tr>
            <tr><td><code>--carousel-transition-duration</code></td><td>Control and indicator timing; zeroed under reduced-motion</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
