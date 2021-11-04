import {
    NgTranslationLangEnum,
    NgTranslationService
} from 'ng-translation';
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
    return this.translationService.translationSync('title');
  }

  constructor(
    private translationService: NgTranslationService,
  ) {
  }

  ngOnInit(): void {
    this.title$ = this.translationService.translationAsync('title');
  }

  onChangeLang(lang: string): void {
    this.translationService.changeLang(lang).subscribe(result => {
      console.log(result);
      if (!result.result) {
        alert('切换语言失败，没有导入该语言包,当前语言是:' + result.curLang);
      }
    });
  }

}
