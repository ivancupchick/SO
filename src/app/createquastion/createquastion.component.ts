import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from 'firebase/app';
import { QuationsService } from '../quations.service';


@Component({
  selector: 'app-createquastion',
  templateUrl: './createquastion.component.html',
  styleUrls: ['./createquastion.component.css']
})
export class CreatequastionComponent implements OnInit {
  user: User;
  quations: any;

  constructor(private authService: AuthService, private dbServise: QuationsService) { 
    authService.getUser().subscribe( user => {
      this.user = user;
    });
  }

  onSubmit(formData: any) {
    const now = new Date();

    const tagsArray: string[] = [];
    if (formData.value.tag1) { tagsArray.push('tag1'); }
    if (formData.value.tag2) { tagsArray.push('tag2'); }
    if (formData.value.tag3) { tagsArray.push('tag3'); }

    this.dbServise.sendQuastion({
      id: 0,
      title: formData.value.title,
      description: formData.value.description,
      author: this.user.uid,
      approved: false,
      tags: tagsArray, // add tags
      dateOfCreation: +now,
      answerID: 0,
    });
  }

  ngOnInit() {
  }
}
