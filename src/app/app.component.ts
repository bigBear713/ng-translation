import {
  NgTransLangEnum,
  NgTransService
} from 'ng-trans';
import { Observable } from 'rxjs';

import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title$: Observable<string> | undefined;

  get title() {
    return this.transService.translationSync('title');
  }

  constructor(
    private transService: NgTransService,
  ) {
  }

  ngOnInit(): void {
    this.title$ = this.transService.translationAsync('title');
  }

  onChangeLang(lang: string): void {
    this.transService.changeLang(lang).subscribe(result => {
      console.log(result);
      if (!result.result) {
        alert('切换语言失败，没有导入该语言包,当前语言是:' + result.curLang);
      }
    });
  }

}
