import { NgTranslationService } from 'ng-translation';
import { Observable } from 'rxjs';

import {
    Component,
    OnInit
} from '@angular/core';

@Component({
  selector: 'app-feature1',
  templateUrl: './feature1.component.html',
  styleUrls: ['./feature1.component.scss']
})
export class Feature1Component implements OnInit {

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

}
