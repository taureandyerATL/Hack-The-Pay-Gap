import {Component} from '@angular/core';
import {Header} from './header.ts';
import {Title} from './title.ts';
import {Techs} from './techs/techs.ts';
import {Footer} from './footer.ts';

@Component({
  selector: 'App',
  template: `
    <div class="main-container">
      <Header></Header>
      <main class="main">
        <TitleComponent></TitleComponent>
        <Techs></Techs>
      </main>
      <Footer></Footer>
    </div>
  `,
  directives: [Header, Title, Techs, Footer]
})
export class Main {}
