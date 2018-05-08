import { Component, OnInit } from '@angular/core';

import { Exercise } from '../exercise';
import { ExerciseService } from '../exercise.service';

import { AuthService, SocialUser } from "angular4-social-login";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  exercises: Exercise[] = [];
  private user: SocialUser;
  private loggedIn: boolean;

  constructor(private authService: AuthService, private exerciseService: ExerciseService) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    this.getExercises();
  }

  getExercises(): void {
      this.exerciseService.getExercises()
      .subscribe(exercises => this.exercises = exercises);
  }
}
