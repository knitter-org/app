import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feeds-edit',
  templateUrl: './feeds-edit.component.html',
  styleUrls: ['./feeds-edit.component.less']
})
export class FeedsEditComponent {

  form = new FormGroup({
    url: new FormControl(''),
  });

  constructor(
    route: ActivatedRoute
  ) {
    const feedId = route.snapshot.params['id'];
  }
}
