import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements AfterViewInit {
  @ViewChild('flipDest') flipDest!: ElementRef<HTMLElement>;
  @ViewChild('statusText') statusText!: ElementRef<HTMLElement>;
  @ViewChild('mainGate') mainGate!: ElementRef<HTMLElement>;
  @ViewChild('ctaArea') ctaArea!: ElementRef<HTMLElement>;

  constructor(private router: Router) {}

  goToGenerator() {
    this.router.navigate(['/generator']);
  }

  ngAfterViewInit() {
    this.runAnimation();
  }

  private runAnimation() {
    const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·-';
    const TARGET  = 'SKYTEAM · APPROACH GENERATOR';
    const container  = this.flipDest.nativeElement;
    const statusEl   = this.statusText.nativeElement;
    const gateEl     = this.mainGate.nativeElement;
    const ctaEl      = this.ctaArea.nativeElement;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cells: { el: HTMLElement; target: string; isSpace: boolean }[] = [];
    for (let i = 0; i < TARGET.length; i++) {
      const ch = TARGET[i];
      const el = document.createElement('span');
      const isSpace = ch === ' ';
      el.className = 'fc' + (isSpace ? ' is-space' : '');
      el.textContent = isSpace ? ' ' : CHARSET[Math.floor(Math.random() * (CHARSET.length - 4))];
      container.appendChild(el);
      cells.push({ el, target: ch, isSpace });
    }

    if (reducedMotion) {
      cells.forEach(({ el, target }) => { el.textContent = target; });
      statusEl.textContent = 'NOW BOARDING';
      gateEl.textContent   = 'B06';
      ctaEl.classList.add('visible');
      return;
    }

    let settled = 0;
    const nonSpaceCount = cells.filter(c => !c.isSpace).length;

    cells.forEach(({ el, target: t, isSpace }, i) => {
      if (isSpace) { el.textContent = ' '; settled++; return; }

      const startDelay = 220 + i * 30;
      const flipCount  = 7 + Math.floor(Math.random() * 7);
      let count = 0;

      setTimeout(() => {
        const iv = setInterval(() => {
          if (count >= flipCount) {
            clearInterval(iv);
            el.textContent = t;
            el.classList.add('settled');
            settled++;

            if (settled - cells.filter(c => c.isSpace).length === nonSpaceCount) {
              setTimeout(() => {
                gateEl.textContent   = 'B07';
                statusEl.textContent = 'NOW BOARDING';
                setTimeout(() => ctaEl.classList.add('visible'), 550);
              }, 280);
            }
            return;
          }
          el.textContent = CHARSET[Math.floor(Math.random() * (CHARSET.length - 4))];
          count++;
        }, 52);
      }, startDelay);
    });
  }
}
