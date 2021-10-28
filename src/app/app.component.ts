import { NgTranslationService } from 'ng-translation';
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

  onChangeLang(): void {
    this.translationService.changeLang(
      this.translationService.lang === 'en' ? 'zh-CN' : 'en'
    );
  }

}
