import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventsService } from '../services/events.service';
import { MyEvent } from '../interfaces/MyEvent';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'events-page',
  imports: [FormsModule, EventCardComponent, ReactiveFormsModule],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageComponent {
  title = 'Events Page';

  #eventsService = inject(EventsService);

  events = signal<MyEvent[]>([]);

  searchControl = new FormControl('');
  search = toSignal(
    this.searchControl.valueChanges.pipe(
        debounceTime(600), 
        distinctUntilChanged()
    ),
    { initialValue: '' }
  )
  
  #destroyRef = inject(DestroyRef);

  order = signal('');
  pageNumber = signal(1);

  constructor() {
    effect(() => {
        if (this.search() !== '' || this.order() !== '') {
          this.pageNumber.set(1);
        }
      });

    effect(() => {
        this.#eventsService
        .getEvents(this.order(), this.pageNumber(), this.search()!)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((myEvents) => {
            if(this.pageNumber() === 1) {
                this.events.set(myEvents)
            }
            else {
                this.events.update((events) => [...events, ...myEvents]);
            }
        });
    });
  }

  addEvent(event: MyEvent) {
    this.events.update((events) => [...events, event]);
  }

  deleteEvent(event: MyEvent) {
    this.events.update((events) => events.filter((e) => e !== event));
  }

  orderByPrice() {
    this.order.set('price');
  }

  orderByDate() {
    this.order.set('date');
  }

  orderByDistance() {
    this.order.set('distance');
  }

  loadMore(){
    this.pageNumber.update((page) => page + 1);
  }
}