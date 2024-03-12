import {BehaviorSubject, Observable} from 'rxjs';

export class Store<T> {
  state: Observable<Readonly<T>>;
  private state$: BehaviorSubject<Readonly<T>>;

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject<Readonly<T>>(initialState);
    this.state = this.state$.asObservable();
  }

  getState(): Readonly<T> {
    return this.state$.getValue();
  }

  setState(state: Readonly<T>): void {
    this.state$.next(state);
  }
}
