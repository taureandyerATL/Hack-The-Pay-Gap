import {Component, Input} from '@angular/core';
import {Tech} from './techs.ts';

@Component({
  selector: 'Tech',
  template: `
    <div class="tech">
      <img class="tech-logo" [src]="tech.logo"/>
      <h3 class="tech-h3">
        {{ tech.title }}
      </h3>
      <p>{{ tech.text1 }}</p>
      <p>{{ tech.text2 }}</p>
    </div>
  `
})
export class TechComponent {
  @Input() public tech: Tech;
}
