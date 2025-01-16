import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventsService } from '../services/events.service';
import { MyEvent } from '../interfaces/MyEvent';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ProfileService } from '../../profile/services/profile.service';
import { User } from '../../auth/interfaces/user';

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
  #profileService = inject(ProfileService)
  #destroyRef = inject(DestroyRef);

  creator = input<number>()
  attending = input<number>()

  events = signal<MyEvent[]>([]);
  profile = signal<User | null>(null);
  order = signal('');
  pageNumber = signal(1);

  searchControl = new FormControl('');
  search = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  constructor() {
    effect(() => {
      if (this.search() !== '' || this.order() !== '') {
        this.pageNumber.set(1);
      }
    });

    effect(() => {
        if(this.creator()){
            this.#eventsService
          .getEventsCreatedByUser(this.creator()!, this.order(), this.pageNumber(), this.search()!)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe((myEvents) => {
            if (this.pageNumber() === 1) {
              this.events.set(myEvents);
            } else {
              this.events.update((events) => [...events, ...myEvents]);
            }
          });
        }
        else if(this.attending()) {
            this.#eventsService
            .getEventsAttending(this.attending()!, this.order(), this.pageNumber(), this.search()!)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((myEvents) => {
              if (this.pageNumber() === 1) {
                this.events.set(myEvents);
              } else {
                this.events.update((events) => [...events, ...myEvents]);
              }
            });
        }
        else {
            this.#eventsService
            .getEvents(this.order(), this.pageNumber(), this.search()!)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((myEvents) => {
              if (this.pageNumber() === 1) {
                this.events.set(myEvents);
              } else {
                this.events.update((events) => [...events, ...myEvents]);
              }
            });
        }
    });

    effect(() => {
        if(this.creator() || this.attending()){
            this.#profileService
            .getProfile(this.creator() || this.attending())
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((profile) => this.profile.set(profile))
        }
    })
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

  loadMore() {
    this.pageNumber.update((page) => page + 1);
  }
}
