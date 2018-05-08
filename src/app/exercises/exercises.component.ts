import { Component, OnInit } from '@angular/core';

import { Exercise } from '../exercise';
import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})
export class ExercisesComponent implements OnInit {
  exercises: Exercise[];

  constructor(private exerciseService: ExerciseService) {} 

  ngOnInit() {
      
  }
  
  getExercises(): void {
    this.exerciseService.getExercises()
    .subscribe(exercises => this.exercises = exercises);
  }

  add(category: string, distance: number, time: number): void {
    category = category.trim();
    if (!category && !distance && !time) { return; }
    this.exerciseService.addExercise({ category } as Exercise)
      .subscribe(exercise => {
        this.exercises.push(exercise);
      });
  }
}
