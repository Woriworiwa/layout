import {BehaviorSubject, Observable} from 'rxjs';

export class Store<T> {
  state: Observable<Readonly<T>>;
  private state$: BehaviorSubject<Readonly<T>>;

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject<Readonly<T>>(initialState);
    this.state = this.state$.asObservable();
  }

  protected getState(): Readonly<T> {
    return this.state$.getValue();
  }

  protected setState(state: Readonly<T>): void {
    this.state$.next(state);
  }
}
