import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Exercise } from '../exercise';
import { ExerciseService } from '../exercise.service';

import { AuthService, SocialUser } from "angular4-social-login";

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.css']
})
export class ExerciseDetailComponent implements OnInit {
  @Input() exercise: Exercise;
  private user: SocialUser;
  private loggedIn: boolean;
  private currentId = 0;
  
  constructor(
    private route: ActivatedRoute,
    private exerciseService: ExerciseService,
    private location: Location,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const category = this.route.snapshot.paramMap.get('category');
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    this.exercise = {id: this.currentId, userId: this.user.id, category: category, distance: null, time: null};
  }
  
  goBack(): void {
    this.location.back();
  }
  
  save(): void {
      console.log(this.exercise);
    this.exerciseService.addExercise(this.exercise)
      .subscribe(() => this.goBack());
  }
  
}
