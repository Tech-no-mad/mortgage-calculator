export class OnboardingTour {
  private currentStep = 1;
  private maxStep = 1;
  private tooltipEl: HTMLDivElement | null = null;
  
  constructor() {
    if (typeof window === 'undefined') return;
  }

  init() {
    // Only run once per session/local storage
    const path = window.location.pathname;
    if (localStorage.getItem(`tour_completed_${path}`)) return;

    // Find max step
    const steps = document.querySelectorAll('[data-step]');
    if (steps.length === 0) return;

    this.maxStep = Array.from(steps).reduce((max, el) => {
      const step = parseInt(el.getAttribute('data-step') || '1');
      return step > max ? step : max;
    }, 1);

    this.createTooltip();
    // Small delay to ensure layout is settled
    setTimeout(() => this.showStep(1), 500);

    // Attach listeners
    steps.forEach(el => {
      el.addEventListener('focus', this.handleInteraction.bind(this), true);
      el.addEventListener('click', this.handleInteraction.bind(this), true);
      el.addEventListener('input', this.handleInteraction.bind(this), true);
    });
  }

  createTooltip() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'fixed z-[100] bg-gradient-to-r from-[var(--color-usa-blue)] to-[var(--color-usa-red)] text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl pointer-events-none transition-all duration-300 opacity-0 translate-y-2';
    document.body.appendChild(this.tooltipEl);
  }

  showStep(step: number) {
    this.currentStep = step;
    const target = document.querySelector(`[data-step="${step}"]`);
    
    if (!target) {
      // If target doesn't exist (e.g. skipped because it's fixed), skip to next
      if (step < this.maxStep) {
        this.showStep(step + 1);
      } else {
        this.finish();
      }
      return;
    }

    const tooltipText = target.getAttribute('data-tooltip') || `Step ${step}`;
    if (this.tooltipEl) {
      this.tooltipEl.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          ${tooltipText}
        </div>
      `;
      
      const rect = target.getBoundingClientRect();
      
      // Calculate position (above the element)
      let top = rect.top - 40;
      let left = rect.left + (rect.width / 2);
      
      // If top is offscreen, put it below
      if (top < 0) {
        top = rect.bottom + 10;
      }
      
      this.tooltipEl.style.top = `${top}px`;
      this.tooltipEl.style.left = `${left}px`;
      this.tooltipEl.style.transform = 'translate(-50%, 0)';
      this.tooltipEl.style.opacity = '1';
      
      // Highlight the target softly
      document.querySelectorAll('.onboarding-active').forEach(el => el.classList.remove('ring-2', 'ring-[var(--color-usa-blue)]', 'onboarding-active'));
      
      // Add ring to the target (make sure target doesn't break layout)
      target.classList.add('ring-2', 'ring-[var(--color-usa-blue)]', 'rounded-lg', 'transition-all', 'onboarding-active');
      
      // Scroll into view if needed
      if (rect.top < 100 || rect.bottom > window.innerHeight) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  handleInteraction(e: Event) {
    const target = (e.currentTarget as HTMLElement);
    const step = parseInt(target.getAttribute('data-step') || '0');
    
    if (step === this.currentStep) {
      target.classList.remove('ring-2', 'ring-[var(--color-usa-blue)]');
      if (step < this.maxStep) {
        // Small delay so user can type before the tooltip jumps
        setTimeout(() => this.showStep(step + 1), 200);
      } else {
        this.finish();
      }
    }
  }

  finish() {
    if (this.tooltipEl) {
      this.tooltipEl.style.opacity = '0';
      setTimeout(() => this.tooltipEl?.remove(), 300);
    }
    const path = window.location.pathname;
    localStorage.setItem(`tour_completed_${path}`, 'true');
    document.querySelectorAll('.ring-2.ring-[var(--color-usa-blue)]').forEach(el => el.classList.remove('ring-2', 'ring-[var(--color-usa-blue)]'));
  }
}
