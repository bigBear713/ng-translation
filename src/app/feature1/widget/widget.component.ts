import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { INgTransSentencePart } from 'ng-trans';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {

  @Input()
  comContent: string | TemplateRef<any> = '';

  @Input() list: INgTransSentencePart[] = [];

  constructor() { }

  ngOnInit() {
  }

}
