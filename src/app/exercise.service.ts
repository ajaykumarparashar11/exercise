import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Exercise } from './exercise';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class ExerciseService {

  private exercisesUrl = 'api/exercises';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET exercises from the server */
  getExercises (): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.exercisesUrl)
      .pipe(
        tap(exercises => this.log(`fetched exercises`)),
        catchError(this.handleError('getExercises', []))
      );
  }

  /** GET exercise by id. Return `undefined` when id not found */
  getExerciseNo404<Data>(id: number): Observable<Exercise> {
    const url = `${this.exercisesUrl}/?id=${id}`;
    return this.http.get<Exercise[]>(url)
      .pipe(
        map(exercises => exercises[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} exercise id=${id}`);
        }),
        catchError(this.handleError<Exercise>(`getExercise id=${id}`))
      );
  }

  /** GET exercise by id. Will 404 if id not found */
  getExercise(id: number): Observable<Exercise> {
    const url = `${this.exercisesUrl}/${id}`;
    return this.http.get<Exercise>(url).pipe(
      tap(_ => this.log(`fetched exercise id=${id}`)),
      catchError(this.handleError<Exercise>(`getExercise id=${id}`))
    );
  }

  /* GET exercises whose name contains search term */
  searchExercises(term: string): Observable<Exercise[]> {
    if (!term.trim()) {
      // if not search term, return empty exercise array.
      return of([]);
    }
    return this.http.get<Exercise[]>(`api/exercises/?name=${term}`).pipe(
      tap(_ => this.log(`found exercises matching "${term}"`)),
      catchError(this.handleError<Exercise[]>('searchExercises', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new exercise to the server */
  addExercise (exercise: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(this.exercisesUrl, exercise, httpOptions).pipe(
      tap((exercise: Exercise) => this.log(`added exercise w/ id=${exercise.id}`)),
      catchError(this.handleError<Exercise>('addExercise'))
    );
  }

  /** DELETE: delete the exercise from the server */
  deleteExercise (exercise: Exercise | number): Observable<Exercise> {
    const id = typeof exercise === 'number' ? exercise : exercise.id;
    const url = `${this.exercisesUrl}/${id}`;

    return this.http.delete<Exercise>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted exercise id=${id}`)),
      catchError(this.handleError<Exercise>('deleteExercise'))
    );
  }

  /** PUT: update the exercise on the server */
  updateExercise (exercise: Exercise): Observable<any> {
    return this.http.put(this.exercisesUrl, exercise, httpOptions).pipe(
      tap(_ => this.log(`updated exercise id=${exercise.id}`)),
      catchError(this.handleError<any>('updateExercise'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ExerciseService message with the MessageService */
  private log(message: string) {
    this.messageService.add('ExerciseService: ' + message);
  }
}
