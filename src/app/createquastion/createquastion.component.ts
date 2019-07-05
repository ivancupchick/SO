import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from 'firebase/app';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { QuationsService } from '../quations.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-createquastion',
  templateUrl: './createquastion.component.html',
  styleUrls: ['./createquastion.component.css']
})
export class CreatequastionComponent implements OnInit {
  user: User;
  quations: any;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private authService: AuthService, private dbServise: QuationsService, private router: Router) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice())
    );

    dbServise.getTagsValuesChanges().subscribe( (tags: string[]) => {
      this.allTags = tags;
    });

    authService.getUser().subscribe( user => {
      this.user = user;
    });
  }


  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.tags.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tagCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  onSubmit(formData: any) {
    const now = new Date();
    const tagsForSend = Array.from(new Set(this.tags));

    this.dbServise.pushTags(tagsForSend);

    this.dbServise.sendQuastion({
      id: 0,
      title: formData.value.title,
      description: formData.value.description,
      author: this.user.uid,
      approved: false,
      tags: tagsForSend, // add tags
      dateOfCreation: +now,
      answerID: 0,
    });
    this.router.navigateByUrl('');
  }

  ngOnInit() { }
}
