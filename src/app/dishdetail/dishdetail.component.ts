import { Component, Input, OnInit, ViewChild , Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DISH } from '../shared/dish';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';
import { visiblity, flyInOut, expand } from '../animations/app.animation';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    visiblity(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  commentForm: FormGroup;
  comment: Comment;

  dish : DISH;
  dishIds: string[];
  prev: string;
  next: string;

  errMess: string;
  dishCopy: DISH;

  visiblity = 'shown';

  @ViewChild('fform') commentFormDirective;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
    }
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location, private fb: FormBuilder , @Inject('BaseURL') private BaseURL,) {
      this.createForm();
     }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe((dishid) => this.dishIds = dishid);
    this.route.params.pipe(switchMap((params: Params) => {this.visiblity = 'hidden'; return this.dishservice.getDish(params['id'])})).
    subscribe(dish => {this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); this.visiblity = 'shown';} ,
    errmess => this.errMess = <any>this.errMess);
  }

  setPrevNext(dishid: string){
    const index = this.dishIds.indexOf(dishid);
    this.prev = this.dishIds[ ((this.dishIds.length) + (index-1)) % (this.dishIds.length) ];
    this.next = this.dishIds[ ((this.dishIds.length) + (index+1)) % (this.dishIds.length) ];
  }

  goBack(): void{
    this.location.back();
  }

  onSubmit(){
    this.comment = this.commentForm.value;
    var date= new Date();
    this.comment.date= date.toISOString();
    this.dishCopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishCopy).subscribe(
      dish => {this.dish = dish; this.dishCopy = dish;}, errmess => {this.dish = null; this.dishCopy = null; this.errMess = <any>errmess});

    console.log(this.comment);
    this.commentForm.reset(
      {
        author: '',
        comment: '',
        rating: 5
      }
    );
    this.commentFormDirective.reset();
  }

  createForm(): void{
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      comment: ['', [Validators.required] ],
      rating: 5
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
