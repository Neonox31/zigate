import { Observable, empty } from 'rxjs'
import { ZGMessage } from '../../src/message'

export class MockZiGate {
  messages$: Observable<ZGMessage>

  constructor() {
    this.messages$ = empty()
  }
}
