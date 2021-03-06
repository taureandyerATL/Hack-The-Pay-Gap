import {Component} from '@angular/core';

@Component({
  selector: 'Header',
  template: `
    <header class="header">
      <p class="header-title">
        <a href="https://github.com/FountainJS/generator-fountain-webapp" target="_blank">
          Fountain Generator
        </a>
      </p>
      <p class="header-date">
        Generated with FountainJS v0.5.5 on Tue Jun 28 2016 19:36:53 GMT-0500 (CDT)
      </p>
    </header>
  `
})
export class Header {}
